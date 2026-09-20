import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

async function load() {
  return import("@/lib/seo/metadata");
}

describe("absoluteUrl", () => {
  it("builds canonical URLs without query strings or trailing slashes", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.example.org/");
    const { absoluteUrl } = await import("@/lib/seo/site-url");
    expect(absoluteUrl("/")).toBe("https://www.example.org");
    expect(absoluteUrl("/solutions/erp/")).toBe("https://www.example.org/solutions/erp");
    expect(absoluteUrl("/contact?industry=x#consultation")).toBe("https://www.example.org/contact");
  });
});

describe("buildMetadata", () => {
  it("sets title, description, canonical and Open Graph", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://www.example.org");
    vi.stubEnv("VERCEL_ENV", "production");
    const { buildMetadata } = await load();
    const m = buildMetadata({ title: "ERP Systems", description: "Desc", path: "/solutions/erp" });
    expect(m.title).toBe("ERP Systems");
    expect(m.alternates?.canonical).toBe("https://www.example.org/solutions/erp");
    expect(m.openGraph).toMatchObject({
      title: "ERP Systems | U Design",
      url: "https://www.example.org/solutions/erp",
    });
    expect(m.robots).toBeUndefined();
  });

  it("noindexes every page outside production", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    const { buildMetadata } = await load();
    const m = buildMetadata({ title: "T", description: "D", path: "/" });
    expect(m.robots).toEqual({ index: false, follow: false });
  });

  it("noindexes but follows explicit noindex pages in production", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const { buildMetadata } = await load();
    expect(
      buildMetadata({ title: "T", description: "D", path: "/x", noindex: true }).robots,
    ).toEqual({
      index: false,
      follow: true,
    });
  });
});
