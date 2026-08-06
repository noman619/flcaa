import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * The banner at the top of a school landing page — the original's own
 * treatment: a warm field, the school's name, one line of positioning and a
 * single call to action, with the track's mark alongside.
 *
 * Deliberately not the generic track hero: those carry a breadcrumb, a
 * compliance badge and jump links, which is right for a catalog page and wrong
 * for a page whose job is to send a visitor to one course.
 */
export function SchoolHero({
  title,
  intro,
  cta,
  art,
  breadcrumb,
}: {
  title: string;
  intro: string;
  cta: { label: string; href: string };
  /** Line-art mark, served as an SVG file. */
  art: { src: string; alt: string };
  breadcrumb: string;
}) {
  return (
    <section className="relative overflow-hidden bg-gold-500">
      {/* One warm light behind the mark, so the field is not flat paint. */}
      <span
        className="pointer-events-none absolute -top-24 -right-24 size-112 rounded-full bg-white/20 blur-3xl"
        aria-hidden
      />

      <div className="relative container-page py-12 lg:py-16">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-white/70">
            <li>
              <Link
                href="/"
                className="transition-colors duration-200 hover:text-white"
              >
                Home
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden />
            <li className="font-medium text-white" aria-current="page">
              {breadcrumb}
            </li>
          </ol>
        </nav>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div className="reveal">
            <h1 className="max-w-xl font-display text-[2.1rem] leading-[1.08] font-medium text-white lg:text-[3rem]">
              {title}
            </h1>

            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-gold-100">
              {intro}
            </p>

            <Link
              href={cta.href}
              className="mt-9 inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[13.5px] font-medium text-brand-700 shadow-card transition-[transform,box-shadow,background-color] duration-250 ease-out-soft hover:-translate-y-px hover:bg-mist-50 hover:shadow-pop"
            >
              {cta.label}
            </Link>
          </div>

          <div className="reveal justify-self-center lg:justify-self-end">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={art.src}
              alt={art.alt}
              className="h-32 w-auto opacity-90 lg:h-44"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
