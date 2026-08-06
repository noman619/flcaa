import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronRight } from "lucide-react";
import { getPostBySlug, getPublishedPosts } from "@/lib/queries";
import { SITE } from "@/lib/site";
import { formatShortDate, initials, readingMinutes } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";
import { YouTubeEmbed } from "@/components/course/youtube-embed";
import { POST_EXTRAS } from "@/content/post-extras";
import { PostFooter } from "@/components/blog/post-footer";

export const revalidate = 3600;

const CATEGORY_LABEL: Record<string, string> = {
  "real-estate": "Real Estate",
  cam: "CAM",
  "board-members": "Board Members",
};

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const extras = POST_EXTRAS[post.slug];
  const all = await getPublishedPosts();
  const category = (post as typeof post & { category?: string }).category;

  // Same topic first, then the newest of anything else.
  const sameTopic = all.filter(
    (p) =>
      p.id !== post.id && (p as typeof p & { category?: string }).category === category,
  );
  const rest = all.filter(
    (p) =>
      p.id !== post.id && (p as typeof p & { category?: string }).category !== category,
  );
  const recent = [...sameTopic, ...rest].slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? undefined,
    image: post.cover_image_url ?? undefined,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* ------------------------------ header ------------------------------ */}
        <header className="border-b border-ink-200/70 bg-sand-100">
          <div className="container-page max-w-3xl py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-7">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-500">
                <li>
                  <Link href="/" className="transition-colors hover:text-ink-900">
                    Home
                  </Link>
                </li>
                <ChevronRight className="size-3.5 text-ink-300" aria-hidden />
                <li>
                  <Link href="/blog" className="transition-colors hover:text-ink-900">
                    Blog
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="flex flex-wrap items-center gap-3 text-[11px] tracking-[0.16em] uppercase">
              {category && CATEGORY_LABEL[category] ? (
                <span className="rounded-full bg-brand-800 px-3 py-1 text-white">
                  {CATEGORY_LABEL[category]}
                </span>
              ) : null}
            </div>

            <h1 className="mt-6 font-display text-[2rem] leading-[1.1] text-ink-950 lg:text-[2.9rem]">
              {post.title}
            </h1>

            {post.excerpt ? (
              <p className="mt-6 text-lg leading-relaxed text-ink-600">
                {post.excerpt}
              </p>
            ) : null}

            {/*
              Byline, as the original carries it: who wrote it, when, and how
              long it will take. The reading time is computed from the body
              rather than stored, so an edited article cannot advertise a
              stale figure.
            */}
            <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink-200/70 pt-6 text-[13px] text-ink-500">
              <span className="flex size-8 items-center justify-center rounded-full bg-brand-800 text-[11px] font-medium text-white">
                {initials(SITE.name)}
              </span>
              <span className="font-medium text-ink-800">{SITE.name}</span>
              <span className="text-ink-300" aria-hidden>
                ·
              </span>
              {post.published_at ? (
                <>
                  <time dateTime={post.published_at}>
                    {formatShortDate(post.published_at)}
                  </time>
                  <span className="text-ink-300" aria-hidden>
                    ·
                  </span>
                </>
              ) : null}
              <span>{readingMinutes(post.body_markdown)} min read</span>
            </div>
          </div>
        </header>

        {/*
          An article with a video leads with the video instead: the original
          does, and a decorative cover above a real one is two hero images
          arguing. The cover still identifies the post in the blog listing.
        */}
        {post.cover_image_url && !extras?.video ? (
          <div className="container-page max-w-4xl">
            <Image
              src={post.cover_image_url}
              alt=""
              width={1200}
              height={750}
              priority
              className="h-auto w-full rounded-b-hero object-cover"
            />
          </div>
        ) : null}

        {/* ------------------------------- body ------------------------------- */}
        <div className="container-page max-w-3xl py-14 lg:py-20">
          {extras?.video ? (
            <div className="mb-12">
              <YouTubeEmbed
                id={extras.video.id}
                title={extras.video.title}
                poster={extras.video.poster}
              />
            </div>
          ) : null}

          {post.body_markdown ? (
            <div className="prose-flca">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Article images are served from our own /public, so they can
                  // be optimised and lazy-loaded instead of dropped in raw.
                  img: ({ src, alt }) =>
                    typeof src === "string" ? (
                      <Image
                        src={src}
                        alt={alt ?? ""}
                        width={1100}
                        height={700}
                        className="h-auto w-full rounded-card"
                      />
                    ) : null,
                }}
              >
                {post.body_markdown}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="rounded-panel border border-dashed border-ink-300 bg-sand-50 px-6 py-10 text-center text-sm text-ink-500">
              The full article is being prepared. In the meantime, our advisors can
              answer any question directly.
            </p>
          )}

          {extras?.cta ? (
            <div className="mt-12">
              <ButtonLink href={extras.cta.href} size="lg" variant="leaf">
                {extras.cta.label}
              </ButtonLink>
            </div>
          ) : null}

          <PostFooter
            slug={post.slug}
            title={post.title}
            category={category}
            categoryLabel={category ? CATEGORY_LABEL[category] : undefined}
          />
        </div>
      </article>

      {/* --------------------------- recent posts --------------------------- */}
      {recent.length ? (
        <section className="border-t border-ink-200/70 bg-sand-50">
          <div className="container-page py-14 lg:py-20">
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-display text-[1.6rem] text-ink-950 lg:text-[2rem]">
                Recent Posts
              </h2>
              <Link
                href="/blog"
                className="text-sm text-brand-700 underline underline-offset-4 hover:text-brand-900"
              >
                See All
              </Link>
            </div>

            <div className="mt-9 grid gap-6 sm:grid-cols-3">
              {recent.map((p) => (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}`}
                  className="group overflow-hidden rounded-panel border border-ink-200/70 bg-white shadow-card transition-[transform,box-shadow] duration-300 ease-out-soft hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-sand-100">
                    {p.cover_image_url ? (
                      <Image
                        src={p.cover_image_url}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <p className="p-6 text-[14.5px] leading-snug font-medium text-brand-700">
                    {p.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
