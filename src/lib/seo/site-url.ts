import { siteUrl } from "@/lib/utils/env.public";

/** Absolute canonical URL for a path: no query string, no trailing slash except "/". */
export function absoluteUrl(path: string = "/"): string {
  const clean = path.split(/[?#]/)[0] ?? "/";
  const normalized = clean === "/" ? "" : `/${clean.replace(/^\/+|\/+$/g, "")}`;
  return `${siteUrl}${normalized}` || siteUrl;
}
