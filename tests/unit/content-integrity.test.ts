import { afterEach, describe, expect, it, vi } from "vitest";
import { clientLogos } from "@/content/client-logos";
import { digitalization } from "@/content/digitalization";
import { home } from "@/content/home";
import { industries } from "@/content/industries";
import { marketingServices } from "@/content/marketing";
import { processSteps } from "@/content/process";
import { projects } from "@/content/projects";
import { PENDING_SCREENSHOT } from "@/content/projects/pending";
import { solutions } from "@/content/solutions";
import { stats } from "@/content/stats";
import { testimonials } from "@/content/testimonials";
import { whyThemes } from "@/content/why";
import { includeDrafts, isVisible, resolveSlugs } from "@/lib/content/core";
import { getFormOptions } from "@/lib/content/form-options";
import { usesPlaceholder } from "@/lib/content/projects";
import {
  filterApprovedLogos,
  filterVerifiedStats,
  filterVerifiedTestimonials,
} from "@/lib/content/proof";
import type { Industry, Project, Solution } from "@/types/content";
import {
  checkBannedWords,
  checkBidirectional,
  checkCtaLabels,
  checkImageAlts,
  checkIndustryDistinctness,
  checkPlaceholders,
  checkProjectIntegrity,
  checkProofFilters,
  checkReferences,
  checkScreenshots,
  checkSeo,
  checkSlugs,
  seoEntries,
  type ContentSet,
} from "./integrity/rules";

const content: ContentSet = { solutions, marketing: marketingServices, industries, projects };

const allEntries = [
  ...solutions.map((v) => ({ id: `solution:${v.slug}`, status: v.status, value: v })),
  ...marketingServices.map((v) => ({ id: `marketing:${v.slug}`, status: v.status, value: v })),
  ...industries.map((v) => ({ id: `industry:${v.slug}`, status: v.status, value: v })),
  // A project whose page is withheld in production (placeholder screenshots) cannot
  // show those assets to anyone, so rule 6 treats it as a warning, not an error.
  ...projects.map((v) => ({
    id: `project:${v.slug}`,
    status: v.status,
    value: v,
    reachable: !usesPlaceholder(v),
  })),
  { id: "home", status: "published", value: home },
  { id: "digitalization", status: "published", value: digitalization },
  { id: "process", status: "published", value: processSteps },
  { id: "why", status: "published", value: whyThemes },
];

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("repository core", () => {
  it("hides drafts in production unless CONTENT_INCLUDE_DRAFTS is set", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_INCLUDE_DRAFTS", "");
    expect(includeDrafts()).toBe(false);
    expect(isVisible({ status: "draft" })).toBe(false);
    expect(isVisible({ status: "published" })).toBe(true);
    vi.stubEnv("CONTENT_INCLUDE_DRAFTS", "true");
    expect(isVisible({ status: "draft" })).toBe(true);
  });

  it("resolves slugs in order and drops missing or invisible targets", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_INCLUDE_DRAFTS", "");
    const collection = [
      { slug: "a", status: "published" as const },
      { slug: "b", status: "draft" as const },
      { slug: "c", status: "published" as const },
    ];
    expect(resolveSlugs(["c", "b", "missing", "a"], collection).map((e) => e.slug)).toEqual([
      "c",
      "a",
    ]);
  });

  it("derives form options from content", () => {
    const options = getFormOptions();
    expect(options.industries).toHaveLength(industries.length + 1);
    expect(options.industries.at(-1)).toEqual({ value: "other", label: "Other" });
    expect(options.needs).toHaveLength(solutions.length + marketingServices.length + 1);
    expect(options.needs.at(-1)?.value).toBe("not-sure");
  });
});

describe("integrity rules on real content", () => {
  it("rule 0: slugs are valid and unique", () => expect(checkSlugs(content)).toEqual([]));
  it("rule 1: references resolve", () => expect(checkReferences(content)).toEqual([]));
  it("rule 2: SEO fields are unique and within length", () =>
    expect(checkSeo(seoEntries(content))).toEqual([]));
  it("rule 3: concept projects carry no client or results", () =>
    expect(checkProjectIntegrity(projects)).toEqual([]));
  it("rule 4: proof getters return only verified items", () =>
    expect(
      checkProofFilters(
        filterVerifiedTestimonials(testimonials),
        filterVerifiedStats(stats),
        filterApprovedLogos(clientLogos),
      ),
    ).toEqual([]));
  it("rule 5: projects have captioned screenshots", () =>
    expect(checkScreenshots(projects)).toEqual([]));
  it("rule 6: no placeholders in published entries (drafts reported as warnings)", () => {
    const { errors, warnings } = checkPlaceholders(allEntries);
    if (warnings.length) console.warn(`[content] draft placeholders:\n  ${warnings.join("\n  ")}`);
    expect(errors).toEqual([]);
  });
  it("rule 7: CTA labels are approved", () =>
    expect(
      checkCtaLabels([
        home.hero.primaryCta.label,
        home.hero.secondaryCta.label,
        home.marketing.cta.label,
        digitalization.cta.label,
      ]),
    ).toEqual([]));
  it("rule 8: no banned buzzwords or guarantee language", () =>
    expect(checkBannedWords(allEntries)).toEqual([]));
  it("rule 9: industry pages are distinct", () =>
    expect(checkIndustryDistinctness(industries)).toEqual([]));
  it("rule 12: content images have meaningful alt text", () =>
    expect(checkImageAlts(allEntries)).toEqual([]));
  it("rule 11: relations are bidirectional with ≥ 2 related links", () =>
    expect(checkBidirectional(content)).toEqual([]));
});

describe("integrity rules detect violations (fixtures)", () => {
  const baseIndustry = industries[0] as Extract<Industry, { hasPage: true }>;
  const baseSolution = solutions[0] as Extract<Solution, { hasPage: true }>;
  const baseProject = projects[0] as Project;

  it("rule 0: invalid and duplicate slugs", () => {
    const bad: ContentSet = {
      ...content,
      solutions: [{ ...baseSolution, slug: "Bad Slug" }, baseSolution, baseSolution],
    };
    expect(checkSlugs(bad).length).toBeGreaterThanOrEqual(2);
  });

  it("rule 1: unknown reference", () => {
    const bad: ContentSet = {
      ...content,
      solutions: [{ ...baseSolution, industries: ["nowhere"] }],
    };
    expect(checkReferences(bad)).toContain(
      'service:custom-software references unknown industry "nowhere"',
    );
  });

  it("rule 2: duplicate and out-of-range SEO", () => {
    const errors = checkSeo([
      { id: "a", title: "Short", description: "Too short" },
      { id: "b", title: "Short", description: "Too short" },
    ]);
    expect(errors.some((e) => e.includes("duplicate title"))).toBe(true);
    expect(errors.some((e) => e.includes("title length"))).toBe(true);
  });

  it("rule 3: concept project with results", () => {
    const bad = {
      ...baseProject,
      results: [{ label: "x", value: "1", verifiedBy: "", verifiedOn: "" }],
    } as unknown as Project;
    expect(checkProjectIntegrity([bad])).toHaveLength(1);
  });

  it("rule 4: unverified proof", () => {
    const t = {
      quote: "q",
      name: "n",
      role: "r",
      company: "c",
      verified: false,
      approvedOn: "2026-01-01",
    };
    expect(filterVerifiedTestimonials([t])).toEqual([]);
    expect(checkProofFilters([t], [], [])).toEqual(["unverified testimonial returned"]);
    expect(filterVerifiedStats([{ value: "1", label: "l", source: "", verified: true }])).toEqual(
      [],
    );
  });

  it("rule 5: missing screenshots and captions", () => {
    const bad = { ...baseProject, screenshots: [] } as Project;
    expect(checkScreenshots([bad])).toContain(`project:${baseProject.slug} has no screenshots`);
    const noCaption = {
      ...baseProject,
      screenshots: [{ image: PENDING_SCREENSHOT, caption: " " }],
    } as Project;
    expect(checkScreenshots([noCaption]).length).toBe(1);
  });

  it("rule 6: placeholder text and assets fail when published", () => {
    const { errors } = checkPlaceholders([
      { id: "x", status: "published", value: { text: "Lorem ipsum" } },
      { id: "y", status: "published", value: { shot: PENDING_SCREENSHOT } },
      { id: "z", status: "draft", value: { text: "TODO" } },
    ]);
    expect(errors).toEqual(['x contains "lorem"', "y uses a placeholder asset"]);
  });

  it("rule 7: unapproved CTA label", () => expect(checkCtaLabels(["Buy Now"])).toHaveLength(1));

  it("rule 8: banned words", () =>
    expect(
      checkBannedWords([{ id: "x", value: "Our innovative, guaranteed results" }]),
    ).toHaveLength(2));

  it("rule 9: near-identical industries", () => {
    const clone = { ...baseIndustry, slug: "clone" };
    expect(checkIndustryDistinctness([baseIndustry, clone])).toHaveLength(1);
  });

  it("rule 12: weak alt text", () => {
    expect(
      checkImageAlts([{ id: "x", value: { image: { src: "a.png", alt: "image" } } }]),
    ).toHaveLength(1);
    expect(
      checkImageAlts([{ id: "y", value: { src: "a.png", alt: "x", decorative: true } }]),
    ).toHaveLength(1);
  });

  it("rule 11: one-directional relation", () => {
    const bad: ContentSet = {
      ...content,
      industries: industries.map((i) =>
        i.slug === "manufacturing" && i.hasPage ? { ...i, solutions: ["crm"] } : i,
      ),
    };
    expect(
      checkBidirectional(bad).some((e) => e.includes("industry:manufacturing lists crm")),
    ).toBe(true);
  });
});
