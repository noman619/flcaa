import * as React from "react";


export type NextStep = {
  title: string;
  /** Rich node so the original's inline links survive. */
  body: React.ReactNode;
  icon: { src: string; alt?: string };
};

/**
 * "You Have Passed the State Exam. Now What?" — a titled card listing what to
 * do once the licence is in hand.
 *
 * One card with a banded head rather than three loose feature blocks: these
 * steps only make sense under that question, and detaching them from it loses
 * the framing. The band carries the heading so the card reads as a single
 * object at a glance.
 */
export function NextSteps({
  title,
  steps,
}: {
  title: string;
  steps: readonly NextStep[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-sand-50">
      <div className="container-page py-16 lg:py-24">
        <div className="reveal mx-auto max-w-4xl overflow-hidden rounded-hero bg-white shadow-float ring-1 ring-ink-200/70">
          {/* head */}
          <div className="relative overflow-hidden bg-linear-to-r from-brand-900 to-brand-700 px-8 py-7 lg:px-10 lg:py-8">
            <div
              className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-white/6 blur-2xl"
              aria-hidden
            />

            <div className="relative flex items-center justify-between gap-6">
              <h2 className="font-display text-[1.45rem] leading-tight font-light text-white lg:text-[1.9rem]">
                {title}
              </h2>

              <span
                className="hidden size-14 shrink-0 items-center justify-center rounded-full bg-white/10 font-display text-2xl text-white/80 ring-1 ring-white/20 sm:flex"
                aria-hidden
              >
                ?
              </span>
            </div>
          </div>

          {/* steps */}
          <ul className="divide-y divide-ink-200/70">
            {steps.map((step) => (
              <li
                key={step.title}
                className="group grid gap-5 px-8 py-8 transition-colors duration-300 hover:bg-sand-50 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-7 lg:px-10 lg:py-9"
              >
                <span className="flex size-16 shrink-0 items-center justify-center rounded-panel bg-sand-50 ring-1 ring-ink-200/70 transition-colors duration-300 group-hover:bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={step.icon.src}
                    alt={step.icon.alt ?? ""}
                    width={64}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    className="size-10"
                  />
                </span>

                <div className="min-w-0">
                  <h3 className="font-display text-lg text-brand-800 lg:text-xl">
                    {step.title}
                  </h3>
                  <div className="prose-flca mt-3 text-[15px] text-ink-600">
                    {step.body}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
