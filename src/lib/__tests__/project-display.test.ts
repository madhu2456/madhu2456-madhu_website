import { describe, expect, it } from "vitest";
import { getDistinctProjectTagline } from "../project-display";

describe("getDistinctProjectTagline", () => {
  it("drops taglines that repeat the title suffix after a dash", () => {
    expect(
      getDistinctProjectTagline(
        "Adticks - Real-time AI Visibility & SERP Intelligence Platform",
        "Real-time AI Visibility & SERP Intelligence Platform",
      ),
    ).toBeNull();
  });

  it("keeps taglines that add new information", () => {
    expect(
      getDistinctProjectTagline(
        "Python & AI Learning Platform",
        "Python & AI Learning Platform with AI Assistant",
      ),
    ).toBe("Python & AI Learning Platform with AI Assistant");
  });

  it("returns null for empty taglines", () => {
    expect(getDistinctProjectTagline("Adticks", "")).toBeNull();
    expect(getDistinctProjectTagline("Adticks", null)).toBeNull();
  });

  it("returns null when title and tagline are identical", () => {
    expect(getDistinctProjectTagline("Same title", "Same title")).toBeNull();
  });
});
