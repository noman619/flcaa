import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getPlayerData } from "@/lib/enrollments";
import { createClient } from "@/lib/supabase/server";
import { ExamRunner } from "./exam-runner";
import type { ExamQuestion } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Exam prep",
  robots: { index: false, follow: false },
};

export default async function ExamPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const [{ courseId }, user] = await Promise.all([params, requireUser()]);

  const data = await getPlayerData(user.id, courseId);
  if (!data) notFound();

  const supabase = await createClient();
  const { data: questions } = await supabase
    .from("exam_questions")
    // correct_index is needed for instant flashcard feedback; the graded exam
    // is still scored server-side so a client cannot fake a passing attempt.
    .select("id, question, choices, correct_index, explanation")
    .eq("course_id", courseId);

  return (
    <div className="-my-8 lg:-my-12">
      <header className="border-b border-ink-200 bg-white">
        <div className="container-page flex items-center gap-4 py-4">
          <Link
            href={`/dashboard/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Back to course
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-base">
              {data.enrollment.course?.title} — Exam prep
            </h1>
          </div>
        </div>
      </header>

      <div className="container-page py-8 lg:py-12">
        <ExamRunner
          enrollmentId={data.enrollment.id}
          courseId={courseId}
          courseTitle={data.enrollment.course?.title ?? "Course"}
          passingScore={data.passingScore}
          questions={((questions ?? []) as ExamQuestion[]).map((q) => ({
            id: q.id,
            question: q.question,
            choices: Array.isArray(q.choices) ? q.choices : [],
            correctIndex: q.correct_index,
            explanation: q.explanation,
          }))}
          attempts={data.attempts.map((a) => ({
            id: a.id,
            scorePercent: a.score_percent,
            passed: a.passed,
            takenAt: a.taken_at,
          }))}
        />
      </div>
    </div>
  );
}
