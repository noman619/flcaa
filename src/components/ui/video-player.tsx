"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/** The media query is an external store, so it is read rather than mirrored. */
function useReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(MOTION_QUERY);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false, // server render: assume motion is allowed
  );
}

/**
 * A YouTube embed that autoplays, but politely:
 *
 * - The iframe is only mounted once it scrolls into view, so a page doesn't pay
 *   YouTube's ~1MB player cost on first paint.
 * - Autoplay is muted, which is the only form browsers permit without a
 *   gesture. Controls stay on so the viewer can unmute.
 * - When the visitor prefers reduced motion we never autoplay; the poster stays
 *   until they press play.
 *
 * Shared by the homepage video band and the resource guides so there is one
 * implementation of this behaviour, not two that drift.
 */
export function VideoPlayer({
  videoId,
  src,
  title,
  className,
}: {
  /** YouTube id. Mutually exclusive with src. */
  videoId?: string;
  /** Self-hosted file URL. Mutually exclusive with videoId. */
  src?: string;
  title: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(false);
  const reducedMotion = useReducedMotion();

  React.useEffect(() => {
    const node = ref.current;
    if (!node || active) return;

    // No IntersectionObserver (very old browsers) — just show the poster.
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // setState here is a subscription callback, not a synchronous
          // effect body — it fires only when the video actually appears.
          if (!window.matchMedia(MOTION_QUERY).matches) setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  const embedSrc =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}` +
    `&playsinline=1&rel=0&modestbranding=1&controls=1`;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div className="overflow-hidden rounded-hero p-1.5 ring-1 ring-white/10 lit-top">
        <div className="relative aspect-video w-full overflow-hidden rounded-hero-inner bg-ink-900">
          {active && src ? (
            <video
              src={src}
              title={title}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="absolute inset-0 size-full object-cover"
            />
          ) : active ? (
            <iframe
              src={embedSrc}
              title={title}
              loading="lazy"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 flex size-full flex-col items-center justify-center gap-5 transition-colors duration-300 hover:bg-white/5"
              aria-label={`Play video: ${title}`}
            >
              <span className="relative flex size-20 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur transition-transform duration-500 ease-out-soft group-hover:scale-105">
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-white/10"
                  aria-hidden
                />
                <Play className="relative ml-1 size-7 fill-white text-white" aria-hidden />
              </span>
              <span className="text-sm font-medium text-ink-300">
                {reducedMotion ? "Press to play" : "Loading video…"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
