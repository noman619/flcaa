import type { Metadata } from "next";
import { MessageSquare } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getMyEnrollments } from "@/lib/enrollments";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { MessageThread } from "./message-thread";
import type { Message } from "@/lib/database.types";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false, follow: false },
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const [{ thread }, user] = await Promise.all([searchParams, requireUser()]);
  const enrollments = await getMyEnrollments(user.id);

  const threads = enrollments.filter(
    (e) => e.course?.offering_type !== "course_extension",
  );

  if (!threads.length) {
    return (
      <div className="space-y-8">
        <header>
          <h1 className="font-display text-3xl">Messages</h1>
        </header>
        <EmptyState
          icon={MessageSquare}
          title="No conversations yet"
          description="Instructor messaging opens up once you are enrolled in a course."
          action={<ButtonLink href="/courses">Browse courses</ButtonLink>}
        />
      </div>
    );
  }

  const active = threads.find((t) => t.id === thread) ?? threads[0]!;

  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .eq("enrollment_id", active.id)
    .order("created_at", { ascending: true });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-3xl">Messages</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          One thread per course. A licensed Florida instructor replies within one
          business day.
        </p>
      </header>

      <MessageThread
        currentUserId={user.id}
        activeEnrollmentId={active.id}
        threads={threads.map((t) => ({
          id: t.id,
          title: t.course?.title ?? "Course",
          trackSlug: t.course?.track?.slug ?? "real-estate",
        }))}
        messages={
          ((messages ?? []) as Pick<
            Message,
            "id" | "sender_id" | "body" | "created_at"
          >[]) ?? []
        }
      />
    </div>
  );
}
