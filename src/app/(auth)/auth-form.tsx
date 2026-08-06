"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { loginAction, type AuthState } from "./actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" block disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {pending ? "Please wait…" : label}
    </Button>
  );
}

export function AuthForm({
  next,
  initialError,
  initialEmail = "",
}: {
  next: string;
  initialError?: string;
  /** Prefilled from the cart, so the address is not asked for twice. */
  initialEmail?: string;
}) {
  const [state, formAction] = useActionState<AuthState, FormData>(loginAction, {});
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-5">
      {initialError ? <Alert tone="error">{initialError}</Alert> : null}
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

        <Field label="Email address" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={initialEmail}
            placeholder="you@example.com"
            required
          />
        </Field>

        <Field label="Password" htmlFor="password" required>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              className="pr-11"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-400 hover:text-ink-700"
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden />
              ) : (
                <Eye className="size-4" aria-hidden />
              )}
            </button>
          </div>
        </Field>

        <SubmitButton label="Log in" />
      </form>
    </div>
  );
}
