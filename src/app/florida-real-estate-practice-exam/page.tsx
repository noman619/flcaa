import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { PurchaseCard } from "@/components/course/purchase-card";
import {
  CourseHero,
  KeyPointsBand,
} from "@/components/course/course-sections";
import { TipsBand } from "@/components/marketing/tips-band";
import { VideoPlayer } from "@/components/ui/video-player";
import { REAL_ESTATE_EXAM_FAQS } from "@/content/course-faqs";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-real-estate-practice-exam                    */
/* -------------------------------------------------------------------------- */

const ENROLL_SLUG = "re-sales-associate-exam-prep";

const HERO = {
  title: "Florida Real Estate Practice Exams",
  intro:
    "Real estate practice exams and flashcards that will boost your ability to pass the sales associates state exam in Florida. Get the most updated questions and answers designed to mimic what you'll actually encounter on the licensing state test.",
  rating: { stars: 5, label: "4.9 Rating (247 Reviews)" },
  crossSell: {
    question: "You have completed your real estate license course?",
    href: "/florida-real-estate-license-course",
    body: "Our innovative online platform will test your knowledge and identify which topics you've mastered and which areas you need to spend more time on.",
  },
  // https://www.youtube.com/watch?v=2AWO7hOzG68
  video: {
    id: "2AWO7hOzG68",
    title: "Florida Real Estate Practice Exams",
  },
} as const;

const KEY = {
  title: "What is the key to passing the state exam?",
  points: [
    "Study the right questions.",
    "Practice actual state exam questions that are challenging and tricky.",
    "Retake the exam simulations until you get the recommended passing rate.",
  ],
} as const;

const PRICING = {
  saveLabel: "Save $50",
  instalment: "As low as 4 interest-free payments of $16.75 with",
  guarantee: "30-Day Money-Back Guarantee",
  ctaLabel: "Add to Cart",
  includes: [
    "First-Class State Exam Simulations",
    "Flashcards",
    "6-Month Unlimited Access",
  ],
} as const;

const TIPS = [
  {
    title: "Eliminate wrong answers",
    body: "One of the beautiful things about multiple choice exams is that even if you don't know the answer, you still have a 25% chance of answering correctly. To make your chances of guessing even better, go ahead and eliminate the options that you are certain are incorrect. If you aren't 100% sure what the answer is, it's better to guess between two options rather than four.",
  },
  {
    title: "Manage your time",
    body: "Keep in mind, that you shouldn't rush. This may be a timed test, but you have plenty of time to complete the exam. However, don't waste time on questions you can't answer. Better guessing than losing precious minutes on questions you simply don't know the answer.",
  },
  {
    title: "Plan your study",
    body: "The number one reason for not passing an exam is not allowing enough time to practice. While cramming may have worked back in high school, this isn't the time to try to learn everything in one night. There is a lot of very specific information on this exam, and very little of it is common sense. Build yourself a solid base of information before you attempt.",
  },
  {
    title: "Organize your study space",
    body: "Try and get rid of all distractions, and make sure you feel as comfortable and able to focus as possible. For some people, this may mean almost complete silence; for others, background music helps. Some of us need everything completely tidy and organized in order to concentrate, while others thrive in a more cluttered environment. Think about what works for you, and take the time to get it right.",
  },
  {
    title: "Take Practice Exams",
    body: "This is one of the most important steps of preparing for the State examination. They include questions representative of the actual exam. It will help you get a better feel for the exams and questions. The simulations are designed to help familiarize you with the content and types of questions on the exams, and to provide feedback on your areas of strength and weakness.",
  },
  {
    title: "Practice Your Real Estate Math",
    body: "Some test takers are afraid of real estate math problems and it's understandable. Math can be challenging, but imagine if you could turn that weakness into a strength. Real Estate math is not that complex if you practice. You'll be so much better off on the exam, and have an edge when you actually have to use math as an agent.",
  },
  {
    title: "Plan Your Exam Day",
    body: "Be sure that you have everything that you need to be prepared gathered up the night before. When preparing to take the exam at a testing center, ensure you bring two forms of valid identification along with proof of completing pre-licensing education. You should also be sure that you are not hungry or thirsty when you sit down to test. There is nothing that will kill concentration faster than a rumbling belly during the exam. This is an easy fix, just make sure you eat well on test day!",
  },
] as const;

export const metadata: Metadata = {
  title: { absolute: "Florida Real Estate Practice Exam | Prolicense School" },
  description:
    "Real Estate Exam Questions and Answers. Practice Tests to Improve Your Passing Rate. Study Guide for the Florida Real Estate Agent Exam. Prolicense School.",
  alternates: { canonical: "/florida-real-estate-practice-exam" },
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
          <PurchaseCard
            media={<VideoPlayer videoId={HERO.video.id} title={HERO.video.title} />}
            wasPrice={pricing.wasPrice}
            price={pricing.price}
            saveLabel={PRICING.saveLabel}
            instalment={PRICING.instalment}
            guarantee={PRICING.guarantee}
            includes={PRICING.includes}
            ctaLabel={PRICING.ctaLabel}
            enrollItem={{
              courseId: course?.id ?? "",
              slug: course?.slug ?? ENROLL_SLUG,
              title: course?.title ?? "Florida Real Estate Practice Exams",
              priceCents: course?.price_cents ?? 0,
              trackSlug: course?.track?.slug ?? "real-estate",
              hours: course?.hours ?? null,
            }}
          />
        }
        footer={
          <div>
            {/* Rating, as shown under the intro on the original. */}
            <p className="flex flex-wrap items-center gap-2.5">
              <span className="flex text-gold-500" aria-hidden>
                {Array.from({ length: HERO.rating.stars }, (_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </span>
              <span className="text-[13.5px] text-ink-700">
                {HERO.rating.label}
              </span>
            </p>

            <div className="mt-7 border-t border-ink-200/70 pt-6">
              <h2 className="font-display text-lg text-ink-950">
                <Link
                  href={HERO.crossSell.href}
                  className="underline decoration-ink-300 underline-offset-4 transition-colors duration-200 hover:decoration-brand-700"
                >
                  {HERO.crossSell.question}
                </Link>
              </h2>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-600">
                {HERO.crossSell.body}
              </p>
            </div>
          </div>
        }
      />

      <KeyPointsBand title={KEY.title} points={KEY.points} />

      <TipsBand
        eyebrow="Study Smart"
        title="Tips for Passing Your Florida Real Estate Exam"
        tips={TIPS}
      />

      <FaqAccordion
        items={REAL_ESTATE_EXAM_FAQS}
        title="Florida Real Estate Exam Information"
      />
    </>
  );
}
