import Link from "next/link";
import { ArrowRight, BadgeCheck, ChevronRight, ShieldCheck } from "lucide-react";
import { CourseCard } from "@/components/course/course-card";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GraduationCap } from "lucide-react";
import { OFFERING_ORDER, OFFERING_TYPES, trackTheme } from "@/lib/catalog";
import { getCoursesByTrack, getTrack, groupByOffering } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { getOwnedCourseIds } from "@/lib/enrollments";
import { notFound } from "next/navigation";
import { cn } from "@/lib/utils";
import { trackLabel } from "@/lib/site";
import type { OfferingType } from "@/lib/database.types";

export async function TrackLanding({
  slug,
  showHero = true,
}: {
  slug: string;
  /**
   * False where the page carries its own banner — the real estate school page
   * uses the original's branded hero, and two headings would fight.
   */
  showHero?: boolean;
}) {
  const [track, courses, user] = await Promise.all([
    getTrack(slug),
    getCoursesByTrack(slug),
    getCurrentUser(),
  ]);

  if (!track) notFound();

  const owned = user ? await getOwnedCourseIds(user.id) : new Set<string>();
  const grouped = groupByOffering(courses);
  const sections = OFFERING_ORDER.filter((type) => grouped.has(type));
  const theme = trackTheme(track.slug);

  return (
    <>
      {/* breadcrumb + hero */}
      {showHero ? (
      <section className={cn("border-b", theme.border, theme.bg)}>
        <div className="container-page py-12 lg:py-16">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-sm text-ink-500">
              <li>
                <Link href="/" className="hover:text-ink-900 hover:underline">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3.5" aria-hidden />
              <li className="font-medium text-ink-900" aria-current="page">
                {trackLabel(track.slug, track.name)}
              </li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
                style={{ backgroundColor: theme.accent }}
              >
                <ShieldCheck className="size-3.5" aria-hidden />
                Florida DBPR approved
              </span>
              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight lg:text-5xl">
                {track.name}
              </h1>
              {track.tagline ? (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-600">
                  {track.tagline}
                </p>
              ) : null}
            </div>

            {/* jump links */}
            {sections.length > 1 ? (
              <nav aria-label="Jump to section" className="lg:justify-self-end">
                <p className="mb-2.5 text-xs font-medium tracking-wider text-ink-500 uppercase">
                  Jump to
                </p>
                <ul className="flex flex-wrap gap-2">
                  {sections.map((type) => (
                    <li key={type}>
                      <a
                        href={`#${type}`}
                        className="inline-flex rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-xs font-medium text-ink-700 backdrop-blur transition-colors hover:bg-white"
                      >
                        {OFFERING_TYPES[type].plural}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
        </div>
      </section>
      ) : null}

      <div className="container-page py-14 lg:py-20">
        {sections.length === 0 ? (
          <EmptyState
            icon={GraduationCap}
            title="No courses published yet"
            description="Courses for this track are being finalised. Check back shortly or contact us for the schedule."
            action={
              <ButtonLink href="/contact" variant="outline">
                Contact us
              </ButtonLink>
            }
          />
        ) : (
          <div className="space-y-16 lg:space-y-20">
            {sections.map((type) => (
              <OfferingSection
                key={type}
                type={type}
                courses={grouped.get(type) ?? []}
                owned={owned}
              />
            ))}
          </div>
        )}

        {/* cross-sell */}
        <div className="mt-20 rounded-card border border-ink-200 bg-ink-50 p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl">
                Not sure which course you need?
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-600">
                Tell us where you are in the process and we&apos;ll point you at the
                exact state requirement — including how many hours you owe and by
                when.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-600">
                {[
                  "No sales pressure",
                  "Answers within one business day",
                  "Florida-specific guidance",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <BadgeCheck className="size-4 text-emerald-600" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <ButtonLink href="/contact" size="lg" className="shrink-0">
              Ask an advisor
              <ArrowRight aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </div>
    </>
  );
}

function OfferingSection({
  type,
  courses,
  owned,
}: {
  type: OfferingType;
  courses: Awaited<ReturnType<typeof getCoursesByTrack>>;
  owned: Set<string>;
}) {
  const meta = OFFERING_TYPES[type];
  return (
    <section id={type} className="scroll-mt-28">
      <div className="mb-7 max-w-2xl">
        <h2 className="font-display text-2xl lg:text-3xl">{meta.plural}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">{meta.blurb}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            owned={owned.has(course.id)}
          />
        ))}
      </div>
    </section>
  );
}
