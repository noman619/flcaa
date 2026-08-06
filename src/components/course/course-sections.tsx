import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { INSTRUCTORS, type Instructor } from "@/lib/instructors";
import { RELATED_RESOURCES } from "@/lib/course-media";
import {
  GuideStepCards,
  type StepCard,
} from "@/components/marketing/guide-step-cards";

/**
 * Sections shared by the course landing pages (63-hour, mutual recognition).
 * Extracted so the two pages cannot drift apart in styling or structure —
 * only their data differs.
 */

export function StatsBand({
  stats,
}: {
  stats: readonly { value: string; label: string }[];
}) {
  return (
    <section className="bg-ink-950">
      <div className="container-page py-16 lg:py-20">
        <h2 className="text-center font-display text-[1.9rem] font-light text-white/95 lg:text-[2.4rem]">
          What to Expect
        </h2>

        <dl className="mt-12 grid gap-10 sm:grid-cols-3 sm:divide-x sm:divide-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <p className="font-display text-5xl text-white lg:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-[11px] tracking-[0.22em] text-white/50 uppercase">
                  {stat.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function ExamChart({
  title,
  blurbLead,
  blurbLink,
  bars,
}: {
  title: string;
  blurbLead: string;
  blurbLink: { label: string; href: string };
  bars: readonly { label: string; value: number; tone: string }[];
}) {
  // The story of the chart is the gap between the two figures, so state it.
  const best = Math.max(...bars.map((b) => b.value));
  const rest = Math.min(...bars.map((b) => b.value));
  const lead = best - rest;

  return (
    <section className="relative overflow-hidden border-b border-ink-200/70 bg-ink-950">
      {/* A single soft light behind the columns, nothing more. */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-800/25 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page py-20 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <p className="text-[10px] tracking-[0.28em] text-white/40 uppercase">
              Results
            </p>

            <h2 className="mt-5 font-display text-[2rem] leading-[1.1] font-light text-white/95 lg:text-[2.75rem]">
              {title}
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/55">
              {blurbLead}
              <Link
                href={blurbLink.href}
                className="text-white/90 underline decoration-white/30 underline-offset-4 transition-colors duration-200 hover:decoration-white"
              >
                {blurbLink.label}
              </Link>
              .
            </p>

            {lead > 0 ? (
              <p className="mt-9 inline-flex items-baseline gap-2.5 rounded-full bg-white/5 px-5 py-2.5 ring-1 ring-white/10">
                <span className="font-display text-2xl text-white">+{lead}</span>
                <span className="text-[11px] tracking-[0.18em] text-white/45 uppercase">
                  points ahead
                </span>
              </p>
            ) : null}
          </div>

          {/* chart */}
          <div className="reveal">
            <div className="relative rounded-hero bg-white/[0.03] p-8 ring-1 ring-white/10 lg:p-10">
              {/* gridlines, drawn behind the columns */}
              <div className="absolute inset-x-8 top-10 bottom-24 lg:inset-x-10" aria-hidden>
                {[0, 25, 50, 75, 100].map((line) => (
                  <span
                    key={line}
                    className="absolute inset-x-0 h-px bg-white/[0.07]"
                    style={{ bottom: `${line}%` }}
                  />
                ))}
              </div>

              <div className="relative flex h-72 items-end justify-center gap-10 sm:gap-16 lg:h-80">
                {bars.map((bar, i) => (
                  <div
                    key={bar.label}
                    className="flex h-full w-28 flex-col items-center justify-end sm:w-32"
                  >
                    <p className="mb-3 font-display text-[1.75rem] leading-none text-white lg:text-3xl">
                      {bar.value}%
                    </p>

                    <div
                      className={`bar-rise w-full rounded-t-card ${bar.tone}`}
                      // Height is the datum; the scaleY animation only reveals it.
                      style={{
                        height: `${bar.value}%`,
                        animationDelay: `${i * 140}ms`,
                      }}
                      aria-hidden
                    />
                  </div>
                ))}
              </div>

              {/* baseline + labels */}
              <div className="mt-0 h-px w-full bg-white/15" />
              <div className="mt-5 flex justify-center gap-10 sm:gap-16">
                {bars.map((bar) => (
                  <p
                    key={bar.label}
                    className="w-28 text-center text-[12.5px] leading-snug text-white/70 sm:w-32"
                  >
                    <span
                      className={`mr-2 inline-block size-2 rounded-full align-middle ${bar.tone}`}
                      aria-hidden
                    />
                    {bar.label}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function InstructorsBand({
  instructors = INSTRUCTORS,
  title = "Meet Your Instructors",
}: {
  /** Defaults to the shared staff list; pass only to override. */
  instructors?: readonly Instructor[];
  /** The school pages name the track in the heading. */
  title?: string;
} = {}) {
  return (
    <section className="border-b border-ink-200/70 bg-sand-100">
      <div className="container-page py-16 lg:py-24">
        <h2 className="text-center font-display text-[1.9rem] text-ink-950 lg:text-[2.4rem]">
          {title}
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:gap-16">
          {instructors.map((person) => (
            <figure key={person.name} className="reveal text-center">
              <Image
                src={person.photo}
                alt={person.name}
                width={200}
                height={200}
                className="mx-auto size-32 rounded-full object-cover shadow-card lg:size-36"
              />
              <figcaption className="mt-5 font-display text-lg text-brand-700">
                {person.name}
              </figcaption>
              <p className="mx-auto mt-4 max-w-md text-[14.5px] leading-relaxed text-ink-600">
                {person.bio}
              </p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedResources({
  items = RELATED_RESOURCES,
  title = "Related Resources",
}: {
  /** Defaults to the shared set; pass only to override. */
  items?: readonly { title: string; image: string; href: string }[];
  /** The guides label the same rail "Recent Posts". */
  title?: string;
} = {}) {
  return (
    <section className="bg-sand-50">
      <div className="container-page py-16 lg:py-24">
        <h2 className="font-display text-[1.6rem] text-ink-950 lg:text-[2rem]">
          {title}
        </h2>

        <div className="mt-9 grid gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group reveal overflow-hidden rounded-panel border border-ink-200/70 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-card-hover"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-sand-100">
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
                />
              </div>
              <p className="p-6 text-[14.5px] leading-snug font-medium text-brand-700">
                {item.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Course landing hero: headline and claims on the left, media on the right.
 * `media` is a slot so a page can put a laptop mock-up, a plain video, or a
 * still image in it without this component knowing about any of them.
 */
export function CourseHero({
  title,
  intro,
  bullets,
  mediaHeading,
  media,
  footer,
}: {
  title: string;
  intro: string;
  /** Omit where the media column already carries the selling points. */
  bullets?: readonly string[];
  /** Omit to run the media flush to the top of its column. */
  mediaHeading?: string;
  media: React.ReactNode;
  /** Optional extra block under the bullets — a rating, a secondary CTA. */
  footer?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/70 bg-mist-50">
      <div className="relative container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="reveal">
          <h1 className="font-display text-[2.15rem] leading-[1.08] text-ink-950 lg:text-[3.1rem]">
            {title}
          </h1>

          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-600">
            {intro}
          </p>

          {bullets?.length ? (
            <ul className="mt-9 space-y-4">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                  <span className="icon-tile mt-0.5 size-7">
                    <Check className="size-3.5" aria-hidden />
                  </span>
                  <span className="text-[15px] leading-relaxed text-ink-800">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}

          {footer ? <div className="mt-9">{footer}</div> : null}
        </div>

        <div className="reveal min-w-0">
          {mediaHeading ? (
            <p className="eyebrow mb-6 text-center">{mediaHeading}</p>
          ) : null}
          {media}
        </div>
      </div>
    </section>
  );
}

/**
 * A question answered by a short run of checked points — "What is the key to
 * passing the state exam?".
 *
 * The question sits in its own column instead of centred above the list, so the
 * points start at the top of the band rather than a third of the way down it.
 */
export function KeyPointsBand({
  title,
  points,
  note,
}: {
  title: string;
  points: readonly string[];
  note?: React.ReactNode;
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page grid gap-12 py-16 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-20 lg:py-24">
        <div className="reveal">
          <h2 className="font-display text-[1.9rem] leading-[1.12] text-ink-950 lg:text-[2.4rem]">
            {title}
          </h2>
          {note ? (
            <div className="mt-6 text-[15px] leading-relaxed text-ink-600">
              {note}
            </div>
          ) : null}
        </div>

        <ul className="reveal min-w-0 divide-y divide-ink-200/70 self-start overflow-hidden rounded-panel border border-ink-200/70 bg-sand-50 shadow-card">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-4 px-6 py-5 lg:px-7">
              <span className="icon-tile mt-0.5 size-7 shrink-0">
                <Check className="size-3.5" aria-hidden />
              </span>
              <span className="text-[15px] leading-relaxed text-ink-800">
                {point}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Thin promo strip above the hero. */
export function PromoBar({ label, expires }: { label: string; expires: string }) {
  return (
    <div className="bg-accent-700 py-2.5 text-center text-white">
      <p className="container-page text-[13px]">
        <span className="font-medium">{label}</span>{" "}
        <span className="text-white/70">{expires}</span>
      </p>
    </div>
  );
}

/** "Do you hold a real estate license in another state?" band. */
export function ReciprocityBand({
  question,
  action,
}: {
  question: string;
  action: { label: string; href: string };
}) {
  return (
    <section className="bg-mist-100">
      <div className="container-page flex flex-col items-center gap-5 py-10 text-center sm:flex-row sm:justify-center sm:gap-8 sm:text-left">
        <p className="text-[15px] text-ink-800">{question}</p>
        <ButtonLink href={action.href}>{action.label}</ButtonLink>
      </div>
    </section>
  );
}

/**
 * "4 Steps to Get Your ... License" — the step cards beside a heading and a
 * link to the matching how-to guide.
 */
export function StepsCallout({
  steps,
  heading,
  link,
}: {
  steps: readonly StepCard[];
  heading: string;
  link: { label: string; href: string };
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
        <div className="reveal">
          <GuideStepCards steps={steps} />
        </div>

        <div className="reveal text-center lg:text-left">
          <h2 className="font-display text-[1.9rem] leading-tight text-ink-950 lg:text-[2.4rem]">
            {heading}
          </h2>
          <p className="mt-5">
            <Link
              href={link.href}
              className="text-[15px] text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
            >
              {link.label}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
