import { legalPages, type LegalPage } from "@/content/legal";
import { isVisible } from "./core";

/** Legal pages that are published in this environment (draft ones are gated). */
export function getLegalPages(): LegalPage[] {
  return legalPages.filter(isVisible);
}

export function getLegalPage(slug: LegalPage["slug"]): LegalPage | undefined {
  return getLegalPages().find((page) => page.slug === slug);
}

/** Href for a legal page, or undefined while it is unpublished, so nothing links to a 404. */
export function legalHref(slug: LegalPage["slug"]): string | undefined {
  return getLegalPage(slug) ? `/${slug}` : undefined;
}
