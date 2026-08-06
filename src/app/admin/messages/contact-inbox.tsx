"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Mail, Phone, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/alert";
import { markContactHandled } from "@/app/dashboard/actions";
import { formatShortDate } from "@/lib/utils";
import type { ContactMessage } from "@/lib/database.types";

export function ContactInbox({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [showHandled, setShowHandled] = React.useState(false);

  const visible = showHandled ? messages : messages.filter((m) => !m.handled);

  async function toggle(message: ContactMessage) {
    setPendingId(message.id);
    setError(null);
    const res = await markContactHandled(message.id, !message.handled);
    setPendingId(null);
    if (res.error) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {error ? <Alert tone="error">{error}</Alert> : null}

      <label className="flex items-center gap-2.5 text-sm text-ink-700">
        <input
          type="checkbox"
          checked={showHandled}
          onChange={(e) => setShowHandled(e.target.checked)}
          className="size-4 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
        />
        Show messages already handled
      </label>

      {visible.length === 0 ? (
        <p className="rounded-card border border-dashed border-ink-300 bg-ink-50 px-6 py-12 text-center text-sm text-ink-500">
          {showHandled ? "No messages yet." : "Inbox is clear."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((message) => (
            <li
              key={message.id}
              className="rounded-card border border-ink-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-medium text-ink-900">{message.name}</p>
                    <Badge
                      variant={message.handled ? "success" : "warning"}
                      size="sm"
                    >
                      {message.handled ? "Handled" : "Open"}
                    </Badge>
                    <span className="text-xs text-ink-400">
                      {formatShortDate(message.created_at)}
                    </span>
                  </div>

                  {message.subject ? (
                    <p className="mt-2 text-sm font-medium text-ink-700">
                      {message.subject}
                    </p>
                  ) : null}

                  <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-ink-600">
                    {message.body}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <a
                      href={`mailto:${message.email}`}
                      className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
                    >
                      <Mail className="size-3.5" aria-hidden />
                      {message.email}
                    </a>
                    {message.phone ? (
                      <a
                        href={`tel:${message.phone}`}
                        className="inline-flex items-center gap-1.5 text-brand-600 hover:underline"
                      >
                        <Phone className="size-3.5" aria-hidden />
                        {message.phone}
                      </a>
                    ) : null}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={message.handled ? "outline" : "primary"}
                  onClick={() => toggle(message)}
                  disabled={pendingId === message.id}
                >
                  {pendingId === message.id ? (
                    <Loader2 className="animate-spin" />
                  ) : message.handled ? (
                    <Undo2 />
                  ) : (
                    <Check />
                  )}
                  {message.handled ? "Reopen" : "Mark handled"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
