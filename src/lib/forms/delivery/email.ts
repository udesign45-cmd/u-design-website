import "server-only";
import { requireEnv } from "@/lib/utils/env.server";
import { fetchWithRetry, type Lead, type LeadDeliveryAdapter } from "./types";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function rows(lead: Lead): [string, string][] {
  return [
    ["Name", lead.name],
    ["Company", lead.company],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Industry", lead.industry.label],
    ["What they need", lead.need.label],
    ["Budget range", lead.budget?.label ?? "Not provided"],
    ["Message", lead.message || "Not provided"],
    ["Submitted from", lead.sourcePage],
    ["Submitted at", lead.submittedAt],
    ["Reference", lead.id],
  ];
}

export function buildEmail(lead: Lead) {
  const subject = `New consultation request — ${lead.company} (${lead.industry.label})`;
  const text = rows(lead)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const html =
    `<h2>New consultation request</h2><table cellpadding="6" style="border-collapse:collapse">` +
    rows(lead)
      .map(
        ([k, v]) =>
          `<tr><th align="left" style="vertical-align:top">${escapeHtml(k)}</th><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("") +
    `</table>`;
  return { subject, text, html };
}

/** Email delivery through a Resend-compatible HTTP API, without an SDK (contracts/lead-delivery.md). */
export const emailAdapter: LeadDeliveryAdapter = {
  name: "email",
  async deliver(lead) {
    const { subject, text, html } = buildEmail(lead);
    try {
      const response = await fetchWithRetry(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${requireEnv("RESEND_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: requireEnv("LEAD_EMAIL_FROM"),
          to: requireEnv("LEAD_EMAIL_TO")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          reply_to: lead.email,
          subject,
          text,
          html,
        }),
      });
      return response.ok
        ? { ok: true }
        : { ok: false, reason: `email provider responded ${response.status}` };
    } catch {
      return { ok: false, reason: "email provider unreachable" };
    }
  },
};
