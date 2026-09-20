import { expect, test } from "@playwright/test";

test.describe("home page (US1, FR-010–FR-020)", () => {
  test("hero content and CTAs are visible without scrolling", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    const hero = page.locator("section[aria-labelledby='hero-heading']");
    await expect(hero.getByText("Build. Market. Grow.", { exact: true })).toBeVisible();
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Digital Solutions That Help Businesses Grow");
    await expect(
      hero.getByText(/We build custom software, dashboards and automation systems/),
    ).toBeVisible();

    const primary = hero.getByRole("link", { name: "Get Free Consultation" });
    const secondary = hero.getByRole("link", { name: "View Our Solutions" });
    await expect(primary).toHaveAttribute("href", "/contact#consultation");
    await expect(secondary).toHaveAttribute("href", "/solutions");
    for (const cta of [primary, secondary]) {
      const box = await cta.boundingBox();
      expect(box && viewport && box.y + box.height).toBeLessThanOrEqual(viewport?.height ?? 0);
    }
  });

  test("sections appear in the approved order", async ({ page }) => {
    await page.goto("/");
    const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((e) => e.id));
    const expected = [
      "services",
      "industries",
      "projects",
      "digitalization",
      "how-we-work",
      "marketing",
      "why",
      "final-cta",
    ];
    expect(ids.filter((id) => expected.includes(id))).toEqual(expected);
  });

  test("proof sections stay hidden without verified content (constitution II)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByText("Trusted by Growing Businesses")).toHaveCount(0);
    await expect(page.locator("#metrics")).toHaveCount(0);
    await expect(page.locator("#testimonials")).toHaveCount(0);
  });

  test("showcase projects are labelled Concept / Demo", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#projects").getByText("Concept / Demo")).toHaveCount(3);
  });

  test("spreadsheet journey and CTA (FR-016)", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#digitalization");
    await expect(section.getByRole("heading", { level: 2 })).toHaveText(
      "Still Managing Your Business With Spreadsheets?",
    );
    for (const stage of [
      "Manual Processes",
      "Centralized Business Software",
      "Real-Time Business Visibility",
    ]) {
      await expect(section.getByRole("heading", { name: stage })).toBeVisible();
    }
    const cta = section.getByRole("link", { name: "Discuss Your Business Process" });
    await expect(cta).toHaveAttribute("href", /\/contact\?.*#consultation$/);
  });

  test("services show both categories", async ({ page }) => {
    await page.goto("/");
    const services = page.locator("#services");
    await expect(
      services.getByRole("heading", { name: "Business Software & Digital Solutions" }),
    ).toBeVisible();
    await expect(
      services.getByRole("heading", { name: "Digital Marketing & Growth" }),
    ).toBeVisible();
    for (const name of [
      "Business Process Digitalization",
      "Meta Ads",
      "Performance Marketing",
      "Digital Strategy",
    ]) {
      await expect(services.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });
});
