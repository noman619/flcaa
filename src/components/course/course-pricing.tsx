import Image from "next/image";
import { Check, Minus } from "lucide-react";
import type { CartItem } from "@/components/cart/cart-provider";
import { EnrollButton } from "@/components/course/enroll-button";
import { FreeTrialDialog } from "@/components/marketing/free-trial-dialog";
import { GoogleReviews } from "@/components/marketing/google-reviews-source";

export type PricingPlan = {
  name: string;
  /** Catalog slug for this tier. */
  slug: string;
  /** Absent where the tier carries no advertised anchor. */
  wasPrice?: string;
  price: string;
  cents: string;
  deal: string;
  instalment: string;
  popular?: boolean;
  freeTrial?: boolean;
};

export type TrustBadge = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Omit where the artwork already carries its own wording. */
  caption?: string;
};

/** The award badge the real estate course page has always shown. */
const DEFAULT_BADGE: TrustBadge = {
  src: "/course/agent-advice.png",
  alt: "Agent Advice",
  width: 424,
  height: 92,
  caption: "Best Online School 2025",
};

export type FeatureRow = {
  label: string;
  /** One flag per plan, in the same order as `plans`. */
  included: readonly boolean[];
};

/**
 * Plans, then the matrix that explains them.
 *
 * The matrix is a real <table> with scoped headers rather than a grid of divs:
 * a pricing comparison is tabular data, and a screen reader announcing
 * "Digital Flashcards, Premium, included" is the whole point of the section.
 * The ✓/− glyphs are aria-hidden with the state carried in visually hidden
 * text, because an icon alone tells a screen reader nothing.
 */
export function CoursePricing({
  plans,
  features,
  certification,
  enrollItems,
  badge = DEFAULT_BADGE,
}: {
  plans: readonly PricingPlan[];
  features: readonly FeatureRow[];
  certification: readonly string[];
  /** Cart item per plan, same order as `plans`. */
  enrollItems: readonly CartItem[];
  /** Third item in the trust rail. Defaults to the Agent Advice award. */
  badge?: TrustBadge;
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
                src={badge.src}
                alt={badge.alt}
                width={badge.width}
                height={badge.height}
                className={
                  badge.caption
                    ? "mx-auto h-auto w-36 lg:w-full"
                    : "mx-auto h-auto w-28 lg:w-40"
                }
              />
              {badge.caption ? (
                <p className="mt-2 text-xs text-ink-500">{badge.caption}</p>
              ) : null}
            </div>
          </div>

          {/*
           * plans — min-w-0 is load-bearing: a grid item defaults to
           * min-width:auto, so the matrix's min-w-136 (544px) would set this
           * column's floor and push the whole page wider than a 360px screen
           * instead of scrolling inside its own overflow-x-auto.
           */}
          <div className="min-w-0">
            <div className="grid gap-5 sm:grid-cols-3">
              {plans.map((plan, planIndex) => (
                <div
                  key={plan.name}
                  className={`reveal relative flex flex-col rounded-panel bg-white p-6 shadow-card ${
                    plan.popular
                      ? "ring-2 ring-brand-600"
                      : "border border-ink-200/70"
                  }`}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-white uppercase">
                      Most Popular
                    </span>
                  ) : null}

                  <p className="font-display text-lg text-ink-950">{plan.name}</p>

                  <p className="mt-4 flex items-baseline gap-2">
                    <span className="text-sm text-ink-400 line-through">
                      {plan.wasPrice}
                    </span>
                    <span className="font-display text-3xl text-brand-700">
                      {plan.price}
                      <span className="text-lg">{plan.cents}</span>
                    </span>
                  </p>

                  <p className="mt-2 text-xs font-medium text-accent-600">
                    {plan.deal}
                  </p>

                  <p className="mt-4 flex flex-wrap items-center gap-1.5 text-xs leading-relaxed text-ink-500">
                    {plan.instalment}
                    <Image
                      src="/course/klarna.png"
                      alt="Klarna"
                      width={104}
                      height={26}
                      className="h-4 w-auto"
                    />
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <EnrollButton item={enrollItems[planIndex]} />
                    {plan.freeTrial ? (
                      <FreeTrialDialog
                        label="Free Trial"
                        course={`Florida Real Estate License Course — ${plan.name}`}
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {/* comparison matrix */}
            <div className="mt-10 contain-paint overflow-x-auto">
              <table className="w-full min-w-136 border-collapse text-left">
                <caption className="sr-only">
                  What each plan includes
                </caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-1/2 pb-3" />
                    {plans.map((plan) => (
                      <th
                        key={plan.name}
                        scope="col"
                        className="pb-3 text-center text-[13px] font-medium text-ink-700"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200/70 border-y border-ink-200/70">
                  {features.map((row) => (
                    <tr key={row.label} className="even:bg-white/60">
                      <th
                        scope="row"
                        className="py-3 pr-4 text-[13.5px] font-normal text-ink-700"
                      >
                        {row.label}
                      </th>
                      {row.included.map((yes, i) => (
                        <td key={plans[i]?.name ?? i} className="py-3 text-center">
                          {yes ? (
                            <Check
                              className="mx-auto size-4 text-leaf-600"
                              aria-hidden
                            />
                          ) : (
                            <Minus
                              className="mx-auto size-4 text-ink-300"
                              aria-hidden
                            />
                          )}
                          <span className="sr-only">
                            {yes ? "Included" : "Not included"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-1 text-center text-xs text-ink-500">
              {certification.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
