import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  GraduationCap,
} from "lucide-react";
import { CoursePricing } from "@/components/course/course-pricing";
import { FaqAccordion } from "@/components/course/faq-accordion";
import {
  CourseHero,
  ExamChart,
  InstructorsBand,
  PromoBar,
  RelatedResources,
  StatsBand,
} from "@/components/course/course-sections";
import { LaptopVideo } from "@/components/course/laptop-video";
import { GuideStepCards } from "@/components/marketing/guide-step-cards";
import { GoogleReviewsBand } from "@/components/marketing/google-reviews-source";
import { CAM_FAQS } from "@/content/course-faqs";
import { CAM_RESOURCES } from "@/lib/course-media";
import { CAM_INSTRUCTORS } from "@/lib/instructors";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-cam-license-course-online                    */
/* -------------------------------------------------------------------------- */

const HERO = {
  title: "Florida CAM License Course Online",
  intro:
    "Get your Florida CAM license with this complete, 16-hour online pre-licensing course, fully state-approved to meet all requirements.",
  bullets: [
    "Florida residency is not required",
    "Get your license in less than 5 weeks",
    "Take the course online—on any device, anytime",
  ],
  mediaHeading: "Our CAM Course in Action",
  /** The original's course walkthrough, served from our own domain. */
  video: "/course/cam-course-demo.mp4",
} as const;

const PROMO = {
  label: "Back to School - 30% OFF",
  expires: "(Expires 08/15/2026)",
} as const;

/**
 * Catalog products behind the plans. Created by
 * supabase/add_cam_course_tiers.sql; until that has been run the tier rows do
 * not exist and each plan falls back to the base course, so the page never
 * breaks — it just prices them alike.
 */
const BASE_SLUG = "cam-licensing-course";

const PLANS = [
  {
    name: "Basic",
    slug: "cam-licensing-course-basic",
    deal: "30% OFF August Deal",
    freeTrial: true,
  },
  {
    name: "Premium",
    slug: "cam-licensing-course-premium",
    deal: "30% OFF August Deal",
    popular: true,
    freeTrial: true,
  },
  {
    name: "Ultimate",
    slug: "cam-licensing-course-ultimate",
    deal: "30% OFF August Deal",
    freeTrial: true,
  },
] as const;

// Columns are [Basic, Premium, Ultimate], matching PLANS.
const FEATURES = [
  { label: "16-Hour State-Approved Course", included: [true, true, true] },
  { label: "Fully Narrated Online Course", included: [true, true, true] },
  { label: "Dedicated Instructor Support 24/7", included: [true, true, true] },
  { label: "30-Day Money-Back Guarantee", included: [true, true, true] },
  { label: "6-Month Access", included: [true, true, true] },
  {
    label: "2 Attempts at the End-of the-Course Exam",
    included: [true, true, true],
  },
  { label: "State Exam Simulator", included: [false, true, true] },
  { label: "Digital Flashcards", included: [false, true, true] },
  {
    label: "Unlimited Retakes on the End-of-Course Exam",
    included: [false, false, true],
  },
  { label: "3-Month Access Extension", included: [false, false, true] },
] as const;

/**
 * Third item in the trust rail. This page carries the state seal where the
 * real estate page carries the Agent Advice award; the artwork has its own
 * lettering, so it takes no caption.
 */
const TRUST_BADGE = {
  src: "/course/florida-state-seal.png",
  alt: "Great Seal of the State of Florida",
  width: 284,
  height: 298,
} as const;

const CERTIFICATION = [
  "Florida State-Approved CAM School",
  "License#: PRE46 Course#: 0007587",
] as const;

const STATS = [
  { value: "84%", label: "Pass rate" },
  { value: "24/7", label: "Instructor support" },
  { value: "5/5", label: "Satisfaction rate" },
] as const;

const EXAM = {
  title: "Ace The Florida CAM Exam",
  blurbLead:
    "Average scores are based on the aggregated results of over 1,500 CAM students who completed our proprietary ",
  blurbLink: { label: "exam-prep assessment", href: "/florida-cam-exam-test-flashcards" },
  bars: [
    {
      label: "Prolicense Florida",
      value: 84,
      tone: "bg-gradient-to-t from-brand-500 to-brand-200",
    },
    {
      label: "State Average",
      value: 52,
      tone: "bg-gradient-to-t from-gold-600 to-gold-200",
    },
  ],
} as const;

/**
 * The step graphic on this page runs in a different order from the guide's:
 * the application comes before fingerprinting here.
 */
const STEP_CARDS = [
  { label: "Enroll into a pre-licensing course", icon: GraduationCap },
  { label: "Submit your CAM license application", icon: FileCheck2 },
  { label: "Get your fingerprints taken", icon: Fingerprint },
  { label: "Schedule and pass the state exam", icon: ClipboardCheck },
] as const;

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} | 84% Pass Rate` },
  description: HERO.intro,
  alternates: { canonical: "/florida-cam-license-course-online" },
};

export default async function Page() {
  // One lookup per tier, plus the base course as a fallback.
  const [base, ...tiers] = await Promise.all([
    getCourseBySlug(BASE_SLUG),
    ...PLANS.map((plan) => getCourseBySlug(plan.slug)),
  ]);

  /*
   * Prices come from the catalog rows, never from this file: an edit in the
   * admin has to move the page and the cart together, or the two disagree.
   * The instalment line is a quarter of the payable price, which is what the
   * "4 interest-free payments" offer actually is.
   */
  const plans = PLANS.map((plan, i) => {
    const pricing = displayPrice(tiers[i] ?? base);
    const [dollars, cents = "00"] = pricing.price.split(".");
    return {
      ...plan,
      wasPrice: pricing.wasPrice,
      price: dollars,
      cents: `.${cents}`,
      instalment: `As low as 4 interest-free payments of ${formatPrice(
        Math.round(pricing.payableCents / 4),
      )} with`,
    };
  });

  const enrollItems = PLANS.map((plan, i) => {
    const course = tiers[i] ?? base;
    return {
      courseId: course?.id ?? "",
      slug: course?.slug ?? BASE_SLUG,
      title: course?.title ?? plan.name,
      priceCents: course?.price_cents ?? 0,
      trackSlug: course?.track?.slug ?? "cam",
      hours: course?.hours ?? null,
    };
  });

  return (
    <>
      <PromoBar label={PROMO.label} expires={PROMO.expires} />

      <CourseHero
        title={HERO.title}
        intro={HERO.intro}
        bullets={HERO.bullets}
        mediaHeading={HERO.mediaHeading}
        media={
          /*
           * 1592x1080 (1.474) against the 1.449 cut-out — barely wider, so a
           * centred crop loses under 2% of the width and needs no bias.
           */
          <LaptopVideo
            src={HERO.video}
            alt="A walkthrough of the Florida CAM licensing course"
          />
        }
      />

      {/* ---------------------------- pricing ---------------------------- */}
      <CoursePricing
        plans={plans}
        features={FEATURES}
        certification={CERTIFICATION}
        enrollItems={enrollItems}
        badge={TRUST_BADGE}
      />

      <StatsBand stats={STATS} />

      <ExamChart
        title={EXAM.title}
        blurbLead={EXAM.blurbLead}
        blurbLink={EXAM.blurbLink}
        bars={EXAM.bars}
      />

      <InstructorsBand instructors={CAM_INSTRUCTORS} />

      {/* ----------------------------- 4 steps --------------------------- */}
      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="reveal">
            <GuideStepCards steps={STEP_CARDS} />
          </div>

          <div className="reveal text-center lg:text-left">
            <h2 className="font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
              4 Steps to Get Your Florida CAM License
            </h2>
            <p className="mt-5">
              <Link
                href="/how-get-cam-license-florida"
                className="text-[15px] text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
              >
                Learn how to get your CAM license in Florida.
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ----------------------------- reviews --------------------------- */}
      <GoogleReviewsBand />

      {/* ------------------------------- FAQ ----------------------------- */}
      <FaqAccordion items={CAM_FAQS} />

      <RelatedResources items={CAM_RESOURCES} />
    </>
  );
}
