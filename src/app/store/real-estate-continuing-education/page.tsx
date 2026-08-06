import type { Metadata } from "next";
import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { StoreProduct } from "@/components/marketing/store-grid";
import { StoreSortableGrid } from "@/components/marketing/store-sort";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://checkout.flcaa.com/products/real-estate-continuing-education       */
/* -------------------------------------------------------------------------- */

const TITLE = "Real Estate Continuing Education";

const BREADCRUMB = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/courses" },
  { label: "REAL ESTATE COURSES", href: "/real-estate" },
  { label: TITLE },
];

/**
 * The shelf, in the order the storefront lists it: the bundle first, then the
 * four topics. `slug` resolves the catalog row that carries the real price —
 * the four topics are created by supabase/add_re_ce_individual_courses.sql.
 *
 * The storefront names both specialty courses "Specialty Credit (4 Hrs)"; the
 * names are kept as it shows them and the slugs keep the products apart.
 */
/* Prices come from the catalog row each slug resolves — see displayPrice. */
const PRODUCTS: readonly (Omit<StoreProduct, "item" | "price" | "wasPrice"> & {
  slug: string;
})[] = [
  {
    slug: "re-continuing-education",
    name: "Florida Real Estate CE 14-Hour Package",
    // The storefront shows a flat $24.00 here — no struck anchor, no sale flag.
    image: "/course/re-ce-bundle.jpg",
  },
  {
    slug: "re-ce-business-ethics",
    name: "Business Ethics (3 Hrs)",
    image: "/course/re-ce-ethics.png",
  },
  {
    slug: "re-ce-investors",
    name: "Specialty Credit (4 Hrs)",
    image: "/course/re-ce-investors.png",
  },
  {
    slug: "re-ce-mortgages",
    name: "Specialty Credit (4 Hrs)",
    image: "/course/re-ce-mortgages.png",
  },
  {
    slug: "re-ce-core-law",
    name: "Florida Core Law (3 Hrs)",
    image: "/course/re-ce-law.png",
  },
];

export const metadata: Metadata = {
  title: { absolute: `${TITLE} | Prolicense Florida` },
  description:
    "Buy the 14-hour Florida real estate CE package or any individual continuing education topic.",
  alternates: { canonical: "/store/real-estate-continuing-education" },
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
      image: product.image,
      item: {
        courseId: course?.id ?? "",
        slug: course?.slug ?? product.slug,
        title: course?.title ?? product.name,
        priceCents: course?.price_cents ?? 0,
        trackSlug: course?.track?.slug ?? "real-estate",
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
                    <span
                      className="font-medium text-ink-900"
                      aria-current="page"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <StoreSortableGrid items={items} columns={5} />
      </div>
    </section>
  );
}
