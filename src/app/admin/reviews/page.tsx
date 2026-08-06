import { createClient } from "@/lib/supabase/server";
import { ReviewModerator } from "./review-moderator";

export default async function AdminReviewsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("reviews")
    .select(
      "id, rating, body, is_published, created_at, course:courses(title), author:profiles(full_name)",
    )
    .order("created_at", { ascending: false });

  const reviews = (data ?? []) as unknown as {
    id: string;
    rating: number;
    body: string | null;
    is_published: boolean;
    created_at: string;
    course: { title: string } | null;
    author: { full_name: string | null } | null;
  }[];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-3xl">Reviews</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Reviews are unpublished by default. Publish to show them on the public
          reviews page and the course page.
        </p>
      </header>

      <ReviewModerator reviews={reviews} />
    </div>
  );
}
