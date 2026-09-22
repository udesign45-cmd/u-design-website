import { expect, test } from "@playwright/test";

/**
 * Runs against a second production build made with `CONTENT_INCLUDE_DRAFTS` off (task
 * T208) — that is, exactly what visitors get. It proves that the publication gate works
 * in the direction that still matters after the 2026-09-21 content approval: anything
 * not ready must be absent from the site, not merely hidden with CSS.
 *
 * Today that means the three portfolio case studies, which stay unpublished while their
 * screenshots are placeholders (integrity rule: no placeholder asset reaches production).
 */
const PLACEHOLDER_PROJECTS = [
  "/portfolio/manufacturing-erp",
  "/portfolio/travel-agency-management",
  "/portfolio/real-estate-crm",
];

const PUBLISHED = [
  "/",
  "/solutions",
  "/solutions/erp",
  "/industries",
  "/industries/manufacturing",
  "/digital-marketing",
  "/digital-marketing/meta-ads",
  "/plans",
  "/portfolio",
  "/about",
  "/contact",
  "/blog",
  "/privacy-policy",
  "/terms-of-service",
];

test.describe("publication gate", () => {
  for (const path of PLACEHOLDER_PROJECTS) {
    test(`${path} is withheld while its screenshots are placeholders`, async ({ request }) => {
      expect((await request.get(path)).status()).toBe(404);
    });
  }

  test("the portfolio hub still presents the concepts, with no link to a missing page", async ({
    page,
  }) => {
    await page.goto("/portfolio");
    await expect(page.locator("#project-list > li")).toHaveCount(3);
    await expect(page.locator("#project-list").getByText("Concept / Demo")).toHaveCount(3);
    await expect(page.locator("a[href^='/portfolio/']")).toHaveCount(0);
  });

  test("the sitemap lists the published set and nothing withheld", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const path of PLACEHOLDER_PROJECTS) expect(xml, path).not.toContain(`${path}<`);
    for (const path of PUBLISHED) {
      const expected = path === "/" ? "<loc>" : `${path}<`;
      expect(xml, path).toContain(expected);
    }
  });

  test("every published page renders", async ({ page }) => {
    for (const path of PUBLISHED) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("no page links to a withheld page", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1] ?? "/").pathname,
    );
    const dangling: string[] = [];
    for (const path of paths) {
      const html = await (await request.get(path)).text();
      for (const match of html.matchAll(/<a[^>]+href="(\/[^"#?]*)/g)) {
        const target = match[1] ?? "/";
        if (PLACEHOLDER_PROJECTS.includes(target)) dangling.push(`${path} → ${target}`);
      }
    }
    expect(dangling).toEqual([]);
  });

  test("email stays private; phone and location are published, the form remains available", async ({
    page,
  }) => {
    await page.goto("/contact");
    await expect(page.locator("a[href^='mailto:']")).toHaveCount(0);
    await expect(page.locator("a[href^='tel:']")).toHaveCount(1);
    await expect(page.getByText("Karachi, Pakistan")).toBeVisible();
    await expect(page.locator("#consultation-form")).toBeVisible();
  });
});
