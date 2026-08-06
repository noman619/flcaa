import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Star } from "lucide-react";
import { PurchaseCard } from "@/components/course/purchase-card";
import { StepBands } from "@/components/marketing/step-bands";
import { TopicCourseCards } from "@/components/marketing/topic-course-cards";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/fl-real-estate-continuing-education                  */
/* -------------------------------------------------------------------------- */

const SLUG = "re-continuing-education";

const HERO = {
  title: "Florida Real Estate Continuing Education Courses Online",
  lead: "The mandatory 14 hours shall be comprised of the following:",
  hours: [
    "3 Hours Florida Core Law",
    "3 Hours Business Ethics",
    "8 Hours Specialty Credit",
  ],
  rating: "4.9 Rating (142 Reviews)",
  claims: ["Fast and Easy", "Guaranteed to Pass", "Instant Reporting to DBPR"],
  art: { src: "/course/ce-hero.svg", alt: "" },
  badge: {
    src: "/course/ce-14hr-badge.jpg",
    alt: "14-hour continuing education licence renewal",
  },
} as const;

const OFFER = {
  heading: "14-Hour Package",
  includesTitle: "This course bundle includes:",
  includes: [
    "3 Hours Florida Core Law",
    "3 Hours Business Ethics",
    "8 Hours Specialty Credit",
  ],
} as const;

/**
 * Section 2 — the à-la-carte topics.
 *
 * The original's "More details" buttons open its storefront category,
 * checkout.flcaa.com/products/real-estate-continuing-education; ours open the
 * local port of that shelf.
 *
 * Its own inconsistencies are kept: "11$" on the ethics card, "(4Hrs)" without
 * a space on the third, and specialty credit split across two 4-hour cards
 * even though the bundle advertises 8 hours of it.
 */
const STORE_URL = "/store/real-estate-continuing-education";

const TOPICS = {
  lead: ["If you prefer,", "get courses individually by topic."],
  title: "CE Hours Per Topic",
  items: [
    {
      category: "Florida Core Law",
      hours: "3 Hrs",
      title: "Real Estate Legal Updates - $11",
      price: "$11",
      image: "/course/re-ce-law.png",
      href: STORE_URL,
    },
    {
      category: "Business Ethics",
      hours: "3 Hrs",
      title: "Ethics For Real Estate Professionals - 11$",
      price: "$11",
      image: "/course/re-ce-ethics.png",
      href: STORE_URL,
    },
    {
      category: "Specialty Credit",
      hours: "4Hrs",
      title: "Working With Investors - $11",
      price: "$11",
      image: "/course/re-ce-investors.png",
      href: STORE_URL,
    },
    {
      category: "Specialty Credit",
      hours: "4 Hrs",
      title: "Understanding Mortgages - $11",
      price: "$11",
      image: "/course/re-ce-mortgages.png",
      href: STORE_URL,
    },
  ],
} as const;

/**
 * Section 3 — the renewal path. The original sets the titles in caps as a
 * style, so they are stored in sentence case and uppercased in CSS.
 */
const RENEWAL = {
  title: "Steps to Renew Your Florida Real Estate License",
  steps: [
    {
      title: "Complete your 14 hours of real estate continuing education.",
      body: "Renewal Date: 3/31 or 9/30 every two years. The date you renew depends on when you took your licensing exam.",
    },
    {
      title: "We will submit your completed hours to the Florida DBPR.",
      body: "Electronic processing of your completed hours will take 1-3 business days.",
    },
    {
      title: "Submit your license renewal form to the DBPR",
      body: (
        <>
          The form can be completed online at{" "}
          <a
            href="https://www.myfloridalicense.com/datamart/mainMenuFLDBPR.do"
            target="_blank"
            rel="noreferrer"
            className="text-white underline decoration-white/50 underline-offset-4 transition-colors duration-200 hover:decoration-white"
          >
            http://www.myfloridalicense.com
          </a>
          . For help, contact the DBPR customer support center at 850-487-1395.
        </>
      ),
    },
    {
      title: "Pay your renewal fee.",
      body: "On the DBPR website, you will need to pay the License Renewal fee to complete your renewal.",
    },
  ],
} as const;

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} | Prolicense Florida` },
  description:
    "Complete your mandatory 14 hours of Florida real estate continuing education online — core law, business ethics and specialty credit.",
  alternates: { canonical: "/fl-real-estate-continuing-education" },
};

export default async function Page() {
  const course = await getCourseBySlug(SLUG);
  const pricing = displayPrice(course);

  return (
    <>
      {/* ------------------------------- hero -------------------------------
          The price card straddles the two bands, as on the original: it starts
          inside the blue and finishes on the light field below, so the offer
          reads as the hinge between the pitch and the detail. */}
      <section className="relative overflow-hidden bg-brand-600 pb-32 lg:pb-40">
        <span
          className="pointer-events-none absolute -top-32 -right-24 size-112 rounded-full bg-white/15 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page grid items-start gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 lg:py-20">
          <div className="reveal">
            <h1 className="max-w-lg font-display text-[2rem] leading-[1.12] font-medium text-white lg:text-[2.75rem]">
              {HERO.title}
            </h1>

            <p className="mt-10 max-w-md text-[16px] leading-relaxed text-white/90">
              {HERO.lead}
            </p>

            <ul className="mt-4 space-y-2">
              {HERO.hours.map((hour) => (
                <li key={hour} className="flex items-start gap-3">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-white/60"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed text-white/90">
                    {hour}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-10 flex flex-wrap items-center gap-3">
              <span className="flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-5 fill-gold-500 text-gold-500" />
                ))}
              </span>
              <Link
                href="/reviews"
                className="text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white"
              >
                {HERO.rating}
              </Link>
            </p>
          </div>

          <div className="reveal justify-self-center lg:justify-self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERO.art.src}
              alt={HERO.art.alt}
              className="h-44 w-auto drop-shadow-2xl lg:h-64"
            />
          </div>
        </div>
      </section>

      {/* -------------------- badge, claims, and the offer ------------------- */}
      <section className="border-b border-ink-200/70 bg-mist-50">
        <div className="container-page pb-16 lg:pb-24">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="reveal flex flex-wrap items-center gap-8 pt-12 lg:gap-12 lg:pt-14">
              <Image
                src={HERO.badge.src}
                alt={HERO.badge.alt}
                width={494}
                height={332}
                className="h-28 w-auto rounded-card shadow-card lg:h-32"
              />

              <ul className="space-y-4">
                {HERO.claims.map((claim) => (
                  <li key={claim} className="flex items-center gap-3">
                    <span className="icon-tile size-7">
                      <Check className="size-3.5" aria-hidden />
                    </span>
                    <span className="text-[15px] font-medium text-brand-700">
                      {claim}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The card rides up into the blue band above. */}
            <div className="reveal -mt-24 lg:-mt-32">
              <PurchaseCard
                heading={OFFER.heading}
                wasPrice={pricing.wasPrice}
                price={pricing.price}
                saveLabel={pricing.saveLabel}
                includesTitle={OFFER.includesTitle}
                includes={OFFER.includes}
                enrollItem={{
                  courseId: course?.id ?? "",
                  slug: course?.slug ?? SLUG,
                  title: course?.title ?? HERO.title,
                  priceCents: course?.price_cents ?? 0,
                  trackSlug: course?.track?.slug ?? "real-estate",
                  hours: course?.hours ?? null,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------ à-la-carte by topic ------------------------
          The original sets the invitation on its own quiet band above the
          run, in red, and puts the section name in a pill. Kept: it is the
          hinge between "buy the bundle" and "buy one topic". */}
      <section className="bg-sand-100">
        <div className="container-page pt-12 pb-2 text-center lg:pt-14 lg:pb-3">
          {TOPICS.lead.map((line) => (
            <p
              key={line}
              className="reveal font-display text-[1.15rem] leading-snug text-accent-700 lg:text-[1.35rem]"
            >
              {line}
            </p>
          ))}
        </div>
      </section>

      <TopicCourseCards
        title={TOPICS.title}
        items={TOPICS.items}
        titleVariant="pill"
      />

      <StepBands title={RENEWAL.title} steps={RENEWAL.steps} />
    </>
  );
}
