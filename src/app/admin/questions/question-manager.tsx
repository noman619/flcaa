"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  createExamQuestion,
  deleteExamQuestion,
  type AdminState,
} from "@/app/admin/admin-actions";
import type { Course, ExamQuestion } from "@/lib/database.types";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Plus />}
      Add question
    </Button>
  );
}

export function QuestionManager({
  courses,
  activeCourseId,
  questions,
}: {
  courses: Pick<Course, "id" | "title" | "slug" | "passing_exam_score">[];
  activeCourseId: string | null;
  questions: ExamQuestion[];
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<AdminState, FormData>(
    createExamQuestion,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  const activeCourse = courses.find((c) => c.id === activeCourseId);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="course-filter" className="text-sm font-medium text-ink-700">
            Course
          </label>
          <Select
            id="course-filter"
            value={activeCourseId ?? ""}
            onChange={(e) =>
              router.push(`/admin/questions?course=${e.target.value}`)
            }
            className="max-w-md"
          >
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
            ))}
          </Select>
          <Badge variant="outline">
            {questions.length} question{questions.length === 1 ? "" : "s"}
          </Badge>
          {activeCourse ? (
            <Badge variant="brand">
              Pass mark {activeCourse.passing_exam_score ?? 70}%
            </Badge>
          ) : null}
        </div>

        {questions.length === 0 ? (
          <p className="rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-12 text-center text-sm text-ink-500">
            No questions in this bank yet. Add the first one on the right — the
            exam-prep page unlocks as soon as there is at least one.
          </p>
        ) : (
          <ul className="space-y-3">
            {questions.map((question, index) => (
              <li
                key={question.id}
                className="rounded-card border border-ink-200 bg-white p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="min-w-0 flex-1 text-sm font-medium text-ink-900">
                    {index + 1}. {question.question}
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Delete this question?")) return;
                      await deleteExamQuestion(question.id);
                      router.refresh();
                    }}
                    aria-label="Delete question"
                    className="shrink-0 rounded p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
                <ol className="mt-3 space-y-1 text-sm">
                  {(Array.isArray(question.choices) ? question.choices : []).map(
                    (choice, i) => (
                      <li
                        key={i}
                        className={
                          i === question.correct_index
                            ? "font-medium text-emerald-700"
                            : "text-ink-500"
                        }
                      >
                        {String.fromCharCode(65 + i)}. {choice}
                        {i === question.correct_index ? " ✓" : ""}
                      </li>
                    ),
                  )}
                </ol>
                {question.explanation ? (
                  <p className="mt-3 rounded bg-ink-50 p-3 text-xs leading-relaxed text-ink-600">
                    {question.explanation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="space-y-4 rounded-card border border-ink-200 bg-white p-6 lg:sticky lg:top-28"
      >
        <h2 className="font-display text-lg">Add a question</h2>

        {state.error ? <Alert tone="error">{state.error}</Alert> : null}
        {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

        <input type="hidden" name="courseId" value={activeCourseId ?? ""} />

        <Field label="Question" htmlFor="question" required>
          <Textarea id="question" name="question" required className="min-h-24" />
        </Field>

        {[0, 1, 2, 3].map((i) => (
          <Field
            key={i}
            label={`Choice ${String.fromCharCode(65 + i)}`}
            htmlFor={`choice${i}`}
            required={i < 2}
          >
            <Input id={`choice${i}`} name={`choice${i}`} required={i < 2} />
          </Field>
        ))}

        <Field label="Correct answer" htmlFor="correctIndex" required>
          <Select id="correctIndex" name="correctIndex" defaultValue="0">
            <option value="0">A</option>
            <option value="1">B</option>
            <option value="2">C</option>
            <option value="3">D</option>
          </Select>
        </Field>

        <Field
          label="Explanation"
          htmlFor="explanation"
          hint="Shown after a graded attempt and in flashcard mode."
        >
          <Textarea id="explanation" name="explanation" className="min-h-20" />
        </Field>

        <Submit />
      </form>
    </div>
  );
}
