"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

export type RefundState = { error?: string; notice?: string };

/**
 * The original's refund form: first name, last name, email, order number and
 * order date, all required. Every field is something support needs to find the
 * order, so none of them is optional.
 */
const schema = z.object({
  firstName: z.string().min(1, "Enter your first name.").max(80),
  lastName: z.string().min(1, "Enter your last name.").max(80),
  email: z.string().email("Enter a valid email address."),
  orderNumber: z.string().min(1, "Enter your order number.").max(80),
  orderDate: z.string().min(1, "Enter the order date.").max(40),
  // Honeypot: real users never fill this in.
  company: z.string().max(0, "Submission rejected.").optional().or(z.literal("")),
});

/**
 * Refund requests are filed as contact messages rather than in a table of
 * their own: support answers them from the same inbox (/admin/messages), and
 * a second store would mean a second place to forget to look.
 */
export async function submitRefund(
  _prev: RefundState,
  formData: FormData,
): Promise<RefundState> {
  const parsed = schema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    orderNumber: formData.get("orderNumber"),
    orderDate: formData.get("orderDate"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and retry." };
  }

  const { firstName, lastName, email, orderNumber, orderDate } = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: `${firstName} ${lastName}`.trim(),
    email,
    phone: null,
    subject: "Refund request",
    body: `Order number: ${orderNumber}\nOrder date: ${orderDate}`,
  });

  if (error) {
    return {
      error: `We couldn't submit your request (${error.message}). Please call ${SITE.phone}.`,
    };
  }

  return {
    notice:
      "Thanks — your refund request is with our support team. We reply within one business day.",
  };
}
