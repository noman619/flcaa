import type { Metadata } from "next";
import { Star } from "lucide-react";
import { CourseHero } from "@/components/course/course-sections";
import { PurchaseCard } from "@/components/course/purchase-card";
import { IconFeatures } from "@/components/marketing/icon-features";
import { VideoPlayer } from "@/components/ui/video-player";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/florida-cam-exam-test-flashcards                     */
/* -------------------------------------------------------------------------- */

const ENROLL_SLUG = "cam-exam-prep";

const HERO = {
  title: "Florida CAM License State Exam Preparation",
  intro:
    "Pass your Florida Community Association Manager test the first time - Guaranteed.",
  rating: { stars: 5, label: "4.9 Rating (219 Reviews)" },
  /**
   * The page's own hero video, named in its VideoObject schema:
   * https://youtu.be/7LwPd4Q_4pY
   */
  video: {
    id: "7LwPd4Q_4pY",
    title: "Florida CAM License State Exam Preparation",
  },
} as const;

const PRICING = {
  saveLabel: "Save $50",
  instalment: "As low as 4 interest-free payments of $17.25 with",
  guarantee: "Pass the First Time or Don't Pay!",
  ctaLabel: "Enroll Now",
  includes: [
    "Top quality state exam questions",
    "Flashcards",
    "3 actual state exam simulations",
    "6-Month Unlimited Access",
  ],
} as const;

const FEATURES = [
  {
    icon: "/course/prep-practice-tests.svg",
    text: "Comprehensive practice tests & exam simulations.",
  },
  {
    icon: "/course/prep-anytime.svg",
    text: "Access online questions and answers whenever you want, wherever you are.",
  },
  {
    icon: "/course/prep-any-device.svg",
    text: "Study online or on any device.",
  },
  {
    icon: "/course/prep-support.svg",
    text: "We’re here for you 7 days a week via phone, messaging, and email.",
  },
] as const;

const FOOTNOTE =
  "Don't waste your time. Learn precisely what you need to pass the state exam on your first attempt.";

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} | Prolicense Florida` },
  description: HERO.intro,
  alternates: { canonical: "/florida-cam-exam-test-flashcards" },
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
            media={
              <VideoPlayer videoId={HERO.video.id} title={HERO.video.title} />
            }
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
              title: course?.title ?? "Florida CAM Exam Prep",
              priceCents: course?.price_cents ?? 0,
              trackSlug: course?.track?.slug ?? "cam",
              hours: course?.hours ?? null,
            }}
          />
        }
        footer={
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
        }
      />

      <IconFeatures features={FEATURES} footnote={FOOTNOTE} />
    </>
  );
}
