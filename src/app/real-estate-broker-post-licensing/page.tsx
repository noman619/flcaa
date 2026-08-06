import type { Metadata } from "next";
import { ShopShelf } from "@/components/marketing/shop-shelf";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from the broker post-licensing shelf at               */
/*  home.recampus.com/shop/caa/real-estate-post-licensing/state-level          */
/*  ?level=BROKER_POST_LICENSE&licenseType=BRK&orgCode=RE_POST_FL             */
/* -------------------------------------------------------------------------- */

const SHELF = {
  title: "Real Estate Post-Licensing",
  filters: ["Florida", "Broker"],
  heading: "Explore Courses",
  intro:
    "Complete your post-licensing requirements with the education you need to be successful in your new career. Your new career in real estate is an investment, so support it with education that will give you the skills and knowledge you need to continue your career with confidence.",
} as const;

/**
 * The two courses on the shelf. `slug` resolves the catalog row that carries
 * the payable price — both are created by
 * supabase/add_broker_post_courses.sql. A missing row falls back to the
 * 60-hour parent so the page never renders a priceless Add to Cart.
 */
const BASE_SLUG = "re-60-broker-post";

const COURSES = [
  {
    title: "Essentials of Real Estate Investment v1.0",
    tagline:
      "Feel Confident Making the Leap into Real Estate Investment with This Course",
    credits: "30",
    slug: "re-60-broker-post-investment",
    image: "/track/goal-broker.jpg",
    alt: "An agent going through paperwork with clients",
  },
  {
    title: "Real Estate Brokerage: A Management Guide v1.0",
    tagline: "Develop your leadership skills with this management guide.",
    credits: "30",
    slug: "re-60-broker-post-brokerage",
    image: "/track/catalog/broker-post.jpg",
    alt: "A broker leading a team meeting",
  },
] as const;

export const metadata: Metadata = {
  title: {
    absolute: "Florida Broker Post-Licensing Courses | Prolicense Florida",
  },
  description: SHELF.intro,
  alternates: { canonical: "/real-estate-broker-post-licensing" },
};

export default async function Page() {
  const rows = await Promise.all(
    [BASE_SLUG, ...COURSES.map((c) => c.slug)].map((slug) =>
      getCourseBySlug(slug),
    ),
  );
  const bySlug = new Map(rows.flatMap((row) => (row ? [[row.slug, row]] : [])));
  const base = bySlug.get(BASE_SLUG);

  const courses = COURSES.map((course) => {
    const row = bySlug.get(course.slug) ?? base;
    return {
      ...course,
      price: displayPrice(row).price,
      href: `/courses/${BASE_SLUG}`,
      item: {
        courseId: row?.id ?? "",
        slug: row?.slug ?? course.slug,
        title: row?.title ?? course.title,
        priceCents: row?.price_cents ?? 0,
        trackSlug: row?.track?.slug ?? "real-estate",
        hours: row?.hours ?? null,
      },
    };
  });

  return (
    <ShopShelf
      title={SHELF.title}
      filters={SHELF.filters}
      heading={SHELF.heading}
      intro={SHELF.intro}
      courses={courses}
    />
  );
}
