import * as React from "react";

export type Tip = {
  /** Short heading, e.g. "Eliminate wrong answers". */
  title: string;
  body: string;
};

/**
 * A numbered run of advice — the "Tips for Passing Your Florida Real Estate
 * Exam" block, and anything shaped like it.
 *
 * Two columns rather than the original's single long list: seven paragraphs
 * stacked full-width give a line length far past comfortable reading, and the
 * reader has to scroll past all of it to reach the next section. The numbers
 * carry the order, so splitting the run across columns costs nothing.
 */
export function TipsBand({
  eyebrow,
  title,
  intro,
  tips,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  tips: readonly Tip[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/70 bg-sand-50">
      {/* one soft wash, so the band reads as its own surface without a border */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 size-208 -translate-x-1/2 rounded-full bg-gold-200/25 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page py-20 lg:py-28">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

          <h2 className="mt-4 font-display text-[2rem] leading-[1.1] text-ink-950 lg:text-[2.6rem]">
            {title}
          </h2>

          {intro ? (
            <p className="mt-5 text-[15px] leading-relaxed text-ink-600">
              {intro}
            </p>
          ) : null}
        </div>

        <ol className="mt-14 grid gap-x-10 gap-y-8 lg:mt-20 lg:grid-cols-2 lg:gap-x-14">
          {tips.map((tip, i) => (
            <li
              key={tip.title}
              className="reveal group relative min-w-0 rounded-panel border border-ink-200/70 bg-white/80 p-7 shadow-card backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-card-hover lg:p-8"
            >
              <div className="flex items-baseline gap-4">
                <span
                  className="font-display text-3xl leading-none text-gold-500/70 transition-colors duration-300 group-hover:text-gold-600 lg:text-4xl"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3 className="font-display text-lg text-ink-950 lg:text-xl">
                  <span className="sr-only">{`Tip ${i + 1}: `}</span>
                  {tip.title}
                </h3>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-ink-600">
                {tip.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
