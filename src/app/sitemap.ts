import type { MetadataRoute } from "next";
import { getCourses, getPublishedPosts } from "@/lib/queries";
import { SITE_URL } from "@/lib/env";
import { RESOURCE_GUIDES } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts] = await Promise.all([
    getCourses().catch(() => []),
    getPublishedPosts().catch(() => []),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = (
    [
      { url: "/", changeFrequency: "weekly", priority: 1 },
      { url: "/real-estate", changeFrequency: "weekly", priority: 0.9 },
      { url: "/cam", changeFrequency: "weekly", priority: 0.9 },
      { url: "/board-members", changeFrequency: "weekly", priority: 0.9 },
      { url: "/courses", changeFrequency: "weekly", priority: 0.8 },
      { url: "/blog", changeFrequency: "weekly", priority: 0.7 },
      {
        url: "/florida-real-estate-license-course",
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: "/florida-real-estate-mutual-recognition-exam-prep",
        changeFrequency: "weekly",
        priority: 0.8,
      },
      ...RESOURCE_GUIDES.map((guide) => ({
        url: guide.path,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
      { url: "/reviews", changeFrequency: "monthly", priority: 0.6 },
      { url: "/contact", changeFrequency: "monthly", priority: 0.6 },
      { url: "/returns-refunds", changeFrequency: "yearly", priority: 0.3 },
      { url: "/privacy", changeFrequency: "yearly", priority: 0.3 },
      { url: "/terms", changeFrequency: "yearly", priority: 0.3 },
    ] satisfies MetadataRoute.Sitemap
  ).map((entry) => ({
    ...entry,
    url: `${SITE_URL}${entry.url}`,
    lastModified: new Date(),
  }));

  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${SITE_URL}/courses/${course.slug}`,
    lastModified: new Date(course.updated_at),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.published_at ?? post.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...courseRoutes, ...postRoutes];
}
