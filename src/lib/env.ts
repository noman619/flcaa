/** Centralised env access so missing config fails loudly and in one place. */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

export const SUPABASE_URL = required(
  "NEXT_PUBLIC_SUPABASE_URL",
  process.env.NEXT_PUBLIC_SUPABASE_URL,
);

export const SUPABASE_ANON_KEY = required(
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/** Only present server-side. Needed for the Stripe webhook + admin service writes. */
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

/**
 * When Stripe is not configured we fall back to a local "dev checkout" that marks
 * the order paid immediately. This keeps the whole purchase -> enrollment flow
 * testable without keys, exactly as the brief allows.
 */
export const STRIPE_ENABLED = STRIPE_SECRET_KEY.length > 0;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

/**
 * Google Places (New) key, server-side only. When unset the review widget
 * falls back to the transcribed reviews instead of failing — see
 * src/lib/google-reviews.ts.
 */
export const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY ?? "";
