// Global error boundary — catches unhandled errors in the root layout subtree
"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-prose text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-2">
        Try again
      </Button>
    </main>
  );
}
