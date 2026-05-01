import { describe, expect, it } from "vitest";
import { formatDate, isDateExpired } from "../utils";

describe("formatDate", () => {
  it("should return N/A for empty values", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate(undefined)).toBe("N/A");
    expect(formatDate("")).toBe("N/A");
  });

  it("should format valid dates correctly", () => {
    const date = "2024-05-01";
    // Depends on locale, but checking for year and month substring is safe
    const formatted = formatDate(date);
    expect(formatted).toContain("2024");
    expect(formatted).toContain("May");
  });

  it("should return original string for invalid dates", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("isDateExpired", () => {
  it("should return false for empty values", () => {
    expect(isDateExpired(null)).toBe(false);
  });

  it("should return true for past dates", () => {
    expect(isDateExpired("2000-01-01")).toBe(true);
  });

  it("should return false for future dates", () => {
    // 2099 is definitely in the future
    expect(isDateExpired("2099-01-01")).toBe(false);
  });
});
