import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/server";
import { fulfillOrder, type Db } from "@/lib/fulfillment";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "@/lib/env";

/** Stripe needs the raw body, so this route must never be cached. */
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured on this deployment." },
      { status: 501 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature." }, { status: 400 });
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json(
      {
        error: `Signature verification failed: ${
          error instanceof Error ? error.message : "unknown"
        }`,
      },
      { status: 400 },
    );
  }

  // Enrollment creation must bypass RLS — there is no user session here.
  const db = createServiceClient() as unknown as Db;

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id ?? session.client_reference_id;
        if (orderId && session.payment_status === "paid") {
          await fulfillOrder(db, orderId);
        }
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const orderId = session.metadata?.order_id ?? session.client_reference_id;
        if (orderId) {
          await db.from("orders").update({ status: "canceled" }).eq("id", orderId);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        const orderId = charge.metadata?.order_id;
        if (orderId) {
          await db.from("orders").update({ status: "refunded" }).eq("id", orderId);
        }
        break;
      }

      default:
        break;
    }
  } catch (error) {
    // Return 500 so Stripe retries rather than dropping the event.
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Fulfilment failed." },
      { status: 500 },
    );
  }

  return NextResponse.json({ received: true });
}
