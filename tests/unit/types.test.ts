import { describe, expect, it } from "vitest";
import { PENDING_SCREENSHOT } from "@/content/projects/pending";
import type { CtaLabel, Project } from "@/types/content";

describe("content types enforce integrity at compile time", () => {
  it("rejects client fields and results on concept projects", () => {
    // @ts-expect-error — concept projects cannot carry verified results (FR-052)
    const concept: Project = {
      slug: "x",
      title: "X",
      type: "concept",
      industry: "manufacturing",
      solutionTypes: [],
      summary: "s",
      modules: [],
      screenshots: [{ image: PENDING_SCREENSHOT, caption: "c" }],
      featured: false,
      status: "draft",
      results: [{ label: "Growth", value: "1", verifiedBy: "a", verifiedOn: "2026-01-01" }],
    };
    expect(concept.type).toBe("concept");
  });

  it("only allows approved CTA labels", () => {
    const ok: CtaLabel = "Get Free Consultation";
    // @ts-expect-error — not an approved CTA label (FR-005)
    const bad: CtaLabel = "Buy Now";
    expect([ok, bad]).toHaveLength(2);
  });
});
