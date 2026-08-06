"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { NAV_TRACKS, NAV_RESOURCES, SITE } from "@/lib/site";
import { TRACK_THEME } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Button, ButtonLink } from "@/components/ui/button";
import { CartIndicator } from "@/components/cart/cart-indicator";

type NavLink = { label: string; href: string };

/** A menu entry that opens a further column, or one that just navigates. */
type NavGroup = NavLink & { links?: readonly NavLink[] };

type Menu = {
  key: string;
  title: string;
  href: string;
  description: string;
  links: readonly NavLink[];
  /** Present where the menu has a second level, as Real Estate does. */
  groups?: readonly NavGroup[];
  accent: string;
  bg: string;
  border: string;
  /** Extra path prefixes that should light this menu up as the active one. */
  matches: readonly string[];
};

/**
 * One list drives the desktop dropdowns and the mobile drawer: the three
 * course tracks, then Resources.
 */
const MENUS: Menu[] = [
  ...NAV_TRACKS.map((track) => ({
    key: track.slug,
    title: track.title,
    href: track.href,
    description: track.description,
    links: track.links,
    groups: "groups" in track ? track.groups : undefined,
    accent: TRACK_THEME[track.slug].accent,
    bg: TRACK_THEME[track.slug].bg,
    border: TRACK_THEME[track.slug].border,
    matches: [track.href],
  })),
  {
    key: "resources",
    title: NAV_RESOURCES.title,
    href: NAV_RESOURCES.href,
    description: NAV_RESOURCES.description,
    links: NAV_RESOURCES.links,
    accent: "#335c8a",
    bg: "bg-brand-50",
    border: "border-brand-200",
    matches: ["/blog", "/reviews"],
  },
];

export function HeaderNav({
  isAuthed,
  isAdmin,
  name,
}: {
  isAuthed: boolean;
  isAdmin: boolean;
  name: string;
}) {
  const pathname = usePathname();
  const [openTrack, setOpenTrack] = React.useState<string | null>(null);
  const [anchor, setAnchor] = React.useState<{ top: number; left: number } | null>(
    null,
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const closeTimer = React.useRef<number | undefined>(undefined);

  // Close both menus whenever the route changes. Adjusting state during render
  // (rather than in an effect) avoids a flash of the open menu on the new page.
  const [lastPath, setLastPath] = React.useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenTrack(null);
    setMobileOpen(false);
  }

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenTrack(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function scheduleClose() {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenTrack(null), 140);
  }
  function cancelClose() {
    window.clearTimeout(closeTimer.current);
  }

  /**
   * The panel is portalled to <body> and positioned from the trigger's rect.
   * Nested inside the header it inherited that subtree's compositing and
   * painted semi-transparently over the hero image — verified by giving it a
   * solid red background and still seeing the photograph through it, with
   * elementsFromPoint confirming the menu was the front-most element. At body
   * level there is no ancestor group to composite into.
   */
  function openMenu(key: string, trigger: HTMLElement) {
    const r = trigger.getBoundingClientRect();
    setAnchor({ top: r.bottom, left: r.left });
    setOpenTrack(key);
  }

  // A stale anchor after scroll or resize would leave the panel detached.
  React.useEffect(() => {
    if (!openTrack) return;
    const close = () => setOpenTrack(null);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("resize", close);
    };
  }, [openTrack]);

  const activeMenu = MENUS.find((m) => m.key === openTrack) ?? null;

  return (
    <>
      {/* ---------- desktop ---------- */}
      <nav
        className="hidden lg:flex lg:items-center lg:gap-1"
        aria-label="Main navigation"
        onMouseLeave={scheduleClose}
      >
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={cn(
            "relative px-3.5 py-2 text-[13px] tracking-[0.01em] transition-colors duration-200 ease-out-soft",
            pathname === "/"
              ? "text-ink-900"
              : "text-ink-500 hover:text-ink-900",
          )}
        >
          Home
        </Link>

        {MENUS.map((menu) => {
          const active = menu.matches.some((p) => pathname.startsWith(p));
          const open = openTrack === menu.key;
          return (
            <div
              key={menu.key}
              className="relative"
              onMouseEnter={(e) => {
                cancelClose();
                openMenu(menu.key, e.currentTarget);
              }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-haspopup="true"
                onClick={(e) => {
                  if (open) setOpenTrack(null);
                  else openMenu(menu.key, e.currentTarget.parentElement!);
                }}
                className={cn(
                  "relative inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] tracking-[0.01em] transition-colors duration-200 ease-out-soft",
                  active || open
                    ? "text-ink-900"
                    : "text-ink-500 hover:text-ink-900",
                )}
              >
                {menu.title}
                <ChevronDown
                  className={cn(
                    "size-3.5 text-ink-400 transition-transform duration-300 ease-out-soft",
                    open && "rotate-180 text-ink-700",
                  )}
                  aria-hidden
                />
              </button>
            </div>
          );
        })}
      </nav>

      {/* ---------- mega-menu panel (portalled — see openMenu) ---------- */}
      {activeMenu && anchor && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed z-60 hidden pt-2 lg:block"
              style={{ top: anchor.top, left: anchor.left }}
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              {/*
                Minimal panel: no filled header band, no chrome. A hairline
                frame, one tracked label, and a two-column index of links
                separated by rules. The accent appears only as a 1px rule that
                draws itself across the top on open.
              */}
              <div
                className={cn(
                  "animate-fade-up overflow-hidden rounded-2xl bg-white shadow-pop ring-1 ring-ink-200/70",
                  activeMenu.groups ? "w-2xl" : "w-136",
                )}
              >
                <span
                  className="block h-px w-full origin-left animate-[draw_0.5s_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ backgroundColor: activeMenu.accent }}
                  aria-hidden
                />

                <div className="px-7 pt-6 pb-2">
                  <p
                    className="text-[10px] tracking-[0.24em] uppercase"
                    style={{ color: activeMenu.accent }}
                  >
                    {activeMenu.title}
                  </p>
                  <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-ink-500">
                    {activeMenu.description}
                  </p>
                </div>

                {activeMenu.groups ? (
                  <GroupedLinks
                    // Remount per menu so the open category resets with it.
                    key={activeMenu.key}
                    groups={activeMenu.groups}
                    accent={activeMenu.accent}
                  />
                ) : (
                  <ul className="grid grid-cols-2 gap-x-8 px-7 py-3">
                    {activeMenu.links.map((link) => (
                      <li
                        key={link.label}
                        className="border-b border-ink-100 last:border-b-0"
                      >
                        <Link href={link.href} className="menu-link group/link">
                          <span className="flex items-baseline justify-between gap-3">
                            <span>{link.label}</span>
                            <span
                              className="translate-x-1 text-xs opacity-0 transition-[opacity,transform] duration-300 ease-out-soft group-hover/link:translate-x-0 group-hover/link:opacity-100"
                              style={{ color: activeMenu.accent }}
                              aria-hidden
                            >
                              ↗
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="px-7 pt-3 pb-6">
                  <Link
                    href={activeMenu.href}
                    className="group/all inline-flex items-center gap-2 text-[11px] tracking-[0.18em] text-ink-500 uppercase transition-colors duration-200 hover:text-ink-900"
                  >
                    {activeMenu.key === "resources"
                      ? "All resources"
                      : `All ${activeMenu.title}`}
                    <span
                      className="h-px w-6 transition-[width] duration-300 ease-out-soft group-hover/all:w-10"
                      style={{ backgroundColor: activeMenu.accent }}
                      aria-hidden
                    />
                  </Link>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {/* ---------- mobile trigger ---------- */}
      <div className="ml-auto flex items-center gap-1 lg:hidden">
        <CartIndicator />
        <Button
          variant="ghost"
          size="icon"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {/*
        ---------- mobile drawer ----------
        Portalled to <body> on purpose. An element with a `backdrop-filter`
        becomes the containing block for its `position: fixed` descendants, and
        a stacking/backdrop root for the rest. Nesting this drawer inside the
        header collapsed it to the header's own height — 0px tall, contents
        clipped by overflow-y-auto, clicks falling through to the page beneath.
        Keep it outside the header's subtree even if the header's frosted layer
        moves again.
      */}
      {mobileOpen && typeof document !== "undefined"
        ? createPortal(
            <div className="animate-fade-in fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-sand-50 lg:hidden">
              <div className="container-page space-y-6 py-6">
                {isAuthed ? (
                  <div className="rounded-2xl border border-ink-200/70 bg-white p-4 shadow-card">
                    <p className="text-xs text-ink-500">Signed in as</p>
                    <p className="font-medium text-ink-900">{name}</p>
                    <div className="mt-3 flex gap-2">
                      <ButtonLink href="/dashboard" size="sm" block>
                        Dashboard
                      </ButtonLink>
                      {isAdmin ? (
                        <ButtonLink href="/admin" size="sm" variant="outline" block>
                          Admin
                        </ButtonLink>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <ButtonLink href="/login" block>
                    Log in
                  </ButtonLink>
                )}

                <Link
                  href="/"
                  className="block border-b border-ink-200 py-3 font-display text-base"
                >
                  Home
                </Link>

                {MENUS.map((menu) => (
                  <MobileSection
                    key={menu.key}
                    title={menu.title}
                    href={menu.href}
                  >
                    {menu.groups
                      ? menu.groups.map((group) =>
                          group.links?.length ? (
                            <MobileGroup
                              key={group.label}
                              label={group.label}
                              links={group.links}
                            />
                          ) : (
                            <li key={group.label}>
                              <Link href={group.href} className="mobile-link">
                                {group.label}
                              </Link>
                            </li>
                          ),
                        )
                      : menu.links.map((link) => (
                          <li key={link.label}>
                            <Link href={link.href} className="mobile-link">
                              {link.label}
                            </Link>
                          </li>
                        ))}
                  </MobileSection>
                ))}

                <Link
                  href="/contact"
                  className="block py-2 font-display text-base"
                >
                  Contact
                </Link>

                <a
                  href={SITE.phoneHref}
                  className="block rounded-2xl bg-brand-50 px-4 py-3.5 text-center text-sm font-medium text-brand-800 ring-1 ring-brand-200/70 ring-inset"
                >
                  Questions? Call {SITE.phone}
                </a>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/**
 * Two-level menu body: categories on the left, the hovered category's courses
 * on the right — the shape the original site uses for Real Estate.
 *
 * Hovering a category switches the right column; the category itself is still
 * a link, so a visitor who wants the whole track can click straight through.
 * The right column keeps its width whichever category is showing, so the panel
 * does not resize under the pointer.
 */
function GroupedLinks({
  groups,
  accent,
}: {
  groups: readonly NavGroup[];
  accent: string;
}) {
  const first = groups.findIndex((group) => group.links?.length);
  const [active, setActive] = React.useState(Math.max(first, 0));
  const shown = groups[active]?.links ?? [];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-6 px-7 py-3">
      <ul className="border-r border-ink-100 pr-6">
        {groups.map((group, i) => {
          const parent = Boolean(group.links?.length);
          const on = parent && i === active;
          return (
            <li
              key={group.label}
              className="border-b border-ink-100 last:border-b-0"
              onMouseEnter={() => (parent ? setActive(i) : undefined)}
            >
              <Link
                href={group.href}
                className="menu-link group/link"
                onFocus={() => (parent ? setActive(i) : undefined)}
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span style={on ? { color: accent } : undefined}>
                    {group.label}
                  </span>
                  {parent ? (
                    <span
                      className={cn(
                        "text-xs transition-[opacity,transform] duration-300 ease-out-soft",
                        on
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-1 opacity-0 group-hover/link:translate-x-0 group-hover/link:opacity-100",
                      )}
                      style={{ color: accent }}
                      aria-hidden
                    >
                      →
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <ul>
        {shown.map((link) => (
          <li
            key={link.label}
            className="border-b border-ink-100 last:border-b-0"
          >
            <Link href={link.href} className="menu-link group/link">
              <span className="flex items-baseline justify-between gap-3">
                <span>{link.label}</span>
                <span
                  className="translate-x-1 text-xs opacity-0 transition-[opacity,transform] duration-300 ease-out-soft group-hover/link:translate-x-0 group-hover/link:opacity-100"
                  style={{ color: accent }}
                  aria-hidden
                >
                  ↗
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * A category inside the mobile drawer — the second level the Real Estate menu
 * has on desktop, folded into the same drawer rather than a slide-over.
 *
 * A <details> rather than state: the drawer is already long, and the native
 * element gets keyboard and screen-reader behaviour for free.
 */
function MobileGroup({
  label,
  links,
}: {
  label: string;
  links: readonly NavLink[];
}) {
  return (
    <li>
      <details className="group/details">
        <summary className="mobile-link flex cursor-pointer items-center justify-between gap-3 list-none [&::-webkit-details-marker]:hidden">
          {label}
          <ChevronDown
            className="size-4 shrink-0 text-ink-400 transition-transform duration-300 ease-out-soft group-open/details:rotate-180"
            aria-hidden
          />
        </summary>

        <ul className="mt-1 ml-3 border-l border-ink-200 pl-3">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="mobile-link text-ink-600">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}

function MobileSection({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-b border-ink-200 pb-3">
      <div className="flex items-center justify-between">
        <Link href={href} className="py-2 font-display text-base">
          {title}
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Expand"} ${title}`}
          className="rounded-md p-2 text-ink-500 hover:bg-ink-100"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>
      </div>
      {open ? <ul className="mt-1">{children}</ul> : null}
    </div>
  );
}
