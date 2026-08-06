import * as React from "react";
import Link from "next/link";
import { Check, ChevronRight } from "lucide-react";
import { VideoPlayer } from "@/components/ui/video-player";
import {
  GuideStepCards,
  type StepCard,
} from "@/components/marketing/guide-step-cards";

export type GuideHeroProps = {
  eyebrow: string;
  title: string;
  intro: string;
  /** The headline claims, shown as a checked list beside the video. */
  highlights: readonly string[];
  video: { id: string; title: string };
  breadcrumb: { label: string; href?: string }[];
  /** Four-step summary graphic, top right. */
  steps?: readonly StepCard[];
};

/**
 * Opening section for a ported resource guide.
 *
 * Laid out as the original is: copy and step graphic on the top row, video and
 * the checked claims on the bottom row. Field, breadcrumb and rhythm are
 * PageHero's (sand-100, container-page, breadcrumb over eyebrow over h1) so a
 * guide does not read as a different site. The video sits on a navy plate, the
 * only dark surface the design language uses for media.
 */
export function GuideHero({
  eyebrow,
  title,
  intro,
  highlights,
  video,
  breadcrumb,
  steps,
}: GuideHeroProps) {
  return (
    <section className="relative border-b border-ink-200/70 bg-sand-100">
      <div className="relative container-page py-16 lg:py-20">
        <nav aria-label="Breadcrumb" className="mb-7">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
            {breadcrumb.map((crumb, i) => (
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

        <div className="grid gap-x-16 gap-y-14 lg:grid-cols-2 lg:gap-y-20">
          {/* top left — the headline */}
          <div className="reveal">
            <p className="eyebrow">{eyebrow}</p>

            <h1 className="mt-5 font-display text-[2.15rem] leading-[1.08] text-ink-950 lg:text-[3.1rem]">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ink-600">
              {intro}
            </p>
          </div>

          {/* top right — the four steps at a glance */}
          {steps?.length ? (
            <div className="reveal lg:self-center">
              <GuideStepCards steps={steps} />
            </div>
          ) : (
            <div aria-hidden />
          )}

          {/* bottom left — the video */}
          <div className="reveal rounded-hero bg-brand-950 p-2.5 shadow-card lg:self-center">
            <VideoPlayer videoId={video.id} title={video.title} />
          </div>

          {/* bottom right — the claims */}
          <ul className="reveal space-y-6 lg:self-center">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-4">
                <span className="icon-tile mt-0.5 size-8">
                  <Check className="size-4" aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed text-ink-800">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
