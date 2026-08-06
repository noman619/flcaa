import * as React from "react";

/**
 * Band tints, in the original's order: green, red, navy, gold.
 * `rule` is the hairline under the title, drawn in the band's own light.
 */
const TONES = [
  { band: "bg-leaf-500", numeral: "text-white/25", rule: "bg-white/25" },
  { band: "bg-accent-500", numeral: "text-white/25", rule: "bg-white/25" },
  { band: "bg-brand-800", numeral: "text-white/20", rule: "bg-white/20" },
  { band: "bg-gold-500", numeral: "text-white/30", rule: "bg-white/30" },
] as const;

export type StepBand = {
  title: string;
  /** Rich node so a step can carry the original's inline links. */
  body: React.ReactNode;
};

/**
 * Full-width numbered bands — the renewal path as the original colours it.
 *
 * One reading axis: the numeral sits in its own column and the title and copy
 * share a single left edge beside it, so the eye returns to the same place on
 * every line. (The original centres the title and right-aligns the copy, which
 * gives each band three different edges and nothing to read down.)
 *
 * The numeral is set large and translucent rather than on a tinted plate — it
 * marks position without competing with the sentence next to it.
 */
export function StepBands({
  title,
  steps,
}: {
  title: string;
  steps: readonly StepBand[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <h2 className="reveal text-center font-display text-[1.8rem] leading-tight text-brand-600 lg:text-[2.35rem]">
          {title}
        </h2>

        <ol className="reveal mx-auto mt-10 max-w-4xl overflow-hidden rounded-panel shadow-pop lg:mt-14">
          {steps.map((step, i) => {
            const tone = TONES[i % TONES.length];
            return (
              <li
                key={step.title}
                className={`group grid items-start gap-x-6 gap-y-3 px-7 py-8 transition-[padding] duration-300 ease-out-soft sm:grid-cols-[auto_minmax(0,1fr)] lg:gap-x-10 lg:px-12 lg:py-10 ${tone.band}`}
              >
                <p
                  className={`font-display text-5xl leading-none tabular-nums lg:text-6xl ${tone.numeral} transition-colors duration-300 group-hover:text-white/70`}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                <div className="min-w-0">
                  <h3 className="text-[13px] font-medium tracking-[0.16em] text-white uppercase lg:text-sm">
                    {step.title}
                  </h3>

                  <span
                    className={`mt-4 block h-px w-10 transition-[width] duration-500 ease-out-soft group-hover:w-16 ${tone.rule}`}
                    aria-hidden
                  />

                  <p className="mt-4 max-w-2xl text-[14.5px] leading-relaxed text-white/85">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
