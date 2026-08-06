import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { CourseHero } from "@/components/course/course-sections";
import { PurchaseCard } from "@/components/course/purchase-card";
import { YouTubeEmbed } from "@/components/course/youtube-embed";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { GuideLink, GuideSteps } from "@/components/marketing/guide-steps";
import { POST_LICENSE_FAQS } from "@/content/course-faqs";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-real-estate-45-hour-post-license-course      */
/* -------------------------------------------------------------------------- */

const SLUG = "re-45-sales-associate-post";

const HERO = {
  title: "Florida Real Estate Post-License Course",
  intro:
    "This course satisfies the 45-hour sales associate post-licensing requirements to renew your real estate license for the first time in Florida.",
  rating: "4.9 Rating (186 Reviews)",
  approval: "FREC Approved Course #0026157",
  bullets: [
    "Obtain your 45-hour education online.",
    "Easily renew your real estate license in Florida.",
    "Same-day electronic reporting to the Florida DBPR.",
  ],
  video: {
    id: "pzXLZa58UCc",
    title: "Florida Real Estate Post License Course",
    poster: "/course/post45-poster.jpg",
  },
} as const;

const OFFER = {
  guarantee: "30-Day Money-Back Guarantee",
  includes: [
    "45-Hour Post-License Online Course",
    "24/7 Instructor Support",
    "Course E-Book",
  ],
} as const;

/** Section 2 — what the state requires, in the original's order. */
const REQUIREMENTS = {
  title: "Florida Real Estate Post-License Requirements",
  steps: [
    {
      title: "Verify Your License Expiration Date",
      body: [
        <>
          In Florida, real estate licenses expire on March 31st or September
          30th, every two years. The specific renewal date for your license
          depends on when you passed your exam. This information is also{" "}
          <GuideLink href="https://www.myfloridalicense.com/wl11.asp?mode=0&SID=">
            available on your real estate license
          </GuideLink>
          .
        </>,
      ],
    },
    {
      title: "Complete Your Post-License Education",
      body: [
        <>
          Prior to their first license renewal deadline,{" "}
          <GuideLink href="http://www.myfloridalicense.com/dbpr/re/documents/real_estate_ed_requirements.pdf">
            Florida real estate sales associates must complete 45 hours of
            post-licensing education
          </GuideLink>
          . Failing to complete the post-licensing education on time, will
          result in your license becoming null and void. If you hold a 4-year
          degree, or higher, in real estate you may be exempt from the
          post-license education requirement.
        </>,
      ],
    },
    {
      title: "Pay Your Renewal Fee",
      body: [
        <>
          <GuideLink href="https://www.myfloridalicense.com/datamart/mainMenuFLDBPR.do">
            Submit a payment of $32 to the Florida DBPR
          </GuideLink>{" "}
          within 90 days of the license renewal date.
        </>,
      ],
    },
  ],
} as const;

/** Section 3 — what the 45 hours cover. No links in the original. */
const OVERVIEW = {
  title: "Florida Real Estate 45-Hour Post-Licensing Course",
  heading: "Course Overview",
  intro:
    "The Florida 45-Hour Post-Licensing Course contains practical instructions about real estate business planning, marketing, prospecting, and closing transactions.",
  topics: [
    "Niche Opportunities in Real Estate",
    "Organizing Your Real Estate Business",
    "Finding and Securing New Listings",
    "Marketing and Servicing Listings",
    "Prospecting for Buyers",
    "Understanding Mortgage Finance",
    "Closing the Transaction",
    "Achieving a Work and Life Balance",
  ],
} as const;

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} Online | Prolicense Florida` },
  description: HERO.intro,
  alternates: { canonical: "/florida-real-estate-45-hour-post-license-course" },
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
          <div className="space-y-4">
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

            <p className="text-[11px] font-medium tracking-[0.16em] text-ink-500 uppercase">
              {HERO.approval}
            </p>
          </div>
        }
        media={
          <PurchaseCard
            media={
              <YouTubeEmbed
                id={HERO.video.id}
                title={HERO.video.title}
                poster={HERO.video.poster}
              />
            }
            wasPrice={pricing.wasPrice}
            price={pricing.price}
            saveLabel={pricing.saveLabel}
            guarantee={OFFER.guarantee}
            includes={OFFER.includes}
            ctaLabel="Add to Cart"
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

      {/* -------------------------- requirements ---------------------------- */}
      <GuideSteps
        title={REQUIREMENTS.title}
        steps={REQUIREMENTS.steps}
        stepLabel={null}
      />

      {/* --------------------------- course overview -------------------------
          Eight topics, set in two columns on a wide screen: the list is a
          syllabus to scan, not a sequence to follow, so the numbers the
          original omits stay omitted and the rules carry the rhythm. */}
      <section className="border-b border-ink-200/70 bg-sand-100">
        <div className="container-page py-16 lg:py-24">
          <h2 className="reveal text-center font-display text-[1.8rem] leading-tight text-brand-600 lg:text-[2.35rem]">
            {OVERVIEW.title}
          </h2>

          <div className="reveal mx-auto mt-10 max-w-4xl lg:mt-14">
            <h3 className="font-display text-[1.15rem] text-ink-950">
              {OVERVIEW.heading}
            </h3>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-600">
              {OVERVIEW.intro}
            </p>

            <ul className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {OVERVIEW.topics.map((topic) => (
                <li
                  key={topic}
                  className="flex items-center gap-3.5 border-b border-ink-200/60 py-4 last:border-b-0"
                >
                  <span
                    className="size-1.5 shrink-0 rounded-full bg-brand-600"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-snug text-ink-800">
                    {topic}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* -------------------------------- faq --------------------------------
          The original runs this on its bright blue field with no heading, just
          the question-mark art. Dark tone here for the same weight without a
          second brand blue. */}
      <FaqAccordion
        items={POST_LICENSE_FAQS}
        title={null}
        tone="dark"
        icon={{ src: "/course/faq-bubbles.png", width: 596, height: 476 }}
      />
    </>
  );
}
