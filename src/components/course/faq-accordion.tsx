import * as React from "react";
import Image from "next/image";

export type FaqItem = {
  q: string;
  /** Rendered answer. */
  a: React.ReactNode;
  /** Plain-text answer for the FAQPage structured data. */
  text: string;
  /** Optional mark beside the question, where the original carries one. */
  icon?: React.ComponentType<{ className?: string }>;
};

/**
 * Tone tables rather than conditionals at each call site, so a new surface is
 * one entry here and cannot half-apply.
 */
const TONES = {
  light: {
    section: "border-b border-ink-200/70 bg-white",
    heading: "text-ink-950",
    shell:
      "overflow-hidden rounded-panel divide-y divide-ink-200/70 border border-ink-200/70 bg-white shadow-card",
    item: "",
    summary: "text-ink-900 hover:bg-sand-50",
    sign: "bg-sand-100 text-ink-500",
    answer: "text-ink-600",
    lead: "text-ink-600",
  },
  /**
   * Separate white cards floating on the sand field, as the CAM guide renders
   * them. Light's single bordered panel would read as one block against a
   * tinted background instead of the stack of cards the original shows.
   */
  sand: {
    section: "border-b border-ink-200/70 bg-sand-100",
    heading: "text-ink-950",
    shell: "space-y-4",
    item: "overflow-hidden rounded-panel border border-ink-200/50 bg-white shadow-card transition-shadow duration-300 hover:shadow-card-hover",
    summary: "text-brand-800 hover:bg-sand-50",
    sign: "bg-sand-100 text-ink-500",
    answer: "text-ink-600",
    lead: "text-ink-700",
  },
  dark: {
    section: "bg-brand-950",
    heading: "text-white",
    // Separate pills, not rows in one panel: on a dark field a hairline
    // divider all but disappears, so the gap has to carry the separation.
    shell: "space-y-3.5",
    item: "overflow-hidden rounded-panel ring-1 ring-white/10",
    summary: "bg-white/5 text-white hover:bg-white/9",
    sign: "bg-white/10 text-white/70",
    answer: "bg-white/3 pt-5 text-white/70 prose-flca-dark",
    lead: "text-white/70",
  },
} as const;

/**
 * Disclosure list built on <details>/<summary>.
 *
 * Native disclosure means keyboard operation, in-page find and print
 * expansion all work without a line of JavaScript — and the answers stay in
 * the DOM for search engines, which a JS-gated accordion loses.
 *
 * The dark tone renders each question as a separate raised pill rather than
 * rows sharing one panel: on a dark field, hairline dividers all but vanish,
 * so the gap has to carry the separation instead.
 */
export function FaqAccordion({
  items,
  title = "Frequently asked questions",
  tone = "light",
  icon,
  align,
  intro,
}: {
  items: readonly FaqItem[];
  /** `null` for a run that carries its own lead-in instead of a heading. */
  title?: string | null;
  tone?: keyof typeof TONES;
  /** Illustration above the heading. Its presence also centres the header. */
  icon?: { src: string; width: number; height: number };
  /** Overrides the icon-derived default, for a centred heading with no art. */
  align?: "left" | "center";
  /** Who is answering, shown above the run as a portrait beside the lead. */
  intro?: { photo: string; name: string; text: React.ReactNode };
}) {
  const t = TONES[tone];
  const centred = align ? align === "center" : Boolean(icon);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.text },
    })),
  };

  return (
    <section className={`relative overflow-hidden ${t.section}`}>
      {tone === "dark" ? (
        <div
          className="pointer-events-none absolute -top-52 left-1/2 size-208 -translate-x-1/2 rounded-full bg-brand-700/35 blur-3xl"
          aria-hidden
        />
      ) : null}

      <div className="relative container-page max-w-3xl py-16 lg:py-24">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {intro ? (
          /*
            The instructor answering the run. A portrait rather than a generic
            icon, because the original attributes the answers to a named
            person — the attribution is the point.
          */
          <div className="reveal mb-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <Image
              src={intro.photo}
              alt={intro.name}
              width={200}
              height={200}
              className="size-24 shrink-0 rounded-full object-cover ring-1 ring-ink-200/70 lg:size-28"
            />
            <p className={`text-[15px] leading-relaxed ${t.lead}`}>
              {intro.text}
            </p>
          </div>
        ) : null}

        <div className={centred ? "text-center" : undefined}>
          {icon ? (
            <Image
              src={icon.src}
              alt=""
              width={icon.width}
              height={icon.height}
              className="mx-auto mb-6 h-auto w-24 lg:w-28"
            />
          ) : null}

          {title ? (
            <h2
              className={`font-display text-[1.9rem] lg:text-[2.4rem] ${t.heading}`}
            >
              {title}
            </h2>
          ) : null}
        </div>

        <div
          className={`${title ? "mt-9" : ""} ${t.shell} ${centred ? "text-left" : ""}`}
        >
          {items.map((faq) => (
            <details key={faq.q} className={`group ${t.item}`}>
              <summary
                className={`flex cursor-pointer list-none items-center justify-between gap-5 px-6 py-5 text-[15px] font-medium transition-colors duration-200 ${t.summary}`}
              >
                <span className="flex min-w-0 items-center gap-3.5">
                  {faq.icon ? (
                    <span
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full ${t.sign}`}
                      aria-hidden
                    >
                      <faq.icon className="size-4.5" />
                    </span>
                  ) : null}
                  {faq.q}
                </span>
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-lg leading-none transition-transform duration-300 ease-out-soft group-open:rotate-45 ${t.sign}`}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <div className={`prose-flca px-6 pb-6 text-[15px] ${t.answer}`}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
