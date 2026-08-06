import {
  ClipboardCheck,
  FileCheck2,
  Fingerprint,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

/**
 * The four step colours, matching the original guide graphics: gold, navy,
 * green, red. Gold is not a logo hue and is scoped to these runs only — see
 * the --color-gold-* note in globals.css.
 */
export const STEP_TONES = [
  { block: "bg-gold-500", icon: "text-gold-600", ring: "border-gold-300", rule: "bg-gold-200" },
  { block: "bg-brand-600", icon: "text-brand-700", ring: "border-brand-300", rule: "bg-brand-200" },
  { block: "bg-leaf-600", icon: "text-leaf-700", ring: "border-leaf-300", rule: "bg-leaf-200" },
  { block: "bg-accent-700", icon: "text-accent-700", ring: "border-accent-300", rule: "bg-accent-200" },
] as const;

export type StepCard = { label: string; icon: LucideIcon };

/**
 * The four steps to a Florida licence. Identical wording on the real estate
 * and CAM guides on the original, so they share one definition here rather
 * than two that can drift.
 */
export const LICENSE_STEP_CARDS: readonly StepCard[] = [
  { label: "Take and Pass a Pre-License Course", icon: GraduationCap },
  { label: "Get Your Fingerprints Taken", icon: Fingerprint },
  { label: "Submit Your Application", icon: FileCheck2 },
  { label: "Schedule and Pass the State Exam", icon: ClipboardCheck },
];

/**
 * The four-step summary graphic from the top of a guide.
 *
 * Rebuilt as markup rather than shipped as a bitmap: it stays sharp at any
 * density, the labels are real text for search and screen readers, and the
 * colours come from the palette instead of being baked into a PNG.
 *
 * Two columns on a phone, four from `sm` — four 90px columns on a 360px screen
 * would leave the labels unreadable.
 */
export function GuideStepCards({ steps }: { steps: readonly StepCard[] }) {
  return (
    <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-panel bg-ink-200/70 shadow-card sm:grid-cols-4">
      {steps.map((step, i) => {
        const tone = STEP_TONES[i % STEP_TONES.length];
        const Icon = step.icon;

        return (
          <li key={step.label} className="flex flex-col bg-white">
            <div className={`${tone.block} px-4 py-5 text-center text-white`}>
              <p className="text-[10px] tracking-[0.2em] text-white/75 uppercase">
                Step
              </p>
              <p className="mt-1 font-display text-4xl leading-none">{i + 1}</p>
            </div>

            <div className="flex flex-1 flex-col gap-4 px-4 py-5">
              <Icon
                className={`size-7 ${tone.icon}`}
                strokeWidth={1.25}
                aria-hidden
              />
              <p className="text-[13px] leading-snug font-medium text-ink-900">
                {step.label}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
