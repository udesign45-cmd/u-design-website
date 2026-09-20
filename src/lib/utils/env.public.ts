/**
 * Values that are safe to expose. `siteEnv` is read on the server only
 * (metadata, robots) because VERCEL_ENV is not inlined into client bundles.
 */
export type SiteEnv = "production" | "preview" | "development";

function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

export const siteUrl: string = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

export function getSiteEnv(): SiteEnv {
  const value = process.env.VERCEL_ENV;
  return value === "production" || value === "preview" ? value : "development";
}

export const gaId: string | undefined = process.env.NEXT_PUBLIC_GA_ID || undefined;
export const metaPixelId: string | undefined = process.env.NEXT_PUBLIC_META_PIXEL_ID || undefined;
export const analyticsConsentRequired: boolean =
  process.env.NEXT_PUBLIC_ANALYTICS_CONSENT === "required";
