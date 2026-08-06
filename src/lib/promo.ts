/**
 * Site promotion — the "Back to School" deal advertised on the course pages.
 *
 * Deliberately NOT a row in `coupons`:
 *
 *  - coupons are typed in by the customer; this one applies automatically,
 *  - reading `coupons` needs SUPABASE_SERVICE_ROLE_KEY (see priceCart), which
 *    is not configured, and
 *  - the `coupons` table currently 500s under RLS recursion, so nothing can
 *    read it at all.
 *
 * It is still applied server-side in priceCart, never from the client, so the
 * discount cannot be forged by editing the cart.
 */
export const PROMO = {
  label: "Back to School - 30% OFF",
  /** Shown next to the label. Matches the banner on the original site. */
  expiresLabel: "(Expires 08/15/2026)",
  percentOff: 30,
  /** Inclusive end of the last day, Florida time (EDT, UTC-4). */
  endsAt: new Date("2026-08-15T23:59:59-04:00"),
  /**
   * Courses the deal covers. Scoped rather than site-wide: every other course
   * in the catalog already stores its final price, so a blanket 30% would
   * silently undercut them.
   */
  slugs: [
    "re-63-sales-associate",
    "re-63-sales-associate-basic",
    "re-63-sales-associate-premium",
    "re-63-sales-associate-ultimate",
    "re-mutual-recognition-exam-prep",
    "cam-licensing-course",
    "cam-licensing-course-basic",
    "cam-licensing-course-premium",
    "cam-licensing-course-ultimate",
  ] as readonly string[],
  /**
   * Advertised payable price, for courses where the deal is not exactly the
   * headline percentage.
   *
   * Mutual recognition lists at 14200 and advertises 9900 — that is 30.28%,
   * close enough to badge as "30% OFF" but not equal to it. Without an override
   * the cart would charge 9940 and contradict the page.
   */
  finalCents: {
    "re-mutual-recognition-exam-prep": 9900,
  } as Record<string, number | undefined>,
} as const;

/**
 * Advertised list price for products sold at a standing discount, in cents.
 *
 * These are not the "Back to School" promotion — the cut is not 30%, the
 * landing pages carry no promo banner, and `courses.price_cents` already holds
 * the payable figure. The struck-through number beside the price is a real
 * advertised anchor though, so the cart has to show the saving rather than a
 * bare total that silently contradicts the page the visitor came from.
 *
 * Display only. Nothing here changes what priceCart charges.
 */
export const LIST_PRICES: Record<string, number | undefined> = {
  "re-sales-associate-exam-prep": 11700, // $117 -> $67
  "cam-exam-prep": 11900, // $119 -> $69
  "cam-continuing-education": 14200, // $142 -> $99
  "re-72-broker": 27900, // $279 -> $229
  "re-45-sales-associate-post": 15600, // $156 -> $109
  "re-continuing-education": 3500, // $35 -> $24
};

export const SALE_LABEL = "Limited-time discount";

/** The anchor to show for a line, or its own price where there is none. */
export function listPriceCents(slug: string, unitPriceCents: number): number {
  // A promoted course is discounted by PROMO instead; never both.
  if (promoApplies(slug)) return unitPriceCents;
  const list = LIST_PRICES[slug];
  return list !== undefined && list > unitPriceCents ? list : unitPriceCents;
}

/** Total advertised saving across a set of lines, in cents. */
export function saleDiscountCents(
  items: readonly { slug: string; unitPriceCents: number }[],
): number {
  return items.reduce(
    (sum, item) =>
      sum + (listPriceCents(item.slug, item.unitPriceCents) - item.unitPriceCents),
    0,
  );
}

export function isPromoActive(now: Date = new Date()): boolean {
  return now.getTime() <= PROMO.endsAt.getTime();
}

export function promoApplies(slug: string): boolean {
  return PROMO.slugs.includes(slug);
}

/**
 * Discount for a set of priced line items, in cents.
 *
 * Rounded per line so the total always equals the sum of what each line
 * advertises — rounding the basket as a whole can land a cent away from the
 * price shown on the card.
 */
export function promoDiscountCents(
  items: readonly { slug: string; unitPriceCents: number }[],
  now: Date = new Date(),
): number {
  if (!isPromoActive(now)) return 0;
  return items.reduce((sum, item) => {
    if (!promoApplies(item.slug)) return sum;
    const target = PROMO.finalCents[item.slug];
    const discount =
      target === undefined
        ? Math.round((item.unitPriceCents * PROMO.percentOff) / 100)
        : Math.max(0, item.unitPriceCents - target);
    return sum + discount;
  }, 0);
}
