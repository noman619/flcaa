import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

/**
 * "Leave us a review" panel, ported from https://www.flcaa.com/review.
 *
 * The three badges are the platforms' own artwork — Google's is a raster
 * export, BBB's and Facebook's are vectors lifted from the original page —
 * so they render as-is rather than being redrawn in the site's palette. The
 * badge is the trust mark; restyling it would defeat the point.
 */

export type ReviewPlatform = {
  name: string;
  badge: string;
  /** Vectors go through a plain <img>; next/image refuses SVG by default. */
  vector?: boolean;
  href: string;
  /** Rating under the mark, where the platform shows one. */
  note?: string;
};

export const REVIEW_PLATFORMS: readonly ReviewPlatform[] = [
  {
    name: "Google",
    badge: "/review/google-4-9.png",
    href: "https://g.page/r/CX1p3ruKCLZaEAI/review",
    note: "4.9 average rating",
  },
  {
    name: "BBB",
    badge: "/review/bbb.svg",
    vector: true,
    href: "https://www.bbb.org/us/fl/hallandale/profile/real-estate-school/prolicense-education-llc-0633-90406374/customer-reviews",
    note: "Accredited Business",
  },
  {
    name: "Facebook",
    badge: "/review/facebook-5-0.svg",
    vector: true,
    href: "https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2F100063749209834%2Freviews%2F",
    note: "5.0 average rating",
  },
];

const BADGE_CLASS = "h-40 w-40 object-contain lg:h-44 lg:w-44";

export function ReviewPlatforms({
  platforms = REVIEW_PLATFORMS,
}: {
  platforms?: readonly ReviewPlatform[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/70 bg-sand-50">
      {/* Two soft washes so the white badge plates sit on light, not on flat. */}
      <span
        className="pointer-events-none absolute -top-24 -left-24 size-112 rounded-full bg-brand-100/40 blur-3xl"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute -right-24 -bottom-24 size-112 rounded-full bg-gold-100/50 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page py-16 lg:py-24">
        {/* ---- masthead: logo beside the thank-you mark ---- */}
        <div className="reveal flex flex-wrap items-center justify-center gap-8 lg:gap-14">
          <Image
            src="/logo-prolicense.png"
            alt="Prolicense Florida"
            width={466}
            height={138}
            className="h-14 w-auto lg:h-16"
            priority
          />
          <Image
            src="/review/thank-you.png"
            alt="Thank you!"
            width={468}
            height={402}
            className="h-24 w-auto lg:h-28"
            priority
          />
        </div>

        <h2 className="reveal mx-auto mt-10 max-w-2xl text-center font-display text-[1.6rem] leading-snug text-ink-950 lg:text-[2rem]">
          Please take a moment to leave us a review on one of the following
          platforms:
        </h2>

        {/* ---- platforms ---- */}
        <ul className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-3">
          {platforms.map((platform) => (
            <li
              key={platform.name}
              className="reveal group flex flex-col items-center rounded-panel border border-ink-200/60 bg-white p-8 text-center shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card-hover"
            >
              {platform.vector ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={platform.badge} alt="" className={BADGE_CLASS} />
              ) : (
                <Image
                  src={platform.badge}
                  alt=""
                  width={418}
                  height={382}
                  className={BADGE_CLASS}
                />
              )}

              {platform.note ? (
                <p className="mt-5 text-[11px] font-medium tracking-[0.16em] text-ink-500 uppercase">
                  {platform.note}
                </p>
              ) : null}

              <a
                href={platform.href}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink-900 px-6 text-[13.5px] font-medium text-white transition-[transform,background-color,box-shadow] duration-250 ease-out-soft group-hover:bg-ink-950 hover:-translate-y-px hover:shadow-card"
              >
                Write a Review
                <span className="sr-only"> on {platform.name}</span>
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
