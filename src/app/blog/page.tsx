import type { Metadata } from "next";
import { Newspaper } from "lucide-react";
import { getPublishedPosts } from "@/lib/queries";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/marketing/page-hero";
import { BlogIndex } from "@/components/blog/blog-index";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: "Blog | Prolicense Florida School" },
  description:
    "Guides on getting licensed in Florida: timelines, exam strategy, CAM salaries, HOA board requirements and continuing-education deadlines.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Blog | Prolicense Florida School", url: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Blog"
        description="Plain-English answers about getting licensed in Florida — written by the instructors who teach the courses."
        breadcrumb={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      {posts.length === 0 ? (
        <div className="container-page py-14 lg:py-20">
          <EmptyState
            icon={Newspaper}
            title="No articles published yet"
            description="New guides are added regularly. Check back soon."
            action={<ButtonLink href="/courses">Browse courses instead</ButtonLink>}
          />
        </div>
      ) : (
        <BlogIndex posts={posts} />
      )}
    </>
  );
}
