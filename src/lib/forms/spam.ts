import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { serverEnv } from "@/lib/utils/env.server";

/**
 * Spam layers 1–2 (plan AD-18): honeypot + signed minimum fill time.
 *
 * `/contact` is statically generated, so a per-visit timestamp cannot be signed
 * at render time. The form requests a token at mount via `issueRenderToken()`.
 * A MISSING token (no-JS submission) skips only the time check — the honeypot
 * and rate limit still apply. A PRESENT token that fails verification is spam.
 */

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function signTimestamp(
  now: number = Date.now(),
  secret = serverEnv.formSigningSecret(),
): string {
  const ms = String(now);
  return `${ms}.${sign(ms, secret)}`;
}

export function verifyTimestamp(
  token: string,
  now: number = Date.now(),
  secret = serverEnv.formSigningSecret(),
  minFillMs = serverEnv.formMinFillMs(),
): boolean {
  const [ms, signature] = token.split(".");
  if (!ms || !signature || !/^\d+$/.test(ms)) return false;
  const expected = Buffer.from(sign(ms, secret), "hex");
  const given = Buffer.from(signature, "hex");
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return false;
  const elapsed = now - Number(ms);
  return elapsed >= minFillMs && elapsed <= MAX_AGE_MS;
}

export function isHoneypotFilled(formData: FormData): boolean {
  const value = formData.get("website");
  return typeof value === "string" && value.trim().length > 0;
}

export function isSpam(formData: FormData, now: number = Date.now()): boolean {
  if (isHoneypotFilled(formData)) return true;
  const token = formData.get("renderedAt");
  if (typeof token === "string" && token.length > 0) {
    return !verifyTimestamp(token, now);
  }
  return false;
}
