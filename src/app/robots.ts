import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site-url";

/** Production: crawl everything. Every other environment: disallow all (plan AD-04). */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
