import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getMyEnrollments } from "@/lib/enrollments";
import { ProfileForm } from "./profile-form";
import { ReviewForm } from "./review-form";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Account settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const user = await requireUser();
  const enrollments = await getMyEnrollments(user.id);

  const reviewable = enrollments
    .filter((e) => e.course && e.course.offering_type !== "course_extension")
    .map((e) => ({ courseId: e.course_id, title: e.course!.title }));

  return (
    <div className="max-w-3xl space-y-10">
      <header>
        <h1 className="font-display text-3xl">Account settings</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          One account covers every course you own — there is nothing else to log
          into.
        </p>
      </header>

      <section className="rounded-card border border-ink-200 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Your details</h2>
        <div className="mt-5">
          <ProfileForm
            fullName={user.profile?.full_name ?? ""}
            phone={user.profile?.phone ?? ""}
            email={user.email ?? ""}
          />
        </div>
      </section>

      <section className="rounded-card border border-ink-200 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Account</h2>
        <dl className="mt-5 divide-y divide-ink-100 text-sm">
          <div className="flex justify-between py-3">
            <dt className="text-ink-500">Email address</dt>
            <dd className="font-medium text-ink-900">{user.email}</dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-ink-500">Role</dt>
            <dd className="font-medium text-ink-900 capitalize">
              {user.profile?.role ?? "student"}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-ink-500">Member since</dt>
            <dd className="font-medium text-ink-900">
              {formatDate(user.profile?.created_at)}
            </dd>
          </div>
          <div className="flex justify-between py-3">
            <dt className="text-ink-500">Courses owned</dt>
            <dd className="font-medium text-ink-900">{enrollments.length}</dd>
          </div>
        </dl>
      </section>

      {reviewable.length ? (
        <section className="rounded-card border border-ink-200 bg-white p-6 shadow-card">
          <h2 className="font-display text-lg">Leave a review</h2>
          <p className="mt-1.5 text-sm text-ink-500">
            Only students who bought a course can review it. Reviews are published
            after a quick moderation check.
          </p>
          <div className="mt-5">
            <ReviewForm courses={reviewable} />
          </div>
        </section>
      ) : null}

      <section className="rounded-card border border-ink-200 bg-white p-6 shadow-card">
        <h2 className="font-display text-lg">Sign out</h2>
        <p className="mt-1.5 text-sm text-ink-500">
          Signs you out on this device only.
        </p>
        <form action="/auth/signout" method="post" className="mt-5">
          <Button type="submit" variant="outline">
            Sign out
          </Button>
        </form>
      </section>
    </div>
  );
}
