import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { CourseHero } from "@/components/course/course-sections";
import { PurchaseCard } from "@/components/course/purchase-card";
import { GuideLink, GuideSteps } from "@/components/marketing/guide-steps";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-real-estate-broker-license-course            */
/* -------------------------------------------------------------------------- */

const SLUG = "re-72-broker";

const HERO = {
  title: "Florida Real Estate Broker Online Course",
  intro:
    "This course satisfies the 72-hour real estate broker licensing requirement in Florida.",
  rating: "4.9 Rating (218 Reviews)",
  bullets: [
    "Florida residency is not required",
    "Complete your 72-hour efficiently online",
    "Get an edge as a real estate broker",
  ],
  art: {
    src: "/course/broker-hero.jpg",
    alt: "An illustration of a house changing hands for cash",
  },
} as const;

const OFFER = {
  guarantee: "30-Day Money-Back Guarantee",
  includes: [
    "72-Hour Broker License Online Course",
    "State Exam Simulator",
    "24/7 Instructor Support",
  ],
} as const;

/**
 * Section 2 — the path to a broker licence.
 *
 * The original underlines several phrases without linking them ("Florida
 * sales associate", "state-approved school"); those stay emphasis. Only the
 * four that carry an href are links, and they point where the original does.
 */
const LICENSE = {
  title: "How to Get You Florida Real Estate Broker License",
  eligibility: {
    title: "Prerequisite experience:",
    separator: "or",
    items: [
      <>
        Has been an active{" "}
        {/* The original links this to its 63-hour sales associate page. */}
        <GuideLink href="/florida-real-estate-license-course">
          <strong>Florida</strong> sales associate
        </GuideLink>{" "}
        for at least 24 months during the preceding 5 years.
      </>,
      <>
        Has held a valid{" "}
        <GuideLink href="https://www.myfloridalicense.com/CheckListDetail.asp?SID=&xactCode=1012&clientCode=2501&XACT_DEFN_ID=345">
          real estate broker&#39;s license
        </GuideLink>{" "}
        for at least 24 months during the preceding 5 years in any{" "}
        <strong>other state</strong>, territory, or jurisdiction of the United
        States.
      </>,
    ],
  },
  steps: [
    {
      title: "Complete a Pre-Licensing Course",
      body: [
        <>
          All candidates are required to complete 72 hours of online or
          classroom approved pre-licensing broker education. Real estate broker
          license courses can be completed online with a{" "}
          {/* The original points this at its real estate school page. */}
          <GuideLink href="/real-estate">state-approved school</GuideLink>.
        </>,
      ],
    },
    {
      title: "Have Your Fingerprints Taken",
      body: [
        <>
          Digital fingerprints can be taken at any authorized location across
          the US.{" "}
          <GuideLink href="https://fl.state.identogo.com/">
            Make an appointment online
          </GuideLink>{" "}
          or contact IdentoGO at (800) 528-1358 for more information.
        </>,
      ],
    },
    {
      title: "Submit Your Application",
      body: [
        <>
          <GuideLink href="https://www.myfloridalicense.com/intentions2.asp?chBoard=true&SID=&boardid=25&professionid=25B">
            Submit your broker application to the Florida DBPR
          </GuideLink>
          . You don&#39;t have to be a Florida resident to apply and obtain your
          license. You may submit your application for approval prior to taking
          the pre-licensing broker education. If experience is coming from a
          state other than Florida, a certification of license history is
          required.
        </>,
      ],
    },
    {
      title: "Pass the Florida Real Estate Broker Exam",
      body: [
        <>
          The real estate broker state exam is offered daily at Pearson VUE test
          centers across United States. To register, call Pearson VUE at
          888-204-6230 or{" "}
          <GuideLink href="https://home.pearsonvue.com/fl/dbpr">
            visit their website
          </GuideLink>
          .{" "}
          <GuideLink href="/docs/fl-broker-exam-candidate-booklet.pdf">
            The broker exam
          </GuideLink>{" "}
          is a multiple-choice test of 100 questions with a passing grade of
          75%.
        </>,
      ],
    },
    {
      title: "Activate Your License",
      body: [
        "To activate your real estate broker license, you must submit a request for change of status to the Florida DBPR.",
      ],
    },
  ],
} as const;

/** Section 3 — what the 72 hours cover, in the original's order. */
const OVERVIEW = {
  title: "Real Estate Broker Course Overview",
  topics: [
    "Becoming a Real Estate Broker",
    "Opening a Real Estate Office",
    "Owning and Managing a Real Estate Office",
    "Escrow Management",
    "Office Inspections and Disciplinary Process",
    "Comparative Market Analysis",
    "Business Valuation",
    "Investment Real Estate",
    "Property Management",
  ],
} as const;

/**
 * Section 4 — renewal. Copy verbatim, including the original's "must to
 * complete" and its "14 hours of continuing" with the noun left off.
 */
const RENEWAL = {
  title: "Florida Real Estate Broker License Renewal Requirements",
  periods: [
    {
      title: "First Renewal Period",
      body: "Florida real estate brokers must to complete 60 hours of post-licensing education during their first renewal cycle of 18 to 24 months. These courses may be conducted online or in classrooms.",
    },
    {
      title: "Subsequent Renewal Periods",
      body: "Following the first renewal period, Florida real estate brokers must to complete 14 hours of continuing every 24 months. The real estate broker continuing education must include 8 hours of specialty credit, 3 hours dedicated to an update of Florida laws and 3 hours of ethics and business practices.",
    },
  ],
} as const;

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} | Prolicense Florida` },
  description: HERO.intro,
  alternates: { canonical: "/florida-real-estate-broker-license-course" },
};

export default async function Page() {
  const course = await getCourseBySlug(SLUG);
  const pricing = displayPrice(course);

  return (
    <>
      <CourseHero
        title={HERO.title}
        intro={HERO.intro}
        bullets={HERO.bullets}
        footer={
          <p className="flex flex-wrap items-center gap-3">
            <span className="flex gap-0.5" aria-hidden>
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-5 fill-gold-500 text-gold-500" />
              ))}
            </span>
            <Link
              href="/reviews"
              className="text-[15px] font-medium text-ink-900 underline decoration-ink-300 underline-offset-4 transition-colors duration-200 hover:decoration-ink-900"
            >
              {HERO.rating}
            </Link>
          </p>
        }
        media={
          <PurchaseCard
            media={
              /* The original's own artwork, on the white field it was drawn
                 for — the card's dark media well would fight it. */
              <Image
                src={HERO.art.src}
                alt={HERO.art.alt}
                width={825}
                height={479}
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="h-auto w-full rounded-card bg-white"
              />
            }
            wasPrice={pricing.wasPrice}
            price={pricing.price}
            saveLabel={pricing.saveLabel}
            guarantee={OFFER.guarantee}
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
        }
      />

      {/* ------------------- how to get your broker license ------------------ */}
      <GuideSteps
        title={LICENSE.title}
        eligibility={LICENSE.eligibility}
        steps={LICENSE.steps}
        stepLabel={null}
      />

      {/* --------------------------- course overview -------------------------
          Nine short lines. Set in two columns on a wide screen so the block
          reads as a syllabus at a glance rather than a long thin list, with
          the numbers carried in their own tiles — the order is part of the
          content here, it is the course's running order. */}
      <section className="border-b border-ink-200/70 bg-sand-100">
        <div className="container-page py-16 lg:py-24">
          <h2 className="reveal text-center font-display text-[1.8rem] leading-tight text-brand-600 lg:text-[2.35rem]">
            {OVERVIEW.title}
          </h2>

          <ol className="reveal mx-auto mt-10 grid max-w-4xl gap-x-10 gap-y-1 sm:grid-cols-2 lg:mt-14">
            {OVERVIEW.topics.map((topic, i) => (
              <li
                key={topic}
                className="flex items-center gap-4 border-b border-ink-200/60 py-4 last:border-b-0"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-medium text-brand-700 shadow-xs tabular-nums">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-snug text-ink-800">
                  {topic}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------ renewal requirements -----------------------
          Two periods, side by side: they are a sequence a licensee moves
          through, and stacking them hides that the second is the one that
          repeats. The ordinal above each title carries that sequence. */}
      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page py-16 lg:py-24">
          <h2 className="reveal text-center font-display text-[1.8rem] leading-tight text-brand-600 lg:text-[2.35rem]">
            {RENEWAL.title}
          </h2>

          <ol className="reveal mx-auto mt-10 grid max-w-4xl gap-6 lg:mt-14 lg:grid-cols-2">
            {RENEWAL.periods.map((period, i) => (
              <li
                key={period.title}
                className="rounded-panel border border-ink-200/60 bg-sand-50 p-7 shadow-card transition-shadow duration-300 hover:shadow-card-hover lg:p-8"
              >
                <p className="text-[10px] tracking-[0.24em] text-brand-500 uppercase">
                  {i === 0 ? "First" : "Thereafter"}
                </p>
                <h3 className="mt-3 font-display text-[1.15rem] text-ink-950 lg:text-[1.3rem]">
                  {period.title}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                  {period.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
