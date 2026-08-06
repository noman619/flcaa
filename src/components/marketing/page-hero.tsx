import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * The single hero treatment used by every top-level marketing page, so the
 * transition from one section of the site to another never changes register.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb,
  actions,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative border-b border-ink-200/70 bg-sand-100">
      <div className="relative container-page py-16 lg:py-20">
        {breadcrumb?.length ? (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
              {breadcrumb.map((crumb, i) => (
                <React.Fragment key={crumb.label}>
                  {i > 0 ? (
                    <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
                  ) : null}
                  <li>
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="transition-colors duration-200 hover:text-ink-900"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-ink-900" aria-current="page">
                        {crumb.label}
                      </span>
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="animate-fade-up">
          {eyebrow ? (
            <p className="eyebrow mb-3.5 flex items-center gap-2.5">
              <span className="h-px w-6 bg-brand-400" aria-hidden />
              {eyebrow}
            </p>
          ) : null}

          <h1 className="max-w-4xl font-display text-[2.5rem] text-ink-900 sm:text-5xl lg:text-[3.5rem]">
            {title}
          </h1>

          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-600">
              {description}
            </p>
          ) : null}

          {actions ? <div className="mt-9">{actions}</div> : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
