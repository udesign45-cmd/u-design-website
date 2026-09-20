import { afterEach, describe, expect, it, vi } from "vitest";
import { blogCategories } from "@/content/blog/categories";
import { industries } from "@/content/industries";
import { marketingServices } from "@/content/marketing";
import { pageSeo } from "@/content/pages-seo";
import { projects } from "@/content/projects";
import { solutions } from "@/content/solutions";
import { site } from "@/content/site";
import { buildTrail } from "@/lib/seo/breadcrumbs";
import {
  blogPosting,
  breadcrumbList,
  faqPage,
  organization,
  serializeJsonLd,
  service,
  website,
} from "@/lib/seo/jsonld";
import { collectRoutes } from "@/lib/seo/routes";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

const allRoutes = () =>
  collectRoutes({
    pageSeo,
    solutions,
    industries,
    marketing: marketingServices,
    projects,
    projectHasPage: () => true,
    legal: [
      {
        slug: "privacy-policy",
        title: "Privacy Policy",
        description: "d".repeat(80),
        status: "published",
        updatedAt: "2026-09-19",
      },
    ],
    posts: [
      {
        slug: "signs-your-business-has-outgrown-spreadsheets",
        seo: {
          title: "7 Signs Your Business Has Outgrown Spreadsheets",
          description:
            "Warning signs that your business has outgrown Excel, what changes with a centralized system and how to plan the move without disrupting operations.",
        },
        publishedAt: "2026-09-19",
      },
    ],
    categories: blogCategories,
  });

describe("route registry (T163)", () => {
  const routes = allRoutes().filter((r) => r.kind !== "legal");

  it("has unique titles and descriptions site-wide", () => {
    const titles = routes.map((r) => r.title.toLowerCase());
    const descriptions = routes.map((r) => r.description.toLowerCase());
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keeps titles and descriptions within length limits", () => {
    for (const r of routes) {
      expect(r.title.length, r.path).toBeGreaterThanOrEqual(30);
      expect(r.title.length, r.path).toBeLessThanOrEqual(60);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(70);
      expect(r.description.length, r.path).toBeLessThanOrEqual(160);
    }
  });

  it("uses clean, lowercase, SEO-friendly paths", () => {
    for (const r of routes) expect(r.path).toMatch(/^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/);
  });

  it("omits the blog index when there are no posts and draft legal pages", () => {
    const withoutPosts = collectRoutes({
      pageSeo,
      solutions: [],
      industries: [],
      marketing: [],
      projects: [],
      projectHasPage: () => false,
      legal: [
        {
          slug: "privacy-policy",
          title: "P",
          description: "D",
          status: "draft",
          updatedAt: "2026-09-19",
        },
      ],
      posts: [],
      categories: [],
    });
    expect(withoutPosts.some((r) => r.path === "/blog")).toBe(false);
    expect(withoutPosts.some((r) => r.path === "/privacy-policy")).toBe(false);
  });
});

describe("canonical URLs", () => {
  it("builds absolute canonicals for every route", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.example.org");
    const { absoluteUrl } = await import("@/lib/seo/site-url");
    for (const r of allRoutes()) {
      const url = absoluteUrl(r.path);
      expect(url.startsWith("https://www.example.org")).toBe(true);
      expect(url).not.toMatch(/[?#]/);
      if (r.path !== "/") expect(url.endsWith("/")).toBe(false);
    }
  });
});

describe("robots (T167)", () => {
  it("disallows everything outside production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const robots = (await import("@/app/robots")).default();
    expect(robots.rules).toEqual({ userAgent: "*", disallow: "/" });
    expect(robots.sitemap).toBeUndefined();
  });

  it("allows crawling and lists the sitemap in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.example.org");
    const robots = (await import("@/app/robots")).default();
    expect(robots.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(robots.sitemap).toBe("https://www.example.org/sitemap.xml");
  });
});

describe("JSON-LD builders (T168)", () => {
  const forbidden = /Review|AggregateRating|award|ratingValue/;

  it("organization only includes provided fields", () => {
    const org = organization(site);
    expect(org).toMatchObject({ "@type": "Organization", name: "U Design" });
    for (const key of ["email", "telephone", "sameAs", "address", "logo"])
      expect(org).not.toHaveProperty(key);
    const withContact = organization({
      ...site,
      email: "hello@example.org",
      socials: [{ platform: "linkedin", url: "https://l.example" }],
    });
    expect(withContact).toMatchObject({
      email: "hello@example.org",
      sameAs: ["https://l.example"],
    });
  });

  it("never emits empty values or forbidden types", () => {
    const blocks = [
      organization(site),
      website(site),
      service({ name: "ERP Systems", description: "d", path: "/solutions/erp" }),
      breadcrumbList(buildTrail([{ name: "Solutions", path: "/solutions" }])),
      blogPosting({ title: "T", excerpt: "E", slug: "s", publishedAt: "2026-09-19" }),
    ];
    for (const b of blocks) {
      const json = JSON.stringify(b);
      expect(json).not.toMatch(forbidden);
      expect(json).not.toContain('""');
      expect(json).not.toContain("null");
    }
    expect(blocks[4]).not.toHaveProperty("author");
  });

  it("builds breadcrumbs with positions and absolute URLs", () => {
    const b = breadcrumbList(buildTrail([{ name: "Industries", path: "/industries" }])) as {
      itemListElement: { position: number; name: string; item: string }[];
    };
    expect(b.itemListElement.map((i) => i.position)).toEqual([1, 2]);
    expect(b.itemListElement[0]?.name).toBe("Home");
  });

  it("returns no FAQPage without real FAQs", () => {
    expect(faqPage([])).toBeNull();
    expect(faqPage([{ question: "Q?", answer: "A." }])).toMatchObject({ "@type": "FAQPage" });
  });

  it("escapes < to prevent script injection", () => {
    expect(serializeJsonLd({ name: "</script><script>alert(1)</script>" })).not.toContain(
      "</script>",
    );
  });
});
