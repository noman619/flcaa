import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OFFERING_TYPES, trackTheme } from "@/lib/catalog";
import { cn, formatHours, formatPrice } from "@/lib/utils";
import type { CourseWithTrack } from "@/lib/queries";

export function CourseCard({
  course,
  owned = false,
  className,
}: {
  course: CourseWithTrack;
  owned?: boolean;
  className?: string;
}) {
  const theme = trackTheme(course.track?.slug ?? "real-estate");
  const hours = formatHours(course.hours);

  return (
    <article
      className={cn(
        "group reveal relative flex flex-col overflow-hidden rounded-panel border border-ink-200/70 bg-white shadow-card",
        "transition-[transform,box-shadow,border-color] duration-300 ease-out-soft",
        "hover:-translate-y-1.5 hover:shadow-card-hover",
        className,
      )}
    >
      {/* Tinted header carrying the track's identity, with the required
          hour count set as a large ghosted numeral. */}
      <div
        className={cn("relative overflow-hidden px-6 pt-6 pb-5", theme.bg)}
      >
        <span
          className="absolute inset-x-0 top-0 h-px"
          style={{ backgroundColor: theme.accent, opacity: 0.55 }}
          aria-hidden
        />

        {course.hours ? (
          <span
            className="pointer-events-none absolute -right-2 -bottom-5 font-display text-[5.5rem] leading-none opacity-15 transition-transform duration-500 ease-out-soft group-hover:-translate-y-1"
            style={{ color: theme.accent }}
            aria-hidden
          >
            {Number(course.hours)}
          </span>
        ) : null}

        <div className="relative flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-white"
            style={{ backgroundColor: theme.accent }}
          >
            {OFFERING_TYPES[course.offering_type]?.label ?? course.offering_type}
          </span>
          {owned ? (
            <Badge variant="solid" size="sm">
              Enrolled
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-[19px] leading-snug text-ink-900">
          <Link
            href={`/courses/${course.slug}`}
            className="before:absolute before:inset-0 before:content-['']"
          >
            {course.title}
          </Link>
        </h3>

        {course.subtitle ? (
          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-ink-500">
            {course.subtitle}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-500">
          {hours ? (
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5 text-ink-400" aria-hidden />
              {hours}
            </span>
          ) : null}
          <span>Self-paced online</span>
          {course.is_state_approved ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <BadgeCheck className="size-3.5" aria-hidden />
              State approved
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <div>
            <span className="tabular font-display text-2xl text-ink-900">
              {course.price_cents === 0 ? "Free" : formatPrice(course.price_cents)}
            </span>
            {course.access_days ? (
              <span className="mt-0.5 block text-[11px] text-ink-400">
                {course.access_days}-day access
              </span>
            ) : null}
          </div>

          <span
            className="icon-tile shrink-0 text-white transition-transform duration-300 ease-out-soft group-hover:scale-110"
            style={{ backgroundColor: theme.accent }}
            aria-hidden
          >
            <ArrowUpRight className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
