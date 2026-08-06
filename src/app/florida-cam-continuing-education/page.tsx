import type { Metadata } from "next";
import Image from "next/image";
import { Check, Sparkles } from "lucide-react";
import { CourseHero } from "@/components/course/course-sections";
import { PurchaseCard } from "@/components/course/purchase-card";
import {
  GoogleReviews,
  GoogleReviewsBand,
} from "@/components/marketing/google-reviews-source";
import { GuideLink, GuideSteps } from "@/components/marketing/guide-steps";
import { TopicBlocks } from "@/components/marketing/topic-blocks";
import { TopicCourseCards } from "@/components/marketing/topic-course-cards";
import { VideoPlayer } from "@/components/ui/video-player";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-cam-continuing-education                     */
/* -------------------------------------------------------------------------- */

const ENROLL_SLUG = "cam-continuing-education";

/** Section 1. */
const HERO = {
  title: "Florida CAM Continuing Education Courses Online",
  intro:
    "Easily complete all state-required hours for your CAM license renewal with our 100% online courses.",
  badge: "Includes 5 hours of HOA-specific CE for CAMs who manage HOAs",
  /** The page's own walkthrough: https://youtu.be/VxZljTxRJUM */
  video: { id: "VxZljTxRJUM", title: "Florida CAM Continuing Education" },
  bullets: [
    "Fast and Easy",
    "Guaranteed to Pass",
    "Instant Reporting to DBPR",
  ],
  certification: "Florida State Approved CAM School. CAM CE Provider #PVD637",
  package: {
    src: "/course/cam-ce-package-2026.png",
    dueLabel: "Education Due Date:",
    dueDate: "09/30/2026",
  },
  lead: "Whether you manage a condominium, HOA, or co-op, this package includes everything you need to renew your CAM license in 2026.",
} as const;

const PRICING = {
  heading: "CAM CE Package",
  includesTitle: "This course bundle includes:",
  includes: [
    "3 Credits of Legal Updates",
    "3 Credits of Human Resources",
    "3 Credits of Insurance/Financial Mgt",
    "3 Credits of Operation of Property",
    "3 Credits of Elective",
    "2 Optional Credits of HOA-Specific",
  ],
  ctaLabel: "Enroll Now",
} as const;

/**
 * Section 2. Every "More details" link on the original points at the same
 * product on the external Prolicense storefront; here they open our own
 * store page for the same shelf.
 */
const STORE_URL = "/store/cam-continuing-education";

const TOPIC_COURSES = {
  title: "If you prefer, get courses individually by topic.",
  items: [
    {
      category: "CAM Legal Updates",
      hours: "(3 Hrs)",
      title: "CAM Legal Updates, Renewal 2026",
      price: "$25",
      image: "/course/ce-legal.png",
      href: STORE_URL,
    },
    {
      category: "Human Resources",
      hours: "(3 Hrs)",
      title: "Dealing with Problems and Conflicts",
      price: "$25",
      image: "/course/ce-human-resources.png",
      href: STORE_URL,
    },
    {
      category: "Insurance / Financial Mgt",
      hours: "(3 Hrs)",
      title: "Strategies to Collect Owners’ Dues",
      price: "$25",
      image: "/course/ce-insurance.png",
      href: STORE_URL,
    },
    {
      category: "Operation of Property",
      hours: "(3 Hrs)",
      title: "Preventive Property Maintenance",
      price: "$25",
      image: "/course/ce-property.png",
      href: STORE_URL,
    },
    {
      category: "Elective Topic",
      hours: "(3 Hrs)",
      title: "Prevent Theft and Fraud",
      price: "$25",
      image: "/course/ce-elective.png",
      href: STORE_URL,
    },
  ],
} as const;

/** Section 3. */
const RENEWAL = {
  title: "Renewing Your Florida CAM License: A Step-by-Step Guide",
  lead: [
    <>
      <GuideLink href="/blog/florida-cam-license-renewal-guide">
        Renewing your CAM license in Florida
      </GuideLink>{" "}
      is a straightforward process that can be completed in a few simple steps.
      All CAM licenses in Florida expire on September 30th of every
      even-numbered year.
    </>,
  ],
  steps: [
    {
      title: "Update Your DBPR Profile",
      body: [
        "Before completing your education, determine if this critical first step applies to you.",
        <>
          <GuideLink href="/blog/florida-cam-hoa-ce-requirements-2026">
            Do you manage a Homeowners&apos; Association (HOA)
          </GuideLink>
          ? If so, you must update your online account with the Department of
          Business and Professional Regulation (DBPR). Log in to your profile
          and check the box indicating that you provide services to HOAs. This
          directly impacts your continuing education requirements.
        </>,
      ],
    },
    {
      title: "Complete and Verify Your Continuing Education (CE)",
      body: [
        "Next, complete your state-approved continuing education (CE). The total number of hours required depends on whether you manage an HOA.",
        <>
          <strong className="text-ink-900">
            For CAMs NOT Managing an HOA:
          </strong>{" "}
          You are required to complete 15 hours of CE covering approved topics
          like legal updates, financial management, and property operations.
        </>,
        <>
          <strong className="text-ink-900">For CAMs Managing an HOA:</strong>{" "}
          You are required to complete 17 hours of CE. This includes the
          standard 15 hours plus an additional 2-hour course focused
          specifically on HOA governance and recordkeeping.
        </>,
        "After completing your courses, your school will electronically submit your credit hours to the DBPR. Allow 1-3 business days for this to be processed. You should log in to your Florida DBPR profile to verify that all your CE hours have been posted correctly before moving to the next step.",
      ],
    },
    {
      title: "Submit Your Renewal Application Online",
      body: [
        "Once your CE hours are successfully posted to your DBPR profile, you can renew your license. The DBPR typically sends a renewal notice approximately 90 days before the deadline (around late June of an even-numbered year).",
      ],
      bullets: [
        <>
          Go to the official DBPR website at{" "}
          <GuideLink href="https://www2.myfloridalicense.com/">
            www.myfloridalicense.com
          </GuideLink>{" "}
          and log in to your account.
        </>,
        'Navigate to and select the "Renew Your License" option.',
        "Carefully verify that all your personal and contact information is current and accurate before submitting.",
      ],
    },
    {
      title: "Pay your renewal fee",
      body: [
        "The final step is to pay the required renewal fee.",
        "The on-time renewal fee for an active CAM license is $105.",
        "To avoid a late fee, you must complete all renewal steps and pay the fee by the September 30th deadline.",
      ],
    },
  ],
} as const;

/** Section 4. */
const CLARIFICATIONS = {
  title: "Other Renewal Requirements and Important Clarifications",
  blocks: [
    {
      title: "Continuing Education (CE) Topic Breakdown",
      body: [
        "The standard 15-hour continuing education requirement for Florida CAMs is broken down into specific, mandatory categories. All 15 hours must be completed through a DBPR-approved provider. The required topics are:",
      ],
      bullets: [
        "3 Hours: Legal Updates",
        "3 Hours: Insurance and Financial Management",
        "3 Hours: Operation of the Association's Physical Property",
        "3 Hours: Human Resources",
        "3 Hours: Elective (any approved CAM-related topic)",
      ],
      footer: [
        "For CAMs managing HOAs, the 17-hour requirement incorporates these topics but must also include the state-mandated 2-hour course on HOA governance and recordkeeping.",
      ],
    },
    {
      title: "Exemptions from Continuing Education",
      body: [
        "Under Florida regulations, there are now two distinct scenarios where a licensee may be exempt from the biennial continuing education requirement.",
        <>
          <strong className="text-ink-900">
            1. First Renewal Exemption (For New Licensees)
          </strong>{" "}
          If you are renewing your CAM license for the very first time, and you
          were initially licensed within the current renewal period (between
          October 1, 2024, and September 30, 2026), you are exempt from the
          continuing education requirement for the 2026 renewal cycle.
        </>,
        <>
          <strong className="text-ink-900">
            2. Long-Tenured Licensee Exemption (New Law)
          </strong>{" "}
          Effective July 1, 2024, a new law exempts CAMs from CE requirements if
          they meet all of the following criteria:
        </>,
      ],
      bullets: [
        "Holds an active license.",
        "Has held their Florida CAM license continuously for at least 10 years.",
        "Has had no disciplinary action imposed against their license.",
      ],
      footer: [
        "Licensees who believe they qualify for this exemption can verify their status through their online account on the DBPR website.",
      ],
    },
    {
      title: "Action Required for All Exempt Licensees",
      body: [
        "An exemption from continuing education is NOT an exemption from the renewal process itself.",
        "Regardless of which exemption applies to you, you are still required to complete the online renewal application and pay the full $105 renewal fee by the September 30, 2026, deadline to keep your license active.",
      ],
    },
  ],
} as const;

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} | Prolicense Florida` },
  description: HERO.intro,
  alternates: { canonical: "/florida-cam-continuing-education" },
};

export default async function Page() {
  const course = await getCourseBySlug(ENROLL_SLUG);
  const pricing = displayPrice(course);

  return (
    <>
      <CourseHero
        title={HERO.title}
        intro={HERO.intro}
        media={
          <VideoPlayer videoId={HERO.video.id} title={HERO.video.title} />
        }
        footer={
          <div className="space-y-7">
            {/* The HOA line is the page's one announcement, so it keeps the
                dark plate the original gives it rather than a quiet note. */}
            <p className="flex items-start gap-3.5 rounded-panel bg-brand-950 px-5 py-4 text-[14.5px] leading-relaxed text-gold-200">
              <Sparkles className="mt-0.5 size-4.5 shrink-0" aria-hidden />
              {HERO.badge}
            </p>

            <GoogleReviews />
          </div>
        }
      />

      {/* ------------------------- the CE package ------------------------- */}
      <section id="package" className="border-b border-ink-200/70 bg-white scroll-mt-28">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-10 lg:py-20">
          <div className="reveal">
            <ul className="space-y-4">
              {HERO.bullets.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="icon-tile mt-0.5 size-7">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink-800">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[13px] leading-relaxed text-ink-500">
              {HERO.certification}
            </p>
          </div>

          <div className="reveal text-center">
            <Image
              src={HERO.package.src}
              alt="2026 Florida CAM CE package, HOA ready"
              width={920}
              height={920}
              className="mx-auto h-auto w-56 rounded-card lg:w-64"
            />
            <p className="mt-5 font-display text-lg text-ink-950">
              {HERO.package.dueLabel}
              <br />
              {HERO.package.dueDate}
            </p>
          </div>

          <div className="reveal min-w-0">
            <p className="mb-7 text-[15px] leading-relaxed text-ink-600">
              {HERO.lead}
            </p>

            <PurchaseCard
              heading={PRICING.heading}
              wasPrice={pricing.wasPrice}
              price={pricing.price}
              saveLabel={pricing.saveLabel}
              includesTitle={PRICING.includesTitle}
              includes={PRICING.includes}
              ctaLabel={PRICING.ctaLabel}
              enrollItem={{
                courseId: course?.id ?? "",
                slug: course?.slug ?? ENROLL_SLUG,
                title: course?.title ?? "Florida CAM Continuing Education",
                priceCents: course?.price_cents ?? 0,
                trackSlug: course?.track?.slug ?? "cam",
                hours: course?.hours ?? null,
              }}
            />
          </div>
        </div>
      </section>

      <TopicCourseCards
        title={TOPIC_COURSES.title}
        items={TOPIC_COURSES.items}
      />

      {/* Numbered renewal walkthrough — real steps here, so the badges keep
          the "Step" label. */}
      <section className="bg-white">
        <div className="container-page pt-16 lg:pt-24">
          <h2 className="reveal mx-auto max-w-3xl text-center font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
            {RENEWAL.title}
          </h2>
        </div>
        <GuideSteps lead={RENEWAL.lead} steps={RENEWAL.steps} />
      </section>

      <TopicBlocks title={CLARIFICATIONS.title} items={CLARIFICATIONS.blocks} />

      <GoogleReviewsBand />
    </>
  );
}
