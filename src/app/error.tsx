"use client";

import Link from "@/components/ui/AppLink";

// Framework-required client boundary (tasks T052, T179). Never renders error details.
export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="surface-gray py-section">
      <div className="mx-auto w-full max-w-page px-4 md:px-6 xl:px-8">
        <div className="max-w-2xl">
          <h1 className="text-h1">Something went wrong</h1>
          <p className="mt-4 text-lead text-fg-muted">
            We could not load this page. Please try again, or return to the home page.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center rounded-control bg-brand-green px-5 font-semibold text-ink"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-control border border-ink/35 px-5 font-semibold"
            >
              Go to home page
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
