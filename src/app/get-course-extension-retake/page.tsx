import type { Metadata } from "next";
import {
  EXTENSION_HERO,
  ExtensionHero,
} from "@/components/marketing/extension-hero";
import { ExtensionProducts } from "@/components/marketing/extension-products";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/get-course-extension-retake                          */
/* -------------------------------------------------------------------------- */

/**
 * The CAM pre-licensing products, in the original's order and layout: the two
 * extensions side by side, the re-enrollment centred below them.
 *
 * `slug` resolves the catalog row that carries the payable price — the 90-day
 * extension and the re-enrollment are created by
 * supabase/add_cam_extension_products.sql. A missing row falls back to the
 * 30-day extension, so the page never renders a button that would charge
 * nothing.
 */
const BASE_SLUG = "cam-course-extension";

const CAM_PRODUCTS = [
  { lead: "Get ", strong: "30-day", tail: " Course Extension", price: "$52", slug: BASE_SLUG },
  {
    lead: "Get ",
    strong: "90-day",
    tail: " Course Extension",
    slug: "cam-course-extension-90",
  },
  {
    lead: "Re-enroll and Restart Course",
    slug: "cam-course-reenroll",
  },
] as const;

export const metadata: Metadata = {
  title: { absolute: `${EXTENSION_HERO.title} | Prolicense Florida` },
  description: EXTENSION_HERO.body[0],
  alternates: { canonical: "/get-course-extension-retake" },
};

export default async function Page() {
  const rows = await Promise.all(
    CAM_PRODUCTS.map((product) => getCourseBySlug(product.slug)),
  );
  const base = rows[0];

  const products = CAM_PRODUCTS.map((product, i) => {
    const course = rows[i] ?? base;
    return {
      lead: product.lead,
      strong: "strong" in product ? product.strong : undefined,
      tail: "tail" in product ? product.tail : undefined,
      price: displayPrice(course).price,
      item: course
        ? {
            courseId: course.id,
            slug: course.slug,
            title: course.title,
            priceCents: course.price_cents,
            trackSlug: course.track?.slug ?? "cam",
            hours: course.hours,
          }
        : null,
    };
  });

  return (
    <>
      <ExtensionHero />

      <ExtensionProducts
        title="CAM Pre-Licensing"
        tone="green"
        products={products}
      />
    </>
  );
}
