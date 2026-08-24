"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { Select } from "@/components/ui/input";
import { AuthForm } from "../auth-form";

/** Where the original sends CAM and board member students to sign in. */
const LMS_LOGIN = "https://lms.flcaa.com/plus/login";

/** Where the original sends broker students. */
const RECAMPUS_LOGIN = "https://home.recampus.com/portal/caa/login";

/**
 * The three options the original's login page offers, in its order and
 * wording. CAM and board members leave for the LMS immediately, as they do
 * there; real estate opens a second choice.
 */
export const LOGIN_TRACKS = [
  { key: "cam", label: "CAM (Community Association Manager)", href: LMS_LOGIN },
  { key: "real-estate", label: "Real Estate Agent & Broker" },
  { key: "board-members", label: "Association Board Members", href: LMS_LOGIN },
] as const;

/**
 * The real estate programmes, in the original's order and button colours.
 * Each runs on its own system, so every one of these leaves the site.
 */
const RE_PROGRAMMES = [
  {
    label: "Pre-Licensing Course & Exam Prep",
    href: LMS_LOGIN,
    tone: "bg-gold-500 text-ink-950 hover:bg-gold-300",
  },
  {
    label: "Post-Licensing & Continuing Education",
    href: LMS_LOGIN,
    tone: "bg-leaf-500 text-white hover:bg-leaf-400",
  },
  {
    label: "Broker Licensing & Post",
    href: RECAMPUS_LOGIN,
    tone: "bg-brand-300 text-ink-950 hover:bg-brand-200",
  },
] as const;

export function CoursePicker({
  next,
  initialError,
  initialEmail = "",
}: {
  next: string;
  initialError?: string;
  initialEmail?: string;
}) {
  /*
   * Held in component state, not the URL: the panel is a step in a choice
   * someone is making right now, so a refresh or a trip through the navbar
   * should put them back at the question, not halfway through the answer.
   */
  const [showProgrammes, setShowProgrammes] = React.useState(false);

  /*
   * Every option leaves for an external system, so the form would be
   * unreachable for someone the proxy bounced out of /dashboard, /admin or
   * /checkout. They arrive with ?next=, which is proof they were already
   * headed somewhere on this site: show them the form instead.
   */
  if (next.length > 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-3xl">Hey, Good to see you again!</h1>
          <p className="mt-2 text-sm text-ink-500">
            Sign in to continue. One account covers every course you own.
          </p>
        </div>

        <AuthForm
          next={next}
          initialError={initialError}
          initialEmail={initialEmail}
        />
      </div>
    );
  }

  function select(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    const track = LOGIN_TRACKS.find((t) => t.key === value);

    if (track && "href" in track) {
      /*
       * The LMS is a separate system, so it opens in its own tab and this
       * page stays where it is. Reset the field: leaving it on a choice the
       * visitor cannot see the result of makes the page look stuck.
       */
      window.open(track.href, "_blank", "noopener,noreferrer");
      event.target.value = "";
      setShowProgrammes(false);
      return;
    }

    setShowProgrammes(value === "real-estate");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl">Hey, Good to see you again!</h1>
        <p className="mt-2 text-sm text-ink-500">
          Choose what you study with us. You&apos;ll sign in once — one account
          covers every course you own.
        </p>
      </div>

      {initialError ? (
        <p className="mb-6 rounded-2xl bg-accent-50 px-4 py-3 text-sm text-accent-800 ring-1 ring-accent-200/70 ring-inset">
          {initialError}
        </p>
      ) : null}

      <label
        htmlFor="course"
        className="mb-2 block text-[11px] tracking-[0.2em] text-ink-500 uppercase"
      >
        Select your course to login
      </label>
      <Select
        id="course"
        defaultValue=""
        onChange={select}
        className="h-12"
      >
        <option value="">SELECT YOUR COURSE TO LOGIN</option>
        {LOGIN_TRACKS.map((track) => (
          <option key={track.key} value={track.key}>
            {track.label}
          </option>
        ))}
      </Select>

      {showProgrammes ? (
        /*
         * A dark panel rather than another grey card: it is a second question,
         * and giving it the site's navy separates it from the field above
         * instead of letting the two blur into one form.
         */
        <div className="animate-fade-up relative mt-7 overflow-hidden rounded-hero bg-brand-950 p-7 shadow-pop lg:p-8">
          <span
            className="pointer-events-none absolute -top-20 -right-16 size-64 rounded-full bg-brand-700/40 blur-3xl"
            aria-hidden
          />

          <p className="relative text-[10px] tracking-[0.28em] text-white/45 uppercase">
            Real estate login
          </p>
          <p className="relative mt-3 text-[15px] leading-relaxed text-white/80">
            Which programme are you signing in to?
          </p>

          <ul className="relative mt-7 divide-y divide-white/10">
            {RE_PROGRAMMES.map((programme) => (
              <li key={programme.label}>
                <a
                  href={programme.href}
                  target="_blank"
                  rel="noreferrer"
                  /* Grid, not flex-wrap: the longest label used to push its
                     button onto a line of its own, breaking the column the
                     other two share. Here the label wraps inside its own
                     cell and every button stays on the same right edge. */
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 py-5 sm:gap-x-8 lg:py-6"
                >
                  <span className="text-[14.5px] leading-snug text-white/90 transition-colors duration-200 group-hover:text-white">
                    {programme.label}
                  </span>

                  <span
                    className={`inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-6 text-[11.5px] font-medium tracking-[0.14em] uppercase shadow-card transition-[transform,background-color] duration-250 ease-out-soft group-hover:-translate-y-px ${programme.tone}`}
                  >
                    Login
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
