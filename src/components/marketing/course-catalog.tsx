import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

export type CatalogCourse = {
  title: string;
  /** "Course Length: 63 Hours". Absent on courses the original leaves off. */
  length?: string;
  blurb: string;
  href: string;
  image: string;
  alt: string;
};

export type CatalogGroup = {
  /** Section band, e.g. "PRE-LICENSING COURSES". */
  label: string;
  courses: readonly CatalogCourse[];
};

/**
 * The school pages' course catalog: dark section bands, each holding a run of
 * courses on a warm field.
 *
 * The band-per-group structure is the original's and worth keeping — a visitor
 * scanning for "post-licensing" finds the band, not the course. Each course is
 * one row so the length, the description and the action stay on one reading
 * line rather than being spread across a card grid.
 */
export function CourseCatalog({
  title,
  groups,
}: {
  title: string;
  groups: readonly CatalogGroup[];
}) {
  return (
    <section className="border-b border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-24">
        <h2 className="reveal font-display text-[1.8rem] leading-tight text-gold-600 lg:text-[2.35rem]">
          {title}
        </h2>

        <div className="mt-10 space-y-8 lg:mt-14 lg:space-y-10">
          {groups.map((group) => (
            <section
              key={group.label}
              className="reveal overflow-hidden rounded-panel border border-brand-900/15 shadow-card"
            >
              <h3 className="bg-ink-950 px-6 py-3.5 text-[11px] font-medium tracking-[0.2em] text-white uppercase lg:px-8">
                {group.label}
              </h3>

              <ul className="divide-y divide-brand-900/10 bg-sand-100">
                {group.courses.map((course) => (
                  <li key={course.title}>
                    <Link
                      href={course.href}
                      className="group grid gap-5 p-6 transition-colors duration-300 hover:bg-sand-50 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] sm:items-center sm:gap-8 lg:p-8"
                    >
                      <div className="min-w-0">
                        <h4 className="font-display text-[1.05rem] leading-snug text-brand-700 transition-colors duration-200 group-hover:text-brand-900 lg:text-[1.15rem]">
                          {course.title}
                        </h4>
                        {course.length ? (
                          <p className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-ink-500">
                            <Clock className="size-3.5" aria-hidden />
                            {course.length}
                          </p>
                        ) : null}
                      </div>

                      <p className="min-w-0 text-[14.5px] leading-relaxed text-ink-600">
                        {course.blurb}
                      </p>

                      <div className="flex items-center gap-5">
                        <div className="relative hidden aspect-3/2 w-32 shrink-0 overflow-hidden rounded-card lg:block">
                          <Image
                            src={course.image}
                            alt={course.alt}
                            fill
                            sizes="128px"
                            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-105"
                          />
                        </div>

                        <span className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-5 py-2.5 text-[12.5px] font-medium whitespace-nowrap text-white transition-colors duration-200 group-hover:bg-brand-950">
                          Preview This Course
                          <ArrowRight
                            className="size-3.5 transition-transform duration-300 ease-out-soft group-hover:translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
