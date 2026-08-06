import Link from "next/link";
import { ArrowRight, Award, Building2, Home } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { trackTheme } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Track } from "@/lib/database.types";

const ICONS: Record<string, LucideIcon> = {
  home: Home,
  "building-2": Building2,
  award: Award,
};

/**
 * Solid, edge-to-edge colour field per card — no split header/body. The icon
 * sits top-left in a soft tile, the CTA anchors bottom-left as a pill, and a
 * large quarter-arc bleeds off the bottom-right corner.
 */
export function TrackCard({
  track,
  popularTopics,
  href,
}: {
  track: Track;
  popularTopics: { label: string; href: string }[];
  href: string;
}) {
  const theme = trackTheme(track.slug);
  const Icon = ICONS[track.icon ?? ""] ?? Home;

  return (
    <article
      className={cn(
        "group reveal relative flex flex-col overflow-hidden rounded-panel p-8 lg:p-9",
        "transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-card-hover",
        theme.bg,
      )}
    >
      <span
        className="icon-tile icon-tile-lg relative mb-7 text-white transition-transform duration-500 ease-out-soft group-hover:scale-105"
        style={{ backgroundColor: theme.accent }}
      >
        <Icon className="size-5.5" strokeWidth={1.75} aria-hidden />
      </span>

      <h3 className="relative font-display text-[22px] leading-tight text-ink-900">
        {track.name}
      </h3>

      {track.tagline ? (
        <p className="relative mt-3 text-sm leading-relaxed text-ink-600">
          {track.tagline}
        </p>
      ) : null}

      <p className="relative mt-7 mb-3 text-[11px] font-medium tracking-[0.16em] text-ink-500 uppercase">
        Popular topics
      </p>
      <ul className="relative space-y-0.5">
        {popularTopics.map((topic) => (
          <li key={topic.href}>
            <Link
              href={topic.href}
              className="group/topic -mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-ink-700 transition-colors duration-200 hover:bg-white/60 hover:text-ink-900"
            >
              <span
                className="size-1.5 shrink-0 rounded-full transition-transform duration-200 group-hover/topic:scale-150"
                style={{ backgroundColor: theme.accent }}
                aria-hidden
              />
              {topic.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className="relative mt-auto inline-flex items-center gap-2.5 self-start rounded-full bg-white/80 px-5 py-2.5 pt-2.5 text-[13px] font-medium text-ink-900 ring-1 ring-white/70 ring-inset backdrop-blur-sm transition-[transform,background-color] duration-300 ease-out-soft hover:-translate-y-px hover:bg-white"
      >
        Explore {track.name}
        <span
          className="flex size-6 items-center justify-center rounded-full text-white transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
          style={{ backgroundColor: theme.accent }}
          aria-hidden
        >
          <ArrowRight className="size-3" />
        </span>
      </Link>
    </article>
  );
}
