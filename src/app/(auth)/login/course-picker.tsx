"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Select } from "@/components/ui/input";
import { AuthForm } from "../auth-form";

export type LoginCourse = { slug: string; title: string; track: string };

/**
 * Mirrors the original site's "select your course to login" entry point.
 *
 * The picker is a routing step only — it decides where the student lands
 * after authenticating. Credentials are still checked once, against the one
 * account, so a student who owns several courses does not need several logins.
 */
export function CoursePicker({
  courses,
  next,
  initialError,
  initialEmail = "",
}: {
  courses: LoginCourse[];
  next: string;
  initialError?: string;
  initialEmail?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("course") ?? "";

  const [slug, setSlug] = React.useState(preselected);
  const chosen = courses.find((c) => c.slug === slug) ?? null;

  // Group by track so the list reads the way the catalog does.
  const groups = React.useMemo(() => {
    const map = new Map<string, LoginCourse[]>();
    for (const course of courses) {
      const list = map.get(course.track) ?? [];
      list.push(course);
      map.set(course.track, list);
    }
    return [...map.entries()];
  }, [courses]);

  function select(value: string) {
    setSlug(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("course", value);
    else params.delete("course");
    // Keep it shareable and back-button friendly.
    router.replace(`/login${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  if (!chosen) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-display text-3xl">Hey, good to see you again</h1>
          <p className="mt-2 text-sm text-ink-500">
            Choose the course you want to open. You&apos;ll sign in once and land
            straight on it.
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
          value={slug}
          onChange={(e) => select(e.target.value)}
          className="h-12"
        >
          <option value="">Choose a course…</option>
          {groups.map(([track, list]) => (
            <optgroup key={track} label={track}>
              {list.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.title}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>

        <p className="mt-6 text-sm text-ink-500">
          Not sure which one?{" "}
          <button
            type="button"
            onClick={() => select("__all__")}
            className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-900"
          >
            Sign in and show me everything I own
          </button>
        </p>
      </div>
    );
  }

  const isAll = chosen.slug === "__all__";

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
          {isAll ? "All courses" : chosen.track}
        </p>
        <h1 className="mt-2 font-display text-3xl">
          {isAll ? "Welcome back" : chosen.title}
        </h1>
        <p className="mt-2 text-sm text-ink-500">
          Sign in to continue. One account covers every course you own.
        </p>
      </div>

      <AuthForm
        next={isAll ? next : `/courses/${chosen.slug}`}
        initialError={initialError}
        initialEmail={initialEmail}
      />
    </div>
  );
}
