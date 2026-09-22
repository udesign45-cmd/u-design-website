import { expect, test } from "@playwright/test";
import { receivedLeads } from "./support/mock-webhook";

test("keyboard-only consultation journey with visible focus (T213)", async ({
  page,
  isMobile,
}, testInfo) => {
  test.skip(isMobile, "keyboard journey on desktop");
  await page.goto("/");

  // Skip link is the first focusable element
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();

  // Tab to the header CTA and follow it
  const headerCta = page.locator("header a[data-track-location='header']");
  for (
    let i = 0;
    i < 20 && !(await headerCta.evaluate((el) => el === document.activeElement));
    i++
  ) {
    await page.keyboard.press("Tab");
  }
  await expect(headerCta).toBeFocused();
  const outline = await headerCta.evaluate((el) => getComputedStyle(el).outlineWidth);
  expect(parseFloat(outline)).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/plans$/);

  // Continue with the keyboard to the first service's Get Started button
  const getStarted = page.getByRole("link", { name: "Get Started" }).first();
  await getStarted.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/contact\?.*#consultation$/);
  await expect(page.locator("input[name='submissionId']")).not.toHaveValue("");

  // Fill the form with the keyboard only
  const company = `Keyboard-${testInfo.project.name}-${Date.now()}`;
  await page.locator("#consultation-name").focus();
  await page.keyboard.type("Keyboard User");
  await page.keyboard.press("Tab");
  await page.keyboard.type(company);
  await page.keyboard.press("Tab");
  await page.keyboard.type("keyboard@company.test");
  await page.keyboard.press("Tab");
  await page.keyboard.type("+44 20 7946 0000");
  await page.keyboard.press("Tab");
  await expect(page.locator("#consultation-industry")).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await expect(page.locator("#consultation-need")).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.locator("#consultation-form button[type='submit']").focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Request received" })).toBeFocused();
  await expect
    .poll(async () => (await receivedLeads()).some((l) => l.lead.company === company))
    .toBe(true);
});

test("reduced motion: no running animations (T214)", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  // Mobile WebKit has no wheel input, so scroll the document directly.
  await page.evaluate(() => window.scrollTo(0, 4000));
  await page.waitForTimeout(300);
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && Number(a.effect?.getTiming().duration ?? 0) > 1)
        .length,
  );
  expect(running).toBe(0);
  await context.close();
});
