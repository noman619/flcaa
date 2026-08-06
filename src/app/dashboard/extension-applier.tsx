"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { applyExtension } from "./actions";
import { formatShortDate } from "@/lib/utils";

export function ExtensionApplier({
  extensions,
  targets,
}: {
  extensions: { id: string; title: string; days: number }[];
  targets: { id: string; title: string; expiresAt: string | null }[];
}) {
  const router = useRouter();
  const [extensionId, setExtensionId] = React.useState(extensions[0]?.id ?? "");
  const [targetId, setTargetId] = React.useState(targets[0]?.id ?? "");
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<{
    error?: string;
    notice?: string;
  } | null>(null);

  if (!extensions.length) return null;

  async function apply() {
    setPending(true);
    setResult(null);
    const res = await applyExtension(extensionId, targetId);
    setResult(res);
    setPending(false);
    if (!res.error) router.refresh();
  }

  const selected = extensions.find((e) => e.id === extensionId);

  return (
    <section className="rounded-card border border-accent-200 bg-accent-50 p-6">
      <h2 className="flex items-center gap-2 font-display text-lg text-accent-900">
        <CalendarPlus className="size-5" aria-hidden />
        You have {extensions.length} unused course extension
        {extensions.length === 1 ? "" : "s"}
      </h2>
      <p className="mt-1.5 text-sm text-accent-800">
        Choose which course to extend. This adds {selected?.days ?? 90} days to that
        course&apos;s access window.
      </p>

      {result?.error ? (
        <Alert tone="error" className="mt-4">
          {result.error}
        </Alert>
      ) : null}
      {result?.notice ? (
        <Alert tone="success" className="mt-4">
          {result.notice}
        </Alert>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        {extensions.length > 1 ? (
          <div>
            <label htmlFor="extension" className="sr-only">
              Extension to use
            </label>
            <Select
              id="extension"
              value={extensionId}
              onChange={(e) => setExtensionId(e.target.value)}
            >
              {extensions.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title} (+{e.days} days)
                </option>
              ))}
            </Select>
          </div>
        ) : (
          <input type="hidden" value={extensionId} readOnly />
        )}

        <div className={extensions.length > 1 ? "" : "sm:col-span-2"}>
          <label htmlFor="target" className="sr-only">
            Course to extend
          </label>
          <Select
            id="target"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            {targets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title} — expires {formatShortDate(t.expiresAt)}
              </option>
            ))}
          </Select>
        </div>

        <Button onClick={apply} disabled={pending || !targetId} variant="accent">
          {pending ? <Loader2 className="animate-spin" /> : null}
          Apply extension
        </Button>
      </div>
    </section>
  );
}
