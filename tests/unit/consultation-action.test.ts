import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "10.0.0.1" }),
}));

const deliverLead = vi.fn();
vi.mock("@/lib/forms/delivery", () => ({
  deliverLead: (...args: unknown[]) => deliverLead(...args),
}));

const { submitConsultation } = await import("@/app/actions/consultation");
const { resetRateLimits } = await import("@/lib/forms/rate-limit");
const { signTimestamp } = await import("@/lib/forms/spam");

const idle = { status: "idle" } as const;

function validForm(overrides: Record<string, string> = {}): FormData {
  const fd = new FormData();
  const base: Record<string, string> = {
    name: "Aisha Khan",
    company: "Example Textiles",
    email: "aisha@company.com",
    phone: "+92 300 1234567",
    industry: "manufacturing",
    need: "erp",
    message: "",
    sourcePage: "/contact",
    submissionId: crypto.randomUUID(),
    renderedAt: "",
    website: "",
  };
  for (const [k, v] of Object.entries({ ...base, ...overrides })) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  vi.stubEnv("FORM_SIGNING_SECRET", "unit-secret");
  vi.stubEnv("FORM_MIN_FILL_MS", "3000");
  vi.stubEnv("FORM_RATE_LIMIT_MAX", "100");
  resetRateLimits();
  deliverLead.mockReset();
  deliverLead.mockResolvedValue({ ok: true });
});

describe("submitConsultation (Behavior table)", () => {
  it("delivers valid requests and confirms", async () => {
    const state = await submitConsultation(idle, validForm());
    expect(state.status).toBe("success");
    expect(deliverLead).toHaveBeenCalledTimes(1);
    const lead = deliverLead.mock.calls[0]?.[0];
    expect(lead).toMatchObject({
      company: "Example Textiles",
      industry: { value: "manufacturing", label: "Manufacturing" },
      need: { value: "erp", label: "ERP Systems" },
      sourcePage: "/contact",
    });
  });

  it("returns field errors and keeps values for invalid input", async () => {
    const state = await submitConsultation(idle, validForm({ email: "nope" }));
    expect(state.status).toBe("invalid");
    if (state.status === "invalid") {
      expect(state.fieldErrors.email).toBeDefined();
      expect(state.values.company).toBe("Example Textiles");
    }
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot spam without delivering", async () => {
    const state = await submitConsultation(idle, validForm({ website: "spam" }));
    expect(state.status).toBe("success");
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("treats a too-fast signed token as spam", async () => {
    const state = await submitConsultation(
      idle,
      validForm({ renderedAt: signTimestamp(Date.now(), "unit-secret") }),
    );
    expect(state.status).toBe("success");
    expect(deliverLead).not.toHaveBeenCalled();
  });

  it("is idempotent for a repeated submissionId", async () => {
    const id = crypto.randomUUID();
    await submitConsultation(idle, validForm({ submissionId: id }));
    const second = await submitConsultation(idle, validForm({ submissionId: id }));
    expect(second.status).toBe("success");
    expect(deliverLead).toHaveBeenCalledTimes(1);
  });

  it("generates an id for no-JS submissions", async () => {
    const state = await submitConsultation(idle, validForm({ submissionId: "" }));
    expect(state.status).toBe("success");
    expect(deliverLead).toHaveBeenCalledTimes(1);
  });

  it("reports delivery failure with values kept and no internals exposed", async () => {
    deliverLead.mockResolvedValue({ ok: false, reason: "all adapters failed" });
    const state = await submitConsultation(idle, validForm());
    expect(state.status).toBe("failed");
    if (state.status === "failed") {
      expect(state.values.name).toBe("Aisha Khan");
      expect(state.message).not.toMatch(/adapter|error|stack/i);
    }
  });

  it("handles thrown configuration errors as a failure", async () => {
    deliverLead.mockRejectedValue(new Error("Missing RESEND_API_KEY"));
    const state = await submitConsultation(idle, validForm());
    expect(state.status).toBe("failed");
  });

  it("rate limits repeated submissions from one client", async () => {
    vi.stubEnv("FORM_RATE_LIMIT_MAX", "2");
    await submitConsultation(idle, validForm());
    await submitConsultation(idle, validForm());
    const third = await submitConsultation(idle, validForm());
    expect(third.status).toBe("failed");
    if (third.status === "failed") expect(third.message).toMatch(/Too many requests/);
  });
});
