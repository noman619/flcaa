import { CourseCard } from "@/components/course/course-card";
import { SectionHeading } from "@/components/marketing/section";
import { getCourses } from "@/lib/queries";
import type { ResourceGuide } from "@/lib/site";

/**
 * The courses a guide funnels to. Split out of GuidePage so a guide with a
 * bespoke hero can still reuse it.
 */
export async function GuideCourses({ guide }: { guide: ResourceGuide }) {
  const all = await getCourses().catch(() => []);
  // Preserve the order declared in RESOURCE_GUIDES, not the catalog's order.
  const courses = guide.courses
    .map((slug) => all.find((c) => c.slug === slug))
    .filter((c) => c !== undefined);

  if (!courses.length) return null;

  return (
    <section className="border-t border-ink-200/70 bg-sand-50">
      <div className="container-page py-14 lg:py-20">
        <SectionHeading title="Courses for this path" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
}
