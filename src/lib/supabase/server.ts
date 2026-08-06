import "server-only";

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/lib/database.types";
import {
  SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_URL,
} from "@/lib/env";

/**
 * Request-scoped client that reads/writes the auth cookie. Use this for
 * everything that should respect Row Level Security.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component — the middleware refreshes the
          // session cookie instead, so this is safe to ignore.
        }
      },
    },
  });
}

/**
 * Read-only anonymous client with no cookie access. Safe to use inside
 * statically rendered / ISR pages (public catalog, blog) where touching
 * cookies would opt the route into dynamic rendering.
 */
export function createPublicClient() {
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Bypasses RLS. Only for trusted server contexts: the Stripe webhook and
 * admin mutations that have already verified the caller's role.
 */
export function createServiceClient() {
  if (!SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. It is required to fulfil orders and for admin writes.",
    );
  }
  return createSupabaseClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const SERVICE_ROLE_AVAILABLE = SUPABASE_SERVICE_ROLE_KEY.length > 0;
