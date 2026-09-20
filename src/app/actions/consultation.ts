"use server";

import { headers } from "next/headers";
import { site } from "@/content/site";
import { getFormOptions } from "@/lib/content/form-options";
import { parseConsultation, safeValues } from "@/lib/forms/consultation-schema";
import { deliverLead, type Lead } from "@/lib/forms/delivery";
import type { ConsultationState } from "@/lib/forms/fields";
import { isRateLimited, rememberSubmission, seenSubmission } from "@/lib/forms/rate-limit";
import { isSpam, signTimestamp } from "@/lib/forms/spam";

/** Signed render timestamp for the minimum-fill check (spam.ts explains why it is issued at mount). */
export async function issueRenderToken(): Promise<string> {
  return signTimestamp(Date.now());
}

function fallbackContacts() {
  return { email: site.email, phone: site.phone };
}

function successMessage(): string {
  return `Thank you — your request has been received. We'll contact you ${site.responseTime ?? "soon"}.`;
}

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

/**
 * Consultation Server Action (contracts/consultation-action.md). Works with and
 * without JavaScript. Never returns stack traces or provider errors.
 */
export async function submitConsultation(
  _prev: ConsultationState,
  formData: FormData,
): Promise<ConsultationState> {
  // 1. Rate limit (best effort per instance; Vercel WAF is authoritative)
  if (isRateLimited(await clientKey())) {
    return {
      status: "failed",
      message: "Too many requests, please try again in a few minutes.",
      values: safeValues(formData),
      fallback: fallbackContacts(),
    };
  }

  // 2. Spam: generic success, nothing delivered
  if (isSpam(formData)) {
    console.warn("[lead-spam]", { reason: "honeypot or timing" });
    return { status: "success", message: successMessage() };
  }

  // 3. Idempotency (no-JS posts get a server-generated id)
  const rawId = formData.get("submissionId");
  if (typeof rawId !== "string" || rawId.length === 0)
    formData.set("submissionId", crypto.randomUUID());
  const submissionId = String(formData.get("submissionId"));
  if (seenSubmission(submissionId)) {
    return { status: "success", message: successMessage() };
  }

  // 4. Validation
  const parsed = parseConsultation(formData);
  if (!parsed.ok) {
    return { status: "invalid", fieldErrors: parsed.fieldErrors, values: parsed.values };
  }

  // 5. Delivery
  const { data } = parsed;
  const options = getFormOptions();
  const label = (list: { value: string; label: string }[], value: string) =>
    list.find((o) => o.value === value)?.label ?? value;

  const lead: Lead = {
    id: data.submissionId,
    submittedAt: new Date().toISOString(),
    sourcePage: data.sourcePage || "/contact",
    name: data.name,
    company: data.company,
    email: data.email,
    phone: data.phone,
    industry: { value: data.industry, label: label(options.industries, data.industry) },
    need: { value: data.need, label: label(options.needs, data.need) },
    ...(data.budget
      ? { budget: { value: data.budget, label: label(options.budgets, data.budget) } }
      : {}),
    ...(data.message ? { message: data.message } : {}),
  };

  let delivered = false;
  try {
    delivered = (await deliverLead(lead)).ok;
  } catch {
    console.error("[lead-delivery]", { id: lead.id, reason: "configuration error" });
  }

  if (delivered) {
    rememberSubmission(submissionId);
    return { status: "success", message: successMessage() };
  }
  return {
    status: "failed",
    message: "We couldn't send your request right now. Please try again, or contact us directly.",
    values: safeValues(formData),
    fallback: fallbackContacts(),
  };
}
