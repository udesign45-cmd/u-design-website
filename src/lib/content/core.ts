import type { Slug, Status } from "@/types/content";

/**
 * Drafts render in development, or when CONTENT_INCLUDE_DRAFTS=true (e2e and
 * Preview deployments). Production never shows drafts (plan AD-02).
 */
export function includeDrafts(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.CONTENT_INCLUDE_DRAFTS === "true";
}

export function isVisible(entry: { status: Status }): boolean {
  return entry.status === "published" || includeDrafts();
}

/** True when the entry is visible and has its own page. */
export function hasPage<T extends { status: Status; hasPage: boolean }>(
  entry: T,
): entry is T & { hasPage: true } {
  return entry.hasPage && isVisible(entry);
}

/**
 * Resolves slug references to visible entries, preserving the given order and
 * silently dropping missing or invisible targets.
 */
export function resolveSlugs<T extends { slug: Slug; status: Status }>(
  slugs: readonly Slug[],
  collection: readonly T[],
): T[] {
  const bySlug = new Map(collection.map((entry) => [entry.slug, entry]));
  return slugs
    .map((slug) => bySlug.get(slug))
    .filter((entry): entry is T => entry !== undefined && isVisible(entry));
}

export function byOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}
