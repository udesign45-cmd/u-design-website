import { expect, test, type Page } from "@playwright/test";
import { receivedLeads } from "./support/mock-webhook";

async function fillValid(page: Page, company: string) {
  await page.fill("#consultation-name", "Test Person");
  await page.fill("#consultation-company", company);
  await page.fill("#consultation-email", "test@company.test");
  await page.fill("#consultation-phone", "+1 555 123 4567");
  await page.selectOption("#consultation-industry", "manufacturing");
  await page.selectOption("#consultation-need", "erp");
  await page.fill("#consultation-message", "We plan production in spreadsheets.");
}

async function waitForHydration(page: Page) {
  // The render token is written into the form once it has hydrated.
  await expect(page.locator("input[name='submissionId']")).not.toHaveValue("");
}

const unique = (label: string, testId: string) => `${label}-${testId}-${Date.now()}`;

test.describe("consultation form (US2, FR-080–FR-088)", () => {
  test("empty submission shows field errors and focuses the first field", async ({ page }) => {
    await page.goto("/contact");
    await waitForHydration(page);
    await page.getByRole("button", { name: "Get Free Consultation" }).click();
    await expect(
      page.getByRole("heading", { name: "Please check the highlighted fields" }),
    ).toBeVisible();
    await expect(page.locator("#consultation-name")).toBeFocused();
    await expect(page.locator("#consultation-name")).toHaveAttribute("aria-invalid", "true");
    await expect(page.getByText("Please enter your name.").first()).toBeVisible();
  });

  test("invalid email and phone use the contract messages", async ({ page }) => {
    await page.goto("/contact");
    await waitForHydration(page);
    await fillValid(page, "Invalid Co");
    await page.fill("#consultation-email", "not-an-email");
    await page.fill("#consultation-phone", "123");
    await page.getByRole("button", { name: "Get Free Consultation" }).click();
    await expect(
      page.getByText("Please enter a valid email address, e.g. name@company.com.").first(),
    ).toBeVisible();
    await expect(
      page
        .getByText(
          "Please enter a valid phone number, including country code if outside your country.",
        )
        .first(),
    ).toBeVisible();
  });

  test("a valid request is delivered once and confirmed", async ({ page }, testInfo) => {
    const company = unique("Valid", testInfo.project.name);
    await page.goto("/contact?source=/solutions/erp");
    await waitForHydration(page);
    await fillValid(page, company);
    await page.getByRole("button", { name: "Get Free Consultation" }).dblclick();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeFocused();
    await page.waitForTimeout(1500);
    const leads = (await receivedLeads()).filter((l) => l.lead.company === company);
    expect(leads).toHaveLength(1);
    expect(leads[0]?.lead).toMatchObject({
      name: "Test Person",
      email: "test@company.test",
      industry: { value: "manufacturing", label: "Manufacturing" },
      need: { value: "erp", label: "ERP Systems" },
      sourcePage: "/solutions/erp",
    });
  });

  test("delivery failure keeps values and explains next steps", async ({ page }, testInfo) => {
    const company = unique("FAIL-TEST", testInfo.project.name);
    await page.goto("/contact");
    await waitForHydration(page);
    await fillValid(page, company);
    await page.getByRole("button", { name: "Get Free Consultation" }).click();
    await expect(page.getByRole("heading", { name: "Your request was not sent" })).toBeVisible();
    await expect(page.locator("#consultation-company")).toHaveValue(company);
    await expect(page.locator("#consultation-email")).toHaveValue("test@company.test");
  });

  test("works without JavaScript (progressive enhancement)", async ({ browser }, testInfo) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const company = unique("NoJS", testInfo.project.name);
    await page.goto("/contact");
    await fillValid(page, company);
    await page.locator("#consultation-form button[type='submit']").click();
    await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
    const leads = (await receivedLeads()).filter((l) => l.lead.company === company);
    expect(leads).toHaveLength(1);
    await context.close();
  });

  test("pre-selects industry and need from the link, ignoring invalid values", async ({ page }) => {
    await page.goto("/contact?industry=manufacturing&need=erp#consultation");
    await waitForHydration(page);
    await expect(page.locator("#consultation-industry")).toHaveValue("manufacturing");
    await expect(page.locator("#consultation-need")).toHaveValue("erp");

    await page.goto("/contact?industry=space&need=<script>#consultation");
    await waitForHydration(page);
    await expect(page.locator("#consultation-industry")).toHaveValue("");
    await expect(page.locator("#consultation-need")).toHaveValue("");
  });

  test("hidden fields survive re-renders while typing (regression)", async ({ page }) => {
    await page.goto("/contact?source=/industries/retail");
    await waitForHydration(page);
    const id = await page.locator("input[name='submissionId']").inputValue();
    await page.fill("#consultation-message", "Typing re-renders the character counter.");
    await page.getByRole("button", { name: "Get Free Consultation" }).click();
    await expect(page.locator("input[name='submissionId']")).toHaveValue(id);
    await expect(page.locator("input[name='sourcePage']")).toHaveValue("/industries/retail");
    await expect(page.locator("input[name='renderedAt']")).not.toHaveValue("");
  });

  test("budget field is hidden until ranges are configured", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("#consultation-budget")).toHaveCount(0);
  });
});
