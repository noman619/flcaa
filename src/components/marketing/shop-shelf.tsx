import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import { EnrollButton } from "@/components/course/enroll-button";
import type { CartItem } from "@/components/cart/cart-provider";

export type ShopCourse = {
  title: string;
  /** One-line promise under the title. */
  tagline: string;
  /** Omitted where the shelf shows no credit hours, as the exam prep one does. */
  credits?: string;
  price: string;
  image: string;
  alt: string;
  /** Where "View Details" goes. */
  href: string;
  item: CartItem;
};

/**
 * A shop shelf in the wholesale catalog's own shape: a titled bar with the
 * filters that got you here, then one wide row per course.
 *
 * Rows rather than cards because every course here carries the same shape of
 * information — title, promise, credits, price — and a visitor is comparing
 * two figures down a column, which a grid of cards makes them hunt for.
 */
export function ShopShelf({
  title,
  filters,
  heading,
  intro,
  courses,
}: {
  title: string;
  /** State and licence chips at the top right. Some shelves carry none. */
  filters?: readonly string[];
  heading: string;
  intro: string;
  courses: readonly ShopCourse[];
}) {
  return (
    <>
      <div className="border-b border-ink-200/70 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-6">
          <h1 className="font-display text-[1.4rem] leading-tight text-ink-950 lg:text-[1.7rem]">
            {title}
          </h1>

          {filters?.length ? (
            <ul className="flex divide-x divide-ink-200 overflow-hidden rounded-card border border-ink-200">
              {filters.map((filter) => (
                <li
                  key={filter}
                  className="bg-white px-5 py-2.5 text-[13px] text-ink-700"
                >
                  {filter}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <section className="border-b border-ink-200/70 bg-sand-50">
        <div className="container-page py-14 lg:py-20">
          <h2 className="reveal font-display text-[1.7rem] leading-tight text-ink-950 lg:text-[2.1rem]">
            {heading}
          </h2>
          <p className="reveal mt-5 max-w-4xl text-[14.5px] leading-relaxed text-ink-600">
            {intro}
          </p>

          <ul className="mt-10 space-y-5 lg:mt-12">
            {courses.map((course) => (
              <li
                key={course.title}
                className="reveal group grid gap-6 rounded-panel border border-ink-200/60 bg-white p-6 shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-0.5 hover:shadow-card-hover sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-8 lg:p-7"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-card bg-sand-100 sm:w-40 lg:w-48">
                  <Image
                    src={course.image}
                    alt={course.alt}
                    fill
                    sizes="(min-width: 1024px) 12rem, (min-width: 640px) 10rem, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-[1.15rem] leading-snug text-ink-950 lg:text-[1.3rem]">
                    {course.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed font-medium text-ink-600">
                    {course.tagline}
                  </p>

                  {course.credits ? (
                    <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-ink-500">
                      <span className="font-medium text-ink-700">Credits:</span>
                      {course.credits}
                      <Info className="size-3.5 text-ink-400" aria-hidden />
                    </p>
                  ) : null}

                  <p className="mt-3">
                    <Link
                      href={course.href}
                      className="text-[13.5px] text-brand-700 underline-offset-4 transition-colors duration-200 hover:text-brand-900 hover:underline"
                    >
                      View Details
                    </Link>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-5 lg:flex-col lg:items-end lg:gap-4">
                  <p className="font-display text-xl text-ink-950 tabular-nums">
                    {course.price}
                  </p>
                  <div className="min-w-40">
                    <EnrollButton item={course.item} label="Add to Cart" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
