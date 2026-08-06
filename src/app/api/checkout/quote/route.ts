import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getWriteClient, priceCart } from "@/lib/fulfillment";

const bodySchema = z.object({
  courseIds: z.array(z.string().uuid()),
  couponCode: z.string().max(64).optional().nullable(),
});

/** Prices a cart (optionally with a coupon) without creating an order. */
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
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const db = await getWriteClient();
  const priced = await priceCart(db, parsed.data.courseIds, parsed.data.couponCode);

  return NextResponse.json({
    subtotalCents: priced.subtotalCents,
    discountCents: priced.discountCents,
    totalCents: priced.totalCents,
    promo: priced.promo,
    couponCode: priced.coupon?.code ?? null,
    couponError: priced.couponError,
  });
}
