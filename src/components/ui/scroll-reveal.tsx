"use client";

import * as React from "react";

const MOBILE_QUERY = "(max-width: 63.999rem)";
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Reveals `.reveal` blocks as they scroll into view — mobile and tablet only.
 *
 * Touch devices never fire hover, so the hover polish that carries the desktop
 * layout does nothing there. This gives those viewports their own motion.
 *
 * Mounted once in the root layout and driven by a single IntersectionObserver
 * over the whole document, so no call site changes and no per-element state.
 *
 * Safety: the hidden state in CSS is scoped to `html.reveal-ready`, which is
 * only added here. If this component never runs — script blocked, hydration
 * failure, JS disabled — nothing is hidden and the page reads normally. It
 * also disconnects and unhides everything above `lg`, so resizing a desktop
 * window down and back can never strand a block at opacity 0.
 */
export function ScrollReveal() {
  React.useEffect(() => {
    const root = document.documentElement;
    const mobile = window.matchMedia(MOBILE_QUERY);
    const reduced = window.matchMedia(MOTION_QUERY);

    let observer: IntersectionObserver | null = null;

    const showAll = () => {
      root.classList.remove("reveal-ready");
      for (const el of document.querySelectorAll<HTMLElement>(".reveal")) {
        el.removeAttribute("data-revealed");
      }
    };

    const start = () => {
      if (!mobile.matches || reduced.matches || !("IntersectionObserver" in window)) {
        showAll();
        return;
      }

      root.classList.add("reveal-ready");

      observer = new IntersectionObserver(
        (entries, obs) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).dataset.revealed = "true";
            obs.unobserve(entry.target);
          }
        },
        /*
         * No negative bottom margin and a zero threshold, deliberately.
         *
         * Shrinking the root (e.g. `0px 0px -12% 0px`) makes the reveal fire
         * a beat earlier, but any block sitting inside that band at maximum
         * scroll can never intersect — it stays at opacity 0 forever. A
         * percentage threshold has the same problem for blocks taller than
         * the viewport. Triggering on the first pixel is always reachable.
         */
        { rootMargin: "0px", threshold: 0 },
      );

      for (const el of document.querySelectorAll<HTMLElement>(".reveal")) {
        // Anything already on screen at load shows immediately — no fade-in
        // on content the visitor is looking at.
        const box = el.getBoundingClientRect();
        if (box.top < window.innerHeight * 0.9) el.dataset.revealed = "true";
        else observer.observe(el);
      }
    };

    const restart = () => {
      observer?.disconnect();
      observer = null;
      showAll();
      start();
    };

    start();
    mobile.addEventListener("change", restart);
    reduced.addEventListener("change", restart);

    return () => {
      observer?.disconnect();
      mobile.removeEventListener("change", restart);
      reduced.removeEventListener("change", restart);
      showAll();
    };
  }, []);

  return null;
}
