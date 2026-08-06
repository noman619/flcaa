import * as React from "react";
import { Download } from "lucide-react";
import { ButtonLink, buttonVariants } from "@/components/ui/button";
import { FreeTrialDialog } from "@/components/marketing/free-trial-dialog";
// One tone table for both step sections, so the number that is gold in the
// summary graphic is gold again in the detailed run below it.
import { STEP_TONES } from "@/components/marketing/guide-step-cards";

/**
 * A step's call to action: either a link, or a trigger that opens the
 * free-trial dialog (`trial` carries the course name shown inside it).
 */
export type GuideStepAction =
  | { kind?: "link"; label: string; href: string; variant?: "primary" | "outline" }
  | { kind: "trial"; label: string; course: string };

/**
 * A link inside step copy. External targets open in a new tab; internal ones
 * navigate normally. Shared so every guide styles its inline links the same.
 */
export function GuideLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className="text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
    >
      {children}
    </a>
  );
}

/**
 * The bold "Cost: $x" opener each item of a cost breakdown carries, with the
 * payee clause left plain. Shared by both licence-cost guides.
 */
export function StepCost({
  amount,
  payee,
}: {
  amount: string;
  payee: string;
}) {
  return (
    <>
      <strong className="text-ink-900">Cost: {amount}</strong>
      {payee}
    </>
  );
}

export type GuideStep = {
  title: string;
  /** Paragraphs. Rich nodes so a step can carry the original's inline links. */
  body: readonly React.ReactNode[];
  /** Bulleted list under the paragraphs, where the original runs one. */
  bullets?: readonly React.ReactNode[];
  actions?: readonly GuideStepAction[];
};

export type GuideStepsProps = {
  /**
   * Heading above the run. Rendered inside this section rather than by the
   * page, so the type sits on the same field as the steps — a heading in its
   * own tinted band above reads as a strip of colour with nothing in it.
   */
  title?: string;
  /** Omitted on guides that open straight into the numbered run. */
  eligibility?: {
    title: string;
    /** Omitted where the list needs no setting up. */
    intro?: string;
    /** Rich nodes so a guide can carry the original's inline emphasis. */
    items: readonly React.ReactNode[];
    /**
     * Word between the items, where they are alternatives rather than a list
     * to satisfy together — the broker guide's "or".
     */
    separator?: string;
    note?: string;
  };
  /** Paragraphs above the numbered run, where the original sets one up. */
  lead?: readonly React.ReactNode[];
  steps: readonly GuideStep[];
  /**
   * Optional handout offered under the run — the original's "Download the 4
   * Steps". Placed after the list rather than inside the last step: it covers
   * every step, not just that one.
   */
  download?: { label: string; href: string; fileName?: string };
  /**
   * Word above the number in each badge. `null` leaves the number alone, for
   * guides whose sections are stages to read rather than steps to perform.
   */
  stepLabel?: string | null;
};

/**
 * Second section of a ported guide: the eligibility check, then the numbered
 * path to the licence.
 *
 * Built as a single-spine timeline rather than the original's left/right
 * zig-zag. Alternating sides forces half the steps to be right-aligned, which
 * gives every other paragraph a ragged left edge — the edge the eye returns to
 * on each line — and it strands the badge and its text at opposite ends of a
 * wide screen. One spine keeps every step on the same reading axis, and the
 * numbers still carry the sequence.
 */
export function GuideSteps({
  title,
  eligibility,
  lead,
  steps,
  download,
  stepLabel = "Step",
}: GuideStepsProps) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        {title ? (
          <div className="reveal mx-auto mb-12 max-w-3xl text-center lg:mb-16">
            <h2 className="font-display text-[1.8rem] leading-tight text-ink-950 lg:text-[2.35rem]">
              {title}
            </h2>
            <span
              className="mx-auto mt-6 block h-px w-16 bg-brand-400"
              aria-hidden
            />
          </div>
        ) : null}

        {eligibility ? (
        <div className="mx-auto max-w-3xl rounded-panel border border-ink-200/70 bg-sand-50 p-8 lg:p-10">
          <h2 className="font-display text-2xl text-ink-950 lg:text-[1.75rem]">
            {eligibility.title}
          </h2>
          {eligibility.intro ? (
            <p className="mt-3 text-[15px] text-ink-600">{eligibility.intro}</p>
          ) : null}

          <ul className="mt-6 space-y-3">
            {eligibility.items.map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && eligibility.separator ? (
                  <li className="pl-6 text-[13px] tracking-[0.16em] text-ink-500 uppercase">
                    {eligibility.separator}
                  </li>
                ) : null}
                <li className="flex items-start gap-3">
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-600"
                    aria-hidden
                  />
                  <span className="text-[15px] leading-relaxed text-ink-800">
                    {item}
                  </span>
                </li>
              </React.Fragment>
            ))}
          </ul>

          {eligibility.note ? (
            <p className="mt-6 border-t border-ink-200/70 pt-5 text-sm leading-relaxed text-ink-600">
              {eligibility.note}
            </p>
          ) : null}
        </div>
        ) : null}

        {lead?.length ? (
          <div className="reveal mx-auto max-w-3xl space-y-4">
            {lead.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-ink-600">
                {paragraph}
              </p>
            ))}
          </div>
        ) : null}

        <ol
          className={`mx-auto max-w-3xl space-y-10 ${
            eligibility || lead?.length ? "mt-16 lg:mt-20" : ""
          }`}
        >
          {steps.map((step, i) => {
            const tone = STEP_TONES[i % STEP_TONES.length];
            const isLast = i === steps.length - 1;

            return (
              <li key={step.title} className="reveal relative pl-24 lg:pl-32">
                {/* badge, sitting on the spine */}
                <span
                  className={`absolute top-0 left-0 flex size-18 items-center justify-center rounded-full border border-dashed p-1.5 lg:size-22 ${tone.ring}`}
                >
                  <span
                    className={`flex size-full flex-col items-center justify-center rounded-full text-white ${tone.block}`}
                  >
                    {stepLabel ? (
                      <span className="text-[9px] tracking-[0.2em] text-white/70 uppercase">
                        {stepLabel}
                      </span>
                    ) : null}
                    <span className="font-display text-2xl leading-none lg:text-[1.75rem]">
                      {i + 1}
                    </span>
                  </span>
                </span>

                {/* spine: runs from this badge to the next one */}
                {!isLast ? (
                  <span
                    className="absolute top-20 -bottom-10 left-9 w-px bg-ink-200 lg:top-24 lg:left-11"
                    aria-hidden
                  />
                ) : null}

                <div className="rounded-panel border border-ink-200/70 bg-white p-7 shadow-card lg:p-8">
                  <h3 className="font-display text-xl text-ink-950 lg:text-2xl">
                    {step.title}
                  </h3>

                  <span
                    className={`mt-4 block h-0.5 w-12 rounded-full ${tone.rule}`}
                    aria-hidden
                  />

                  <div className="mt-5 space-y-4">
                    {step.body.map((paragraph, pi) => (
                      <p
                        key={pi}
                        className="text-[15px] leading-relaxed text-ink-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {step.bullets?.length ? (
                    <ul className="mt-5 space-y-3">
                      {step.bullets.map((bullet, bi) => (
                        <li key={bi} className="flex items-start gap-3">
                          <span
                            className={`mt-2 size-1.5 shrink-0 rounded-full ${tone.rule}`}
                            aria-hidden
                          />
                          <span className="text-[15px] leading-relaxed text-ink-700">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {step.actions?.length ? (
                    <div className="mt-7 flex flex-wrap gap-3">
                      {step.actions.map((action) =>
                        action.kind === "trial" ? (
                          <FreeTrialDialog
                            key={action.label}
                            label={action.label}
                            course={action.course}
                          />
                        ) : (
                          <ButtonLink
                            key={action.label}
                            href={action.href}
                            variant={action.variant ?? "primary"}
                          >
                            {action.label}
                          </ButtonLink>
                        ),
                      )}
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>

        {download ? (
          <div className="reveal mt-12 flex justify-center lg:mt-14">
            {/*
              A plain <a>, not ButtonLink: `download` is not a Link prop, and
              routing a static file through the client router gains nothing.
            */}
            <a
              href={download.href}
              download={download.fileName ?? ""}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              {download.label}
              <Download aria-hidden />
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
