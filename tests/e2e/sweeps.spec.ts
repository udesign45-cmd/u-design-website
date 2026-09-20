import AxeBuilder from "@axe-core/playwright";
import { expect, test, type APIRequestContext } from "@playwright/test";
import { EXTRA_PATHS, renderAllSections, sitemapPaths } from "./support/routes";

/**
 * Site-wide sweeps (tasks T210, T211, T212, T215, T216). They run once, on desktop
 * Chromium, one after another: each visits every route, so running them at the same
 * time starves the single server process.
 *
 * The site is fully static, so the link and SEO sweeps read the served HTML over HTTP
 * instead of rendering every page in a browser. That keeps a 37-route sweep to a few
 * seconds and leaves the browser for the checks that genuinely need layout (overflow,
 * axe, console).
 */
test.describe.configure({ mode: "serial", timeout: 600_000 });

const HEAD = (html: string, re: RegExp) => html.match(re)?.[1] ?? "";
const ALL = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => m[1] ?? "");

async function fetchHtml(request: APIRequestContext, path: string) {
  const response = await request.get(path);
  expect(response.status(), `${path} status`).toBe(200);
  return response.text();
}

test("links: every internal link resolves and no page is orphaned (T210)", async ({ request }) => {
  const paths = [...(await sitemapPaths(request)), ...EXTRA_PATHS];
  const linkedFrom = new Set<string>();
  const status = new Map<string, number>();
  const problems: string[] = [];

  for (const path of paths) {
    const html = await fetchHtml(request, path);
    const hrefs = new Set(ALL(html, /<a[^>]+href="(\/[^"]*)"/g));
    if (![...hrefs].some((h) => h.startsWith("/contact") && h.includes("#consultation"))) {
      problems.push(`${path}: no one-click path to the consultation form`);
    }
    for (const href of hrefs) {
      const [withoutHash, hash] = href.split("#");
      const target = withoutHash?.split("?")[0] || "/";
      if (target !== path) linkedFrom.add(target);
      if (!status.has(target)) status.set(target, (await request.get(target)).status());
      if (hash && target === path && !new RegExp(`id="${hash}"`).test(html)) {
        problems.push(`${path}: anchor #${hash} has no target`);
      }
    }
  }
  for (const [target, code] of status)
    if (code >= 400) problems.push(`broken link ${target}: ${code}`);
  for (const path of paths)
    if (path !== "/" && !linkedFrom.has(path)) problems.push(`orphan page ${path}`);
  expect(problems).toEqual([]);
});

test("SEO: unique metadata, canonical, one h1, valid JSON-LD (T215)", async ({
  request,
  baseURL,
}) => {
  const paths = await sitemapPaths(request);
  expect(paths.length).toBeGreaterThan(20);
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  const problems: string[] = [];
  const ogImages = new Set<string>();

  for (const path of paths) {
    const html = await fetchHtml(request, path);
    const title = HEAD(html, /<title>([^<]*)<\/title>/);
    const description = HEAD(html, /<meta name="description" content="([^"]*)"/);
    const canonical = HEAD(html, /<link rel="canonical" href="([^"]*)"/);
    const ogTitle = HEAD(html, /<meta property="og:title" content="([^"]*)"/);
    const ogDescription = HEAD(html, /<meta property="og:description" content="([^"]*)"/);
    const ogImage = HEAD(html, /<meta property="og:image" content="([^"]*)"/);

    if (titles.has(title)) problems.push(`${path}: title duplicates ${titles.get(title)}`);
    if (descriptions.has(description))
      problems.push(`${path}: description duplicates ${descriptions.get(description)}`);
    titles.set(title, path);
    descriptions.set(description, path);
    if (title.length < 10 || title.length > 70)
      problems.push(`${path}: title length ${title.length}`);
    if (description.length < 50 || description.length > 175)
      problems.push(`${path}: description length ${description.length}`);
    // absoluteUrl() drops the trailing slash, so home canonicalises to the bare origin.
    if (canonical !== `${baseURL}${path === "/" ? "" : path}`)
      problems.push(`${path}: canonical "${canonical}"`);
    if (!ogTitle || !ogDescription)
      problems.push(`${path}: missing Open Graph title or description`);
    if (!ogImage) problems.push(`${path}: missing og:image`);
    else ogImages.add(ogImage);
    if (!/<meta name="twitter:card"/.test(html)) problems.push(`${path}: missing twitter:card`);

    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    const levels = ALL(main, /<h([1-4])[\s>]/g).map(Number);
    const h1s = levels.filter((l) => l === 1).length;
    if (h1s !== 1) problems.push(`${path}: ${h1s} h1 elements`);
    levels.forEach((level, i) => {
      const previous = levels[i - 1];
      if (i > 0 && previous !== undefined && level > previous + 1)
        problems.push(`${path}: h${previous} jumps to h${level}`);
    });

    const blocks = ALL(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
    if (blocks.length === 0) problems.push(`${path}: no JSON-LD`);
    for (const block of blocks) {
      let parsed: { "@type"?: string } | undefined;
      try {
        parsed = JSON.parse(block.replaceAll("\\u003c", "<")) as { "@type"?: string };
      } catch {
        problems.push(`${path}: JSON-LD does not parse`);
        continue;
      }
      if (!parsed["@type"]) problems.push(`${path}: JSON-LD without @type`);
      if (/"(Review|AggregateRating)"/.test(block))
        problems.push(`${path}: forbidden ${parsed["@type"]} schema`);
    }
    if (path !== "/" && !blocks.some((b) => b.includes("BreadcrumbList")))
      problems.push(`${path}: no BreadcrumbList`);
  }
  expect(problems).toEqual([]);

  // Every distinct OG image renders.
  for (const image of ogImages) {
    const response = await request.get(image);
    expect(response.status(), `og:image ${image}`).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/");
  }

  // Non-production environments must never be indexable (contracts/routes-and-seo.md).
  expect(await (await request.get("/robots.txt")).text()).toMatch(/Disallow: \//);
  expect(await fetchHtml(request, "/")).toMatch(/<meta name="robots" content="noindex/);
});

test("responsive: no horizontal overflow at any width (T211)", async ({ page, request }) => {
  const paths = [...(await sitemapPaths(request)), ...EXTRA_PATHS];
  const failures: string[] = [];
  for (const width of [320, 375, 768, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 0) failures.push(`${path}@${width}: overflows by ${overflow}px`);
      if (!(await page.locator("header a[data-track-location='header']").isVisible()))
        failures.push(`${path}@${width}: header CTA hidden`);
      if (!(await page.locator("h1").first().isVisible()))
        failures.push(`${path}@${width}: h1 hidden`);
    }
  }
  expect(failures).toEqual([]);
});

test("accessibility: zero critical or serious axe violations (T212)", async ({ page, request }) => {
  const paths = [...(await sitemapPaths(request)), ...EXTRA_PATHS];
  const problems: string[] = [];
  const scan = async (label: string) => {
    await renderAllSections(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    for (const violation of results.violations) {
      if (violation.impact === "critical" || violation.impact === "serious") {
        problems.push(
          `${label}: ${violation.id} ×${violation.nodes.length} — ${violation.nodes[0]?.target.join(" ")}`,
        );
      }
    }
  };

  for (const width of [1440, 375]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      await scan(`${path}@${width}`);
    }
  }

  // Form states and the open mobile menu (T212 covers these explicitly).
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/contact");
  await expect(page.locator("input[name='submissionId']")).not.toHaveValue("");
  await page.getByRole("button", { name: "Get Free Consultation" }).click();
  await scan("/contact (invalid)");
  await page.fill("#consultation-name", "Axe Tester");
  await page.fill("#consultation-company", "FAIL-TEST-axe");
  await page.fill("#consultation-email", "axe@company.test");
  await page.fill("#consultation-phone", "+1 555 987 6543");
  await page.selectOption("#consultation-industry", "manufacturing");
  await page.selectOption("#consultation-need", "erp");
  await page.getByRole("button", { name: "Get Free Consultation" }).click();
  await expect(page.getByRole("heading", { name: "Your request was not sent" })).toBeVisible();
  await scan("/contact (failed)");

  // Success state (T195 asks for every form state).
  await page.fill("#consultation-company", `Axe-success-${Date.now()}`);
  await page.getByRole("button", { name: "Get Free Consultation" }).click();
  await expect(page.getByRole("heading", { name: "Request received" })).toBeVisible();
  await scan("/contact (success)");

  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.locator("#mobile-nav")).toBeVisible();
  await scan("mobile menu open");

  // Short landscape screen: the menu must still be reachable and scrollable (T196).
  await page.setViewportSize({ width: 568, height: 320 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const panel = page.locator("#mobile-nav");
  await expect(panel).toBeVisible();
  const lastLink = panel.getByRole("link").last();
  await lastLink.scrollIntoViewIfNeeded();
  await expect(lastLink).toBeInViewport();
  await scan("mobile menu open @568x320");

  expect(problems).toEqual([]);
});

test("link names: repeated link text carries distinct context (T199)", async ({
  page,
  request,
}) => {
  const paths = [...(await sitemapPaths(request)), ...EXTRA_PATHS];
  const problems: string[] = [];
  for (const path of paths) {
    await page.goto(path);
    await renderAllSections(page);
    const links = await page.locator("main a[href]").evaluateAll((as) =>
      as.map((a) => ({
        name: (a.getAttribute("aria-label") ?? a.textContent ?? "").replace(/\s+/g, " ").trim(),
        href: a.getAttribute("href") ?? "",
      })),
    );
    const byName = new Map<string, Set<string>>();
    for (const { name, href } of links) {
      if (!name) problems.push(`${path}: link with no accessible name → ${href}`);
      // Compare destinations by path: the consultation CTA legitimately repeats with
      // different context parameters (?source=, ?need=), and all of them lead to the
      // same page, so it is not ambiguous to a screen-reader user.
      const target = href.split(/[?#]/)[0] || href;
      byName.set(name, (byName.get(name) ?? new Set()).add(target));
    }
    for (const [name, targets] of byName) {
      if (targets.size > 1)
        problems.push(`${path}: "${name}" points at ${targets.size} different pages`);
    }
  }
  expect(problems).toEqual([]);
});

test("console: no errors or warnings on any page (T216)", async ({ page, request }) => {
  const paths = [...(await sitemapPaths(request)), ...EXTRA_PATHS];
  const messages: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning")
      messages.push(`${page.url()}: ${message.text()}`);
  });
  page.on("pageerror", (error) => messages.push(`${page.url()}: ${error.message}`));
  for (const path of paths) {
    await page.goto(path);
    await page.waitForLoadState("domcontentloaded");
  }
  expect(messages).toEqual([]);
});
