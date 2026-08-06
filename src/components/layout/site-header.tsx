import { LayoutDashboard, Phone, ShieldCheck } from "lucide-react";
import { getCurrentUser, displayName, isAdmin } from "@/lib/auth";
import { SITE } from "@/lib/site";
import { Logo } from "@/components/layout/logo";
import { CartIndicator } from "@/components/cart/cart-indicator";
import { HeaderNav } from "@/components/layout/header-nav";
import { ButtonLink } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import { UserMenu } from "@/components/layout/user-menu";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Trust bar — quiet, dark, sets the brand register before the nav. */}
      <div className="hidden bg-ink-950 text-white lg:block">
        <div className="container-page flex h-9 items-center justify-between text-[12px]">
          <p className="flex items-center gap-2 text-ink-300">
            <ShieldCheck className="size-3.5 text-brand-400" aria-hidden />
            Florida DBPR-approved provider
            <span className="text-ink-600">·</span>
            Self-paced online
            <span className="text-ink-600">·</span>
            Instructor support included
          </p>
          <div className="flex items-center gap-5">
            <a
              href={SITE.phoneHref}
              className="inline-flex items-center gap-1.5 text-ink-200 transition-colors duration-200 hover:text-white"
            >
              <Phone className="size-3.5" aria-hidden />
              {SITE.phone}
            </a>
            <span className="text-ink-500">{SITE.hours}</span>
          </div>
        </div>
      </div>

      {/*
        The frosted fill lives on its own layer behind the bar, never as an
        ancestor of the nav. An element with `backdrop-filter` becomes a
        backdrop root and stacking context, so a mega-menu nested inside one
        gets composited into that layer and the page shows through it.
      */}
      <div className="relative border-b border-ink-200/70">
        <div
          className="absolute inset-0 -z-10 bg-sand-50/85 backdrop-blur-xl"
          aria-hidden
        />
        <div className="container-page flex h-16 items-center gap-6 lg:h-18">
          <Logo />

          <HeaderNav
            isAuthed={Boolean(user)}
            isAdmin={isAdmin(user)}
            name={displayName(user)}
          />

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <CartIndicator />
            {user ? (
              <>
                <ButtonLink href="/dashboard" variant="ghost" size="sm">
                  <LayoutDashboard /> Dashboard
                </ButtonLink>
                <UserMenu
                  name={displayName(user)}
                  email={user.email}
                  initials={initials(user.profile?.full_name ?? user.email)}
                  isAdmin={isAdmin(user)}
                />
              </>
            ) : (
              <ButtonLink href="/login" variant="accent" size="sm">
                Log in
              </ButtonLink>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
