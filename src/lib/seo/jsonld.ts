import type { Faq, SiteProfile } from "@/types/content";
import type { Crumb } from "./breadcrumbs";
import { absoluteUrl } from "./site-url";

/**
 * Structured data builders (plan AD-13). They only describe information that is
 * visible on the site and never emit Review, AggregateRating or award fields
 * (constitution II). Empty values are dropped.
 */

type Json = Record<string, unknown>;

const ORG_ID = () => `${absoluteUrl("/")}#organization`;

/** Removes undefined, empty strings and empty arrays recursively. */
export function compact<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(compact).filter((v) => v !== undefined) as T;
  }
  if (value && typeof value === "object") {
    const out: Json = {};
    for (const [k, v] of Object.entries(value as Json)) {
      const c = compact(v);
      if (c === undefined || c === "" || (Array.isArray(c) && c.length === 0)) continue;
      if (c && typeof c === "object" && !Array.isArray(c) && Object.keys(c).length === 0) continue;
      out[k] = c;
    }
    return out as T;
  }
  return value;
}

export function organization(site: SiteProfile, logoUrl?: string): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID(),
    name: site.name,
    url: absoluteUrl("/"),
    slogan: site.tagline,
    description: site.positioning,
    logo: logoUrl ? absoluteUrl(logoUrl) : undefined,
    email: site.email,
    telephone: site.phone?.e164,
    sameAs: site.socials.map((s) => s.url),
    address:
      site.location?.address || site.location?.city || site.location?.country
        ? {
            "@type": "PostalAddress",
            streetAddress: site.location.address,
            addressLocality: site.location.city,
            addressCountry: site.location.country,
          }
        : undefined,
  });
}

export function website(site: SiteProfile): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: absoluteUrl("/"),
    publisher: { "@id": ORG_ID() },
  });
}

export function service({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID() },
  });
}

export function breadcrumbList(trail: Crumb[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function blogPosting(post: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: { name: string };
  imageUrl?: string;
}): Json {
  return compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: absoluteUrl(`/blog/${post.slug}`),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    image: post.imageUrl ? absoluteUrl(post.imageUrl) : undefined,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: { "@id": ORG_ID() },
  });
}

/** Only when real, visible FAQ content exists. */
export function faqPage(faqs: Faq[]): Json | null {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

/** Serializes JSON-LD safely for inline <script> tags. */
export function serializeJsonLd(data: Json): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
