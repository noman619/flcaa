"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Select, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { submitReview, type ActionState } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      Submit review
    </Button>
  );
}

export function ReviewForm({
  courses,
}: {
  courses: { courseId: string; title: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    submitReview,
    {},
  );
  const [rating, setRating] = React.useState(5);

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

      <Field label="Course" htmlFor="courseId" required>
        <Select id="courseId" name="courseId" required>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.title}
            </option>
          ))}
        </Select>
      </Field>

      <fieldset>
        <legend className="mb-1.5 block text-sm font-medium text-ink-800">
          Rating <span className="text-red-600">*</span>
        </legend>
        <input type="hidden" name="rating" value={rating} />
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              className="rounded p-0.5"
            >
              <Star
                className={cn(
                  "size-7 transition-colors",
                  value <= rating
                    ? "fill-accent-400 text-accent-400"
                    : "fill-ink-200 text-ink-200 hover:fill-accent-200 hover:text-accent-200",
                )}
                aria-hidden
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-ink-500">{rating} of 5</span>
        </div>
      </fieldset>

      <Field label="Your review" htmlFor="body">
        <Textarea
          id="body"
          name="body"
          maxLength={2000}
          placeholder="What worked well? Would you recommend it to someone starting out?"
        />
      </Field>

      <Submit />
    </form>
  );
}
