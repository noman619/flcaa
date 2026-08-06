"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/auth";
import { generateCertificateNumber, getWriteClient } from "@/lib/fulfillment";
import { formatShortDate } from "@/lib/utils";
import type { ExamQuestion } from "@/lib/database.types";

export type ActionState = { error?: string; notice?: string };

/* ------------------------------- progress -------------------------------- */

/**
 * Marks a lesson complete/incomplete. Also issues the certificate the moment
 * the completion + passing-exam conditions are met.
 */
export async function setLessonComplete(
  enrollmentId: string,
  lessonId: string,
  complete: boolean,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const supabase = await createClient();

  // RLS restricts this to the owner, but check explicitly for a clean message.
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, user_id, course_id, access_expires_at")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment || enrollment.user_id !== user.id) {
    return { error: "You are not enrolled in this course." };
  }
  if (
    enrollment.access_expires_at &&
    new Date(enrollment.access_expires_at).getTime() < Date.now()
  ) {
    return { error: "Your access to this course has expired." };
  }

  if (complete) {
    const { error } = await supabase.from("lesson_progress").upsert(
      {
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "enrollment_id,lesson_id" },
    );
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("enrollment_id", enrollmentId)
      .eq("lesson_id", lessonId);
    if (error) return { error: error.message };
  }

  await maybeIssueCertificate(enrollmentId);
  revalidatePath(`/dashboard/courses/${enrollment.course_id}`);
  revalidatePath("/dashboard");
  return {};
}

/**
 * Business rule: a certificate is issued once every lesson is complete AND at
 * least one exam attempt passed at or above the course's passing score.
 * Courses with no exam questions only require 100% lesson completion.
 */
export async function maybeIssueCertificate(enrollmentId: string) {
  const supabase = await createClient();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, course_id, completed_at, certificate_number")
    .eq("id", enrollmentId)
    .maybeSingle();

  if (!enrollment || enrollment.certificate_number) return;

  const [{ data: modules }, { data: progress }, { data: attempts }, { data: course }] =
    await Promise.all([
      supabase
        .from("course_modules")
        .select("id, lessons(id)")
        .eq("course_id", enrollment.course_id),
      supabase
        .from("lesson_progress")
        .select("lesson_id, completed_at")
        .eq("enrollment_id", enrollmentId),
      supabase.from("exam_attempts").select("passed").eq("enrollment_id", enrollmentId),
      supabase
        .from("courses")
        .select("id, track:tracks(slug)")
        .eq("id", enrollment.course_id)
        .maybeSingle(),
    ]);

  const totalLessons = ((modules ?? []) as unknown as { lessons: { id: string }[] }[])
    .reduce((sum, m) => sum + (m.lessons?.length ?? 0), 0);

  const completed = (progress ?? []).filter((p) => p.completed_at).length;
  if (totalLessons === 0 || completed < totalLessons) return;

  const { count: questionCount } = await supabase
    .from("exam_questions")
    .select("id", { count: "exact", head: true })
    .eq("course_id", enrollment.course_id);

  const examRequired = (questionCount ?? 0) > 0;
  const passed = (attempts ?? []).some((a) => a.passed);
  if (examRequired && !passed) return;

  const trackSlug =
    (course as unknown as { track: { slug: string } | null } | null)?.track?.slug ??
    null;

  await supabase
    .from("enrollments")
    .update({
      completed_at: new Date().toISOString(),
      certificate_number: generateCertificateNumber(trackSlug),
    })
    .eq("id", enrollmentId);
}

/* --------------------------------- exam ---------------------------------- */

const submitExamSchema = z.object({
  enrollmentId: z.string().uuid(),
  answers: z.array(
    z.object({ question_id: z.string().uuid(), selected_index: z.number().int() }),
  ),
});

export async function submitExamAttempt(input: {
  enrollmentId: string;
  answers: { question_id: string; selected_index: number }[];
}): Promise<ActionState & { attemptId?: string; scorePercent?: number; passed?: boolean }> {
  const parsed = submitExamSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid exam submission." };

  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const supabase = await createClient();
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, user_id, course_id")
    .eq("id", parsed.data.enrollmentId)
    .maybeSingle();

  if (!enrollment || enrollment.user_id !== user.id) {
    return { error: "You are not enrolled in this course." };
  }

  const { data: course } = await supabase
    .from("courses")
    .select("passing_exam_score")
    .eq("id", enrollment.course_id)
    .maybeSingle();

  const passingScore = course?.passing_exam_score ?? 70;

  // Grade on the server — the client never sees correct_index before submitting.
  const questionIds = parsed.data.answers.map((a) => a.question_id);
  const { data: questions } = await supabase
    .from("exam_questions")
    .select("id, correct_index")
    .in("id", questionIds);

  const correctById = new Map(
    ((questions ?? []) as Pick<ExamQuestion, "id" | "correct_index">[]).map((q) => [
      q.id,
      q.correct_index,
    ]),
  );

  const graded = parsed.data.answers.filter(
    (a) => correctById.get(a.question_id) === a.selected_index,
  ).length;

  const total = parsed.data.answers.length || 1;
  const scorePercent = Math.round((graded / total) * 100);
  const passed = scorePercent >= passingScore;

  const { data: attempt, error } = await supabase
    .from("exam_attempts")
    .insert({
      enrollment_id: enrollment.id,
      score_percent: scorePercent,
      passed,
      answers: parsed.data.answers,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await maybeIssueCertificate(enrollment.id);
  revalidatePath(`/dashboard/courses/${enrollment.course_id}`);
  revalidatePath("/dashboard");

  return { attemptId: attempt.id, scorePercent, passed };
}

/* ------------------------------ extensions -------------------------------- */

/**
 * Applies a purchased "Course Extension" to another enrollment. The extension
 * enrollment is consumed (marked complete) so it cannot be reused.
 */
export async function applyExtension(
  extensionEnrollmentId: string,
  targetEnrollmentId: string,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("enrollments")
    .select("id, user_id, completed_at, access_expires_at, course:courses(offering_type, access_days)")
    .in("id", [extensionEnrollmentId, targetEnrollmentId]);

  const list = (rows ?? []) as unknown as {
    id: string;
    user_id: string;
    completed_at: string | null;
    access_expires_at: string | null;
    course: { offering_type: string; access_days: number | null } | null;
  }[];

  const extension = list.find((r) => r.id === extensionEnrollmentId);
  const target = list.find((r) => r.id === targetEnrollmentId);

  if (!extension || !target) return { error: "Could not find those enrollments." };
  if (extension.user_id !== user.id || target.user_id !== user.id) {
    return { error: "Those enrollments do not belong to you." };
  }
  if (extension.course?.offering_type !== "course_extension") {
    return { error: "That purchase is not a course extension." };
  }
  if (extension.completed_at) {
    return { error: "That extension has already been used." };
  }
  if (extension.id === target.id) {
    return { error: "Pick a different course to extend." };
  }

  const addDays = extension.course?.access_days ?? 90;
  // Extend from today when access has already lapsed, otherwise from the current expiry.
  const from =
    target.access_expires_at && new Date(target.access_expires_at) > new Date()
      ? new Date(target.access_expires_at)
      : new Date();
  from.setDate(from.getDate() + addDays);

  const { error: updateError } = await supabase
    .from("enrollments")
    .update({ access_expires_at: from.toISOString() })
    .eq("id", targetEnrollmentId);

  if (updateError) return { error: updateError.message };

  await supabase
    .from("enrollments")
    .update({ completed_at: new Date().toISOString() })
    .eq("id", extensionEnrollmentId);

  revalidatePath("/dashboard");
  return {
    notice: `Access extended by ${addDays} days — new expiry ${formatShortDate(from)}.`,
  };
}

/* -------------------------------- profile --------------------------------- */

export async function updateProfile(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const schema = z.object({
    fullName: z.string().min(2, "Enter your full name.").max(120),
    phone: z.string().max(40).optional().or(z.literal("")),
  });

  const parsed = schema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your details." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/", "layout");
  return { notice: "Profile updated." };
}

/* -------------------------------- messages -------------------------------- */

export async function sendMessage(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const enrollmentId = String(formData.get("enrollmentId") ?? "");
  const body = String(formData.get("body") ?? "").trim();

  if (!enrollmentId) return { error: "Missing enrollment." };
  if (body.length < 2) return { error: "Write a message first." };
  if (body.length > 4000) return { error: "Messages are limited to 4000 characters." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ enrollment_id: enrollmentId, sender_id: user.id, body });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/messages");
  return { notice: "Message sent. An instructor replies within one business day." };
}

/* --------------------------------- reviews -------------------------------- */

export async function submitReview(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You must be signed in." };

  const schema = z.object({
    courseId: z.string().uuid(),
    rating: z.coerce.number().int().min(1).max(5),
    body: z.string().max(2000).optional(),
  });

  const parsed = schema.safeParse({
    courseId: formData.get("courseId"),
    rating: formData.get("rating"),
    body: formData.get("body"),
  });
  if (!parsed.success) return { error: "Pick a rating between 1 and 5 stars." };

  const supabase = await createClient();

  // Only verified purchasers may review.
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", parsed.data.courseId)
    .maybeSingle();

  if (!enrollment) {
    return { error: "Only students who bought this course can review it." };
  }

  const { error } = await supabase.from("reviews").upsert(
    {
      user_id: user.id,
      course_id: parsed.data.courseId,
      rating: parsed.data.rating,
      body: parsed.data.body || null,
      is_published: false,
    },
    { onConflict: "user_id,course_id" },
  );

  if (error) return { error: error.message };

  revalidatePath("/reviews");
  revalidatePath("/dashboard");
  return {
    notice: "Thanks! Your review is queued for moderation and will appear shortly.",
  };
}

/* ------------------------------ admin writes ------------------------------ */

export async function moderateReview(
  reviewId: string,
  publish: boolean,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (user?.profile?.role !== "admin") return { error: "Admins only." };

  const db = await getWriteClient();
  const { error } = await db
    .from("reviews")
    .update({ is_published: publish })
    .eq("id", reviewId);

  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  revalidatePath("/reviews");
  return { notice: publish ? "Review published." : "Review hidden." };
}

export async function markContactHandled(
  messageId: string,
  handled: boolean,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (user?.profile?.role !== "admin") return { error: "Admins only." };

  const db = await getWriteClient();
  const { error } = await db
    .from("contact_messages")
    .update({ handled })
    .eq("id", messageId);

  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return {};
}

export async function setCoursePublished(
  courseId: string,
  published: boolean,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (user?.profile?.role !== "admin") return { error: "Admins only." };

  const db = await getWriteClient();
  const { error } = await db
    .from("courses")
    .update({ is_published: published, updated_at: new Date().toISOString() })
    .eq("id", courseId);

  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { notice: published ? "Course published." : "Course unpublished." };
}
