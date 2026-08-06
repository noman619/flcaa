"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { submitContact, type ContactState } from "./actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" variant="leaf" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending ? "Sending…" : "Send"}
    </Button>
  );
}

/**
 * The original's four fields, in its order and with its labels: first name,
 * last name, email (the only required one) and a message.
 */
export function ContactForm() {
  const [state, formAction] = useActionState<ContactState, FormData>(
    submitContact,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

      {/* Honeypot — hidden from humans, catches naive bots. */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First Name" htmlFor="firstName">
          <Input id="firstName" name="firstName" autoComplete="given-name" />
        </Field>
        <Field label="Last Name" htmlFor="lastName">
          <Input id="lastName" name="lastName" autoComplete="family-name" />
        </Field>
      </div>

      <Field label="Email" htmlFor="email" required>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </Field>

      <Field label="Message" htmlFor="body" required>
        <Textarea
          id="body"
          name="body"
          required
          minLength={10}
          maxLength={4000}
          className="min-h-36"
        />
      </Field>

      <div className="flex justify-end">
        <Submit />
      </div>

      <p className="text-xs leading-relaxed text-ink-400">
        We only use your details to answer your question. See our{" "}
        <a href="/privacy" className="underline hover:text-ink-700">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
