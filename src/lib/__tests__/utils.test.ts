import { describe, expect, it } from "vitest";
import { cn, formatLastUpdated, formatMonthYear } from "../utils";

describe("cn", () => {
  it("merges conditional class names", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active");
  });

  it("resolves conflicting Tailwind utilities", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("formatLastUpdated", () => {
  it("formats ISO dates as long month + year (UTC)", () => {
    expect(formatLastUpdated("2026-07-22T00:00:00Z")).toBe("July 2026");
  });

  it("returns null for empty or invalid values", () => {
    expect(formatLastUpdated(null)).toBeNull();
    expect(formatLastUpdated("not-a-date")).toBeNull();
  });
});

describe("formatMonthYear", () => {
  it("formats month and year", () => {
    expect(formatMonthYear("2023-03-20")).toMatch(/Mar 2023/);
  });
});
