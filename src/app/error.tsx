"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surfaced in the server logs / your error reporter.
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-3xl">Something went wrong</h1>
      <p className="mt-3 max-w-md text-ink-500">
        The page hit an unexpected error. Try again — if it keeps happening, call
        us on {SITE.phone} and we&apos;ll sort it out.
      </p>
      {error.digest ? (
        <p className="mt-3 font-mono text-xs text-ink-400">
          Reference: {error.digest}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset}>
          <RotateCcw /> Try again
        </Button>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
