import type { Metadata } from "next";
import { Mail, MapPin, Moon, Phone, Sun } from "lucide-react";
import { ContactForm } from "./contact-form";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/contact                    */
/* -------------------------------------------------------------------------- */

/**
 * Section 2 — support hours. Each day carries two windows: a daytime shift and
 * an evening one, which is why they are a list per row rather than one string.
 */
const SUPPORT_HOURS = [
  { days: "Mon - Thu", windows: ["8:30 am – 6:00 pm", "8:30 pm – 9:30 pm"] },
  { days: "Friday", windows: ["8:30 am – 5:30 pm", "8:00 pm – 9:00 pm"] },
  { days: "Sat-Sun", windows: ["11:00 am – 5:00 pm", "8:00 pm – 9:00 pm"] },
] as const;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call 866-411-8470 or email info@flcaa.com — Prolicense Florida answers questions about licensing requirements, course hours and deadlines.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const socials = SOCIAL_LINKS.filter((s) => s.url);

  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <h1 className="reveal font-display text-[2.4rem] leading-none text-ink-950 lg:text-[3.4rem]">
          Contact
        </h1>

        {/*
          Details left, form right — the original's split. The details column
          is deliberately spare: three ways to reach a person, nothing to read
          past before writing the message.
        */}
        <div className="mt-14 grid gap-12 lg:mt-16 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-20">
          <div className="reveal">
            <ul className="space-y-7">
              <li className="flex items-center gap-4">
                <span className="icon-tile size-11 rounded-icon">
                  <Phone className="size-4.5" aria-hidden />
                </span>
                <a
                  href={SITE.phoneHref}
                  className="text-[15px] text-ink-800 transition-colors duration-200 hover:text-brand-700"
                >
                  {SITE.phone}
                </a>
              </li>

              <li className="flex items-center gap-4">
                <span className="icon-tile size-11 rounded-icon">
                  <Mail className="size-4.5" aria-hidden />
                </span>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-[15px] text-ink-800 transition-colors duration-200 hover:text-brand-700"
                >
                  {SITE.email}
                </a>
              </li>

              <li className="flex items-center gap-4">
                <span className="icon-tile size-11 rounded-icon">
                  <MapPin className="size-4.5" aria-hidden />
                </span>
                <span className="text-[15px] leading-relaxed text-ink-600">
                  {SITE.address}
                </span>
              </li>
            </ul>

            <ul className="mt-10 flex flex-wrap items-center gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex size-11 items-center justify-center rounded-icon border border-ink-200 text-ink-600 transition-[transform,border-color,color] duration-250 ease-out-soft hover:-translate-y-0.5 hover:border-ink-300 hover:text-brand-700"
                  >
                    <SocialMark label={social.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* ---------------------------- support hours --------------------------
          A card per day range on a dark field, rather than a two-column table.
          Support runs two shifts a day, and the table made that read as four
          loose numbers per row; here each shift is its own line with a mark
          for the time of day, so a visitor checking "can I call now?" answers
          it from the icons alone. */}
      <div className="relative overflow-hidden bg-brand-950">
        <span
          className="pointer-events-none absolute -top-32 left-1/4 size-112 rounded-full bg-brand-700/40 blur-3xl"
          aria-hidden
        />

        <div className="relative container-page py-16 lg:py-24">
          <div className="reveal text-center">
            <p className="text-[10px] tracking-[0.28em] text-white/40 uppercase">
              When we answer
            </p>
            <h2 className="mt-4 font-display text-[1.9rem] leading-tight font-light text-white lg:text-[2.4rem]">
              Customer Support Hours
            </h2>
          </div>

          <dl className="reveal mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3 lg:mt-16">
            {SUPPORT_HOURS.map((row) => (
              <div
                key={row.days}
                className="rounded-panel bg-white/4 p-7 ring-1 ring-white/10 transition-[transform,background-color] duration-300 ease-out-soft hover:-translate-y-1 hover:bg-white/7"
              >
                <dt className="text-[11px] font-medium tracking-[0.18em] text-gold-300 uppercase">
                  {row.days}
                </dt>

                <dd className="mt-5 space-y-3.5">
                  {row.windows.map((window, i) => {
                    /* First window is the daytime shift, second the evening —
                       true for every row the original lists. */
                    const Icon = i === 0 ? Sun : Moon;
                    return (
                      <p
                        key={window}
                        className="flex items-center gap-3 text-[14.5px] text-white/85 tabular-nums"
                      >
                        <Icon
                          className="size-4 shrink-0 text-white/35"
                          aria-hidden
                        />
                        {window}
                      </p>
                    );
                  })}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/**
 * Brand marks as inline paths — lucide-react dropped its brand icon set, and
 * these are trademarks rather than UI icons anyway. Same set as the footer.
 */
const SOCIAL_PATHS: Record<string, string> = {
  Facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z",
  YouTube:
    "M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z",
  LinkedIn:
    "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.4h3.4V21h-3.4V8.4Zm5.75 0h3.26v1.72h.05c.45-.86 1.57-1.77 3.23-1.77 3.45 0 4.09 2.27 4.09 5.23V21h-3.4v-5.72c0-1.36-.03-3.12-1.9-3.12-1.9 0-2.19 1.49-2.19 3.02V21H9V8.4Z",
  Instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.18a6.66 6.66 0 1 0 0 13.32 6.66 6.66 0 0 0 0-13.32Zm0 10.98a4.32 4.32 0 1 1 0-8.64 4.32 4.32 0 0 1 0 8.64Zm8.48-11.24a1.56 1.56 0 1 1-3.11 0 1.56 1.56 0 0 1 3.11 0Z",
};

function SocialMark({ label }: { label: string }) {
  const path = SOCIAL_PATHS[label];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" className="size-4.5 fill-current" aria-hidden>
      <path d={path} />
    </svg>
  );
}
