import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { track } from "@/lib/analytics/track";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("track()", () => {
  it("is a no-op when no provider is configured", () => {
    vi.stubGlobal("window", {});
    expect(() =>
      track("cta_click", { label: "Get Free Consultation", location: "hero", page: "/" }),
    ).not.toThrow();
  });

  it("maps events to GA4 and Meta names", () => {
    const gtag = vi.fn();
    const fbq = vi.fn();
    vi.stubGlobal("window", { gtag, fbq });
    track("consultation_submit", {
      industry: "manufacturing",
      need: "erp",
      source_page: "/contact",
    });
    expect(gtag).toHaveBeenCalledWith("event", "generate_lead", {
      industry: "manufacturing",
      need: "erp",
      source_page: "/contact",
    });
    expect(fbq).toHaveBeenCalledWith("track", "Lead", expect.any(Object));
    track("cta_click", { label: "x", location: "y", page: "/" });
    expect(fbq).toHaveBeenCalledTimes(1);
  });

  it("waits for consent when consent is required", () => {
    vi.stubEnv("NEXT_PUBLIC_ANALYTICS_CONSENT", "required");
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    track("cta_click", { label: "x", location: "y", page: "/" });
    expect(gtag).not.toHaveBeenCalled();
  });
});

describe("client component allowlist (plan AD-06, task T179)", () => {
  const ALLOWED = [
    "src/app/error.tsx",
    "src/app/global-error.tsx",
    "src/components/analytics/AnalyticsScripts.tsx",
    "src/components/analytics/TrackClicks.tsx",
    "src/components/forms/ConsultationForm.tsx",
    "src/components/motion/HeroReveal.tsx",
    "src/components/motion/ScrollStagger.tsx",
    "src/components/plans/PlanExplorer.tsx",
    "src/components/portfolio/PortfolioFilter.tsx",
    "src/components/visuals/HeroMedia.tsx",
  ];

  function walk(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      const full = join(dir, name);
      return statSync(full).isDirectory() ? walk(full) : /\.(ts|tsx)$/.test(name) ? [full] : [];
    });
  }

  it("only allowlisted files use the 'use client' directive", () => {
    const root = join(__dirname, "..", "..");
    const clientFiles = walk(join(root, "src"))
      .filter((f) => /^\s*["']use client["'];?/.test(readFileSync(f, "utf8")))
      .map((f) => relative(root, f).replace(/\\/g, "/"))
      .sort();
    expect(clientFiles).toEqual([...ALLOWED].sort());
  });
});
