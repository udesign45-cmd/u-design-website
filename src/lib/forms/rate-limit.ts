import "server-only";
import { serverEnv } from "@/lib/utils/env.server";

/**
 * Spam layer 3 (plan AD-18) and duplicate protection (plan AD-07).
 *
 * BEST EFFORT, PER INSTANCE: serverless instances do not share memory. The
 * Vercel WAF rate-limit rule on POST /contact (task T228) is authoritative.
 */

const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();
const submissions = new Map<string, number>();

function prune(now: number) {
  for (const [key, times] of hits) {
    const recent = times.filter((t) => now - t < WINDOW_MS);
    if (recent.length) hits.set(key, recent);
    else hits.delete(key);
  }
  for (const [id, at] of submissions) {
    if (now - at >= WINDOW_MS) submissions.delete(id);
  }
}

/** Records a hit and returns true when the client is over the limit. */
export function isRateLimited(
  clientKey: string,
  now: number = Date.now(),
  max = serverEnv.formRateLimitMax(),
): boolean {
  prune(now);
  const times = hits.get(clientKey) ?? [];
  if (times.length >= max) return true;
  times.push(now);
  hits.set(clientKey, times);
  return false;
}

export function seenSubmission(id: string, now: number = Date.now()): boolean {
  prune(now);
  return submissions.has(id);
}

export function rememberSubmission(id: string, now: number = Date.now()): void {
  submissions.set(id, now);
}

/** Test helper. */
export function resetRateLimits(): void {
  hits.clear();
  submissions.clear();
}
