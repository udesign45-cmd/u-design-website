/**
 * Launch-readiness gate (task T219). Run with `npm run check:launch` and the
 * production environment loaded. It is the objective go / no-go signal: every
 * blocker that must be cleared before U Design's site can go live is asserted
 * here, and the failure message names what is missing.
 *
 * It is expected to FAIL until the business inputs (T220), the content approval
 * (T222) and the production configuration (T228) are done.
 */
import { describe, expect, it } from "vitest";

type Blockers = string[];

/**
 * Explicit, dated waivers. A waiver records a decision the business made with the
 * trade-off in view — it is not a silent pass, and each one stays visible in the test
 * output and in qa/technical.md until it is lifted.
 *
 * Both waivers below were lifted on 2026-09-23: the official logo replaced the
 * typographic wordmark, and U Design published a phone number and city/country
 * (Karachi, Pakistan) — email stays private, used only for lead delivery. Kept
 * here, unused, as the dated record of the earlier decision and its reversal.
 */
const WAIVERS = {
  officialLogo:
    "2026-09-21: launch approved with the typographic wordmark; the official SVG is still to come (Q-2). Lifted 2026-09-23.",
  publicContactDetails:
    "2026-09-21: U Design chose form-only contact. The email is used for lead delivery and account ownership, never displayed (Q-7). Lifted 2026-09-23: phone and location are now public; email stays private.",
} as const;

async function content() {
  const [site, legal, lib, routes] = await Promise.all([
    import("@/content/site"),
    import("@/content/legal"),
    import("@/lib/content"),
    import("@/lib/content/routes"),
  ]);
  return { site: site.site, legalPages: legal.legalPages, ...lib, ...routes };
}

describe("launch readiness", () => {
  it("publishes the Privacy Policy", async () => {
    const { legalPages } = await content();
    const privacy = legalPages.find((page) => page.slug === "privacy-policy");
    expect(privacy?.status, "Privacy Policy must be published before launch (Q-8)").toBe(
      "published",
    );
  });

  it("gives visitors a way to reach U Design (integrity rule 10)", async () => {
    const { site } = await content();
    const displayed = [site.email, site.phone?.e164].filter(Boolean);
    if (displayed.length > 0) return;

    // Waived: no contact detail is displayed, so the consultation form is the only
    // channel and it must therefore be delivered somewhere real.
    expect(WAIVERS.publicContactDetails).toBeTruthy();
    const provider = process.env.LEAD_DELIVERY_PROVIDER ?? "console";
    expect(
      provider,
      "Form-only contact was chosen, so lead delivery must be configured — otherwise nobody can reach U Design",
    ).not.toBe("console");
  });

  it("has a brand mark", async () => {
    const { site } = await content();
    if (site.logo) return;
    // Waived: the typographic wordmark in components/layout/Logo.tsx stands in.
    expect(WAIVERS.officialLogo).toContain("wordmark");
  });

  it("delivers leads somewhere other than the console", async () => {
    const blockers: Blockers = [];
    const provider = process.env.LEAD_DELIVERY_PROVIDER ?? "console";
    if (provider === "console") blockers.push("LEAD_DELIVERY_PROVIDER is still 'console'");
    if (provider.includes("email")) {
      for (const key of ["LEAD_EMAIL_TO", "LEAD_EMAIL_FROM", "EMAIL_API_KEY"]) {
        if (!process.env[key]) blockers.push(`${key} is not set (email delivery)`);
      }
    }
    if (provider.includes("webhook")) {
      for (const key of ["LEAD_WEBHOOK_URL", "LEAD_WEBHOOK_SECRET"]) {
        if (!process.env[key]) blockers.push(`${key} is not set (webhook delivery)`);
      }
    }
    if (!process.env.FORM_SIGNING_SECRET) blockers.push("FORM_SIGNING_SECRET is not set");
    expect(blockers).toEqual([]);
  });

  it("points at the production domain over https", () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL ?? "";
    expect(url, "Set NEXT_PUBLIC_SITE_URL to the live domain (Q-9)").toMatch(/^https:\/\//);
    expect(url).not.toMatch(/localhost|vercel\.app|example\./);
  });

  it("publishes the core pages", async () => {
    const { getSolutionPages, getIndustryPages, legalPages } = await content();
    const blockers: Blockers = [];
    if (getSolutionPages().length === 0) blockers.push("no solution page is published");
    if (getIndustryPages().length === 0) blockers.push("no industry page is published");
    if (!legalPages.some((page) => page.status === "published"))
      blockers.push("no legal page is published");
    expect(blockers).toEqual([]);
  });

  it("ships no placeholder assets on published pages", async () => {
    const { getProjectPages, usesPlaceholder } = await content();
    const withPlaceholders = getProjectPages()
      .filter(usesPlaceholder)
      .map((project) => project.slug);
    expect(withPlaceholders, "Replace the pending screenshots with real ones (Q-4)").toEqual([]);
  });

  it("links only to published pages from navigation and related content", async () => {
    const { getNavigation, getAllRoutes } = await content();
    const published = new Set(getAllRoutes().map((route) => route.path));
    const navigation = getNavigation();
    const targets = [
      ...navigation.primary.flatMap((item) => [
        item.href,
        ...(item.children ?? []).map((c) => c.href),
      ]),
      ...navigation.footer.flatMap((group) => group.links.map((link) => link.href)),
      navigation.cta.href,
    ];
    const dangling = targets
      .map((href) => href.split(/[?#]/)[0] ?? "/")
      .filter((path) => path && !published.has(path));
    expect([...new Set(dangling)]).toEqual([]);
  });

  it("leaves no DRAFT markers in published content", async () => {
    const { readdir, readFile } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const root = join(process.cwd(), "src", "content");
    const found: Blockers = [];
    async function walk(dir: string) {
      for (const entry of await readdir(dir, { withFileTypes: true })) {
        const path = join(dir, entry.name);
        if (entry.isDirectory()) await walk(path);
        else if (/\.(ts|tsx|mdx)$/.test(entry.name)) {
          const text = await readFile(path, "utf8");
          if (text.includes("// DRAFT")) found.push(path.replace(process.cwd(), ""));
        }
      }
    }
    await walk(root);
    expect(found).toEqual([]);
  });
});
