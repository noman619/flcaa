import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getWriteClient, priceCart, fulfillOrder } from "@/lib/fulfillment";
import { SITE_URL, STRIPE_ENABLED, STRIPE_SECRET_KEY } from "@/lib/env";

const bodySchema = z.object({
  courseIds: z.array(z.string().uuid()).min(1, "Your cart is empty."),
  couponCode: z.string().max(64).optional().nullable(),
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request." },
      { status: 400 },
    );
  }

  const { courseIds, couponCode } = parsed.data;
  const db = await getWriteClient();

  // Never let someone buy a course they already own.
  const { data: owned } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", user.id)
    .in("course_id", courseIds);

  const ownedIds = new Set(
    ((owned ?? []) as { course_id: string }[]).map((e) => e.course_id),
  );
  const toBuy = courseIds.filter((id) => !ownedIds.has(id));

  if (!toBuy.length) {
    return NextResponse.json(
      { error: "You already own everything in your cart." },
      { status: 400 },
    );
  }

  const priced = await priceCart(db, toBuy, couponCode);
  if (!priced.items.length) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (priced.couponError && couponCode) {
    return NextResponse.json({ error: priced.couponError }, { status: 400 });
  }

  // 1. Create the pending order + line items.
  const { data: order, error: orderError } = await db
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total_cents: priced.totalCents,
      coupon_code: priced.coupon?.code ?? null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return NextResponse.json(
      { error: `Could not create order: ${orderError?.message ?? "unknown error"}` },
      { status: 500 },
    );
  }

  const { error: itemsError } = await db.from("order_items").insert(
    priced.items.map((item) => ({
      order_id: order.id,
      course_id: item.courseId,
      unit_price_cents: item.unitPriceCents,
      quantity: 1,
    })),
  );

  if (itemsError) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json(
      { error: `Could not save order items: ${itemsError.message}` },
      { status: 500 },
    );
  }

  // 2a. No Stripe key configured (or the order is free) -> fulfil immediately.
  if (!STRIPE_ENABLED || priced.totalCents === 0) {
    await fulfillOrder(db, order.id);
    return NextResponse.json({
      mode: STRIPE_ENABLED ? "free" : "dev",
      orderId: order.id,
      redirectUrl: `/checkout/success?order_id=${order.id}`,
    });
  }

  // 2b. Stripe Checkout.
  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const discountRatio =
    priced.subtotalCents > 0 ? priced.totalCents / priced.subtotalCents : 1;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      client_reference_id: order.id,
      metadata: { order_id: order.id, user_id: user.id },
      line_items: priced.items.map((item) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          // Spread the discount proportionally so the Stripe total matches ours.
          unit_amount: Math.round(item.unitPriceCents * discountRatio),
          product_data: { name: item.title },
        },
      })),
      success_url: `${SITE_URL}/checkout/success?order_id=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/cart?canceled=1`,
    });

    await db
      .from("orders")
      .update({ stripe_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ mode: "stripe", redirectUrl: session.url });
  } catch (error) {
    await db.from("orders").update({ status: "failed" }).eq("id", order.id);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Stripe checkout could not start.",
      },
      { status: 500 },
    );
  }
}
