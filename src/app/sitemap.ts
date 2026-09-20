import type { MetadataRoute } from "next";
import { getAllRoutes } from "@/lib/content/routes";
import { absoluteUrl } from "@/lib/seo/site-url";

/** XML sitemap of visible, indexable routes only (spec FR-102). */
export default function sitemap(): MetadataRoute.Sitemap {
  return getAllRoutes().map((route) => ({
    url: absoluteUrl(route.path),
    ...(route.lastModified ? { lastModified: route.lastModified } : {}),
  }));
}
