import { expect, test } from "@playwright/test";

const PRIMARY = [
  "Home",
  "Solutions",
  "Industries",
  "Digital Marketing",
  "Portfolio",
  "About",
  "Contact",
];

test.describe("navigation (FR-001–FR-003)", () => {
  test("desktop primary navigation lists the seven items in order", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const labels = (
      await nav
        .locator(":scope > ul > li")
        .evaluateAll((items) => items.map((li) => li.querySelector("a")?.textContent?.trim() ?? ""))
    ).filter(Boolean);
    expect(labels).toEqual(PRIMARY);
  });

  test("dropdown menus open and close with Escape, returning focus", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop navigation");
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Solutions menu" });
    await trigger.click();
    const panel = page.locator("#menu-solutions");
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link", { name: "ERP Systems" })).toHaveAttribute(
      "href",
      "/solutions/erp",
    );
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("mobile menu exposes every item and the CTA", async ({ page, isMobile, browserName }) => {
    test.skip(!isMobile, "mobile navigation");
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await expect(menu).toBeVisible();
    for (const label of PRIMARY) {
      await expect(menu.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(
      page.locator("#mobile-nav").getByRole("link", { name: "Get Free Consultation" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeHidden();
    // WebKit does not restore focus to the invoker when a popover is dismissed with
    // Escape (see qa/accessibility.md); the panel's Close button covers that path.
    if (browserName !== "webkit") await expect(toggle).toBeFocused();
  });

  test("header consultation CTA is always visible", async ({ page }) => {
    await page.goto("/solutions");
    const cta = page
      .locator("header")
      .getByRole("link", { name: /Free Consultation/ })
      .first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/contact#consultation");
  });

  test("Manufacturing is reachable from home in two actions (SC-003)", async ({ page }) => {
    await page.goto("/");
    await page
      .locator("#industries")
      .getByRole("link", { name: "Manufacturing", exact: true })
      .click();
    await expect(page).toHaveURL(/\/industries\/manufacturing$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Manufacturing");
  });
});
