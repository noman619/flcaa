import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import {
  FOOTER_LEGAL,
  FOOTER_POPULAR_COURSES,
  FOOTER_RESOURCES,
  FOOTER_SUPPORT,
  SITE,
  SOCIAL_LINKS,
} from "@/lib/site";

/**
 * Brand marks as inline paths — lucide-react dropped its brand icon set in
 * v1, and these are trademarks rather than UI icons anyway.
 */
const SOCIAL_PATHS: Record<string, string> = {
  Facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.94 8.44-9.94Z",
  YouTube:
    "M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z",
  LinkedIn:
    "M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.25 8.4h3.4V21h-3.4V8.4Zm5.75 0h3.26v1.72h.05c.45-.86 1.57-1.77 3.23-1.77 3.45 0 4.09 2.27 4.09 5.23V21h-3.4v-5.72c0-1.36-.03-3.12-1.9-3.12-1.9 0-2.19 1.49-2.19 3.02V21H9V8.4Z",
  Instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.18a6.66 6.66 0 1 0 0 13.32 6.66 6.66 0 0 0 0-13.32Zm0 10.98a4.32 4.32 0 1 1 0-8.64 4.32 4.32 0 0 1 0 8.64Zm8.48-11.24a1.56 1.56 0 1 1-3.11 0 1.56 1.56 0 0 1 3.11 0Z",
};

const CONTACT_ROWS = [
  { icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: SITE.phone, href: SITE.phoneHref },
  { icon: MapPin, label: SITE.address, href: null },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  const socials = SOCIAL_LINKS.filter((s) => s.url);

  return (
    /*
     * A warm stone field, one step deeper than the page. It grounds the
     * document without going dark — which would force the wordmark to be
     * knocked out to white and lose its colour.
     */
    <footer className="relative mt-auto overflow-hidden bg-sand-100">
      {/* Hairline seam, brightest in the middle. */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent, rgb(22 39 61 / 0.14) 30%, rgb(22 39 61 / 0.14) 70%, transparent)",
        }}
        aria-hidden
      />
      {/* Barely-there tonal shift so the surface isn't flat. */}


      <div className="relative container-page py-14 lg:py-16">
        {/* ---- masthead ---- */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p className="text-sm text-ink-500">{SITE.tagline}</p>
        </div>

        <div className="my-10 h-px w-full bg-ink-900/8" aria-hidden />

        {/* ---- columns ---- */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.15fr)]">
          <FooterColumn title="Popular Courses" links={FOOTER_POPULAR_COURSES} />
          <FooterColumn title="Resources" links={FOOTER_RESOURCES} />
          {/* Policy links live with the rest of the support material. */}
          <FooterColumn
            title="Support"
            links={[...FOOTER_SUPPORT, ...FOOTER_LEGAL]}
          />

          <div>
            <h2 className="text-sm font-medium text-ink-900">Contact</h2>
            <ul className="mt-5 space-y-3.5">
              {CONTACT_ROWS.map(({ icon: Icon, label, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="icon-tile size-8 rounded-icon">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  {href ? (
                    <a
                      href={href}
                      className="pt-1.5 text-[13px] text-ink-600 transition-colors duration-200 hover:text-ink-900"
                    >
                      {label}
                    </a>
                  ) : (
                    <span className="pt-1.5 text-[13px] leading-relaxed text-ink-600">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="my-10 h-px w-full bg-ink-900/8" aria-hidden />

        {/* ---- baseline ---- */}
        <div className="flex flex-col gap-6 text-[13px] text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}, All Rights Reserved.
          </p>

          {socials.length ? (
            <ul className="flex gap-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="icon-tile size-9 rounded-icon bg-ink-900 text-white transition-[transform,background-color] duration-300 ease-out-soft hover:-translate-y-0.5 hover:bg-ink-950"
                  >
                    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                      <path d={SOCIAL_PATHS[social.label] ?? ""} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-medium text-ink-900">{title}</h2>
      <ul className="mt-5 space-y-3 text-[13px]">
        {links.map((link) => {
          /*
           * Anchors go through a plain <a>. The client router restores scroll
           * position on navigation and does not reliably jump to a hash that
           * belongs to another route, so "About US" would land at the top of
           * the home page instead of its section. A full navigation lets the
           * browser resolve the fragment itself.
           */
          const isAnchor = link.href.includes("#");

          return (
            <li key={link.label}>
              {isAnchor ? (
                <a
                  href={link.href}
                  className="text-ink-600 transition-colors duration-200 hover:text-ink-900"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  href={link.href}
                  className="text-ink-600 transition-colors duration-200 hover:text-ink-900"
                >
                  {link.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
