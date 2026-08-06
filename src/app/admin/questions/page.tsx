import { createClient } from "@/lib/supabase/server";
import { QuestionManager } from "./question-manager";
import type { Course, ExamQuestion } from "@/lib/database.types";

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course: courseParam } = await searchParams;
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, slug, passing_exam_score")
    .order("sort_order");

  const courseList = (courses ?? []) as Pick<
    Course,
    "id" | "title" | "slug" | "passing_exam_score"
  >[];

  const activeCourseId = courseParam ?? courseList[0]?.id ?? null;

  const { data: questions } = activeCourseId
    ? await supabase
        .from("exam_questions")
        .select("*")
        .eq("course_id", activeCourseId)
    : { data: [] };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Exam question bank</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Questions power both the graded practice exam and flashcard mode. A
          course with zero questions issues its certificate on lesson completion
          alone.
        </p>
      </header>

      <QuestionManager
        courses={courseList}
        activeCourseId={activeCourseId}
        questions={(questions ?? []) as ExamQuestion[]}
      />
    </div>
  );
}
