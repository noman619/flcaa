"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { setCoursePublished } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";

export function PublishToggle({
  courseId,
  published,
}: {
  courseId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [value, setValue] = React.useState(published);

  async function toggle() {
    const next = !value;
    setPending(true);
    setValue(next);
    const res = await setCoursePublished(courseId, next);
    setPending(false);
    if (res.error) {
      setValue(!next); // roll back the optimistic flip
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      role="switch"
      aria-checked={value}
      aria-label={`${value ? "Unpublish" : "Publish"} course`}
      className={cn(
        "inline-flex h-6 w-11 items-center rounded-full transition-colors",
        value ? "bg-emerald-600" : "bg-ink-300",
      )}
    >
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full bg-white shadow transition-transform",
          value ? "translate-x-5.5" : "translate-x-0.5",
        )}
      >
        {pending ? (
          <Loader2 className="size-3 animate-spin text-ink-500" aria-hidden />
        ) : null}
      </span>
    </button>
  );
}
