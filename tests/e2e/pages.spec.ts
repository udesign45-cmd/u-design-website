import { expect, test } from "@playwright/test";

test.describe("solutions (US4, FR-030–FR-032)", () => {
  test("hub lists the five solutions", async ({ page }) => {
    await page.goto("/solutions");
    const list = page.locator("#solutions");
    for (const name of [
      "Custom Software",
      "ERP Systems",
      "CRM Solutions",
      "Business Dashboards",
      "Workflow Automation",
    ]) {
      await expect(list.getByRole("heading", { name, exact: true })).toBeVisible();
    }
  });

  test("ERP page follows the business-first structure and pre-selects the need", async ({
    page,
  }) => {
    await page.goto("/solutions/erp");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "ERP Systems That Connect Your Entire Operation",
    );
    for (const id of [
      "problem",
      "approach",
      "features",
      "benefits",
      "industries",
      "related-projects",
      "cta",
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(
      page.locator("#industries").getByRole("link", { name: "Manufacturing" }),
    ).toHaveAttribute("href", "/industries/manufacturing");
    const cta = page.getByRole("link", { name: "Get Free Consultation" }).nth(1);
    await expect(cta).toHaveAttribute("href", /need=erp/);
  });
});

test.describe("industries (US3, FR-040–FR-043)", () => {
  test("hub lists all industries with Manufacturing first", async ({ page }) => {
    await page.goto("/industries");
    const headings = await page.locator("#industries h3").allInnerTexts();
    expect(headings[0]).toBe("Manufacturing");
    expect(headings).toEqual(
      expect.arrayContaining([
        "Distribution",
        "Real Estate",
        "Construction",
        "Logistics",
        "Travel & Tourism",
        "Healthcare",
        "Retail",
      ]),
    );
  });

  test("Manufacturing page covers the required workflows and related project", async ({ page }) => {
    await page.goto("/industries/manufacturing");
    const workflows = page.locator("#workflows");
    for (const w of [
      "Production management",
      "Inventory",
      "Raw materials",
      "Purchasing",
      "Sales",
      "Warehouse",
      "Reporting",
      "Management dashboards",
    ]) {
      await expect(workflows.getByRole("heading", { name: w, exact: true })).toBeVisible();
    }
    await expect(page.locator("#related-projects").getByText("Manufacturing ERP")).toBeVisible();
    await expect(page.getByRole("link", { name: "Get Free Consultation" }).nth(1)).toHaveAttribute(
      "href",
      /industry=manufacturing/,
    );
  });

  test("an industry without projects links to the portfolio", async ({ page }) => {
    await page.goto("/industries/construction");
    await expect(
      page.locator("#related-projects").getByRole("link", { name: "Browse our portfolio" }),
    ).toHaveAttribute("href", "/portfolio");
  });
});

test.describe("portfolio (US5, FR-050–FR-054)", () => {
  test("lists three concept projects", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.locator("#project-list > li")).toHaveCount(3);
    await expect(page.locator("#project-list").getByText("Concept / Demo")).toHaveCount(3);
  });

  test("case study follows Problem → Solution → Features → Screens → Business application", async ({
    page,
  }) => {
    await page.goto("/portfolio/manufacturing-erp");
    const order = await page.locator("main section[id]").evaluateAll((els) => els.map((e) => e.id));
    const expected = ["challenge", "solution", "features", "screenshots", "business-application"];
    expect(order.filter((id) => expected.includes(id))).toEqual(expected);
    await expect(page.getByRole("heading", { name: "Results" })).toHaveCount(0);
    await expect(page.locator("figure figcaption").first()).not.toBeEmpty();
    await expect(page.getByText("Concept / Demo").first()).toBeVisible();
  });

  test("filter is not shown with six or fewer projects", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page.getByLabel("Industry", { exact: true })).toHaveCount(0);
  });
});

test.describe("digital marketing, about, contact, blog (US6–US8)", () => {
  test("marketing hub covers all seven services without guarantees", async ({ page }) => {
    await page.goto("/digital-marketing");
    for (const name of [
      "Social Media Marketing",
      "Social Media Management",
      "Content Creation",
      "Meta Ads",
      "Lead Generation",
      "Performance Marketing",
      "Digital Strategy",
    ]) {
      await expect(
        page.locator("main").getByRole("heading", { name, exact: true }).first(),
      ).toBeVisible();
    }
    expect((await page.locator("main").innerText()).toLowerCase()).not.toContain("guarantee");
  });

  test("marketing detail pages build", async ({ page }) => {
    for (const slug of ["social-media", "meta-ads", "content", "lead-generation"]) {
      const response = await page.goto(`/digital-marketing/${slug}`);
      expect(response?.status()).toBe(200);
    }
    expect((await page.goto("/digital-marketing/digital-strategy"))?.status()).toBe(404);
  });

  test("about covers the required topics", async ({ page }) => {
    await page.goto("/about");
    for (const heading of [
      "Who we are",
      "Our approach",
      "Software expertise",
      "Digital marketing expertise",
      "Build. Market. Grow.",
    ]) {
      await expect(page.getByRole("heading", { name: heading, exact: true })).toBeVisible();
    }
  });

  test("contact shows no invented contact details", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("a[href^='mailto:'], a[href^='tel:']")).toHaveCount(0);
    await expect(page.getByText("Use the form to reach our team.")).toBeVisible();
  });

  test("blog index, article and category render in preview", async ({ page }) => {
    await page.goto("/blog");
    await page
      .getByRole("link", { name: "7 Signs Your Business Has Outgrown Spreadsheets" })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "7 Signs Your Business Has Outgrown Spreadsheets",
    );
    await expect(
      page.locator("#related-topics").getByRole("link", { name: "ERP Systems" }),
    ).toHaveAttribute("href", "/solutions/erp");
    expect((await page.goto("/blog/category/digital-transformation"))?.status()).toBe(200);
  });
});

test.describe("errors (FR-007)", () => {
  for (const path of [
    "/does-not-exist",
    "/solutions/nope",
    "/industries/nope",
    "/portfolio/nope",
    "/blog/nope",
  ]) {
    test(`${path} returns the branded 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
      await expect(
        page.locator("main").getByRole("link", { name: "Get Free Consultation" }),
      ).toBeVisible();
      // Next.js adds its own noindex tag to 404 responses; every robots tag must agree.
      const robots = await page
        .locator("meta[name='robots']")
        .evaluateAll((ms) => ms.map((m) => m.getAttribute("content")));
      expect(robots.length).toBeGreaterThan(0);
      for (const content of robots) expect(content).toMatch(/noindex/);
    });
  }
});
