import type { Metadata } from "next";
import { ShopShelf } from "@/components/marketing/shop-shelf";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from the exam prep shelf at                           */
/*  home.recampus.com/shop/caa/real-estate-exam-prep                           */
/* -------------------------------------------------------------------------- */

const SLUG = "re-broker-exam-prep";

const SHELF = {
  title: "Real Estate Exam Prep",
  heading: "Explore Courses",
  intro:
    "Invest in comprehensive review to set yourself up for success on exam day. Exam Prep education is the best way to review for your exam by helping to measure your strengths and weaknesses and concentrating on areas where you need it the most. Gain confidence to successfully pass your real estate exam.",
} as const;

const COURSE = {
  title: "Florida Real Estate Broker Drill and Practice QBank v10.0",
  tagline: "Stay on Top of Your Review with the Latest QBank",
  image: "/track/catalog/practice-exams.jpg",
  alt: "Two students reviewing exam questions together",
} as const;

export const metadata: Metadata = {
  title: {
    absolute: "Florida Broker Exam Prep QBank | Prolicense Florida",
  },
  description: SHELF.intro,
  alternates: { canonical: "/real-estate-exam-prep" },
};

export default async function Page() {
  const course = await getCourseBySlug(SLUG);

  return (
    <ShopShelf
      title={SHELF.title}
      heading={SHELF.heading}
      intro={SHELF.intro}
      courses={[
        {
          ...COURSE,
          price: displayPrice(course).price,
          href: `/courses/${SLUG}`,
          item: {
            courseId: course?.id ?? "",
            slug: course?.slug ?? SLUG,
            title: course?.title ?? COURSE.title,
            priceCents: course?.price_cents ?? 0,
            trackSlug: course?.track?.slug ?? "real-estate",
            hours: course?.hours ?? null,
          },
        },
      ]}
    />
  );
}
