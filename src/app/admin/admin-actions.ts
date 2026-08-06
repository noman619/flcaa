"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { getWriteClient } from "@/lib/fulfillment";
import { slugify } from "@/lib/utils";

export type AdminState = { error?: string; notice?: string };

async function assertAdmin() {
  const user = await getCurrentUser();
  if (user?.profile?.role !== "admin") throw new Error("Admins only.");
  return user;
}

/* -------------------------------- courses -------------------------------- */

const courseSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(200),
  subtitle: z.string().max(300).optional().or(z.literal("")),
  description: z.string().max(8000).optional().or(z.literal("")),
  priceCents: z.coerce.number().int().min(0).max(1_000_000),
  hours: z.coerce.number().min(0).max(999),
  accessDays: z.coerce.number().int().min(1).max(3650),
  passingScore: z.coerce.number().int().min(1).max(100),
  isPublished: z.union([z.literal("on"), z.null(), z.literal("")]).optional(),
});

export async function updateCourse(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Admins only." };
  }

  const parsed = courseSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    subtitle: formData.get("subtitle"),
    description: formData.get("description"),
    priceCents: formData.get("priceCents"),
    hours: formData.get("hours"),
    accessDays: formData.get("accessDays"),
    passingScore: formData.get("passingScore"),
    isPublished: formData.get("isPublished"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form." };
  }

  const db = await getWriteClient();
  const { error } = await db
    .from("courses")
    .update({
      title: parsed.data.title,
      subtitle: parsed.data.subtitle || null,
      description: parsed.data.description || null,
      price_cents: parsed.data.priceCents,
      hours: parsed.data.hours,
      access_days: parsed.data.accessDays,
      passing_exam_score: parsed.data.passingScore,
      is_published: parsed.data.isPublished === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", parsed.data.id);

  if (error) return { error: error.message };

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  return { notice: "Course saved." };
}

/* -------------------------------- modules -------------------------------- */

export async function createModule(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Admins only." };
  }

  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const sortOrder = Number(formData.get("sortOrder") ?? 0);

  if (!courseId || title.length < 2) return { error: "Give the module a title." };

  const db = await getWriteClient();
  const { error } = await db
    .from("course_modules")
    .insert({ course_id: courseId, title, sort_order: sortOrder });

  if (error) return { error: error.message };
  revalidatePath(`/admin/courses/${courseId}`);
  return { notice: "Module added." };
}

export async function createLesson(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Admins only." };
  }

  const schema = z.object({
    moduleId: z.string().uuid(),
    courseId: z.string().uuid(),
    title: z.string().min(2).max(200),
    kind: z.enum(["video", "text", "quiz", "download"]),
    content: z.string().max(20000).optional().or(z.literal("")),
    durationMinutes: z.coerce.number().int().min(0).max(600),
    sortOrder: z.coerce.number().int().min(0).max(999),
  });

  const parsed = schema.safeParse({
    moduleId: formData.get("moduleId"),
    courseId: formData.get("courseId"),
    title: formData.get("title"),
    kind: formData.get("kind"),
    content: formData.get("content"),
    durationMinutes: formData.get("durationMinutes"),
    sortOrder: formData.get("sortOrder"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the lesson fields." };
  }

  const db = await getWriteClient();
  const { error } = await db.from("lessons").insert({
    module_id: parsed.data.moduleId,
    title: parsed.data.title,
    kind: parsed.data.kind,
    content: parsed.data.content || null,
    duration_minutes: parsed.data.durationMinutes,
    sort_order: parsed.data.sortOrder,
  });

  if (error) return { error: error.message };
  revalidatePath(`/admin/courses/${parsed.data.courseId}`);
  return { notice: "Lesson added." };
}

export async function deleteLesson(lessonId: string, courseId: string) {
  await assertAdmin();
  const db = await getWriteClient();
  await db.from("lessons").delete().eq("id", lessonId);
  revalidatePath(`/admin/courses/${courseId}`);
}

/* ----------------------------- exam questions ----------------------------- */

export async function createExamQuestion(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Admins only." };
  }

  const choices = [0, 1, 2, 3]
    .map((i) => String(formData.get(`choice${i}`) ?? "").trim())
    .filter(Boolean);

  const schema = z.object({
    courseId: z.string().uuid(),
    question: z.string().min(5).max(1000),
    correctIndex: z.coerce.number().int().min(0),
    explanation: z.string().max(2000).optional().or(z.literal("")),
  });

  const parsed = schema.safeParse({
    courseId: formData.get("courseId"),
    question: formData.get("question"),
    correctIndex: formData.get("correctIndex"),
    explanation: formData.get("explanation"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the question." };
  }
  if (choices.length < 2) return { error: "Provide at least two answer choices." };
  if (parsed.data.correctIndex >= choices.length) {
    return { error: "The correct answer must be one of the choices you filled in." };
  }

  const db = await getWriteClient();
  const { error } = await db.from("exam_questions").insert({
    course_id: parsed.data.courseId,
    question: parsed.data.question,
    choices,
    correct_index: parsed.data.correctIndex,
    explanation: parsed.data.explanation || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/questions");
  return { notice: "Question added to the bank." };
}

export async function deleteExamQuestion(questionId: string) {
  await assertAdmin();
  const db = await getWriteClient();
  await db.from("exam_questions").delete().eq("id", questionId);
  revalidatePath("/admin/questions");
}

/* --------------------------------- blog ---------------------------------- */

export async function upsertBlogPost(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  let user;
  try {
    user = await assertAdmin();
  } catch {
    return { error: "Admins only." };
  }

  const schema = z.object({
    id: z.string().uuid().optional().or(z.literal("")),
    title: z.string().min(3).max(200),
    slug: z.string().max(200).optional().or(z.literal("")),
    excerpt: z.string().max(400).optional().or(z.literal("")),
    coverImageUrl: z.string().url().optional().or(z.literal("")),
    body: z.string().max(60000).optional().or(z.literal("")),
    publish: z.union([z.literal("on"), z.null(), z.literal("")]).optional(),
  });

  const parsed = schema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    coverImageUrl: formData.get("coverImageUrl"),
    body: formData.get("body"),
    publish: formData.get("publish"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the post fields." };
  }

  const slug = parsed.data.slug?.trim()
    ? slugify(parsed.data.slug)
    : slugify(parsed.data.title);

  const row = {
    slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt || null,
    cover_image_url: parsed.data.coverImageUrl || null,
    body_markdown: parsed.data.body || null,
    author_id: user.id,
    published_at: parsed.data.publish === "on" ? new Date().toISOString() : null,
  };

  const db = await getWriteClient();
  const { error } = parsed.data.id
    ? await db.from("blog_posts").update(row).eq("id", parsed.data.id)
    : await db.from("blog_posts").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { notice: parsed.data.id ? "Post updated." : "Post created." };
}

export async function deleteBlogPost(postId: string) {
  await assertAdmin();
  const db = await getWriteClient();
  await db.from("blog_posts").delete().eq("id", postId);
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

/* -------------------------------- coupons --------------------------------- */

export async function upsertCoupon(
  _prev: AdminState,
  formData: FormData,
): Promise<AdminState> {
  try {
    await assertAdmin();
  } catch {
    return { error: "Admins only." };
  }

  const schema = z.object({
    code: z.string().min(3).max(40),
    percentOff: z.coerce.number().int().min(0).max(100).optional(),
    amountOffCents: z.coerce.number().int().min(0).max(1_000_000).optional(),
    active: z.union([z.literal("on"), z.null(), z.literal("")]).optional(),
  });

  const parsed = schema.safeParse({
    code: formData.get("code"),
    percentOff: formData.get("percentOff") || 0,
    amountOffCents: formData.get("amountOffCents") || 0,
    active: formData.get("active"),
  });

  if (!parsed.success) return { error: "Check the coupon fields." };
  if (!parsed.data.percentOff && !parsed.data.amountOffCents) {
    return { error: "Set either a percentage or a fixed amount off." };
  }

  const db = await getWriteClient();
  const { error } = await db.from("coupons").upsert({
    code: parsed.data.code.trim().toUpperCase(),
    percent_off: parsed.data.percentOff || null,
    amount_off_cents: parsed.data.amountOffCents || null,
    active: parsed.data.active === "on",
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/courses");
  return { notice: "Coupon saved." };
}
