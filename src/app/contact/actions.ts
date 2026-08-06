"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export type ContactState = { error?: string; notice?: string };

/**
 * The original's form asks for first name, last name, email and a message,
 * with only email marked required. Kept to that shape — every extra field on
 * a contact form is a reason not to send it — but the message still has to
 * carry something, or the reply has nothing to answer.
 */
const schema = z.object({
  firstName: z.string().max(80).optional().or(z.literal("")),
  lastName: z.string().max(80).optional().or(z.literal("")),
  email: z.string().email("Enter a valid email address."),
  body: z
    .string()
    .min(10, "Tell us a little more (at least 10 characters).")
    .max(4000),
  // Honeypot: real users never fill this in.
  company: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
});

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    body: formData.get("body"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and retry." };
  }

  const { firstName, lastName, email, body } = parsed.data;
  /* contact_messages stores one name column; the email is the fallback so a
     message is never filed under an empty sender. */
  const name = [firstName, lastName].filter(Boolean).join(" ").trim() || email;

  // The contact_messages RLS policy allows anonymous inserts.
  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name,
    email,
    phone: null,
    subject: null,
    body,
  });

  if (error) {
    return {
      error: `We couldn't save your message (${error.message}). Please call ${SITE.phone}.`,
    };
  }

  await notifyStaff({ name, email, body });

  return { notice: "Thanks for submitting!" };
}

/**
 * Email notification hook. Wire up a provider (Resend, Postmark, SendGrid…) by
 * setting CONTACT_NOTIFY_WEBHOOK to an endpoint that sends the mail. Without it
 * the message is still persisted and visible in /admin/messages.
 */
async function notifyStaff(payload: Record<string, unknown>) {
  const webhook = process.env.CONTACT_NOTIFY_WEBHOOK;
  if (!webhook) return;
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: SITE.email,
        subject: "New contact form message",
        payload,
      }),
    });
  } catch {
    // Never fail the user's submission because notification delivery failed.
  }
}
