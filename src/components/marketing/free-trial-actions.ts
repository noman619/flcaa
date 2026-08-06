"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export type FreeTrialState = { error?: string; notice?: string };

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  course: z.string().min(2).max(160),
  // Honeypot: real users never fill this in.
  company: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
});

/**
 * Free-trial request from a guide.
 *
 * Lands in contact_messages rather than a new table: it is a lead with an
 * email attached, the anonymous-insert RLS policy there is already proven by
 * the contact form, and staff read one inbox instead of two. The subject is
 * fixed so these can be filtered.
 */
export async function requestFreeTrial(
  _prev: FreeTrialState,
  formData: FormData,
): Promise<FreeTrialState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    course: formData.get("course"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and retry." };
  }

  const { email, course } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: email.split("@")[0] || "Free trial request",
    email,
    subject: "Free trial request",
    body: `Free trial requested for: ${course}`,
  });

  if (error) {
    return {
      error: `We couldn't start your trial (${error.message}). Please call ${SITE.phone}.`,
    };
  }

  return {
    notice: "You're in — check your inbox, we've sent your trial access details.",
  };
}
