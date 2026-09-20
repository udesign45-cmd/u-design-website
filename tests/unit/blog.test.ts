import { afterEach, describe, expect, it, vi } from "vitest";
import type { BlogPost } from "@/content/blog/posts";

// The real registry imports MDX, which Vitest does not compile; tests use fixtures.
vi.mock("@/content/blog/posts", () => ({ posts: [] }));
vi.mock("@/content/legal", () => ({ legalPages: [] }));

const { getCategoriesWithPosts, getPublishedPosts, getRelatedPosts, hasBlog } =
  await import("@/lib/content/blog");

const Content = () => null;
function post(slug: string, overrides: Partial<BlogPost> = {}): BlogPost {
  return {
    slug,
    title: slug,
    excerpt: "e",
    featuredImage: { src: { src: "/x.png", width: 1, height: 1 }, alt: "alt text" },
    publishedAt: "2026-01-01",
    category: "erp",
    tags: [],
    relatedSolutions: [],
    relatedIndustries: [],
    seo: { title: "t", description: "d" },
    status: "published",
    Content,
    ...overrides,
  };
}

afterEach(() => vi.unstubAllEnvs());

describe("blog repository", () => {
  it("lists visible posts newest first and filters by category", () => {
    const source = [
      post("a", { publishedAt: "2026-01-01" }),
      post("b", { publishedAt: "2026-03-01", category: "crm" }),
      post("c", { publishedAt: "2026-02-01" }),
    ];
    expect(getPublishedPosts({ source }).map((p) => p.slug)).toEqual(["b", "c", "a"]);
    expect(getPublishedPosts({ source, category: "crm" }).map((p) => p.slug)).toEqual(["b"]);
    expect(
      getCategoriesWithPosts(source)
        .map((c) => c.slug)
        .sort(),
    ).toEqual(["crm", "erp"]);
  });

  it("ranks related posts by shared category and tags", () => {
    const current = post("x", { category: "erp", tags: ["stock"] });
    const source = [
      current,
      post("same-cat", { category: "erp", publishedAt: "2025-01-01" }),
      post("same-tag", { category: "crm", tags: ["stock"], publishedAt: "2026-05-01" }),
      post("newest", { category: "crm", publishedAt: "2026-06-01" }),
    ];
    expect(getRelatedPosts(current, 2, source).map((p) => p.slug)).toEqual([
      "same-cat",
      "same-tag",
    ]);
  });

  it("gates the blog on visible posts (FR-092)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_INCLUDE_DRAFTS", "");
    expect(hasBlog([])).toBe(false);
    expect(hasBlog([post("draft", { status: "draft" })])).toBe(false);
    expect(hasBlog([post("live")])).toBe(true);
  });
});

describe("navigation blog link", () => {
  it("omits Blog when there are no visible posts", async () => {
    const { getNavigation } = await import("@/lib/content/navigation");
    const company = getNavigation().footer.find((g) => g.title === "Company");
    expect(company?.links.some((l) => l.href === "/blog")).toBe(false);
  });
});
