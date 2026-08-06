import { createClient } from "@/lib/supabase/server";
import { BlogManager } from "./blog-manager";
import type { BlogPost } from "@/lib/database.types";

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const supabase = await createClient();

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as BlogPost[];
  const editing = edit ? (posts.find((p) => p.id === edit) ?? null) : null;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Blog</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          {posts.length} posts. Bodies are markdown; leaving &ldquo;publish&rdquo;
          unchecked keeps a post as a draft.
        </p>
      </header>

      <BlogManager posts={posts} editing={editing} />
    </div>
  );
}
