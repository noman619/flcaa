"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { sendMessage, type ActionState } from "@/app/dashboard/actions";
import { trackTheme } from "@/lib/catalog";
import { cn, formatDateTime } from "@/lib/utils";

type Thread = { id: string; title: string; trackSlug: string };
type Msg = { id: string; sender_id: string; body: string; created_at: string };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
      Send
    </Button>
  );
}

export function MessageThread({
  currentUserId,
  activeEnrollmentId,
  threads,
  messages,
}: {
  currentUserId: string;
  activeEnrollmentId: string;
  threads: Thread[];
  messages: Msg[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    sendMessage,
    {},
  );
  const formRef = React.useRef<HTMLFormElement>(null);

  // Clear the composer once the server confirms the message was stored.
  React.useEffect(() => {
    if (state.notice) formRef.current?.reset();
  }, [state.notice]);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start">
      <nav aria-label="Conversations" className="rounded-card border border-ink-200 bg-white p-2">
        <ul>
          {threads.map((thread) => {
            const theme = trackTheme(thread.trackSlug);
            const active = thread.id === activeEnrollmentId;
            return (
              <li key={thread.id}>
                <Link
                  href={`/dashboard/messages?thread=${thread.id}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-brand-50 font-medium text-brand-900"
                      : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                  )}
                >
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: theme.accent }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 leading-snug">{thread.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <section className="rounded-card border border-ink-200 bg-white">
        <div className="max-h-104 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-500">
              No messages yet. Ask anything about the material, the state exam or
              your deadlines.
            </p>
          ) : (
            messages.map((message) => {
              const mine = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={cn("flex", mine ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      mine
                        ? "rounded-br-sm bg-brand-700 text-white"
                        : "rounded-bl-sm bg-ink-100 text-ink-800",
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.body}</p>
                    <p
                      className={cn(
                        "mt-1.5 text-[11px]",
                        mine ? "text-brand-200" : "text-ink-500",
                      )}
                    >
                      {mine ? "You" : "Instructor"} ·{" "}
                      {formatDateTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          ref={formRef}
          action={formAction}
          className="space-y-3 border-t border-ink-200 p-5"
        >
          {state.error ? <Alert tone="error">{state.error}</Alert> : null}
          {state.notice ? <Alert tone="success">{state.notice}</Alert> : null}

          <input type="hidden" name="enrollmentId" value={activeEnrollmentId} />
          <label htmlFor="body" className="sr-only">
            Your message
          </label>
          <Textarea
            id="body"
            name="body"
            required
            maxLength={4000}
            placeholder="Ask your instructor a question…"
            className="min-h-24"
          />
          <div className="flex justify-end">
            <Submit />
          </div>
        </form>
      </section>
    </div>
  );
}
