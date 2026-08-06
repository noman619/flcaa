import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getPlayerData } from "@/lib/enrollments";
import { CoursePlayer } from "./course-player";

export const metadata: Metadata = {
  title: "Course player",
  robots: { index: false, follow: false },
};

export default async function CoursePlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<{ lesson?: string }>;
}) {
  const [{ courseId }, { lesson: lessonParam }, user] = await Promise.all([
    params,
    searchParams,
    requireUser(),
  ]);

  const data = await getPlayerData(user.id, courseId);
  if (!data) notFound();

  // Resume where the student left off: first incomplete lesson, else the last.
  const firstIncomplete = data.orderedLessons.find(
    (l) => !data.completedLessonIds.has(l.id),
  );
  const fallback = firstIncomplete ?? data.orderedLessons.at(-1) ?? null;
  const active =
    data.orderedLessons.find((l) => l.id === lessonParam) ?? fallback;

  const activeIndex = active
    ? data.orderedLessons.findIndex((l) => l.id === active.id)
    : -1;

  return (
    <CoursePlayer
      enrollmentId={data.enrollment.id}
      courseId={courseId}
      courseTitle={data.enrollment.course?.title ?? "Course"}
      trackSlug={data.enrollment.course?.track?.slug ?? "real-estate"}
      trackName={data.enrollment.course?.track?.name ?? ""}
      modules={data.modules}
      completedLessonIds={Array.from(data.completedLessonIds)}
      activeLessonId={active?.id ?? null}
      previousLessonId={
        activeIndex > 0 ? data.orderedLessons[activeIndex - 1]!.id : null
      }
      nextLessonId={
        activeIndex >= 0 && activeIndex < data.orderedLessons.length - 1
          ? data.orderedLessons[activeIndex + 1]!.id
          : null
      }
      percent={data.percent}
      completedCount={data.completedCount}
      totalLessons={data.totalLessons}
      isExpired={data.isExpired}
      accessExpiresAt={data.enrollment.access_expires_at}
      certificateNumber={data.enrollment.certificate_number}
      hasPassed={data.hasPassed}
      bestScore={data.bestScore}
      passingScore={data.passingScore}
    />
  );
}
