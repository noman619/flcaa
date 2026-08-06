"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { updateCourse, type AdminState } from "@/app/admin/admin-actions";
import type { Course } from "@/lib/database.types";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      Save course
    </Button>
  );
}

export function CourseEditor({ course }: { course: Course }) {
  const [state, formAction] = useActionState<AdminState, FormData>(
    updateCourse,
    {},
  );

  return (
    <section className="rounded-card border border-ink-200 bg-white p-6">
      <h2 className="font-display text-lg">Course details</h2>

      <form action={formAction} className="mt-5 space-y-5">
        {state.error ? <Alert tone="error">{state.error}</Alert> : null}
        {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

        <input type="hidden" name="id" value={course.id} />

        <Field label="Title" htmlFor="title" required>
          <Input id="title" name="title" defaultValue={course.title} required />
        </Field>

        <Field label="Subtitle" htmlFor="subtitle" hint="Shown on cards and under the H1.">
          <Input id="subtitle" name="subtitle" defaultValue={course.subtitle ?? ""} />
        </Field>

        <Field label="Description" htmlFor="description">
          <Textarea
            id="description"
            name="description"
            defaultValue={course.description ?? ""}
            className="min-h-40"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Price (cents)" htmlFor="priceCents" required hint="19900 = $199">
            <Input
              id="priceCents"
              name="priceCents"
              type="number"
              min={0}
              defaultValue={course.price_cents}
              required
            />
          </Field>
          <Field label="Hours" htmlFor="hours" required>
            <Input
              id="hours"
              name="hours"
              type="number"
              step="0.5"
              min={0}
              defaultValue={course.hours ?? 0}
              required
            />
          </Field>
          <Field label="Access days" htmlFor="accessDays" required>
            <Input
              id="accessDays"
              name="accessDays"
              type="number"
              min={1}
              defaultValue={course.access_days ?? 365}
              required
            />
          </Field>
          <Field label="Passing score %" htmlFor="passingScore" required>
            <Input
              id="passingScore"
              name="passingScore"
              type="number"
              min={1}
              max={100}
              defaultValue={course.passing_exam_score ?? 70}
              required
            />
          </Field>
        </div>

        <label className="flex items-center gap-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={course.is_published}
            className="size-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
          />
          Published (visible in the public catalog)
        </label>

        <Submit />
      </form>
    </section>
  );
}
