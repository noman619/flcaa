import type { Metadata } from "next";
import Link from "next/link";
import {
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  GraduationCap,
} from "lucide-react";
import { CoursePricing } from "@/components/course/course-pricing";
import { LaptopVideo } from "@/components/course/laptop-video";
import { FaqAccordion } from "@/components/course/faq-accordion";
import {
  CourseHero,
  ExamChart,
  InstructorsBand,
  PromoBar,
  ReciprocityBand,
  RelatedResources,
  StatsBand,
} from "@/components/course/course-sections";
import { GuideStepCards } from "@/components/marketing/guide-step-cards";
import { GoogleReviewsBand } from "@/components/marketing/google-reviews-source";
import { RESOURCE_GUIDES } from "@/lib/site";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/florida-real-estate-license-course  */
/* -------------------------------------------------------------------------- */

const HERO = {
  title: "Florida Real Estate License Course Online",
  intro:
    "Get your Florida real estate license with our 63-hour, state-approved, pre-licensing course. This 100% online program meets all requirements to become a sales associate in Florida.",
  bullets: [
    "Florida residency is not required",
    "Get your license in less than 5 weeks",
    "Take the course online—on any device, anytime",
  ],
  mediaHeading: "Our Real Estate Course in Action",
} as const;

const PROMO = {
  label: "Back to School - 30% OFF",
  expires: "(Expires 08/15/2026)",
} as const;

/**
 * Catalog products behind the plans. Created by supabase/add_course_tiers.sql;
 * until that has been run the tier rows do not exist and each plan falls back
 * to the base course, so the page never breaks — it just prices them alike.
 */
const BASE_SLUG = "re-63-sales-associate";

const PLANS = [
  {
    name: "Basic",
    slug: "re-63-sales-associate-basic",
    deal: "30% OFF August Deal",
    freeTrial: true,
  },
  {
    name: "Premium",
    slug: "re-63-sales-associate-premium",
    deal: "30% OFF August Deal",
    popular: true,
    freeTrial: true,
  },
  {
    name: "Ultimate",
    slug: "re-63-sales-associate-ultimate",
    deal: "30% OFF August Deal",
    freeTrial: true,
  },
] as const;

// Columns are [Basic, Premium, Ultimate], matching PLANS.
const FEATURES = [
  { label: "63-Hour State-Approved Course", included: [true, true, true] },
  { label: "Fully Narrated Online Course", included: [true, true, true] },
  { label: "Dedicated Instructor Support 24/7", included: [true, true, true] },
  { label: "30-Day Money-Back Guarantee", included: [true, true, true] },
  { label: "6-Month Access", included: [true, true, true] },
  { label: "2 Attempts at the End-of-Course Exam", included: [true, true, true] },
  { label: "State Exam Simulator", included: [false, true, true] },
  { label: "Digital Flashcards", included: [false, true, true] },
  {
    label: "Unlimited Re-activations for the End-of-Course Exam",
    included: [false, false, true],
  },
  { label: "3-Month Access Extension", included: [false, false, true] },
] as const;

const CERTIFICATION = [
  "Florida Real Estate Commission (FREC) Certified School",
  "State-Approved Course #0024216",
] as const;

const STATS = [
  { value: "87%", label: "Pass rate" },
  { value: "24/7", label: "Instructor support" },
  { value: "5/5", label: "Satisfaction rate" },
] as const;

const EXAM = {
  title: "Ace The Florida Real Estate Exam",
  blurbLead:
    "Average scores are based on the aggregated results of over 1,500 real estate students who completed our proprietary ",
  blurbLink: { label: "exam-prep assessment", href: "/florida-real-estate-practice-exam" },
  bars: [
    { label: "Prolicense Florida", value: 87, tone: "bg-gradient-to-t from-brand-500 to-brand-200" },
    { label: "State Average", value: 52, tone: "bg-gradient-to-t from-gold-600 to-gold-200" },
  ],
} as const;

const STEP_CARDS = [
  { label: "Take and Pass a Pre-License Course", icon: GraduationCap },
  { label: "Get Your Fingerprints Taken", icon: Fingerprint },
  { label: "Submit Your Application", icon: FileCheck2 },
  { label: "Schedule and Pass the State Exam", icon: ClipboardCheck },
] as const;

const COURSE_SECTIONS = [
  ["The Real Estate Business:", "An overview of the industry, sales specialties, and property management."],
  ["License Law & Qualifications:", "The requirements to get and maintain your license."],
  ["License Law & Administration:", "The role and powers of the FREC and the DBPR."],
  ["Brokerage Relationships & Ethics:", "Understanding your duties to clients (Transaction Broker, Single Agent, etc.) and practicing ethically."],
  ["Real Estate Brokerage Operations:", "How a real estate office functions, including advertising and handling escrow accounts."],
  ["Violations, Penalties, & Procedures:", "The complaint and disciplinary process."],
  ["Federal & State Housing Laws:", "In-depth review of Fair Housing, the Americans with Disabilities Act (ADA), and other critical laws."],
  ["Property Rights:", "Understanding estates, tenancies, condos, co-ops, and timeshares."],
  ["Titles, Deeds, & Ownership Restrictions:", "How legal title is held, transferred, and restricted."],
  ["Legal Descriptions:", "How to legally identify a parcel of land."],
  ["Real Estate Contracts:", "The essential elements of a valid contract, plus sales and listing agreements."],
  ["Residential Mortgages:", "The process of financing a home and understanding mortgage instruments."],
  ["Types of Mortgages & Financing:", "A review of conventional, FHA, VA, and other financing methods."],
  ["Real Estate Computations & Closing:", "The real estate math you'll need, including prorations and closing statement calculations."],
  ["The Real Estate Market & Analysis:", "Understanding supply, demand, and market conditions."],
  ["Real Estate Appraisal:", "The three main approaches to valuing property (sales comparison, cost, and income)."],
  ["Real Estate Investments:", "The basics of investment analysis and business opportunity brokerage."],
  ["Taxes Affecting Real Estate:", "How property taxes, and income taxes apply to real estate."],
  ["Planning & Zoning:", "How the government regulates land use."],
] as const;

const LICENSE_STEPS = [
  ["Apply:", "Submit your fingerprints for a background check and apply for your license with the Florida Department of Business and Professional Regulation (DBPR)."],
  ["Schedule:", "Once the DBPR approves your application, you will get an authorization email to schedule your state exam with the testing vendor, Pearson VUE."],
  ["Pass:", "Take and pass the official 100-question state exam with a score of 75% or higher."],
  ["Activate:", 'Your license is issued as "inactive." To activate it, you must be hired by a licensed real estate broker.'],
] as const;

const FAQS = [
  {
    q: "What is the 63-hour Florida real estate sales associate licensing course?",
    text: "The 63-hour Sales Associate Pre-License course is the mandatory educational requirement set by the Florida Real Estate Commission (FREC) for anyone who wants to become a licensed real estate agent in Florida. This course is your first step in the licensing process. It is designed to teach you the foundational knowledge you need for the industry and to pass the state exam.",
    a: (
      <>
        <p>
          The 63-hour Sales Associate Pre-License course is the mandatory
          educational requirement set by the Florida Real Estate Commission
          (FREC) for anyone who wants to become a licensed real estate agent in
          Florida.
        </p>
        <p>
          This course is your first step in the licensing process. It is
          designed to teach you the foundational knowledge you need for the
          industry and to pass the state exam.
        </p>
      </>
    ),
  },
  {
    q: "Do I need to be a Florida resident to take this course?",
    text: "No, Florida residency is not required to take the course or obtain a license. However, you must have a U.S. Social Security number to apply with the state.",
    a: (
      <p>
        No, Florida residency is not required to take the course or obtain a
        license. However, you must have a U.S. Social Security number to apply
        with the state.
      </p>
    ),
  },
  {
    q: "What does the 63-hour course actually cover?",
    text: "Our 63-hour course covers the complete curriculum mandated by the Florida Real Estate Commission (FREC), known as FREC Course I. It is designed to give you a comprehensive understanding of the laws, principles, and practices you will need to pass the state exam and begin your career. The course is broken down into 19 key sections.",
    a: (
      <>
        <p>
          Our 63-hour course covers the complete curriculum mandated by the
          Florida Real Estate Commission (FREC), known as{" "}
          <strong>FREC Course I</strong>. It is designed to give you a
          comprehensive understanding of the laws, principles, and practices you
          will need to pass the state exam and begin your career.
        </p>
        <p>The course is broken down into 19 key sections:</p>
        <ul>
          {COURSE_SECTIONS.map(([term, detail]) => (
            <li key={term}>
              <strong>{term}</strong> {detail}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    q: 'What is the difference between the "course final exam" and the "state exam"?',
    text: "Our course final exam is a 100-question test you take at the end of our 63-hour program. You must pass it to receive your course completion certificate. The state exam is a separate, 100-question test (3.5-hour time limit) administered by Pearson VUE after your state application is approved. You must pass the state exam with a 75% or higher to be issued your license.",
    a: (
      <>
        <p>
          Our course final exam is a 100-question test you take at the end of
          our 63-hour program. You must pass it to receive your course
          completion certificate.
        </p>
        <p>
          The state exam is a separate, 100-question test (3.5-hour time limit)
          administered by Pearson VUE after your state application is approved.
          You must pass the state exam with a 75% or higher to be issued your
          license.
        </p>
      </>
    ),
  },
  {
    q: "Is this 63-hour online course fully approved by the State of Florida?",
    text: "Yes. Our 63-hour Sales Associate Pre-License course is fully approved by the Florida Real Estate Commission (FREC).",
    a: (
      <p>
        Yes. Our 63-hour Sales Associate Pre-License course is fully approved by
        the Florida Real Estate Commission (FREC).
      </p>
    ),
  },
  {
    q: "How long is my course completion certificate valid?",
    text: "Your course completion certificate is valid for two years from the date you pass the course exam. You must apply and pass the state exam within this two-year window.",
    a: (
      <p>
        Your course completion certificate is valid for <strong>two years</strong>{" "}
        from the date you pass the course exam. You must apply and pass the
        state exam within this two-year window.
      </p>
    ),
  },
  {
    q: "What is the process to obtain my real estate license after the course?",
    text: "After you pass our 63-hour course, there are 4 main steps: Apply, Schedule, Pass, Activate. Important: You must also complete a separate 45-hour Post-Licensing course before your first license renewal.",
    a: (
      <>
        <p>After you pass our 63-hour course, there are 4 main steps:</p>
        <ol>
          {LICENSE_STEPS.map(([term, detail]) => (
            <li key={term}>
              <strong>{term}</strong> {detail}
            </li>
          ))}
        </ol>
        <p>
          <strong>Important:</strong> You must also complete a separate{" "}
          <Link href="/courses/re-45-sales-associate-post">
            45-hour Post-Licensing course
          </Link>{" "}
          before your first license renewal.
        </p>
      </>
    ),
  },
] as const;

export const metadata: Metadata = {
  // Absolute: the original's <title> carries the pass-rate hook and no site suffix.
  title: { absolute: `${HERO.title} | 87% Pass Rate` },
  description: HERO.intro,
  alternates: { canonical: "/florida-real-estate-license-course" },
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
      trackSlug: course?.track?.slug ?? "real-estate",
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
           * The clip is 1720x1078 (1.596) against the 1.449 cut-out, so ~9% of
           * the width is trimmed. Centred, that splits either side and clips
           * the "F" off the course title; hard left runs the right-hand speech
           * bubbles off the screen. 22% keeps the title's margin and leaves the
           * right-hand column intact.
           */
          <LaptopVideo
            src="/course/re-course-demo.mp4"
            alt="A walkthrough of the Florida real estate licensing course"
            objectPosition="22% center"
          />
        }
      />
      {/* ---------------------------- pricing ---------------------------- */}
      <CoursePricing
        plans={plans}
        features={FEATURES}
        certification={CERTIFICATION}
        enrollItems={enrollItems}
      />

      <StatsBand stats={STATS} />
      <ExamChart
        title={EXAM.title}
        blurbLead={EXAM.blurbLead}
        blurbLink={EXAM.blurbLink}
        bars={EXAM.bars}
      />
      <InstructorsBand />
      {/* ----------------------------- 4 steps --------------------------- */}
      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="reveal">
            <GuideStepCards steps={STEP_CARDS} />
          </div>

          <div className="reveal text-center lg:text-left">
            <h2 className="font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
              4 Steps to Get Your Florida Real Estate License
            </h2>
            <p className="mt-5">
              <Link
                href={RESOURCE_GUIDES[0].path}
                className="text-[15px] text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
              >
                Learn how to get your real estate license in Florida.
              </Link>
            </p>
          </div>
        </div>
      </section>

      <ReciprocityBand
        question="Do you hold a real estate license in another state?"
        action={{ label: "License Reciprocity", href: "/florida-real-estate-mutual-recognition-exam-prep" }}
      />
      {/* ----------------------------- reviews --------------------------- */}
      <GoogleReviewsBand />

      {/* ------------------------------- FAQ ----------------------------- */}
      <FaqAccordion items={FAQS} />

      <RelatedResources />
    </>
  );
}
