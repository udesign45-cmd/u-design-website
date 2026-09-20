import { describe, expect, it } from "vitest";
import { consultationHref } from "@/lib/cta";

describe("consultationHref", () => {
  it("links to the form anchor by default", () => {
    expect(consultationHref()).toBe("/contact#consultation");
  });
  it("adds only the provided pre-selection parameters", () => {
    expect(consultationHref({ industry: "manufacturing" })).toBe(
      "/contact?industry=manufacturing#consultation",
    );
    expect(consultationHref({ need: "erp", source: "/solutions/erp" })).toBe(
      "/contact?need=erp&source=%2Fsolutions%2Ferp#consultation",
    );
    expect(consultationHref({ industry: "retail", need: "crm" })).toBe(
      "/contact?industry=retail&need=crm#consultation",
    );
  });
});
