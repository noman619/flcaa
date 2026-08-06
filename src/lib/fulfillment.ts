import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  SERVICE_ROLE_AVAILABLE,
  createClient,
  createServiceClient,
} from "@/lib/supabase/server";
import type { Coupon, Database } from "@/lib/database.types";
import { PROMO, promoDiscountCents } from "@/lib/promo";

export type Db = SupabaseClient<Database>;

/**
 * Writes prefer the service-role client. When SUPABASE_SERVICE_ROLE_KEY is not
 * configured we fall back to the caller's own session — the schema's RLS lets a
 * user create their own orders and enrollments, so the flow still works end to
 * end in development.
 */
export async function getWriteClient(): Promise<Db> {
  return SERVICE_ROLE_AVAILABLE
    ? (createServiceClient() as unknown as Db)
    : ((await createClient()) as unknown as Db);
}

export type PricedCart = {
  items: { courseId: string; unitPriceCents: number; title: string; slug: string }[];
  subtotalCents: number;
  discountCents: number;
  totalCents: number;
  coupon: Coupon | null;
  couponError: string | null;
  /** Automatic site promotion, already included in discountCents. */
  promo: { label: string; discountCents: number } | null;
};

/**
 * Server-side pricing. Prices always come from the database, never the client,
 * so a tampered cart cannot change what gets charged.
 */
export async function priceCart(
  db: Db,
  courseIds: string[],
  couponCode?: string | null,
): Promise<PricedCart> {
  const unique = Array.from(new Set(courseIds)).filter(Boolean);

  const { data: courses, error } = unique.length
    ? await db
        .from("courses")
        .select("id, title, slug, price_cents, is_published")
        .in("id", unique)
    : { data: [], error: null };

  if (error) throw new Error(`Could not price cart: ${error.message}`);

  const items = (courses ?? [])
    .filter((c) => c.is_published)
    .map((c) => ({
      courseId: c.id,
      unitPriceCents: c.price_cents,
      title: c.title,
      slug: c.slug,
    }));

  const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents, 0);

  // Automatic site promotion. Computed here, from database prices, so the
  // advertised deal is what actually gets charged.
  const promoDiscount = promoDiscountCents(items);
  const promo =
    promoDiscount > 0 ? { label: PROMO.label, discountCents: promoDiscount } : null;

  let coupon: Coupon | null = null;
  let couponError: string | null = null;
  // The promotion is always on top; a coupon adds to it.
  let discountCents = promoDiscount;

  if (couponCode?.trim()) {
    const code = couponCode.trim().toUpperCase();
    // Coupons are admin-readable only under RLS, so this needs the service role.
    const { data } = SERVICE_ROLE_AVAILABLE
      ? await createServiceClient().from("coupons").select("*").eq("code", code).maybeSingle()
      : { data: null };

    if (!SERVICE_ROLE_AVAILABLE) {
      couponError =
        "Coupon codes need SUPABASE_SERVICE_ROLE_KEY to be configured on the server.";
    } else if (!data) {
      couponError = "That coupon code was not recognised.";
    } else if (!data.active) {
      couponError = "That coupon is no longer active.";
    } else if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) {
      couponError = "That coupon has expired.";
    } else {
      coupon = data;
      // Coupon applies to what is left after the promotion, so the two stack
      // without ever exceeding the subtotal.
      const afterPromo = subtotalCents - promoDiscount;
      let couponDiscount = 0;
      if (data.percent_off) {
        couponDiscount = Math.round((afterPromo * data.percent_off) / 100);
      } else if (data.amount_off_cents) {
        couponDiscount = data.amount_off_cents;
      }
      discountCents = Math.min(promoDiscount + couponDiscount, subtotalCents);
    }
  }

  return {
    items,
    subtotalCents,
    discountCents,
    totalCents: Math.max(0, subtotalCents - discountCents),
    coupon,
    couponError,
    promo,
  };
}

/**
 * Turns a paid order into enrollments. Idempotent — safe to run again when
 * Stripe retries the webhook or the success page races it.
 */
export async function fulfillOrder(
  db: Db,
  orderId: string,
): Promise<{ created: number }> {
  const { data: order, error: orderError } = await db
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError || !order) throw new Error(`Order ${orderId} not found`);

  if (order.status !== "paid") {
    await db
      .from("orders")
      .update({ status: "paid", updated_at: new Date().toISOString() })
      .eq("id", orderId);
  }

  const { data: items } = await db
    .from("order_items")
    .select("course_id")
    .eq("order_id", orderId);

  const courseIds = Array.from(
    new Set(((items ?? []) as { course_id: string }[]).map((i) => i.course_id)),
  );
  if (!courseIds.length) return { created: 0 };

  const { data: courses } = await db
    .from("courses")
    .select("id, access_days")
    .in("id", courseIds);

  const accessDaysById = new Map(
    ((courses ?? []) as { id: string; access_days: number | null }[]).map((c) => [
      c.id,
      c.access_days ?? 365,
    ]),
  );

  const { data: existing } = await db
    .from("enrollments")
    .select("course_id")
    .eq("user_id", order.user_id)
    .in("course_id", courseIds);

  const alreadyEnrolled = new Set(
    ((existing ?? []) as { course_id: string }[]).map((e) => e.course_id),
  );
  const now = new Date();

  const rows = courseIds
    .filter((id) => !alreadyEnrolled.has(id))
    .map((courseId) => {
      const expires = new Date(now);
      expires.setDate(expires.getDate() + (accessDaysById.get(courseId) ?? 365));
      return {
        user_id: order.user_id,
        course_id: courseId,
        order_id: orderId,
        enrolled_at: now.toISOString(),
        access_expires_at: expires.toISOString(),
      };
    });

  if (rows.length) {
    const { error } = await db.from("enrollments").insert(rows);
    // 23505 = unique violation: a concurrent call already created the row.
    if (error && error.code !== "23505") {
      throw new Error(`Failed to create enrollments: ${error.message}`);
    }
  }

  return { created: rows.length };
}

/** Certificate numbers are short enough to quote over the phone. */
export function generateCertificateNumber(trackSlug: string | null | undefined) {
  const prefix =
    trackSlug === "cam" ? "CAM" : trackSlug === "board-members" ? "BRD" : "RE";
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FLA-${prefix}-${new Date().getFullYear()}-${random}`;
}
