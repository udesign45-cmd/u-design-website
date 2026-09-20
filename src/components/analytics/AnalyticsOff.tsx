/**
 * Build-time replacement for ./Analytics when no analytics ID is configured
 * (next.config.ts `turbopack.resolveAlias`). Ships no client code (plan AD-09).
 */
export function Analytics(_props: { gaId?: string; metaPixelId?: string }) {
  return null;
}
