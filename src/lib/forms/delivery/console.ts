import type { LeadDeliveryAdapter } from "./types";

/** Development only: logs a redacted summary (no personal data). Rejected in production. */
export const consoleAdapter: LeadDeliveryAdapter = {
  name: "console",
  async deliver(lead) {
    console.warn("[lead]", { id: lead.id, industry: lead.industry.value, need: lead.need.value });
    return { ok: true };
  },
};
