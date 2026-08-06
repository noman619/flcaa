import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Opening band for a guide that leads with a photograph.
 *
 * The image carries a navy scrim rather than the original's bare photo: the
 * source picture is pale and its subject sits on both sides of the headline,
 * so unscrimmed text lands on whatever the crop happens to put behind it. A
 * scrim fixes the contrast at every viewport instead of at one.
 *
 * The intro sits below the photo on its own field, as on the original — over
 * the image it would be a second thing competing for the same background.
 */
export function PhotoHero({
  title,
  intro,
  image,
  breadcrumb,
}: {
  title: string;
  intro: React.ReactNode;
  image: { src: string; width: number; height: number };
  breadcrumb: { label: string; href?: string }[];
}) {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-brand-950">
        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          priority
          className="absolute inset-0 -z-10 size-full object-cover"
        />
        {/* Scrim: heavier at the foot, where the headline sits. */}
        <div
          className="absolute inset-0 -z-10 bg-linear-to-b from-brand-950/70 via-brand-950/75 to-brand-950/90"
          aria-hidden
        />

        <div className="container-page py-16 lg:py-24">
          <nav aria-label="Breadcrumb" className="mb-10">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={crumb.label}>
                  {i > 0 ? (
                    <ChevronRight
                      className="size-3.5 text-white/30"
                      aria-hidden
                    />
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
                      <span
                        className="font-medium text-white"
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

          <h1 className="reveal mx-auto max-w-3xl text-center font-display text-[2.15rem] leading-[1.06] text-white lg:text-[3.25rem]">
            {title}
          </h1>
        </div>
      </section>

      <section className="border-b border-ink-200/70 bg-sand-50">
        <div className="container-page max-w-3xl py-14 lg:py-16">
          <p className="reveal text-[15px] leading-relaxed text-ink-700">
            {intro}
          </p>
        </div>
      </section>
    </>
  );
}
