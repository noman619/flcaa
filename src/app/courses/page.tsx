import type { Metadata } from "next";
import Link from "next/link";
import { CourseCard } from "@/components/course/course-card";
import { getCourses } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { getOwnedCourseIds } from "@/lib/enrollments";
import { NAV_TRACKS } from "@/lib/site";
import { OFFERING_TYPES } from "@/lib/catalog";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "All Courses",
  description:
    "Every Florida-approved course we offer: real estate licensing and post-licensing, CAM, HOA board certification, continuing education and state exam prep.",
  alternates: { canonical: "/courses" },
};

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string; type?: string }>;
}) {
  const { track: trackFilter, type: typeFilter } = await searchParams;
  const [courses, user] = await Promise.all([getCourses(), getCurrentUser()]);
  const owned = user ? await getOwnedCourseIds(user.id) : new Set<string>();

  const filtered = courses.filter((c) => {
    if (trackFilter && c.track?.slug !== trackFilter) return false;
    if (typeFilter && c.offering_type !== typeFilter) return false;
    return true;
  });

  const types = Array.from(new Set(courses.map((c) => c.offering_type)));

  return (
    <>
      <PageHero
        eyebrow="Catalog"
        title="Course catalog"
        description={`${courses.length} Florida-approved courses across real estate, community association management and board certification.`}
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Courses" }]}
      />

      <div className="container-page py-12 lg:py-16">
        {/* filters */}
        <div className="mb-10 space-y-4">
          <FilterRow
            label="Track"
            options={[
              { label: "All tracks", href: buildHref(undefined, typeFilter) },
              ...NAV_TRACKS.map((t) => ({
                label: t.title,
                href: buildHref(t.slug, typeFilter),
                active: trackFilter === t.slug,
              })),
            ]}
            activeIndexIsAll={!trackFilter}
          />
          <FilterRow
            label="Type"
            options={[
              { label: "All types", href: buildHref(trackFilter, undefined) },
              ...types.map((t) => ({
                label: OFFERING_TYPES[t]?.plural ?? t,
                href: buildHref(trackFilter, t),
                active: typeFilter === t,
              })),
            ]}
            activeIndexIsAll={!typeFilter}
          />
        </div>

        <p className="mb-6 text-sm text-ink-500" aria-live="polite">
          Showing {filtered.length} of {courses.length} courses
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              owned={owned.has(course.id)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-12 text-center text-sm text-ink-500">
            No courses match those filters.{" "}
            <Link href="/courses" className="font-medium text-brand-700 underline">
              Clear filters
            </Link>
          </p>
        ) : null}
      </div>
    </>
  );
}

function buildHref(track?: string, type?: string) {
  const params = new URLSearchParams();
  if (track) params.set("track", track);
  if (type) params.set("type", type);
  const qs = params.toString();
  return qs ? `/courses?${qs}` : "/courses";
}

function FilterRow({
  label,
  options,
  activeIndexIsAll,
}: {
  label: string;
  options: { label: string; href: string; active?: boolean }[];
  activeIndexIsAll: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="w-12 shrink-0 text-xs font-medium tracking-wider text-ink-500 uppercase">
        {label}
      </span>
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {options.map((option, i) => {
          const active = i === 0 ? activeIndexIsAll : Boolean(option.active);
          return (
            <Link
              key={option.href + option.label}
              href={option.href}
              scroll={false}
              className={
                active
                  ? "rounded-full bg-brand-700 px-3.5 py-1.5 text-xs font-medium whitespace-nowrap text-white"
                  : "rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-xs font-medium whitespace-nowrap text-ink-600 transition-colors hover:border-ink-300 hover:text-ink-900"
              }
            >
              {option.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
