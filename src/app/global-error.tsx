"use client";

import "@/styles/globals.css";

// Framework-required root boundary (tasks T052, T179). Never renders error details.
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh items-center justify-center surface-deep p-6">
        <main className="max-w-xl text-center">
          <p className="font-bold">U DESIGN</p>
          <h1 className="mt-4 text-h2">Something went wrong</h1>
          <p className="mt-3 text-fg-muted">Please try again in a moment.</p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 inline-flex min-h-11 items-center rounded-control bg-brand-green px-5 font-semibold text-ink"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
