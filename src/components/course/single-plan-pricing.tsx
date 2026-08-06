import Image from "next/image";
import { Check } from "lucide-react";
import { EnrollButton } from "@/components/course/enroll-button";
import { GoogleReviews } from "@/components/marketing/google-reviews-source";
import type { CartItem } from "@/components/cart/cart-provider";

/**
 * Pricing for a course sold as one product rather than tiers: the trust rail,
 * a single price card, and a plain list of what is included.
 *
 * The 63-hour page uses CoursePricing instead, because comparing three tiers
 * is tabular data and needs a real <table>. One included/not-included list
 * does not.
 */
export function SinglePlanPricing({
  wasPrice,
  price,
  deal,
  instalment,
  features,
  enrollItem,
}: {
  /** Absent where the course carries no advertised anchor. */
  wasPrice?: string;
  price: string;
  deal: string;
  instalment: string;
  features: readonly string[];
  enrollItem: CartItem;
}) {
  return (
    <section className="border-b border-ink-200/70 bg-sand-50">
      <div className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:gap-14">
          {/* trust rail */}
          <div className="grid min-w-0 grid-cols-1 items-center justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-1 lg:items-stretch lg:justify-items-stretch lg:gap-7">
            <GoogleReviews />

            <Image
              src="/course/bbb-accredited.png"
              alt="BBB Accredited Business — BBB Rating: A+"
              width={380}
              height={190}
              className="h-auto w-40 self-center lg:w-full"
            />

            <div className="text-center">
              <Image
                src="/course/agent-advice.png"
                alt="Agent Advice"
                width={424}
                height={92}
                className="mx-auto h-auto w-36 lg:w-full"
              />
              <p className="mt-2 text-xs text-ink-500">Best Online School 2025</p>
            </div>
          </div>

          <div className="min-w-0 grid gap-8 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:items-start">
            <div className="reveal rounded-panel bg-white p-7 shadow-card ring-2 ring-brand-600">
              <p className="flex items-baseline gap-2">
                {wasPrice ? (
                  <span className="text-sm text-ink-400 line-through">
                    {wasPrice}
                  </span>
                ) : null}
                <span className="font-display text-4xl text-brand-700">{price}</span>
              </p>

              <p className="mt-2 text-xs font-medium text-accent-600">{deal}</p>

              <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs leading-relaxed text-ink-500">
                {instalment}
                <Image
                  src="/course/klarna.png"
                  alt="Klarna"
                  width={104}
                  height={26}
                  className="h-4 w-auto"
                />
              </p>

              <div className="mt-6">
                <EnrollButton item={enrollItem} />
              </div>

            </div>

            <ul className="reveal divide-y divide-ink-200/70 overflow-hidden rounded-panel border border-ink-200/70 bg-white shadow-card">
              {features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <span className="text-[13.5px] text-ink-700">{feature}</span>
                  <Check className="size-4 shrink-0 text-leaf-600" aria-hidden />
                  <span className="sr-only">Included</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
