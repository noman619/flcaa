import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid, type StoreProduct } from "@/components/marketing/store-grid";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://checkout.flcaa.com/products/cam-continuing-education               */
/* -------------------------------------------------------------------------- */

const TITLE = "CAM Continuing Education";

const BREADCRUMB = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/courses" },
  { label: "CAM COURSES", href: "/cam" },
  { label: TITLE },
];

/**
 * The shelf, in the order the storefront lists it: the bundle first, then the
 * five topics. `slug` resolves the catalog row that carries the real price —
 * the five topics are created by supabase/add_cam_ce_individual_courses.sql.
 */
/* Prices come from the catalog row each slug resolves — see displayPrice. */
const PRODUCTS: readonly (Omit<StoreProduct, "item" | "price" | "wasPrice"> & {
  slug: string;
})[] = [
  {
    slug: "cam-continuing-education",
    name: "CAM CE Renewal Package 2026",
    flag: "On Sale",
    image: "/course/cam-ce-package-2026.png",
  },
  {
    slug: "cam-ce-preventive-maintenance",
    name: "Preventive Property Maintenance for CAM",
    tag: { label: "Operation of Property (3 Hrs)", tone: "blue" },
    image: "/course/ce-property.png",
  },
  {
    slug: "cam-ce-collect-dues",
    name: "Proactive Strategies to Collect Owners’ Dues on Time",
    tag: { label: "Insurance & Fin. Mgt (3 Hrs)", tone: "red" },
    image: "/course/ce-insurance.png",
  },
  {
    slug: "cam-ce-problems-conflicts",
    name: "Dealing with Problems and Conflicts",
    tag: { label: "Human Resources (3 Hrs)", tone: "purple" },
    image: "/course/ce-human-resources.png",
  },
  {
    slug: "cam-ce-legal-updates-2026",
    name: "CAM Legal Updates – Renewal 2026",
    tag: { label: "CAM Legal Updates (3 Hrs)", tone: "blue" },
    image: "/course/ce-legal.png",
  },
  {
    slug: "cam-ce-prevent-theft-fraud",
    name: "Prevent Theft and Fraud",
    tag: { label: "Elective (3 Hrs)", tone: "teal" },
    image: "/course/ce-elective.png",
  },
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Prolicense Florida` },
  description:
    "Buy the 2026 CAM CE renewal package or any individual 3-hour continuing education course.",
  alternates: { canonical: "/store/cam-continuing-education" },
};

export default async function Page() {
  const courses = await Promise.all(
    PRODUCTS.map((product) => getCourseBySlug(product.slug)),
  );

  /*
   * A topic row missing means the SQL has not been run yet. Those tiles fall
   * back to the bundle so the page never renders a button that would add a
   * priceless item to the cart.
   */
  const bundle = courses[0];

  const items: StoreProduct[] = PRODUCTS.map((product, i) => {
    const course = courses[i] ?? bundle;
    const pricing = displayPrice(course);
    return {
      name: product.name,
      price: pricing.price,
      wasPrice: pricing.wasPrice,
      flag: product.flag,
      tag: product.tag,
      image: product.image,
      item: {
        courseId: course?.id ?? "",
        slug: course?.slug ?? product.slug,
        title: course?.title ?? product.name,
        priceCents: course?.price_cents ?? 0,
        trackSlug: course?.track?.slug ?? "cam",
        hours: course?.hours ?? null,
      },
    };
  });

  return (
    <section className="border-b border-ink-200/70 bg-sand-50">
      <div className="container-page py-14 lg:py-20">
        <h1 className="font-display text-[2.15rem] leading-tight text-ink-950 lg:text-[3rem]">
          {TITLE}
        </h1>

        <nav aria-label="Breadcrumb" className="mt-4 mb-12">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            {BREADCRUMB.map((crumb, i) => (
              <React.Fragment key={crumb.label}>
                {i > 0 ? (
                  <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
                ) : null}
                <li>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors duration-200 hover:text-ink-900"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-ink-900" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <StoreGrid items={items} />
      </div>
    </section>
  );
}
