import type { Metadata } from "next";
import { RelatedResources } from "@/components/course/course-sections";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { EXAM_INFO_FAQS } from "@/content/course-faqs";
import { HOW_TO_LICENSE_RESOURCES } from "@/lib/course-media";
import { GuideBanner } from "@/components/marketing/guide-banner";
import { GuideLink, GuideSteps } from "@/components/marketing/guide-steps";
import { NAV_RESOURCES, getResourceGuide } from "@/lib/site";

const GUIDE = getResourceGuide("/florida-real-estate-exam");

/** Section 1. Copy ported verbatim from GUIDE.sourceUrl. */
const HERO = {
  title: "Florida Real Estate Exam (2026 Guide)",
  intro:
    "Everything you need to know about the real estate license exam in Florida.",
  /** The original's own banner artwork, served from our own domain. */
  art: { src: "/course/exam-online-test-time.png", width: 1076, height: 1036 },
} as const;

const A = GuideLink;

/** Sections 2–4. Copy ported verbatim from GUIDE.sourceUrl. */
const SECTIONS = [
  {
    title: "Before Scheduling Your Florida State Exam",
    body: [
      <>
        To schedule you Florida real estate exam, <strong>you must first</strong>{" "}
        complete the following steps:
      </>,
    ],
    bullets: [
      <A key="course" href="/florida-real-estate-license-course">
        Complete a 63-Hour Pre-License Course
      </A>,
      "Get Your Fingerprints Taken",
      "Submit Your Application to the Florida Department of Business and Professional Regulation (DBPR). It takes about 10 days to get your application approval.",
    ],
    actions: [
      {
        label: "How to Get Your License",
        href: "/how-to-get-real-estate-license-in-florida",
      },
    ],
  },
  {
    title: "Registering for the Florida Real Estate Exam",
    body: [
      "Once your application is approved, you will receive an email notification with a nine-digit candidate ID number to schedule your state exam. Florida uses Pearson VUE to manage and oversee their real estate license tests.",
      <>
        The exam is available daily at Pearson VUE test centers across United
        States. To register, call Pearson VUE at 888-204-6289 or{" "}
        <A href="https://www.pearsonvue.com/us/en/fl/realestate.html">
          visit their website
        </A>
        . The cost to take or retake the exam is $36.75.
      </>,
    ],
  },
  {
    title: "Taking the Florida Real Estate License Exam",
    body: [
      <>
        It is strongly recommended to study using{" "}
        <A href="/florida-real-estate-practice-exam">
          real estate practice exams
        </A>{" "}
        before take the state test. Exam prep programs and study guides will
        significantly increase your chances to pass the first time.
      </>,
      <>
        The Florida real estate exam is available daily and requires in-person
        attendance at a Pearson Vue test center.{" "}
        <A href="https://www.pearsonvue.com/us/en/fl/realestate.html">
          Test centers are located throughout the United States
        </A>
        .
      </>,
      "You have 3.5 hours to answer 100 multiple-choice real estate questions (a, b, c, d). The passing score is 75%. You can retake the Florida state exam as many times as you wish. You simply need to wait 24 hours to reschedule the test.",
    ],
  },
] as const;

/** Section 5's lead-in. The instructor is INSTRUCTORS[0] on the course pages. */
const FAQ_INTRO = {
  photo: "/course/instructor-marc.jpg",
  name: "Marc Pare, Real Estate Instructor",
  text: (
    <>
      One of <strong className="text-brand-700">Prolicense</strong>&apos;s top
      instructor, Marc Pare, answers some of the most frequently asked questions
      about the Florida real estate exam.
    </>
  ),
} as const;

export const metadata: Metadata = {
  title: HERO.title,
  description: HERO.intro,
  alternates: { canonical: GUIDE.path },
};

export default function Page() {
  return (
    <>
      <GuideBanner
        eyebrow="Real Estate"
        title={HERO.title}
        intro={HERO.intro}
        art={HERO.art}
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Resources", href: NAV_RESOURCES.href },
          { label: GUIDE.label },
        ]}
      />

      {/* Numbered, but stages of the exam process rather than steps to do in
          order, so the badges carry the figure alone. */}
      <GuideSteps steps={SECTIONS} stepLabel={null} />

      <FaqAccordion
        items={EXAM_INFO_FAQS}
        tone="sand"
        title={null}
        intro={FAQ_INTRO}
      />

      {/* The set that closes on the school comparison — the default trio ends
          on this very page. */}
      <RelatedResources items={HOW_TO_LICENSE_RESOURCES} />
    </>
  );
}
