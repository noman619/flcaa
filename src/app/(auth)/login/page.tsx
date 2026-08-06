import type { Metadata } from "next";
import { Suspense } from "react";
import { getCourses } from "@/lib/queries";
import { CoursePicker, type LoginCourse } from "./course-picker";

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
  const [{ next, error, email }, courses] = await Promise.all([
    searchParams,
    getCourses(),
  ]);

  const safeNext =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  const options: LoginCourse[] = courses.map((c) => ({
    slug: c.slug,
    title: c.title,
    track: c.track?.name ?? "Courses",
  }));

  return (
    // useSearchParams needs a Suspense boundary during prerender.
    <Suspense fallback={<div className="h-64" />}>
      <CoursePicker
        courses={options}
        next={safeNext}
        initialError={error}
        initialEmail={email ?? ""}
      />
    </Suspense>
  );
}
