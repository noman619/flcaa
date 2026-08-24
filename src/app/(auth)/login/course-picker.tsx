"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Select } from "@/components/ui/input";
import { AuthForm } from "../auth-form";

/**
 * The three options the original's login page offers, in its order and with
 * its wording.
 *
 * The original routes each to a different system: CAM and board members to its
 * LMS, real estate to a second page that splits again by programme. We host
 * authentication ourselves, so a track only tailors the copy — except real
 * estate, which keeps the original's extra step because a visitor who followed
 * it once will look for it again.
 */
export const LOGIN_TRACKS = [
  { key: "cam", label: "CAM (Community Association Manager)" },
  {
    key: "real-estate",
    label: "Real Estate Agent & Broker",
    href: "/rea-estate-login-page",
  },
  { key: "board-members", label: "Association Board Members" },
] as const;

/**
 * Labels for the sub-programmes on the real estate login page. They never
 * appear in the dropdown — they arrive as ?course= from that page's buttons.
 */
const SUB_TRACKS: Record<string, string> = {
  "re-pre": "Pre-Licensing Course & Exam Prep",
  "re-post": "Post-Licensing & Continuing Education",
  "re-broker": "Broker Licensing & Post",
};

export function CoursePicker({
  next,
  initialError,
  initialEmail = "",
}: {
  next: string;
  initialError?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("course") ?? "";

  const [key, setKey] = React.useState(preselected);
  const label =
    LOGIN_TRACKS.find((t) => t.key === key && !("href" in t))?.label ??
    SUB_TRACKS[key] ??
    null;

  function select(value: string) {
    const track = LOGIN_TRACKS.find((t) => t.key === value);
    if (track && "href" in track) {
      router.push(track.href);
      return;
    }

    setKey(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("course", value);
    else params.delete("course");
    // Keep it shareable and back-button friendly.
    router.replace(`/login${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  if (!label) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-3xl">Hey, Good to see you again!</h1>
          <p className="mt-2 text-sm text-ink-500">
            Choose what you study with us. You&apos;ll sign in once — one
            account covers every course you own.
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
          value=""
          onChange={(e) => select(e.target.value)}
          className="h-12"
        >
          <option value="">SELECT YOUR COURSE TO LOGIN</option>
          {LOGIN_TRACKS.map((track) => (
            <option key={track.key} value={track.key}>
              {track.label}
            </option>
          ))}
        </Select>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => select("")}
        className="mb-7 inline-flex items-center gap-2 text-[13px] text-ink-500 transition-colors hover:text-ink-900"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Choose a different course
      </button>

      <div className="mb-8">
        <p className="text-[11px] tracking-[0.2em] text-brand-600 uppercase">
          {label}
        </p>
        <h1 className="mt-2 font-display text-3xl">
          Hey, Good to see you again!
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Sign in to continue. One account covers every course you own.
        </p>
      </div>

      <AuthForm
        /* The chosen track only tailors the copy — after signing in the
           visitor lands where the action decides, not on a catalog page. */
        next={next}
        initialError={initialError}
        initialEmail={initialEmail}
      />
    </div>
  );
}
