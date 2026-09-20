import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deliverLead, getAdapters, DeliveryConfigError } from "@/lib/forms/delivery";
import { buildEmail, emailAdapter } from "@/lib/forms/delivery/email";
import type { Lead, LeadDeliveryAdapter } from "@/lib/forms/delivery/types";
import { signPayload, webhookAdapter } from "@/lib/forms/delivery/webhook";

const lead: Lead = {
  id: "11111111-2222-4333-8444-555555555555",
  submittedAt: "2026-09-19T10:00:00.000Z",
  sourcePage: "/solutions/erp",
  name: "Aisha <script>alert(1)</script>",
  company: "Example Textiles",
  email: "aisha@company.com",
  phone: "+92 300 1234567",
  industry: { value: "manufacturing", label: "Manufacturing" },
  need: { value: "erp", label: "ERP Systems" },
  message: "Hello",
};

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("LEAD_EMAIL_TO", "leads@udesign.test, sales@udesign.test");
  vi.stubEnv("LEAD_EMAIL_FROM", "website@udesign.test");
  vi.stubEnv("LEAD_WEBHOOK_URL", "https://hooks.example.test/lead");
  vi.stubEnv("LEAD_WEBHOOK_SECRET", "whsec");
  fetchMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const ok = () => new Response("{}", { status: 200 });

describe("email adapter", () => {
  it("sends to all recipients with reply-to and escaped HTML", async () => {
    fetchMock.mockResolvedValue(ok());
    expect(await emailAdapter.deliver(lead)).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String(init.body));
    expect(body.to).toEqual(["leads@udesign.test", "sales@udesign.test"]);
    expect(body.reply_to).toBe("aisha@company.com");
    expect(body.subject).toBe("New consultation request — Example Textiles (Manufacturing)");
    expect(body.html).not.toContain("<script>");
    expect(body.html).toContain("&lt;script&gt;");
  });

  it("retries once on 5xx then succeeds", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 })).mockResolvedValueOnce(ok());
    expect(await emailAdapter.deliver(lead)).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("fails cleanly on network errors / timeouts", async () => {
    fetchMock.mockRejectedValue(new DOMException("timeout", "TimeoutError"));
    const result = await emailAdapter.deliver(lead);
    expect(result).toEqual({ ok: false, reason: "email provider unreachable" });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("builds a plain-text body with every field", () => {
    const { text } = buildEmail(lead);
    for (const v of ["Example Textiles", "ERP Systems", "/solutions/erp", lead.id])
      expect(text).toContain(v);
  });
});

describe("webhook adapter", () => {
  it("posts signed JSON", async () => {
    fetchMock.mockResolvedValue(ok());
    expect(await webhookAdapter.deliver(lead)).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://hooks.example.test/lead");
    const body = String(init.body);
    expect(JSON.parse(body)).toEqual({ event: "consultation.created", lead });
    expect((init.headers as Record<string, string>)["X-UDesign-Signature"]).toBe(
      signPayload(body, "whsec"),
    );
  });

  it("treats 4xx as failure without retry", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 400 }));
    expect(await webhookAdapter.deliver(lead)).toEqual({
      ok: false,
      reason: "webhook responded 400",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("adapter selection and delivery", () => {
  it("selects adapters from LEAD_DELIVERY_PROVIDER", () => {
    expect(getAdapters({ LEAD_DELIVERY_PROVIDER: "console" }).map((a) => a.name)).toEqual([
      "console",
    ]);
    expect(
      getAdapters({ ...process.env, LEAD_DELIVERY_PROVIDER: "email+webhook" }).map((a) => a.name),
    ).toEqual(["email", "webhook"]);
  });

  it("rejects unknown providers, missing config and console in production", () => {
    expect(() => getAdapters({ LEAD_DELIVERY_PROVIDER: "carrier-pigeon" })).toThrow(
      DeliveryConfigError,
    );
    expect(() => getAdapters({ LEAD_DELIVERY_PROVIDER: "webhook" })).toThrow(/LEAD_WEBHOOK_URL/);
    expect(() =>
      getAdapters({ LEAD_DELIVERY_PROVIDER: "console", VERCEL_ENV: "production" }),
    ).toThrow(/not allowed in production/);
  });

  const fake = (name: LeadDeliveryAdapter["name"], ok: boolean): LeadDeliveryAdapter => ({
    name,
    deliver: async () => (ok ? { ok: true } : { ok: false, reason: "down" }),
  });

  it("succeeds when at least one adapter succeeds and logs the failure without personal data", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await deliverLead(lead, [fake("email", true), fake("webhook", false)])).toEqual({
      ok: true,
    });
    const logged = JSON.stringify(errorSpy.mock.calls);
    expect(logged).toContain("webhook");
    expect(logged).not.toContain("aisha@company.com");
    expect(logged).not.toContain("+92");
    errorSpy.mockRestore();
  });

  it("fails when every adapter fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await deliverLead(lead, [fake("email", false), fake("webhook", false)])).toEqual({
      ok: false,
      reason: "all adapters failed",
    });
  });
});
