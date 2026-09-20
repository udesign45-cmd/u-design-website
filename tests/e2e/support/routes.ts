import type { APIRequestContext, Page } from "@playwright/test";

/** Reads every URL path from the sitemap served by the app under test. */
export async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const response = await request.get("/sitemap.xml");
  const xml = await response.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? "/").pathname);
}

/** Legal pages are excluded from the sitemap while in draft but must still be tested. */
export const EXTRA_PATHS = ["/privacy-policy", "/terms-of-service"];

/** Disables content-visibility so axe can resolve real colours (see qa/performance.md). */
export async function renderAllSections(page: Page) {
  await page.addStyleTag({ content: "*{content-visibility:visible !important}" });
}
