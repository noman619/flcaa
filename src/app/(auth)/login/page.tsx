import type { Metadata } from "next";
import { Suspense } from "react";
import { CoursePicker } from "./course-picker";

export const metadata: Metadata = {
  title: "Log in",
  description:
    "Log in to your Prolicense Florida student account to access every course you own.",
  robots: { index: false, follow: true },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; email?: string }>;
}) {
  const { next, error, email } = await searchParams;

  // Empty means "no particular destination" — the action picks by role.
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "";

  return (
    // useSearchParams needs a Suspense boundary during prerender.
    <Suspense fallback={<div className="h-64" />}>
      <CoursePicker
        next={safeNext}
        initialError={error}
        initialEmail={email ?? ""}
      />
    </Suspense>
  );
}
