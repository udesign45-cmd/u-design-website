export type Crumb = { name: string; path: string };

/** Builds a breadcrumb trail that always starts at Home (shared by UI and JSON-LD). */
export function buildTrail(items: Crumb[]): Crumb[] {
  return [{ name: "Home", path: "/" }, ...items];
}
