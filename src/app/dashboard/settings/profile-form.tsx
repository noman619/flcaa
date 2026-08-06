"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { updateProfile, type ActionState } from "@/app/dashboard/actions";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      Save changes
    </Button>
  );
}

export function ProfileForm({
  fullName,
  phone,
  email,
}: {
  fullName: string;
  phone: string;
  email: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateProfile,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

      <Field label="Full name" htmlFor="fullName" required>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={fullName}
          autoComplete="name"
          required
        />
      </Field>

      <Field
        label="Phone"
        htmlFor="phone"
        hint="Used only if we need to reach you about an enrollment."
      >
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={phone}
          autoComplete="tel"
        />
      </Field>

      <Field
        label="Email address"
        htmlFor="email"
        hint="Contact support to change the email on your account."
      >
        <Input id="email" value={email} disabled readOnly />
      </Field>

      <Submit />
    </form>
  );
}
