import type { Metadata } from "next";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*  Copy ported verbatim from https://www.flcaa.com/rea-estate-login-page      */
/*  The slug keeps the original's typo so inbound links still resolve.         */
/* -------------------------------------------------------------------------- */

/**
 * The three programmes, in the original's order and with its button colours.
 *
 * It sends the first two to its LMS and the third to RECampus; we host
 * authentication ourselves, so each carries its programme through to the sign
 * in form as ?course= — the form names it back to the student, which is the
 * only thing the split does for them.
 */
const PROGRAMMES = [
  {
    label: "Pre-Licensing Course & Exam Prep:",
    href: "/login?course=re-pre",
    tone: "bg-gold-500 hover:bg-gold-600",
  },
  {
    label: "Post-Licensing & Continuing Education:",
    href: "/login?course=re-post",
    tone: "bg-leaf-500 hover:bg-leaf-600",
  },
  {
    label: "Broker Licensing & Post:",
    href: "/login?course=re-broker",
    tone: "bg-brand-300 hover:bg-brand-400",
  },
] as const;

export const metadata: Metadata = {
  title: "Real Estate Login",
  description:
    "Sign in to your Prolicense Florida real estate course — pre-licensing, post-licensing, continuing education or broker.",
  alternates: { canonical: "/rea-estate-login-page" },
  robots: { index: false, follow: true },
};

export default function RealEstateLoginPage() {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <span
        className="pointer-events-none absolute -top-32 left-1/3 size-112 rounded-full bg-brand-800/40 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page py-16 lg:py-24">
        <h1 className="reveal font-display text-[1.8rem] leading-tight text-white lg:text-[2.2rem]">
          Real Estate Login
        </h1>

        <ul className="reveal mt-12 max-w-2xl space-y-8 lg:mt-14 lg:space-y-10">
          {PROGRAMMES.map((programme) => (
            <li
              key={programme.label}
              className="flex flex-wrap items-center justify-between gap-5"
            >
              <span className="text-[15px] text-white/90 lg:text-[17px]">
                {programme.label}
              </span>

              <Link
                href={programme.href}
                className={`inline-flex h-10 min-w-32 items-center justify-center rounded-md px-6 text-[12.5px] font-medium tracking-[0.14em] text-ink-950 uppercase transition-[transform,background-color] duration-250 ease-out-soft hover:-translate-y-px ${programme.tone}`}
              >
                Login
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
