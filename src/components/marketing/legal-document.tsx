import * as React from "react";
import Link from "next/link";

/** Inline link, styled once for a whole policy. */
export function LegalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(href.startsWith("http")
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
      className="text-brand-700 underline underline-offset-4 transition-colors duration-200 hover:text-brand-900"
    >
      {children}
    </a>
  );
}

export type LegalBlock =
  | { kind: "p"; body: React.ReactNode }
  /** Lettered or named subsection with its own points. */
  | {
      kind: "group";
      heading?: string;
      body?: React.ReactNode;
      items?: readonly React.ReactNode[];
    }
  | { kind: "list"; items: readonly React.ReactNode[] };

export type LegalSection = { title: string; blocks: readonly LegalBlock[] };

/** Anchor for a section, so the contents rail can address it. */
const anchor = (i: number) => `section-${i + 1}`;

/**
 * A long policy document: navy header, sticky numbered contents, numbered
 * sections on a narrow measure.
 *
 * Shared by the privacy policy and the terms of use — they are the same shape
 * of document, and a legal page that looks different from its sibling reads as
 * a different company's.
 *
 * The contents rail is the point: nobody reads these top to bottom, they
 * arrive hunting one clause, so every section is addressable and one click
 * away.
 */
export function LegalDocument({
  breadcrumb,
  title,
  effective,
  lead,
  sections,
}: {
  breadcrumb: string;
  title: string;
  /** "Effective Date: January 01, 2026", shown as a pill under the title. */
  effective: string;
  /** Preamble above section 1, where the document opens with one. */
  lead?: string;
  sections: readonly LegalSection[];
}) {
  return (
    <>
      <section className="relative overflow-hidden bg-brand-950">
        <span
          className="pointer-events-none absolute -top-40 -right-24 size-112 rounded-full bg-brand-700/40 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page py-16 lg:py-20">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-1.5 text-sm text-white/50">
              <li>
                <Link
                  href="/"
                  className="transition-colors duration-200 hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li className="text-white/90" aria-current="page">
                {breadcrumb}
              </li>
            </ol>
          </nav>

          <h1 className="reveal max-w-3xl font-display text-[2rem] leading-[1.1] font-light text-white lg:text-[2.9rem]">
            {title}
          </h1>

          <p className="reveal mt-6 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-[12.5px] tracking-[0.08em] text-white/80">
            {effective}
          </p>
        </div>
      </section>

      <section className="border-b border-ink-200/70 bg-white">
        <div className="container-page grid gap-12 py-14 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <nav
            aria-label="Sections"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <p className="text-[10px] tracking-[0.24em] text-ink-400 uppercase">
              Contents
            </p>
            <ol className="mt-5 space-y-2.5">
              {sections.map((section, i) => (
                <li key={section.title} className="flex gap-3">
                  <span className="text-[12px] text-ink-300 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <a
                    href={`#${anchor(i)}`}
                    className="text-[13px] leading-snug text-ink-500 transition-colors duration-200 hover:text-brand-700"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="max-w-3xl min-w-0 space-y-14">
            {lead ? (
              <p className="reveal border-l-2 border-brand-200 pl-6 text-[15px] leading-relaxed text-ink-600">
                {lead}
              </p>
            ) : null}

            {sections.map((section, i) => (
              <section
                key={section.title}
                id={anchor(i)}
                className="reveal scroll-mt-28"
              >
                <h2 className="flex items-baseline gap-4 font-display text-[1.35rem] leading-tight text-ink-950 lg:text-[1.6rem]">
                  <span className="text-[13px] text-brand-400 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.title}
                </h2>

                <span
                  className="mt-5 block h-px w-full bg-ink-200/70"
                  aria-hidden
                />

                <div className="mt-6 space-y-5">
                  {section.blocks.map((block, bi) => {
                    if (block.kind === "p") {
                      return (
                        <p
                          key={bi}
                          className="text-[15px] leading-relaxed text-ink-600"
                        >
                          {block.body}
                        </p>
                      );
                    }

                    if (block.kind === "list") {
                      return <LegalPoints key={bi} items={block.items} />;
                    }

                    return (
                      <div
                        key={bi}
                        className="rounded-card bg-sand-50 p-5 lg:p-6"
                      >
                        {block.heading ? (
                          <h3 className="text-[13px] font-medium tracking-[0.06em] text-ink-900">
                            {block.heading}
                          </h3>
                        ) : null}
                        {block.body ? (
                          <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
                            {block.body}
                          </p>
                        ) : null}
                        {block.items?.length ? (
                          <div className="mt-3">
                            <LegalPoints items={block.items} />
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function LegalPoints({ items }: { items: readonly React.ReactNode[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
            aria-hidden
          />
          <span className="text-[15px] leading-relaxed text-ink-700">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
}
