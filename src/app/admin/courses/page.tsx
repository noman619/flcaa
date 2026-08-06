import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { OFFERING_TYPES } from "@/lib/catalog";
import { PublishToggle } from "./publish-toggle";
import { CouponManager } from "./coupon-manager";
import type { Coupon, Course, Track } from "@/lib/database.types";

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const [{ data: courses }, { data: coupons }] = await Promise.all([
    supabase
      .from("courses")
      .select("*, track:tracks(name, slug)")
      .order("sort_order"),
    supabase.from("coupons").select("*").order("code"),
  ]);

  const rows = (courses ?? []) as unknown as (Course & {
    track: Pick<Track, "name" | "slug"> | null;
  })[];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="font-display text-3xl">Courses</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {rows.length} courses in the catalog. Edit pricing, hours and content.
        </p>
      </header>

      <div className="overflow-x-auto rounded-card border border-ink-200 bg-white">
        <table className="w-full min-w-208 text-sm">
          <thead className="bg-ink-50 text-left text-xs tracking-wider text-ink-500 uppercase">
            <tr>
              <th scope="col" className="px-5 py-3 font-medium">Course</th>
              <th scope="col" className="px-5 py-3 font-medium">Track</th>
              <th scope="col" className="px-5 py-3 font-medium">Type</th>
              <th scope="col" className="px-5 py-3 font-medium">Hours</th>
              <th scope="col" className="px-5 py-3 font-medium">Price</th>
              <th scope="col" className="px-5 py-3 font-medium">Published</th>
              <th scope="col" className="px-5 py-3 font-medium">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((course) => (
              <tr key={course.id} className="hover:bg-ink-50/60">
                <td className="px-5 py-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-medium text-ink-900 hover:underline"
                  >
                    {course.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-xs text-ink-400">
                    {course.slug}
                  </p>
                </td>
                <td className="px-5 py-3 text-ink-600">{course.track?.name}</td>
                <td className="px-5 py-3">
                  <Badge variant="outline" size="sm">
                    {OFFERING_TYPES[course.offering_type]?.label}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-ink-600">{course.hours ?? "—"}</td>
                <td className="px-5 py-3 font-medium">
                  {formatPrice(course.price_cents)}
                </td>
                <td className="px-5 py-3">
                  <PublishToggle
                    courseId={course.id}
                    published={course.is_published}
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:underline"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CouponManager coupons={(coupons ?? []) as Coupon[]} />
    </div>
  );
}
