"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ExternalLink, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  deleteBlogPost,
  upsertBlogPost,
  type AdminState,
} from "@/app/admin/admin-actions";
import { formatShortDate } from "@/lib/utils";
import type { BlogPost } from "@/lib/database.types";

function Submit({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      {editing ? "Update post" : "Create post"}
    </Button>
  );
}

export function BlogManager({
  posts,
  editing,
}: {
  posts: BlogPost[];
  editing: BlogPost | null;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState<AdminState, FormData>(
    upsertBlogPost,
    {},
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex flex-wrap items-center gap-3 rounded-card border border-ink-200 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink-900">{post.title}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-400">/{post.slug}</p>
            </div>
            <Badge
              variant={post.published_at ? "success" : "warning"}
              size="sm"
            >
              {post.published_at
                ? `Published ${formatShortDate(post.published_at)}`
                : "Draft"}
            </Badge>
            <div className="flex items-center gap-1">
              {post.published_at ? (
                <Link
                  href={`/blog/${post.slug}`}
                  className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                  aria-label={`View ${post.title}`}
                >
                  <ExternalLink className="size-4" aria-hidden />
                </Link>
              ) : null}
              <Link
                href={`/admin/blog?edit=${post.id}`}
                className="rounded p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                aria-label={`Edit ${post.title}`}
              >
                <Pencil className="size-4" aria-hidden />
              </Link>
              <button
                type="button"
                onClick={async () => {
                  if (!window.confirm(`Delete "${post.title}"?`)) return;
                  await deleteBlogPost(post.id);
                  router.push("/admin/blog");
                  router.refresh();
                }}
                aria-label={`Delete ${post.title}`}
                className="rounded p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </div>
          </li>
        ))}
        {posts.length === 0 ? (
          <li className="rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-12 text-center text-sm text-ink-500">
            No posts yet.
          </li>
        ) : null}
      </ul>

      <form
        key={editing?.id ?? "new"}
        action={formAction}
        className="space-y-4 rounded-card border border-ink-200 bg-white p-6 lg:sticky lg:top-28"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg">
            {editing ? "Edit post" : "New post"}
          </h2>
          {editing ? (
            <Link
              href="/admin/blog"
              className="text-xs text-brand-600 hover:underline"
            >
              Start a new post
            </Link>
          ) : null}
        </div>

        {state.error ? <Alert tone="error">{state.error}</Alert> : null}
        {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

        <input type="hidden" name="id" value={editing?.id ?? ""} />

        <Field label="Title" htmlFor="title" required>
          <Input id="title" name="title" defaultValue={editing?.title ?? ""} required />
        </Field>

        <Field label="Slug" htmlFor="slug" hint="Leave blank to generate from the title.">
          <Input id="slug" name="slug" defaultValue={editing?.slug ?? ""} />
        </Field>

        <Field label="Excerpt" htmlFor="excerpt" hint="Used on cards and as the meta description.">
          <Textarea
            id="excerpt"
            name="excerpt"
            defaultValue={editing?.excerpt ?? ""}
            className="min-h-20"
          />
        </Field>

        <Field label="Cover image URL" htmlFor="coverImageUrl">
          <Input
            id="coverImageUrl"
            name="coverImageUrl"
            type="url"
            defaultValue={editing?.cover_image_url ?? ""}
          />
        </Field>

        <Field label="Body (markdown)" htmlFor="body">
          <Textarea
            id="body"
            name="body"
            defaultValue={editing?.body_markdown ?? ""}
            className="min-h-64 font-mono text-xs"
          />
        </Field>

        <label className="flex items-center gap-2.5 text-sm text-ink-700">
          <input
            type="checkbox"
            name="publish"
            defaultChecked={Boolean(editing?.published_at)}
            className="size-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
          />
          Publish immediately
        </label>

        <Submit editing={Boolean(editing)} />
      </form>
    </div>
  );
}
