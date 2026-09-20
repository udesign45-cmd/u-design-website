import "server-only";
import { createHmac } from "node:crypto";
import { requireEnv } from "@/lib/utils/env.server";
import { fetchWithRetry, type LeadDeliveryAdapter } from "./types";

export function signPayload(body: string, secret: string): string {
  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

/** Signed JSON POST for CRMs, Google Sheets (Apps Script), Zapier or Make (contracts/lead-delivery.md). */
export const webhookAdapter: LeadDeliveryAdapter = {
  name: "webhook",
  async deliver(lead) {
    const body = JSON.stringify({ event: "consultation.created", lead });
    try {
      const response = await fetchWithRetry(requireEnv("LEAD_WEBHOOK_URL"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-UDesign-Signature": signPayload(body, requireEnv("LEAD_WEBHOOK_SECRET")),
        },
        body,
      });
      return response.ok
        ? { ok: true }
        : { ok: false, reason: `webhook responded ${response.status}` };
    } catch {
      return { ok: false, reason: "webhook unreachable" };
    }
  },
};
