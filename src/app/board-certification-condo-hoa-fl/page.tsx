import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { EnrollButton } from "@/components/course/enroll-button";
import { FaqAccordion } from "@/components/course/faq-accordion";
import { BOARD_CERT_FAQS } from "@/content/course-faqs";
import { YouTubeEmbed } from "@/components/course/youtube-embed";
import { CoursePerks } from "@/components/marketing/course-perks";
import { RecentPosts } from "@/components/marketing/recent-posts";
import { BOARD_POST_SLUGS } from "@/lib/course-media";
import { displayPrice } from "@/lib/pricing";
import { getCourseBySlug, getPostBySlug } from "@/lib/queries";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from                                                  */
/*  https://www.flcaa.com/board-certification-condo-hoa-fl                     */
/* -------------------------------------------------------------------------- */

const HERO = {
  title:
    "Florida Board Member Certification Online Course for Condo, HOA & Coop",
  intro:
    "State-approved 4-hour certification for newly elected association board members to comply with Florida’s new education requirement.",
  rating: "4.9 Rating (294 Reviews)",
  tagline:
    "Designed to provide exactly what you need to know to become an effective board director and officer.",
  video: {
    id: "nWw-VJ3aM6k",
    title:
      "Florida Board Member Certification Online Course for Condo, HOA & Coop",
    poster: "/board/video-poster.jpg",
  },
} as const;

const OUTLINE = [
  "Community Operations",
  "Budget & Reserves",
  "Records Access",
  "Bids and Contracts",
  "Financial Reporting",
  "Elections",
  "Problem Solving and Dispute Resolution",
] as const;

/**
 * The three seat counts the original sells.
 *
 * `slug` resolves the catalog row that carries the payable price. The two
 * multi-seat products are created by supabase/add_board_certification_seats.sql;
 * until that has been run they fall back to the single-member course, so the
 * page never renders a button that would charge nothing.
 */
const BASE_SLUG = "board-director-certification";

const SEATS = [
  { name: "One (1) Board Member", slug: BASE_SLUG },
  { name: "Two (2) Board Members", slug: "board-director-certification-2" },
  { name: "Up to 6 Board Members", slug: "board-director-certification-6" },
] as const;

const FEATURES = [
  {
    icon: "/board/icon-certificate.png",
    text: "Earn the state of Florida board member leadership Certification.",
  },
  {
    icon: "/board/icon-home.png",
    text: "4-hour self-paced online certification from the comfort and privacy of your home.",
  },
  {
    icon: "/board/icon-device.png",
    text: "Fast and comprehensive course using your laptop, tablet or mobile device.",
  },
  {
    icon: "/board/icon-instant.png",
    text: "Instant certification delivery upon course completion.",
  },
] as const;

const TAILORED = {
  title: "The Course is Specifically Tailored to Your Type of Association",
  body: [
    // The original's "an reliable" is its own; kept verbatim.
    "As an owner living in a condominium, homeowners association, or cooperative, you understand how important it is to have an reliable board of directors.",
    "This certification is designed to provide a foundation for effective community association board members.",
  ],
  certificate: {
    src: "/board/certificate.png",
    alt: "Florida Board Member Association Certificate",
  },
} as const;

export const metadata: Metadata = {
  title: {
    absolute:
      "Florida Board Member Certification Online Course for Condo, HOA & Coop | Prolicense Florida",
  },
  description: HERO.intro,
  alternates: { canonical: "/board-certification-condo-hoa-fl" },
};

export default async function Page() {
  const [courses, posts] = await Promise.all([
    Promise.all(SEATS.map((seat) => getCourseBySlug(seat.slug))),
    Promise.all(BOARD_POST_SLUGS.map((slug) => getPostBySlug(slug))),
  ]);
  const base = courses[0];

  const plans = SEATS.map((seat, i) => {
    const course = courses[i] ?? base;
    return {
      ...seat,
      price: displayPrice(course).price,
      item: {
        courseId: course?.id ?? "",
        slug: course?.slug ?? seat.slug,
        title: course?.title ?? seat.name,
        priceCents: course?.price_cents ?? 0,
        trackSlug: course?.track?.slug ?? "board",
        hours: course?.hours ?? null,
      },
    };
  });

  return (
    <>
      {/* ------------------------------- hero -------------------------------
          Navy band with the video alongside. The panels below deliberately
          ride up over its lower edge, as on the original — the outline and
          the price card are part of the hero's offer, not a separate act. */}
      <section className="relative overflow-hidden bg-brand-900 pb-28 lg:pb-40">
        <span
          className="pointer-events-none absolute -top-32 -left-40 size-112 rounded-full bg-brand-500/25 blur-3xl"
          aria-hidden
        />
        <span
          className="pointer-events-none absolute -right-32 bottom-0 size-112 rounded-full bg-brand-700/40 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page grid items-start gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-16 lg:py-20">
          <div className="reveal">
            <h1 className="max-w-xl font-display text-[2rem] leading-[1.12] text-white lg:text-[2.9rem]">
              {HERO.title}
            </h1>

            <p className="mt-7 max-w-lg text-[15px] leading-relaxed text-white/70">
              {HERO.intro}
            </p>

            <p className="mt-9 flex flex-wrap items-center gap-3">
              <span className="flex gap-0.5" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star
                    key={i}
                    className="size-5 fill-gold-500 text-gold-500"
                  />
                ))}
              </span>
              <Link
                href="/reviews"
                className="text-[15px] font-medium text-white underline decoration-white/40 underline-offset-4 transition-colors duration-200 hover:decoration-white"
              >
                {HERO.rating}
              </Link>
            </p>

            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-white/85">
              {HERO.tagline}
            </p>
          </div>

          <div className="reveal min-w-0">
            <YouTubeEmbed
              id={HERO.video.id}
              title={HERO.video.title}
              poster={HERO.video.poster}
            />
          </div>
        </div>
      </section>

      {/* --------------------- outline · seats · features -------------------- */}
      <section className="border-b border-ink-200/70 bg-mist-100">
        <div className="container-page pb-16 lg:pt-14 lg:pb-24">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-12">
            {/*
              ---- course outline ----
              Sits under the navy on wide screens, as on the original. On
              mobile it takes over the overlap the price card gives up, so the
              band still opens on a card breaking the navy edge.
            */}
            <div className="reveal -mt-16 rounded-panel border border-white/60 bg-white/80 p-8 shadow-card backdrop-blur-sm lg:mt-0 lg:p-10">
              <h2 className="font-display text-[1.6rem] text-ink-950 lg:text-[1.9rem]">
                Course Outline:
              </h2>

              <ol className="mt-6 space-y-3.5">
                {OUTLINE.map((topic, i) => (
                  <li key={topic} className="flex items-start gap-3.5">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-900 text-[11px] font-medium text-white tabular-nums">
                      {i + 1}
                    </span>
                    <span className="text-[15px] leading-relaxed text-ink-700">
                      {topic}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/*
              ---- seats ----
              Rides up over the navy on wide screens, as on the original. Not
              on mobile: there the grid is one column, so the same pull would
              drag this card up over the outline above it.
            */}
            <div className="reveal overflow-hidden rounded-panel border border-ink-200/60 bg-white shadow-pop lg:-mt-52">
              <div className="bg-brand-900 px-8 py-5">
                <h2 className="text-[13px] font-medium tracking-[0.18em] text-white uppercase">
                  Certification for:
                </h2>
              </div>

              <ul className="divide-y divide-ink-200/70">
                {plans.map((plan) => (
                  <li
                    key={plan.name}
                    className="flex flex-wrap items-center justify-between gap-4 px-8 py-6"
                  >
                    <div className="min-w-0">
                      <p className="text-[15px] leading-snug font-medium text-brand-700">
                        {plan.name}
                      </p>
                      <p className="mt-1 font-display text-2xl text-ink-950">
                        {plan.price}
                      </p>
                    </div>

                    <div className="w-full sm:w-auto sm:min-w-36">
                      <EnrollButton item={plan.item} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- what the certification gives you ---- */}
          <CoursePerks perks={FEATURES} className="mt-14 lg:mt-20" />
        </div>
      </section>

      {/* ---------------------- tailored to your association -----------------
          The certificate is the proof the copy is promising, so it is given
          real presence: a framed, slightly lifted plate rather than a picture
          dropped in a column. */}
      <section className="relative overflow-hidden border-b border-ink-200/70 bg-white">
        <span
          className="pointer-events-none absolute top-1/3 left-1/2 size-112 -translate-x-1/2 rounded-full bg-mist-100/70 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page py-16 lg:py-24">
          <div className="reveal mx-auto max-w-3xl text-center">
            <h2 className="font-display text-[1.8rem] leading-tight text-brand-800 lg:text-[2.35rem]">
              {TAILORED.title}
            </h2>

            {TAILORED.body.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-6 text-[16px] leading-relaxed text-ink-600"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <figure className="reveal mx-auto mt-14 max-w-2xl">
            <div className="group relative overflow-hidden rounded-panel border border-ink-200/70 bg-white p-3 shadow-card transition-[transform,box-shadow] duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover lg:p-4">
              <Image
                src={TAILORED.certificate.src}
                alt={TAILORED.certificate.alt}
                width={1000}
                height={739}
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="h-auto w-full rounded-card"
              />
              {/* A whisper of sheen across the plate on hover, nothing more. */}
              <span
                className="pointer-events-none absolute inset-0 bg-linear-to-tr from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                aria-hidden
              />
            </div>
          </figure>
        </div>
      </section>

      {/* -------------------------------- faq -------------------------------- */}
      <FaqAccordion
        items={BOARD_CERT_FAQS}
        title="Frequently Asked Questions"
        tone="sand"
        align="center"
      />

      {/* ---------------------------- recent posts --------------------------- */}
      <RecentPosts posts={posts.filter((post) => post !== null)} withExcerpt />
    </>
  );
}
