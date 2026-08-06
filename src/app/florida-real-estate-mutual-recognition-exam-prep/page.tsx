import type { Metadata } from "next";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { MUTUAL_RECOGNITION_FAQS } from "@/content/course-faqs";
import { SinglePlanPricing } from "@/components/course/single-plan-pricing";
import {
  CourseHero,
  ExamChart,
  InstructorsBand,
  RelatedResources,
  StatsBand,
} from "@/components/course/course-sections";
import { GoogleReviewsBand } from "@/components/marketing/google-reviews-source";
import { VideoPlayer } from "@/components/ui/video-player";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-real-estate-mutual-recognition-exam-prep     */
/* -------------------------------------------------------------------------- */

const ENROLL_SLUG = "re-mutual-recognition-exam-prep";

const HERO = {
  title: "Florida Real Estate Mutual Recognition Exam Prep Course",
  intro:
    "You are already licensed in one of the 10 mutual recognition states, you don't need the full course—you just need to pass the 40-question law exam. This program is designed to help you do exactly that.",
  bullets: [
    "Take the course online—on any device, anytime",
    "Use our intuitive exam prep system",
    "Practice on the go with our flashcards",
  ],
  mediaHeading: "Course Overview",
  video: "/course/mutual-recognition-overview.mp4",
} as const;

const PRICING = {
  deal: "30% OFF",
  instalment: "As low as 4 interest-free payments of $24.75 with",
  features: [
    "State-Approved School",
    "Fully Narrated Online Program",
    "Dedicated Instructor Support 24/7",
    "30-Day Money-Back Guarantee",
    "4-Month Access",
    "State Exam Simulator",
    "Digital Flashcards",
  ],
} as const;

const STATS = [
  { value: "92%", label: "Pass rate" },
  { value: "24/7", label: "Instructor support" },
  { value: "5/5", label: "Satisfaction rate" },
] as const;

const EXAM = {
  title: "Ace The Florida Real Estate Exam",
  blurbLead:
    "Average scores are based on the aggregated results of over 1,500 real estate students who completed our proprietary ",
  blurbLink: {
    label: "exam-prep assessment",
    href: "/florida-real-estate-practice-exam",
  },
  bars: [
    { label: "Prolicense Florida", value: 92, tone: "bg-gradient-to-t from-brand-500 to-brand-200" },
    { label: "State Average", value: 52, tone: "bg-gradient-to-t from-gold-600 to-gold-200" },
  ],
} as const;


export const metadata: Metadata = {
  title: { absolute: "Get Your Florida License | Mutual Recognition Exam Prep" },
  description: HERO.intro,
  alternates: { canonical: "/florida-real-estate-mutual-recognition-exam-prep" },
};

export default async function Page() {
  const course = await getCourseBySlug(ENROLL_SLUG);
  const pricing = displayPrice(course);

  return (
    <>
      <CourseHero
        title={HERO.title}
        intro={HERO.intro}
        bullets={HERO.bullets}
        mediaHeading={HERO.mediaHeading}
        media={
          <div className="rounded-hero bg-brand-950 p-2.5 shadow-card">
            <VideoPlayer src={HERO.video} title={HERO.title} />
          </div>
        }
      />

      {/* ---------------------------- pricing ---------------------------- */}
      <SinglePlanPricing
        wasPrice={pricing.wasPrice}
        price={pricing.price}
        deal={PRICING.deal}
        instalment={PRICING.instalment}
        features={PRICING.features}
        enrollItem={{
          courseId: course?.id ?? "",
          slug: course?.slug ?? ENROLL_SLUG,
          title: course?.title ?? "Mutual Recognition Exam Prep",
          priceCents: course?.price_cents ?? 0,
          trackSlug: course?.track?.slug ?? "real-estate",
          hours: course?.hours ?? null,
        }}
      />

      <StatsBand stats={STATS} />

      <ExamChart
        title={EXAM.title}
        blurbLead={EXAM.blurbLead}
        blurbLink={EXAM.blurbLink}
        bars={EXAM.bars}
      />

      <InstructorsBand />

      <GoogleReviewsBand />

      <FaqAccordion items={MUTUAL_RECOGNITION_FAQS} />

      <RelatedResources />
    </>
  );
}
