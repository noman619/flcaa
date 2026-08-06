"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/env";

export type AuthState = { error?: string; notice?: string };

const safeNext = (value: FormDataEntryValue | null) => {
  const next = typeof value === "string" ? value : "";
  // Only allow same-origin relative paths — blocks open-redirect abuse.
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
};

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const signupSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function loginAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return {
      error:
        error.message === "Invalid login credentials"
          ? "That email and password combination doesn't match an account."
          : error.message,
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

/**
 * Account creation. Deliberately NOT reachable from the UI — the original site
 * has no self-serve signup, so /signup and every "Create account" link were
 * removed.
 *
 * Kept because accounts still have to come from somewhere: whatever replaces
 * self-serve signup (provisioning at purchase, or admin-created accounts) needs
 * exactly this call. Nothing imports it, so Next does not register it as a
 * callable server action.
 */
export async function signupAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${SITE_URL}/auth/callback`,
    },
  });

  if (error) return { error: error.message };

  // Supabase returns a user with no session when email confirmation is on.
  if (data.user && !data.session) {
    return {
      notice:
        "Check your inbox — we sent a confirmation link to finish setting up your account.",
    };
  }

  revalidatePath("/", "layout");
  redirect(safeNext(formData.get("next")));
}

export async function forgotPasswordAction(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "");
  if (!z.string().email().safeParse(email).success) {
    return { error: "Enter a valid email address." };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${SITE_URL}/auth/callback?next=/dashboard/settings`,
  });
  if (error) return { error: error.message };
  return { notice: "If that email has an account, a reset link is on its way." };
}
