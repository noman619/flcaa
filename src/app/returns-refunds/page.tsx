import type { Metadata } from "next";
import { RefundForm } from "./refund-form";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/returns                    */
/* -------------------------------------------------------------------------- */

const PAGE = {
  title: "Returns and Refunds",
  intro: "Please complete the form below to request a refund",
  formTitle: "Order Information",
} as const;

/**
 * Section 2 — the policy itself. Two of the four conditions carry an underline
 * in the original; kept, since they are the figures a reader is scanning for.
 */
const POLICY = {
  title: "Refund Policy – Prolicense Florida",
  lead: "At Prolicense Florida, we are committed to providing high-quality online education. If you are not satisfied with your course, you may request a refund under the following conditions:",
  conditions: [
    <>
      Refund requests must be made{" "}
      <span className="underline underline-offset-4">
        within 30 days of the original purchase date
      </span>
      .
    </>,
    <>
      The course must be{" "}
      <span className="underline underline-offset-4">
        less than 25% completed
      </span>{" "}
      at the time of the refund request.
    </>,
    <>
      Refunds will not be granted if more than 25% of the course has been
      completed, regardless of the time since purchase.
    </>,
    <>
      Only one refund is allowed per student. Additional refund requests for
      future enrollments will not be accepted.
    </>,
  ],
  close:
    "We appreciate your business and are here to support your learning journey.",
} as const;

export const metadata: Metadata = {
  title: PAGE.title,
  description:
    "Request a refund for a Prolicense Florida course — complete the order information form and our support team will reply within one business day.",
  alternates: { canonical: "/returns-refunds" },
};

export default function ReturnsPage() {
  return (
    <>
      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page py-16 lg:py-20">
          <h1 className="reveal font-display text-[2.4rem] leading-none text-ink-950 lg:text-[3.4rem]">
            {PAGE.title}
          </h1>
          <p className="reveal mt-6 text-[15px] text-brand-700">{PAGE.intro}</p>
        </div>
      </section>

      {/* --------------------------- order information ------------------------
          The form sits on its own tinted field, as on the original: it is the
          page's one job, and a white form on a white page has nothing holding
          it together. */}
      <section className="border-b border-ink-200/70 bg-sand-100">
        <div className="container-page py-14 lg:py-20">
          <h2 className="reveal font-display text-[1.7rem] leading-tight text-ink-950 lg:text-[2.1rem]">
            {PAGE.formTitle}
          </h2>

          <div className="reveal mt-10 rounded-panel border border-ink-200/60 bg-white p-7 shadow-card lg:p-10">
            <RefundForm />
          </div>
        </div>
      </section>

      {/* ------------------------------ the policy ---------------------------
          Set on a narrow measure with the four conditions numbered: they are
          the test a request is judged against, and a numbered list makes it
          countable — "which of the four am I failing?" — where bullets only
          make it long. */}
      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page max-w-3xl py-16 lg:py-20">
          <h2 className="reveal font-display text-[1.5rem] leading-tight text-brand-700 lg:text-[1.8rem]">
            {POLICY.title}
          </h2>

          <p className="reveal mt-6 text-[15px] leading-relaxed text-ink-600">
            {POLICY.lead}
          </p>

          <ol className="reveal mt-8 space-y-4">
            {POLICY.conditions.map((condition, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[11px] font-medium text-brand-700 tabular-nums">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-ink-700">
                  {condition}
                </span>
              </li>
            ))}
          </ol>

          <p className="reveal mt-10 border-t border-ink-200/70 pt-8 text-[15px] leading-relaxed text-ink-600">
            {POLICY.close}
          </p>
        </div>
      </section>
    </>
  );
}
