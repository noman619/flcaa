import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CourseEditor } from "./course-editor";
import { CurriculumEditor } from "./curriculum-editor";
import type { Course, Track } from "@/lib/database.types";
import type { ModuleWithLessons } from "@/lib/queries";

export default async function AdminCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const supabase = await createClient();

  const [{ data: course }, { data: modules }] = await Promise.all([
    supabase
      .from("courses")
      .select("*, track:tracks(name, slug)")
      .eq("id", courseId)
      .maybeSingle(),
    supabase
      .from("course_modules")
      .select("*, lessons(*)")
      .eq("course_id", courseId)
      .order("sort_order"),
  ]);

  if (!course) notFound();

  const typed = course as unknown as Course & {
    track: Pick<Track, "name" | "slug"> | null;
  };

  const orderedModules = ((modules ?? []) as unknown as ModuleWithLessons[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      ...m,
      lessons: (m.lessons ?? []).sort((a, b) => a.sort_order - b.sort_order),
    }));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ChevronLeft className="size-4" aria-hidden />
            All courses
          </Link>
          <h1 className="mt-2 font-display text-3xl">{typed.title}</h1>
          <p className="mt-1 font-mono text-xs text-ink-400">{typed.slug}</p>
        </div>
        <Link
          href={`/courses/${typed.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline"
        >
          <ExternalLink className="size-4" aria-hidden />
          View public page
        </Link>
      </header>

      <CourseEditor course={typed} />

      <CurriculumEditor courseId={courseId} modules={orderedModules} />
    </div>
  );
}
