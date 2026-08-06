import "server-only";

import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import type {
  BlogPost,
  Course,
  CourseModule,
  Lesson,
  Review,
  Track,
} from "@/lib/database.types";

export type CourseWithTrack = Course & { track: Track };
export type ModuleWithLessons = CourseModule & { lessons: Lesson[] };
export type CourseDetail = CourseWithTrack & { modules: ModuleWithLessons[] };

const bySortOrder = <T extends { sort_order: number }>(a: T, b: T) =>
  a.sort_order - b.sort_order;

/* ---------------------------------- tracks --------------------------------- */

export const getTracks = cache(async (): Promise<Track[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("sort_order");
  if (error) throw new Error(`Failed to load tracks: ${error.message}`);
  return data ?? [];
});

export const getTrack = cache(async (slug: string): Promise<Track | null> => {
  const tracks = await getTracks();
  return tracks.find((t) => t.slug === slug) ?? null;
});

/* --------------------------------- courses --------------------------------- */

export const getCourses = cache(async (): Promise<CourseWithTrack[]> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("courses")
    .select("*, track:tracks(*)")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new Error(`Failed to load courses: ${error.message}`);
  // Pricing-tier variants stay purchasable but must not appear in listings.
  // Filtered here rather than in the query so this still works before the
  // is_listed migration has been run (undefined reads as listed).
  return (data ?? []).filter(
    (c) => (c as { is_listed?: boolean }).is_listed !== false,
  ) as unknown as CourseWithTrack[];
});

export const getCoursesByTrack = cache(
  async (trackSlug: string): Promise<CourseWithTrack[]> => {
    const courses = await getCourses();
    return courses.filter((c) => c.track?.slug === trackSlug);
  },
);

export const getCourseBySlug = cache(
  async (slug: string): Promise<CourseDetail | null> => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*, track:tracks(*), modules:course_modules(*, lessons(*))")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(`Failed to load course "${slug}": ${error.message}`);
    if (!data) return null;

    const course = data as unknown as CourseDetail;
    course.modules = (course.modules ?? []).sort(bySortOrder).map((m) => ({
      ...m,
      lessons: (m.lessons ?? []).sort(bySortOrder),
    }));
    return course;
  },
);

/** Every published course slug — used by generateStaticParams + sitemap. */
export const getCourseSlugs = cache(async (): Promise<string[]> => {
  const courses = await getCourses();
  return courses.map((c) => c.slug);
});

/** Courses grouped by offering_type, preserving catalog order. */
export function groupByOffering<T extends { offering_type: string }>(courses: T[]) {
  const groups = new Map<string, T[]>();
  for (const course of courses) {
    const list = groups.get(course.offering_type) ?? [];
    list.push(course);
    groups.set(course.offering_type, list);
  }
  return groups;
}

/* ---------------------------------- blog ----------------------------------- */

export const getPublishedPosts = cache(async (limit?: number): Promise<BlogPost[]> => {
  const supabase = createPublicClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .not("published_at", "is", null)
    .order("published_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load blog posts: ${error.message}`);
  return data ?? [];
});

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();
  if (error) throw new Error(`Failed to load post "${slug}": ${error.message}`);
  return data;
});

/* --------------------------------- reviews --------------------------------- */

export type PublishedReview = Review & {
  course: Pick<Course, "id" | "slug" | "title"> | null;
  author: { full_name: string | null } | null;
};

export const getPublishedReviews = cache(
  async (opts: { courseId?: string; limit?: number } = {}): Promise<PublishedReview[]> => {
    const supabase = createPublicClient();
    let query = supabase
      .from("reviews")
      .select("*, course:courses(id, slug, title), author:profiles(full_name)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (opts.courseId) query = query.eq("course_id", opts.courseId);
    if (opts.limit) query = query.limit(opts.limit);

    const { data, error } = await query;
    // Reviews are decorative on public pages — never break the page over them.
    if (error) return [];
    return (data ?? []) as unknown as PublishedReview[];
  },
);

export function averageRating(reviews: { rating: number }[]): number | null {
  if (!reviews.length) return null;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

/* -------------------------------- utilities -------------------------------- */

export function courseTotals(modules: ModuleWithLessons[]) {
  const lessons = modules.flatMap((m) => m.lessons);
  return {
    moduleCount: modules.length,
    lessonCount: lessons.length,
    minutes: lessons.reduce((sum, l) => sum + (l.duration_minutes ?? 0), 0),
  };
}
