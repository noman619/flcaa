"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";

/**
 * Current catalog price for each course in the cart, keyed by course id.
 *
 * The cart stores a price snapshot taken when the item was added, which goes
 * stale the moment a price changes — a cart filled before a price edit shows
 * the old figure, and any promotion is then computed against it. Checkout has
 * always re-priced from the database (see priceCart), so the two disagreed and
 * the customer saw one number and was charged another.
 *
 * Read through the cookie-free public client: prices are public, and a signed
 * out visitor must get the same answer as a signed in one.
 *
 * Returns an empty map on failure, which leaves the cart on its stored prices
 * rather than blanking them.
 */
export async function getCartPrices(
  courseIds: string[],
): Promise<Record<string, number>> {
  const unique = Array.from(new Set(courseIds)).filter(Boolean);
  if (!unique.length) return {};

  const { data, error } = await createPublicClient()
    .from("courses")
    .select("id, price_cents")
    .in("id", unique);

  if (error || !data) return {};
  return Object.fromEntries(data.map((c) => [c.id, c.price_cents]));
}

/**
 * Persists the "Get Notifications by Email" preference.
 *
 * Writes through the caller's own session, so RLS decides — a signed-out
 * visitor simply gets `false` back rather than an error, and nobody can set
 * someone else's preference.
 *
 * Returns false if the column is missing (supabase/add_email_opt_in.sql has not
 * been run yet) so the checkbox degrades to a no-op instead of throwing.
 */
export async function setEmailOptIn(optIn: boolean): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("profiles")
    .update({ email_opt_in: optIn })
    .eq("id", user.id);

  return !error;
}
