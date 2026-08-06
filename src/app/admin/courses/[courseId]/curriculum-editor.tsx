"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  createLesson,
  createModule,
  deleteLesson,
  type AdminState,
} from "@/app/admin/admin-actions";
import { formatDuration } from "@/lib/utils";
import type { ModuleWithLessons } from "@/lib/queries";

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Plus />}
      {label}
    </Button>
  );
}

export function CurriculumEditor({
  courseId,
  modules,
}: {
  courseId: string;
  modules: ModuleWithLessons[];
}) {
  const [moduleState, moduleAction] = useActionState<AdminState, FormData>(
    createModule,
    {},
  );

  return (
    <section className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="font-display text-lg">Curriculum</h2>
      <p className="mt-1.5 text-sm text-ink-500">
        {modules.length} modules ·{" "}
        {modules.reduce((sum, m) => sum + m.lessons.length, 0)} lessons
      </p>

      <div className="mt-6 space-y-5">
        {modules.map((module, index) => (
          <ModuleBlock
            key={module.id}
            module={module}
            index={index}
            courseId={courseId}
          />
        ))}
      </div>

      <form
        action={moduleAction}
        className="mt-8 rounded-lg border border-dashed border-ink-300 bg-ink-50 p-5"
      >
        <h3 className="font-medium text-ink-900">Add a module</h3>
        {moduleState.error ? (
          <Alert tone="error" className="mt-3">
            {moduleState.error}
          </Alert>
        ) : null}
        <input type="hidden" name="courseId" value={courseId} />
        <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_auto] sm:items-end">
          <Field label="Module title" htmlFor="module-title" required>
            <Input
              id="module-title"
              name="title"
              placeholder="Module 7: Closing & Title"
              required
            />
          </Field>
          <Field label="Sort order" htmlFor="module-sort">
            <Input
              id="module-sort"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={modules.length + 1}
            />
          </Field>
          <Submit label="Add module" />
        </div>
      </form>
    </section>
  );
}

function ModuleBlock({
  module,
  index,
  courseId,
}: {
  module: ModuleWithLessons;
  index: number;
  courseId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [lessonState, lessonAction] = useActionState<AdminState, FormData>(
    createLesson,
    {},
  );

  // Collapse the composer once the server confirms the lesson was created.
  const [lastNotice, setLastNotice] = React.useState(lessonState.notice);
  if (lastNotice !== lessonState.notice) {
    setLastNotice(lessonState.notice);
    if (lessonState.notice) setOpen(false);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-ink-200">
      <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 px-4 py-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded bg-brand-700 text-xs font-medium text-white">
          {index + 1}
        </span>
        <h3 className="min-w-0 flex-1 truncate font-medium">{module.title}</h3>
        <Badge variant="outline" size="sm">
          {module.lessons.length} lessons
        </Badge>
      </div>

      {module.lessons.length ? (
        <ul className="divide-y divide-ink-100">
          {module.lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center gap-3 px-4 py-2.5 text-sm"
            >
              <Badge variant="neutral" size="sm">
                {lesson.kind}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-ink-700">
                {lesson.title}
              </span>
              <span className="shrink-0 text-xs text-ink-400">
                {formatDuration(lesson.duration_minutes)}
              </span>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Delete lesson "${lesson.title}"?`)) return;
                  await deleteLesson(lesson.id, courseId);
                  router.refresh();
                }}
                aria-label={`Delete lesson ${lesson.title}`}
                className="shrink-0 rounded p-1 text-ink-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="px-4 py-4 text-sm text-ink-400">No lessons yet.</p>
      )}

      <div className="border-t border-ink-100 bg-white p-4">
        {open ? (
          <form action={lessonAction} className="space-y-4">
            {lessonState.error ? (
              <Alert tone="error">{lessonState.error}</Alert>
            ) : null}
            <input type="hidden" name="moduleId" value={module.id} />
            <input type="hidden" name="courseId" value={courseId} />

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_9rem_7rem_7rem]">
              <Field label="Lesson title" htmlFor={`t-${module.id}`} required>
                <Input id={`t-${module.id}`} name="title" required />
              </Field>
              <Field label="Type" htmlFor={`k-${module.id}`}>
                <Select id={`k-${module.id}`} name="kind" defaultValue="text">
                  <option value="text">Reading</option>
                  <option value="video">Video</option>
                  <option value="quiz">Quiz</option>
                  <option value="download">Download</option>
                </Select>
              </Field>
              <Field label="Minutes" htmlFor={`d-${module.id}`}>
                <Input
                  id={`d-${module.id}`}
                  name="durationMinutes"
                  type="number"
                  min={0}
                  defaultValue={15}
                />
              </Field>
              <Field label="Order" htmlFor={`s-${module.id}`}>
                <Input
                  id={`s-${module.id}`}
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={module.lessons.length + 1}
                />
              </Field>
            </div>

            <Field
              label="Content"
              htmlFor={`c-${module.id}`}
              hint="Markdown for readings, or a video/file URL for video and download lessons."
            >
              <Textarea id={`c-${module.id}`} name="content" className="min-h-28" />
            </Field>

            <div className="flex gap-2">
              <Submit label="Add lesson" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Plus /> Add lesson to this module
          </Button>
        )}
      </div>
    </div>
  );
}
