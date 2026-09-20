import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("../../src/styles/globals.css", import.meta.url), "utf8");

function token(name: string): string {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!match?.[1]) throw new Error(`Token --color-${name} not found`);
  return match[1];
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  ) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

describe("brand palette", () => {
  it("defines exactly the approved brand colors", () => {
    expect(token("brand-green").toLowerCase()).toBe("#00d84a");
    expect(token("brand-green-dark").toLowerCase()).toBe("#008a2e");
    expect(token("ink").toLowerCase()).toBe("#0b0b0b");
    expect(token("white").toLowerCase()).toBe("#ffffff");
    expect(token("surface-gray").toLowerCase()).toBe("#f7f8fa");
  });

  it("removes Tailwind's default palette", () => {
    expect(css).toMatch(/--color-\*:\s*initial/);
  });
});

describe("allowed pairings meet WCAG AA", () => {
  const text = 4.5;
  const ui = 3;
  const cases: Array<[string, string, number]> = [
    ["ink", "white", text],
    ["ink", "surface-gray", text],
    ["white", "green-deep", text],
    ["ink", "brand-green", text],
    ["ink-muted", "white", text],
    ["ink-muted", "surface-gray", text],
    ["danger", "white", text],
    ["control-border", "white", ui],
    ["brand-green-dark", "white", ui],
    ["brand-green", "ink", ui],
    ["brand-green", "green-deep", ui],
  ];
  it.each(cases)("%s on %s ≥ %d:1", (fg, bg, min) => {
    expect(contrast(token(fg), token(bg))).toBeGreaterThanOrEqual(min);
  });
});

describe("focus rings are visible on every surface (T194)", () => {
  // --focus-ring per surface utility in globals.css, against that surface background.
  it.each([
    ["brand-green-dark", "white"],
    ["brand-green-dark", "surface-gray"],
    ["brand-green", "ink"],
    ["brand-green", "green-deep"],
  ])("%s ring on %s >= 3:1", (ring, surface) => {
    expect(contrast(token(ring), token(surface))).toBeGreaterThanOrEqual(3);
  });

  it("draws a 2px outline with an offset", () => {
    expect(css).toMatch(/outline:\s*2px solid var\(--focus-ring\)/);
    expect(css).toMatch(/outline-offset:\s*2px/);
  });
});

describe("documented forbidden normal-text pairings stay forbidden", () => {
  it.each([
    ["brand-green", "white"],
    ["brand-green-dark", "white"],
  ])("%s on %s < 4.5:1", (fg, bg) => {
    expect(contrast(token(fg), token(bg))).toBeLessThan(4.5);
  });
});
