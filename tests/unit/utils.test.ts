import { describe, expect, it } from "vitest";
import { cx } from "@/lib/utils/cx";
import { formatDate } from "@/lib/utils/format-date";

describe("cx", () => {
  it("joins truthy values only", () => {
    expect(cx("a", false, null, undefined, "b", "")).toBe("a b");
  });
});

describe("formatDate", () => {
  it("formats ISO dates in long English form", () => {
    expect(formatDate("2026-09-19")).toBe("September 19, 2026");
  });
});
