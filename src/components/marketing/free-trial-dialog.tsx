"use client";

import * as React from "react";
import Image from "next/image";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { requestFreeTrial, type FreeTrialState } from "./free-trial-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending ? "Starting…" : "Try Course"}
    </Button>
  );
}

/**
 * "Course Free Trial" button and its modal.
 *
 * Uses the native <dialog> element rather than a hand-rolled overlay: it gives
 * the focus trap, Escape-to-close, inert background and top-layer stacking for
 * free. Top-layer also means it cannot be clipped by an ancestor's
 * backdrop-filter or overflow, which is the trap the header menus hit.
 */
export function FreeTrialDialog({
  label,
  course,
}: {
  label: string;
  course: string;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState<FreeTrialState, FormData>(
    requestFreeTrial,
    {},
  );

  return (
    <>
      <Button type="button" variant="outline" onClick={() => ref.current?.showModal()}>
        {label}
      </Button>

      <dialog
        ref={ref}
        aria-labelledby="free-trial-title"
        onClick={(event) => {
          // Clicking the backdrop closes. The dialog's own box is excluded by
          // testing the target, since the backdrop is the dialog element itself.
          if (event.target === ref.current) ref.current?.close();
        }}
        className="m-auto w-[min(28rem,calc(100vw-2rem))] rounded-panel border-4 border-gold-500 bg-white p-0 shadow-card-hover backdrop:bg-ink-950/60"
      >
        <div className="relative p-8 text-center lg:p-10">
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label="Close"
            className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-900"
          >
            <X className="size-4" aria-hidden />
          </button>

          <Image
            src="/logo-prolicense.png"
            alt=""
            width={180}
            height={48}
            className="mx-auto h-11 w-auto"
          />

          <p className="mt-6 text-[15px] text-ink-700">{course}</p>

          <p
            id="free-trial-title"
            className="mt-1 font-display text-3xl tracking-tight text-gold-600 uppercase lg:text-4xl"
          >
            Free Trial
          </p>

          {state.error ? (
            <div className="mt-6 text-left">
              <Alert tone="error">{state.error}</Alert>
            </div>
          ) : null}

          {state.notice ? (
            <div className="mt-6 text-left">
              <Alert tone="success">{state.notice}</Alert>
            </div>
          ) : (
            <form action={formAction} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <input type="hidden" name="course" value={course} />
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="hidden"
              />

              <label htmlFor="free-trial-email" className="sr-only">
                Email address
              </label>
              <Input
                id="free-trial-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Email"
                required
                className="flex-1"
              />

              <SubmitButton />
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
