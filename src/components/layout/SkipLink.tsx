/** First focusable element on every page (WCAG 2.4.1). */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only rounded-control bg-brand-green px-4 py-3 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to main content
    </a>
  );
}
