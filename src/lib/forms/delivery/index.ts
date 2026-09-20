import "server-only";
import { consoleAdapter } from "./console";
import { emailAdapter } from "./email";
import type { DeliveryResult, Lead, LeadDeliveryAdapter } from "./types";
import { webhookAdapter } from "./webhook";

export type { Lead } from "./types";

const REQUIRED_VARS: Record<"email" | "webhook", string[]> = {
  email: ["RESEND_API_KEY", "LEAD_EMAIL_TO", "LEAD_EMAIL_FROM"],
  webhook: ["LEAD_WEBHOOK_URL", "LEAD_WEBHOOK_SECRET"],
};

export class DeliveryConfigError extends Error {}

/** Builds the adapter list from LEAD_DELIVERY_PROVIDER (research R-1). */
export function getAdapters(
  env: Record<string, string | undefined> = process.env,
): LeadDeliveryAdapter[] {
  const provider = env.LEAD_DELIVERY_PROVIDER || "console";
  const names =
    provider === "email+webhook"
      ? (["email", "webhook"] as const)
      : provider === "email" || provider === "webhook" || provider === "console"
        ? ([provider] as const)
        : null;

  if (!names) throw new DeliveryConfigError(`Unknown LEAD_DELIVERY_PROVIDER "${provider}"`);

  if (names.includes("console" as never) && env.VERCEL_ENV === "production") {
    throw new DeliveryConfigError('LEAD_DELIVERY_PROVIDER "console" is not allowed in production');
  }

  return names.map((name) => {
    if (name === "console") return consoleAdapter;
    const missing = REQUIRED_VARS[name].filter((v) => !env[v]);
    if (missing.length)
      throw new DeliveryConfigError(`Missing ${missing.join(", ")} for ${name} delivery`);
    return name === "email" ? emailAdapter : webhookAdapter;
  });
}

/**
 * Delivers to every configured adapter in parallel. Succeeds when at least one
 * succeeds; every failure is logged without personal data (FR-086).
 */
export async function deliverLead(
  lead: Lead,
  adapters: LeadDeliveryAdapter[] = getAdapters(),
): Promise<DeliveryResult> {
  const results = await Promise.all(
    adapters.map(async (adapter) => {
      try {
        return { adapter: adapter.name, result: await adapter.deliver(lead) };
      } catch {
        return {
          adapter: adapter.name,
          result: { ok: false, reason: "adapter error" } as DeliveryResult,
        };
      }
    }),
  );
  for (const { adapter, result } of results) {
    if (!result.ok)
      console.error("[lead-delivery]", { id: lead.id, adapter, reason: result.reason });
  }
  return results.some((r) => r.result.ok)
    ? { ok: true }
    : { ok: false, reason: "all adapters failed" };
}
