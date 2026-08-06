import type { Course } from "@/lib/database.types";
import {
  PROMO,
  isPromoActive,
  listPriceCents,
  promoApplies,
  promoDiscountCents,
} from "@/lib/promo";
import { formatPrice } from "@/lib/utils";

export type DisplayPrice = {
  /** What the visitor will actually be charged, formatted. */
  price: string;
  /** Struck-through anchor, or undefined where there is no discount. */
  wasPrice?: string;
  /** "30% OFF" — only where something is actually off. */
  saveLabel?: string;
  /** Payable amount in cents, for callers that need the number. */
  payableCents: number;
};

/**
 * The price a marketing page should show for a course.
 *
 * Landing pages used to hardcode their figures, ported from the original.
 * That meant a price edited in Supabase changed what the cart charged while
 * the page kept advertising the old number — the two could disagree silently,
 * which is the one thing a price must never do. Everything visible now comes
 * from the same row priceCart will read at checkout.
 *
 * Two kinds of discount, never both (see listPriceCents):
 *
 *  - PROMO: the row holds the LIST price and the promotion takes a percentage
 *    off it, so the anchor is the row itself.
 *  - LIST_PRICES: the row already holds the payable price and the anchor is a
 *    display-only figure recorded alongside it.
 */
export function displayPrice(
  course: Pick<Course, "slug" | "price_cents"> | null | undefined,
  now: Date = new Date(),
): DisplayPrice {
  if (!course) return { price: "—", payableCents: 0 };

  const list = course.price_cents;
  const discount = promoDiscountCents(
    [{ slug: course.slug, unitPriceCents: list }],
    now,
  );
  const payableCents = list - discount;

  if (discount > 0) {
    return {
      price: formatPrice(payableCents),
      wasPrice: formatPrice(list),
      saveLabel: `${PROMO.percentOff}% OFF`,
      payableCents,
    };
  }

  const anchor = listPriceCents(course.slug, list);
  if (anchor > list) {
    const off = Math.round(((anchor - list) / anchor) * 100);
    return {
      price: formatPrice(list),
      wasPrice: formatPrice(anchor),
      saveLabel: `Save ${off}%`,
      payableCents: list,
    };
  }

  return { price: formatPrice(list), payableCents: list };
}

/** Whether the site-wide promotion is currently running, for banner copy. */
export function promoRunning(slug: string, now: Date = new Date()): boolean {
  return promoApplies(slug) && isPromoActive(now);
}
