"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { submitRefund, type RefundState } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" variant="leaf" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending ? "Sending…" : "Send Request"}
    </Button>
  );
}

/**
 * The original's five fields, in its order and with its labels.
 *
 * Order date is a real date input rather than a text box with a calendar
 * glyph: the browser's own picker is better than anything shipped here, and it
 * normalises the value so support is not reading "3/4" and guessing the month.
 */
export function RefundForm() {
  const [state, formAction] = useActionState<RefundState, FormData>(
    submitRefund,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

      {/* Honeypot — hidden from humans, catches naive bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="First Name" htmlFor="firstName" required>
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
          />
        </Field>
        <Field label="Last Name" htmlFor="lastName" required>
          <Input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
          />
        </Field>
        <Field label="Email" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:max-w-2xl">
        <Field label="Order Number" htmlFor="orderNumber" required>
          <Input id="orderNumber" name="orderNumber" required />
        </Field>
        <Field label="Order Date" htmlFor="orderDate" required>
          <Input id="orderDate" name="orderDate" type="date" required />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <Submit />
        <p className="text-[13px] text-ink-500">
          <span className="text-accent-600">*</span> required
        </p>
      </div>
    </form>
  );
}
