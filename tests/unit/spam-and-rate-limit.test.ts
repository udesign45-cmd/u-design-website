import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  isRateLimited,
  rememberSubmission,
  resetRateLimits,
  seenSubmission,
} from "@/lib/forms/rate-limit";
import { isHoneypotFilled, isSpam, signTimestamp, verifyTimestamp } from "@/lib/forms/spam";

const SECRET = "unit-secret";

beforeEach(() => {
  vi.stubEnv("FORM_SIGNING_SECRET", SECRET);
  vi.stubEnv("FORM_MIN_FILL_MS", "3000");
  vi.stubEnv("FORM_RATE_LIMIT_MAX", "5");
  resetRateLimits();
});

describe("signed render timestamp", () => {
  const t0 = 1_800_000_000_000;

  it("accepts a valid token after the minimum fill time", () => {
    expect(verifyTimestamp(signTimestamp(t0, SECRET), t0 + 5000, SECRET, 3000)).toBe(true);
  });
  it("rejects submissions that are too fast", () => {
    expect(verifyTimestamp(signTimestamp(t0, SECRET), t0 + 1000, SECRET, 3000)).toBe(false);
  });
  it("rejects expired tokens", () => {
    expect(verifyTimestamp(signTimestamp(t0, SECRET), t0 + 25 * 3600_000, SECRET, 3000)).toBe(
      false,
    );
  });
  it("rejects tampered tokens", () => {
    const [, sig] = signTimestamp(t0, SECRET).split(".");
    expect(verifyTimestamp(`${t0 - 60_000}.${sig}`, t0 + 5000, SECRET, 3000)).toBe(false);
    expect(verifyTimestamp("garbage", t0, SECRET, 3000)).toBe(false);
  });
});

describe("isSpam", () => {
  it("flags a filled honeypot", () => {
    const fd = new FormData();
    fd.set("website", "http://spam.example");
    expect(isHoneypotFilled(fd)).toBe(true);
    expect(isSpam(fd)).toBe(true);
  });
  it("does not flag a missing token (no-JS submission)", () => {
    expect(isSpam(new FormData())).toBe(false);
  });
  it("flags a present but invalid token", () => {
    const fd = new FormData();
    fd.set("renderedAt", "123.deadbeef");
    expect(isSpam(fd)).toBe(true);
  });
  it("flags a valid token submitted too quickly", () => {
    const now = Date.now();
    const fd = new FormData();
    fd.set("renderedAt", signTimestamp(now, SECRET));
    expect(isSpam(fd, now + 500)).toBe(true);
    expect(isSpam(fd, now + 4000)).toBe(false);
  });
});

describe("rate limiting and idempotency", () => {
  it("allows up to the limit within the window, then blocks", () => {
    const t = 1_000_000;
    for (let i = 0; i < 5; i++) expect(isRateLimited("1.2.3.4", t + i, 5)).toBe(false);
    expect(isRateLimited("1.2.3.4", t + 10, 5)).toBe(true);
    expect(isRateLimited("5.6.7.8", t + 10, 5)).toBe(false);
  });
  it("resets after the 10-minute window", () => {
    const t = 2_000_000;
    for (let i = 0; i < 5; i++) isRateLimited("ip", t, 5);
    expect(isRateLimited("ip", t + 10 * 60_000 + 1, 5)).toBe(false);
  });
  it("de-duplicates submissions for 10 minutes", () => {
    const t = 3_000_000;
    rememberSubmission("abc", t);
    expect(seenSubmission("abc", t + 1000)).toBe(true);
    expect(seenSubmission("abc", t + 10 * 60_000 + 1)).toBe(false);
  });
});
