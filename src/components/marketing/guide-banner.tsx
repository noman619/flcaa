import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const ART_CLASS = "relative h-auto w-56 max-w-full drop-shadow-2xl lg:w-72";

export type GuideBannerProps = {
  eyebrow?: string;
  title: string;
  intro: string;
  /** Decorative artwork on the right. Hidden below `md`. */
  art: { src: string; width: number; height: number };
  breadcrumb: { label: string; href?: string }[];
};

/**
 * Opening band for a guide that leads with artwork rather than a video —
 * headline, one line of intro, and an illustration.
 *
 * A dark field, unlike GuideHero's sand: the original runs these pages under a
 * flat colour banner, and navy is the site's equivalent. The artwork is purely
 * decorative, so it carries an empty alt and drops out entirely on small
 * screens instead of pushing the headline down the fold.
 */
export function GuideBanner({
  eyebrow,
  title,
  intro,
  art,
  breadcrumb,
}: GuideBannerProps) {
  return (
    <section className="relative overflow-hidden bg-brand-950">
      {/* Two offset glows, so the flat field has depth without a gradient seam. */}
      <div
        className="pointer-events-none absolute -top-40 -left-24 size-176 rounded-full bg-brand-700/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-32 -bottom-52 size-176 rounded-full bg-gold-500/10 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page py-14 lg:py-20">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/50">
            {breadcrumb.map((crumb, i) => (
              <React.Fragment key={crumb.label}>
                {i > 0 ? (
                  <ChevronRight className="size-3.5 text-white/25" aria-hidden />
                ) : null}
                <li>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="transition-colors duration-200 hover:text-white"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-medium text-white" aria-current="page">
                      {crumb.label}
                    </span>
                  )}
                </li>
              </React.Fragment>
            ))}
          </ol>
        </nav>

        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.42fr)] lg:gap-16">
          <div className="reveal min-w-0">
            {eyebrow ? (
              <p className="text-[11px] font-medium tracking-[0.22em] text-gold-300 uppercase">
                {eyebrow}
              </p>
            ) : null}

            <h1 className="mt-5 font-display text-[2.15rem] leading-[1.06] text-white lg:text-[3.25rem]">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/65">
              {intro}
            </p>
          </div>

          <div className="reveal hidden justify-center md:flex" aria-hidden>
            <div className="relative">
              <div
                className="absolute inset-4 rounded-full bg-white/10 blur-3xl"
                aria-hidden
              />
              {/*
                A vector stays a plain <img>: the optimizer refuses SVG unless
                dangerouslyAllowSVG is set, and there is nothing to resize.
              */}
              {art.src.endsWith(".svg") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={art.src}
                  alt=""
                  width={art.width}
                  height={art.height}
                  className={ART_CLASS}
                />
              ) : (
                <Image
                  src={art.src}
                  alt=""
                  width={art.width}
                  height={art.height}
                  priority
                  className={ART_CLASS}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
