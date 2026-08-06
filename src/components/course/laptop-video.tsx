"use client";

import * as React from "react";
import Image from "next/image";

/**
 * Screen cut-out inside laptop.png, as a percentage of the image box.
 *
 * Measured off the asset: the pure-black panel is 729x503px at (167,56) inside
 * a 1060x761px image. Measure with a strict threshold (rgb < 10) — the lid's
 * bezel is rgb(18,19,21), so a loose "is it dark" test reads bezel-to-bezel and
 * yields a box ~20px too wide, which pushes the video out over the right-hand
 * bezel. If the laptop art is ever replaced, re-measure the same way.
 */
const SCREEN = {
  left: "15.755%",
  top: "7.359%",
  width: "68.774%",
  height: "66.097%",
} as const;

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Course demo playing inside the laptop mock-up.
 *
 * Muted, looping and controls-free — it is set dressing, not something a
 * visitor is meant to operate. Playback only starts once the mock-up is on
 * screen, so the page does not fetch the clip for someone who never scrolls
 * this far, and never starts at all under reduced-motion.
 */
export function LaptopVideo({
  src,
  poster,
  alt,
  objectPosition = "center",
}: {
  src: string;
  poster?: string;
  alt: string;
  /**
   * CSS object-position for the crop. The cut-out is 1.449:1, so any wider
   * clip loses width; where centring that loss would cut something important,
   * bias it here. Measure the clip before changing this.
   */
  objectPosition?: string;
}) {
  const ref = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia(MOTION_QUERY).matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          node.play().catch(() => {
            // Autoplay refused (battery saver, data saver). The poster stays.
          });
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <Image
        src="/course/laptop.png"
        alt=""
        width={1060}
        height={761}
        priority
        className="h-auto w-full"
      />

      {/*
       * The cut-out is its own clipping box. Sizing the <video> directly let a
       * mis-set object-fit paint outside the bezel and over the laptop's
       * casing; with overflow-hidden here that is structurally impossible.
       */}
      <span
        className="absolute overflow-hidden bg-black"
        style={SCREEN}
        aria-hidden={false}
      >
        <video
          ref={ref}
          src={src}
          poster={poster}
          aria-label={alt}
          muted
          loop
          playsInline
          preload="none"
          /*
           * `cover`, so the screen is filled edge to edge — a letterbox bar
           * across a laptop mock-up reads as a broken embed. Whatever `cover`
           * trims is contained by the parent's overflow-hidden.
           */
          className="size-full object-cover"
          style={{ objectPosition }}
        />
      </span>
    </div>
  );
}
