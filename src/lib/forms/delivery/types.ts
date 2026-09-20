/** Lead delivery contract (contracts/lead-delivery.md). */

export type LabelledValue = { value: string; label: string };

export type Lead = {
  id: string;
  submittedAt: string;
  sourcePage: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: LabelledValue;
  need: LabelledValue;
  budget?: LabelledValue;
  message?: string;
};

export type DeliveryResult = { ok: true } | { ok: false; reason: string };

export interface LeadDeliveryAdapter {
  name: "email" | "webhook" | "console";
  deliver(lead: Lead): Promise<DeliveryResult>;
}

/** fetch with timeout and a single retry on network errors or 5xx responses. */
export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  timeoutMs = 8000,
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
      if (response.status >= 500 && attempt === 0) continue;
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Request failed");
}
