import type {
  BlogCategory,
  Industry,
  MarketingService,
  Project,
  Seo,
  Solution,
  Status,
} from "@/types/content";

export type RouteEntry = {
  path: string;
  title: string;
  description: string;
  kind:
    | "static"
    | "solution"
    | "industry"
    | "marketing"
    | "project"
    | "legal"
    | "blog"
    | "post"
    | "category";
  lastModified?: string;
};

type RouteInput = {
  pageSeo: Record<string, Seo>;
  solutions: Solution[];
  industries: Industry[];
  marketing: MarketingService[];
  projects: Project[];
  projectHasPage: (p: Project) => boolean;
  legal: { slug: string; title: string; description: string; status: Status; updatedAt: string }[];
  posts: { slug: string; seo: Seo; publishedAt: string; updatedAt?: string }[];
  categories: BlogCategory[];
};

const staticPaths: Record<string, string> = {
  home: "/",
  solutions: "/solutions",
  industries: "/industries",
  digitalMarketing: "/digital-marketing",
  portfolio: "/portfolio",
  about: "/about",
  contact: "/contact",
  blog: "/blog",
};

/**
 * Every indexable route with its SEO fields (data-model › getAllRoutes). Pure,
 * so tests can pass fixtures; `getAllRoutes()` in lib/content supplies real data.
 * Inputs must already be filtered to visible entries.
 */
export function collectRoutes(input: RouteInput): RouteEntry[] {
  const routes: RouteEntry[] = [];
  for (const [key, seo] of Object.entries(input.pageSeo)) {
    const path = staticPaths[key];
    if (!path) continue;
    if (key === "blog" && input.posts.length === 0) continue;
    routes.push({ path, ...seo, kind: key === "blog" ? "blog" : "static" });
  }
  for (const s of input.solutions)
    if (s.hasPage) routes.push({ path: `/solutions/${s.slug}`, ...s.seo, kind: "solution" });
  for (const i of input.industries)
    if (i.hasPage) routes.push({ path: `/industries/${i.slug}`, ...i.seo, kind: "industry" });
  for (const m of input.marketing)
    if (m.hasPage)
      routes.push({ path: `/digital-marketing/${m.slug}`, ...m.seo, kind: "marketing" });
  for (const p of input.projects)
    if (p.seo && input.projectHasPage(p))
      routes.push({ path: `/portfolio/${p.slug}`, ...p.seo, kind: "project" });
  for (const l of input.legal)
    if (l.status === "published")
      routes.push({
        path: `/${l.slug}`,
        title: l.title,
        description: l.description,
        kind: "legal",
        lastModified: l.updatedAt,
      });
  for (const post of input.posts)
    routes.push({
      path: `/blog/${post.slug}`,
      ...post.seo,
      kind: "post",
      lastModified: post.updatedAt ?? post.publishedAt,
    });
  for (const c of input.categories)
    routes.push({ path: `/blog/category/${c.slug}`, ...c.seo, kind: "category" });
  return routes.map(({ title, description, path, kind, lastModified }) => ({
    path,
    title,
    description,
    kind,
    lastModified,
  }));
}
