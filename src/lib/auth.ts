import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/database.types";

export type SessionUser = {
  id: string;
  email: string | null;
  profile: Profile | null;
};

/**
 * Current user + profile. `getUser()` (not `getSession()`) so the JWT is
 * verified against the Auth server rather than trusted from the cookie.
 */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { id: user.id, email: user.email ?? null, profile: profile ?? null };
});

export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    const next = returnTo ? `?next=${encodeURIComponent(returnTo)}` : "";
    redirect(`/login${next}`);
  }
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser("/admin");
  if (user.profile?.role !== "admin") redirect("/dashboard?error=forbidden");
  return user;
}

export function isAdmin(user: SessionUser | null): boolean {
  return user?.profile?.role === "admin";
}

export function displayName(user: SessionUser | null): string {
  return user?.profile?.full_name?.trim() || user?.email?.split("@")[0] || "Student";
}
