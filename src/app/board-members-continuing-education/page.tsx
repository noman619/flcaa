import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { EnrollButton } from "@/components/course/enroll-button";
import { AssociationTabs } from "@/components/marketing/association-tabs";
import { CoursePerks } from "@/components/marketing/course-perks";
import { RecentPosts } from "@/components/marketing/recent-posts";
import { BOARD_POST_SLUGS } from "@/lib/course-media";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug, getPostBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/board-members-continuing-education                   */
/* -------------------------------------------------------------------------- */

const HERO = {
  title:
    "Florida Board Director Continuing Education Online Course (Condo, HOA & Coop)",
  intro:
    "This Florida Board Director Continuing Education Course is specifically designed for existing board members of condominiums, homeowners' associations (HOAs), and cooperatives to fulfill their ongoing statutory education requirements.",
  rating: "4.9 Rating (124 Reviews)",
  image: {
    src: "/board/ce-hero.jpg",
    alt: "A board director taking the continuing education course on a laptop at home",
  },
} as const;

/**
 * The three association types, each with its own statute, hours and prices.
 *
 * `slug` resolves the catalog row that carries the payable price — those rows
 * are created by supabase/add_board_ce_products.sql. A row missing means the
 * SQL has not been run, and that seat falls back to the base board CE course
 * so the page never renders a button that would charge nothing.
 *
 * The two Coop seats the original marks "Coming Soon!" carry no slug at all;
 * they render as disabled.
 */
const BASE_SLUG = "board-continuing-education";

type Association = {
  label: string;
  image: string;
  heading: string;
  hours: string;
  blurb: string;
  seats: readonly {
    label: string;
    /** Only for seats with no product yet — priced seats read the catalog. */
    price?: string;
    /** Per-seat pricing: the figure is followed by "Each". */
    each?: boolean;
    /** Catalog row behind the button. Absent where the seat is not on sale. */
    slug?: string;
    note?: string;
  }[];
  requirement: string;
};

const ASSOCIATIONS: readonly Association[] = [
  {
    label: "Condo",
    image: "/board/assoc-condo.png",
    heading: "Board Director Continuing Education",
    hours: "One-hour",
    blurb:
      " online continuing education course covering the past year’s updates to Chapter 718 of the Florida Statutes.",
    seats: [
      { label: "1 Board Director - ", slug: "board-ce-condo-1" },
      { label: "2 Board Directors - ", slug: "board-ce-condo-2" },
      {
        label: "3 and More Directors - ",
        slug: "board-ce-condo-3-plus",
        each: true,
        note: "Select the number at check-out",
      },
    ],
    requirement:
      "Each year, condo board directors must complete a one-hour continuing education course on the past year's changes to Chapter 718, F.S., and related administrative rules.",
  },
  {
    label: "HOA",
    image: "/board/assoc-hoa.png",
    heading: "Board Director Continuing Education",
    hours: "Four-hour",
    blurb:
      " online continuing education course covering the past year’s updates to Chapter 720 of the Florida Statutes.",
    seats: [
      { label: "1 Board Director - ", slug: "board-ce-hoa-1" },
      { label: "2 Board Directors - ", slug: "board-ce-hoa-2" },
      {
        label: "3 and More Directors - ",
        slug: "board-ce-hoa-3-plus",
        each: true,
        note: "Select the number at check-out",
      },
    ],
    requirement:
      "HOA directors for associations with fewer than 2,500 parcels must complete at least 4 hours of continuing education each year. Those in associations with 2,500 or more parcels must complete at least 8 hours annually.",
  },
  {
    label: "Coop",
    image: "/board/assoc-coop.png",
    heading: "Board Director Continuing Education",
    hours: "One-hour",
    blurb:
      " online continuing education course covering the past year’s updates to Chapter 719 of the Florida Statutes.",
    seats: [
      { label: "1 Board Director - ", slug: "board-ce-coop-1" },
      // No slug: the original marks these two "Coming Soon!".
      { label: "2 Board Directors - ", price: "$24" },
      {
        label: "3 and More Directors - ",
        price: "$10 Each",
        note: "Select the number at check-out",
      },
    ],
    requirement:
      "Each year, coop board directors must complete a one-hour continuing education course on the past year's changes to Chapter 719, F.S., and related administrative rules.",
  },
];

/** Same four marks as the certification page, different copy. */
const PERKS = [
  {
    icon: "/board/icon-certificate.png",
    text: "Fulfill Florida’s board member continuing education requirement.",
  },
  {
    icon: "/board/icon-home.png",
    text: "Learn at your own pace from the comfort and privacy of home.",
  },
  {
    icon: "/board/icon-device.png",
    text: "Access a fast, comprehensive course on your laptop, tablet, or phone.",
  },
  {
    icon: "/board/icon-instant.png",
    text: "Receive your completion certificate instantly upon completion.",
  },
] as const;

export const metadata: Metadata = {
  title: { absolute: `${HERO.title} | Prolicense Florida` },
  description: HERO.intro,
  alternates: { canonical: "/board-members-continuing-education" },
};

export default async function Page() {
  const slugs = Array.from(
    new Set(
      ASSOCIATIONS.flatMap((a) =>
        a.seats.flatMap((seat) => (seat.slug ? [seat.slug] : [])),
      ),
    ),
  );

  const [rows, posts] = await Promise.all([
    Promise.all([BASE_SLUG, ...slugs].map((slug) => getCourseBySlug(slug))),
    Promise.all(BOARD_POST_SLUGS.map((slug) => getPostBySlug(slug))),
  ]);
  const bySlug = new Map(rows.flatMap((row) => (row ? [[row.slug, row]] : [])));
  const base = bySlug.get(BASE_SLUG);

  return (
    <>
      {/* ------------------------------- hero -------------------------------
          Same navy as the certification page's hero, so the two board pages
          read as one family. The photograph is square in the original and is
          kept square here, framed rather than bled — it is a portrait of the
          course, not a backdrop. */}
      <section className="relative overflow-hidden bg-brand-900">
        <span
          className="pointer-events-none absolute -top-32 -left-40 size-112 rounded-full bg-brand-500/25 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-32 -bottom-32 size-112 rounded-full bg-brand-700/40 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page grid items-center gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-16 lg:py-20">
          <div className="reveal">
            <h1 className="max-w-xl font-display text-[2rem] leading-[1.12] text-white lg:text-[2.9rem]">
              {HERO.title}
            </h1>

            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-white/70">
              {HERO.intro}
            </p>

            <p className="mt-10 flex flex-wrap items-center gap-3">
              <span className="flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="size-5 fill-gold-500 text-gold-500" />
                ))}
              </span>
              <Link
                href="/reviews"
                className="text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white"
              >
                {HERO.rating}
              </Link>
            </p>
          </div>

          <div className="reveal min-w-0">
            <div className="group relative overflow-hidden rounded-panel shadow-pop ring-1 ring-white/15">
              <Image
                src={HERO.image.src}
                alt={HERO.image.alt}
                width={900}
                height={900}
                priority
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="h-auto w-full transition-transform duration-700 ease-out-soft group-hover:scale-[1.03]"
              />
              <span
                className="pointer-events-none absolute inset-0 rounded-panel ring-1 ring-white/20 ring-inset"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------- select your type of association ----------------- */}
      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page py-16 lg:py-24">
          <h2 className="reveal text-center font-display text-[1.8rem] leading-tight text-ink-950 lg:text-[2.35rem]">
            Select Your Type of Association
          </h2>

          <div className="reveal mx-auto mt-10 max-w-3xl lg:mt-14">
            <AssociationTabs
              tabs={ASSOCIATIONS.map((association) => ({
                label: association.label,
                panel: (
                  <div>
                    <div className="flex items-start gap-5">
                      <Image
                        src={association.image}
                        alt=""
                        width={240}
                        height={240}
                        className="size-16 shrink-0 rounded-full object-cover ring-1 ring-ink-900/10 lg:size-20"
                      />
                      <div className="min-w-0">
                        <h3 className="font-display text-[1.15rem] text-ink-950 lg:text-[1.4rem]">
                          <span className="font-medium">
                            {association.label}
                          </span>{" "}
                          <span className="text-ink-600">
                            {association.heading}
                          </span>
                        </h3>
                        <p className="mt-2 text-[14.5px] leading-relaxed text-ink-600">
                          <span className="underline underline-offset-4">
                            {association.hours}
                          </span>
                          {association.blurb}
                        </p>
                      </div>
                    </div>

                    <ul className="mt-8 space-y-4">
                      {association.seats.map((seat) => {
                        const course = seat.slug
                          ? (bySlug.get(seat.slug) ?? base)
                          : null;

                        return (
                          <li
                            key={seat.label}
                            className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-ink-200/70 bg-white px-5 py-4 shadow-xs transition-shadow duration-300 hover:shadow-card lg:px-6"
                          >
                            <div className="min-w-0">
                              <p className="text-[15px] text-ink-700 lg:text-base">
                                {seat.label}
                                <span className="font-medium text-ink-950">
                                  {course
                                    ? `${displayPrice(course).price}${
                                        seat.each ? " Each" : ""
                                      }`
                                    : seat.price}
                                </span>
                              </p>
                              {seat.note ? (
                                <p className="mt-1 text-[12.5px] text-ink-500 underline underline-offset-4">
                                  {seat.note}
                                </p>
                              ) : null}
                            </div>

                            <div className="w-full sm:w-40">
                              {course ? (
                                <EnrollButton
                                  item={{
                                    courseId: course.id,
                                    slug: course.slug,
                                    title: course.title,
                                    priceCents: course.price_cents,
                                    trackSlug: course.track?.slug ?? "board",
                                    hours: course.hours,
                                  }}
                                />
                              ) : (
                                /* The original's own label for the two Coop
                                   seats it has not launched yet. */
                                <span className="flex h-11 w-full items-center justify-center rounded-full bg-ink-100 text-[13.5px] font-medium text-ink-500">
                                  Coming Soon!
                                </span>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <p className="mt-7 text-[13.5px] leading-relaxed text-accent-700">
                      <span className="font-medium underline underline-offset-4">
                        Requirement
                      </span>
                      : {association.requirement}
                    </p>
                  </div>
                ),
              }))}
            />
          </div>

          {/* ---- what the course gives you ---- */}
          <CoursePerks perks={PERKS} className="mt-16 lg:mt-20" />
        </div>
      </section>

      {/* ---------------------------- recent posts --------------------------- */}
      <RecentPosts posts={posts.filter((post) => post !== null)} withExcerpt />
    </>
  );
}
