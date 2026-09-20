import { describe, expect, it } from "vitest";
import { parseConsultation } from "@/lib/forms/consultation-schema";
import { MESSAGES, validateValues } from "@/lib/forms/fields";
import { getFormOptions } from "@/lib/content/form-options";

const valid = {
  name: "Aisha Khan",
  company: "Example Textiles Ltd",
  email: "Aisha@Company.com",
  phone: "+92 300 1234567",
  industry: "manufacturing",
  need: "erp",
  budget: "",
  message: "We plan production on spreadsheets.",
  sourcePage: "/industries/manufacturing",
  submissionId: "3f2b8a1e-2c4d-4e5f-8a9b-0c1d2e3f4a5b",
};

function form(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...valid, ...overrides })) fd.set(k, v);
  return fd;
}

describe("parseConsultation (server schema)", () => {
  it("accepts valid input and normalizes it", () => {
    const result = parseConsultation(form());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.email).toBe("aisha@company.com");
      expect(result.data.name).toBe("Aisha Khan");
    }
  });

  it.each([
    ["name", "A", MESSAGES.name],
    ["name", "x".repeat(101), MESSAGES.name],
    ["company", "B", MESSAGES.company],
    ["email", "not-an-email", MESSAGES.email],
    ["email", `${"a".repeat(250)}@x.com`, MESSAGES.email],
    ["phone", "12345", MESSAGES.phone],
    ["phone", "+1 234 567 890 123 456", MESSAGES.phone],
    ["phone", "phone: 1234567", MESSAGES.phone],
    ["industry", "space-mining", MESSAGES.industry],
    ["need", "", MESSAGES.need],
    ["message", "x".repeat(2001), MESSAGES.message],
  ])("rejects %s = %j", (field, value, message) => {
    const result = parseConsultation(form({ [field]: value }));
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.fieldErrors[field as keyof typeof result.fieldErrors]).toBe(message);
  });

  it("accepts boundary values", () => {
    expect(
      parseConsultation(form({ name: "Al", phone: "1234567", message: "x".repeat(2000) })).ok,
    ).toBe(true);
    expect(parseConsultation(form({ name: "x".repeat(100), phone: "+123456789012345" })).ok).toBe(
      true,
    );
  });

  it("strips control characters and keeps values for re-population", () => {
    const result = parseConsultation(form({ name: "A", email: "bad" }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.values.name).toBe("A");
      expect(result.values.email).toBe("bad");
    }
  });

  it("rejects a budget when budget options are not configured", () => {
    expect(parseConsultation(form({ budget: "50k" })).ok).toBe(false);
  });

  it("falls back to /contact for off-site source pages", () => {
    const result = parseConsultation(form({ sourcePage: "//evil.example" }));
    expect(result.ok && result.data.sourcePage).toBe("/contact");
  });
});

describe("validateValues (client, same rules)", () => {
  const o = getFormOptions();
  const allowed = {
    industries: o.industries.map((x) => x.value),
    needs: o.needs.map((x) => x.value),
    budgets: o.budgets.map((x) => x.value),
  };
  it("agrees with the server on valid input", () => {
    expect(validateValues(valid, allowed)).toEqual({});
  });
  it("reports the same messages", () => {
    const errors = validateValues({ ...valid, email: "x", phone: "1" }, allowed);
    expect(errors).toEqual({ email: MESSAGES.email, phone: MESSAGES.phone });
  });
});
