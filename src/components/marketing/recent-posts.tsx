import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/database.types";

/**
 * Cover art per post. The blog_posts rows carry a cover_image_url column but
 * it is null for the seeded posts, so these local files are the fallback —
 * set cover_image_url in Supabase and it takes precedence automatically.
 */
const FALLBACK_COVERS: Record<string, string> = {
  "florida-real-estate-license-fast": "/blog/florida-real-estate-license-fast.png",
  "salary-income-licensed-cam": "/blog/salary-income-licensed-cam.png",
  "hoa-board-member-certification-fl": "/blog/hoa-board-member-certification-fl.png",
};

export function RecentPosts({
  posts,
  withExcerpt = false,
}: {
  posts: BlogPost[];
  /**
   * Show the standfirst under each title. The guide pages carry it — their
   * rail is the end of a long read, so a title alone is a thin invitation.
   * The home page does not: there the rail is one of many, and three
   * paragraphs of teaser would out-shout the sections around it.
   */
  withExcerpt?: boolean;
}) {
  if (!posts.length) return null;

  return (
    <section className="border-t border-ink-200/70 bg-white">
      <div className="container-page py-16 lg:py-20">
        <h2 className="font-display text-[2rem] lg:text-[2.5rem]">Recent Posts</h2>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const cover = post.cover_image_url ?? FALLBACK_COVERS[post.slug] ?? null;
            return (
              <li key={post.id}>
                <article className="group relative flex h-full flex-col rounded-2xl bg-white p-3 ring-1 ring-ink-200/60 transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card">
                  <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl bg-ink-100">
                    {cover ? (
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                      />
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-1 flex-col px-2 pb-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-[15px] leading-snug font-medium text-ink-900">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="transition-colors duration-200 before:absolute before:inset-0 before:content-[''] group-hover:text-brand-700"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <ArrowRight
                        className="mt-0.5 size-4 shrink-0 text-ink-400 transition-[transform,color] duration-300 ease-out-soft group-hover:translate-x-1 group-hover:text-brand-600"
                        aria-hidden
                      />
                    </div>

                    {withExcerpt && post.excerpt ? (
                      <p className="mt-3 line-clamp-3 text-[13.5px] leading-relaxed text-ink-500">
                        {post.excerpt}
                      </p>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
