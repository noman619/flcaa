import "server-only";

import { createClient } from "@/lib/supabase/server";
import type {
  Course,
  Enrollment,
  ExamAttempt,
  Lesson,
  LessonProgress,
  Track,
} from "@/lib/database.types";
import type { ModuleWithLessons } from "@/lib/queries";

export type EnrollmentWithCourse = Enrollment & {
  course: (Course & { track: Track | null }) | null;
};

export type EnrollmentSummary = EnrollmentWithCourse & {
  totalLessons: number;
  completedLessons: number;
  percent: number;
  isExpired: boolean;
  bestScore: number | null;
  hasPassed: boolean;
};

/** Every enrollment for the signed-in user, with progress + exam state folded in. */
export async function getMyEnrollments(userId: string): Promise<EnrollmentSummary[]> {
  const supabase = await createClient();

  const { data: enrollments, error } = await supabase
    .from("enrollments")
    .select("*, course:courses(*, track:tracks(*))")
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false });

  if (error) throw new Error(`Failed to load enrollments: ${error.message}`);
  const rows = (enrollments ?? []) as unknown as EnrollmentWithCourse[];
  if (!rows.length) return [];

  const courseIds = rows.map((e) => e.course_id);
  const enrollmentIds = rows.map((e) => e.id);

  const [{ data: modules }, { data: progress }, { data: attempts }] =
    await Promise.all([
      supabase
        .from("course_modules")
        .select("id, course_id, lessons(id)")
        .in("course_id", courseIds),
      supabase
        .from("lesson_progress")
        .select("enrollment_id, lesson_id, completed_at")
        .in("enrollment_id", enrollmentIds),
      supabase
        .from("exam_attempts")
        .select("enrollment_id, score_percent, passed")
        .in("enrollment_id", enrollmentIds),
    ]);

  const lessonCountByCourse = new Map<string, number>();
  for (const m of (modules ?? []) as unknown as {
    course_id: string;
    lessons: { id: string }[];
  }[]) {
    lessonCountByCourse.set(
      m.course_id,
      (lessonCountByCourse.get(m.course_id) ?? 0) + (m.lessons?.length ?? 0),
    );
  }

  const doneByEnrollment = new Map<string, number>();
  for (const p of (progress ?? []) as Pick<
    LessonProgress,
    "enrollment_id" | "lesson_id" | "completed_at"
  >[]) {
    if (!p.completed_at) continue;
    doneByEnrollment.set(
      p.enrollment_id,
      (doneByEnrollment.get(p.enrollment_id) ?? 0) + 1,
    );
  }

  const bestByEnrollment = new Map<string, { score: number; passed: boolean }>();
  for (const a of (attempts ?? []) as Pick<
    ExamAttempt,
    "enrollment_id" | "score_percent" | "passed"
  >[]) {
    const prev = bestByEnrollment.get(a.enrollment_id);
    if (!prev || a.score_percent > prev.score) {
      bestByEnrollment.set(a.enrollment_id, {
        score: a.score_percent,
        passed: a.passed || (prev?.passed ?? false),
      });
    } else if (a.passed && prev && !prev.passed) {
      bestByEnrollment.set(a.enrollment_id, { ...prev, passed: true });
    }
  }

  return rows.map((e) => {
    const total = lessonCountByCourse.get(e.course_id) ?? 0;
    const done = Math.min(doneByEnrollment.get(e.id) ?? 0, total);
    const best = bestByEnrollment.get(e.id);
    return {
      ...e,
      totalLessons: total,
      completedLessons: done,
      percent: total === 0 ? 0 : Math.round((done / total) * 100),
      isExpired: Boolean(
        e.access_expires_at && new Date(e.access_expires_at).getTime() < Date.now(),
      ),
      bestScore: best?.score ?? null,
      hasPassed: best?.passed ?? false,
    };
  });
}

export type PlayerData = {
  enrollment: EnrollmentWithCourse;
  modules: ModuleWithLessons[];
  completedLessonIds: Set<string>;
  attempts: ExamAttempt[];
  totalLessons: number;
  completedCount: number;
  percent: number;
  bestScore: number | null;
  hasPassed: boolean;
  passingScore: number;
  isExpired: boolean;
  orderedLessons: Lesson[];
};

/**
 * Everything the course player needs, in one place. Returns null when the user
 * is not enrolled in the course — callers turn that into a 404/redirect.
 */
export async function getPlayerData(
  userId: string,
  courseId: string,
): Promise<PlayerData | null> {
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*, course:courses(*, track:tracks(*))")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!enrollment) return null;
  const typed = enrollment as unknown as EnrollmentWithCourse;

  const [{ data: modules }, { data: progress }, { data: attempts }] =
    await Promise.all([
      supabase
        .from("course_modules")
        .select("*, lessons(*)")
        .eq("course_id", courseId)
        .order("sort_order"),
      supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("enrollment_id", typed.id),
      supabase
        .from("exam_attempts")
        .select("*")
        .eq("enrollment_id", typed.id)
        .order("taken_at", { ascending: false }),
    ]);

  const orderedModules = ((modules ?? []) as unknown as ModuleWithLessons[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => ({
      ...m,
      lessons: (m.lessons ?? []).sort((a, b) => a.sort_order - b.sort_order),
    }));

  const completedLessonIds = new Set(
    ((progress ?? []) as Pick<LessonProgress, "lesson_id" | "completed_at">[])
      .filter((p) => p.completed_at)
      .map((p) => p.lesson_id),
  );

  const orderedLessons = orderedModules.flatMap((m) => m.lessons);
  const totalLessons = orderedLessons.length;
  const completedCount = orderedLessons.filter((l) =>
    completedLessonIds.has(l.id),
  ).length;

  const attemptRows = (attempts ?? []) as ExamAttempt[];
  const bestScore = attemptRows.length
    ? Math.max(...attemptRows.map((a) => a.score_percent))
    : null;

  return {
    enrollment: typed,
    modules: orderedModules,
    completedLessonIds,
    attempts: attemptRows,
    totalLessons,
    completedCount,
    percent: totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100),
    bestScore,
    hasPassed: attemptRows.some((a) => a.passed),
    passingScore: typed.course?.passing_exam_score ?? 70,
    isExpired: Boolean(
      typed.access_expires_at &&
        new Date(typed.access_expires_at).getTime() < Date.now(),
    ),
    orderedLessons,
  };
}

/** Course IDs the user owns — used to gate "Enroll" vs "Go to course". */
export async function getOwnedCourseIds(userId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", userId);
  return new Set(
    ((data ?? []) as Pick<Enrollment, "course_id">[]).map((r) => r.course_id),
  );
}
