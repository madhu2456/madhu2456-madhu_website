import { describe, expect, it } from "vitest";
import {
  buildCaseStudyMetaDescription,
  clampMetaDescription,
  getCaseStudyLinkLabel,
  getDistinctProjectTagline,
} from "../project-display";

describe("clampMetaDescription", () => {
  it("returns short text unchanged", () => {
    expect(clampMetaDescription("Short outcome line.")).toBe(
      "Short outcome line.",
    );
  });

  it("never exceeds 160 characters", () => {
    const long =
      "Real-time AI Visibility & SERP Intelligence Platform - Parallel Playwright crawls at 10,000+ URLs per audit (bounded worker pool), comparing server HTML to the rendered DOM. Returns a ranked fix list for SEO, AEO, and GEO so multi-day audits can finish in hours.";
    const out = clampMetaDescription(long);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.length).toBeGreaterThan(40);
  });
});

describe("buildCaseStudyMetaDescription", () => {
  it("prefers impact metrics and stays within 160 chars", () => {
    const desc = buildCaseStudyMetaDescription({
      title: "Adticks - Real-time AI Visibility & SERP Intelligence Platform",
      tagline: "Real-time AI Visibility & SERP Intelligence Platform",
      impactSummary:
        "Parallel Playwright crawls at 10,000+ URLs per audit (bounded worker pool), comparing server HTML to the rendered DOM.",
      impactMetrics: [
        {
          value: "10,000+",
          label:
            "URLs crawled per audit (parallel headless rendering capacity)",
        },
        {
          value: "85%",
          label: "reduction in technical audit cycle time",
        },
      ],
    });
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toMatch(/10,000\+/);
    expect(desc).toMatch(/85%/);
    expect(desc.toLowerCase()).toContain("adticks");
  });
});

describe("getCaseStudyLinkLabel", () => {
  it("uses the brand head before a dash", () => {
    expect(
      getCaseStudyLinkLabel(
        "Adticks - Real-time AI Visibility & SERP Intelligence Platform",
      ),
    ).toBe("Adticks case study");
  });

  it("appends case study when the title is short", () => {
    expect(getCaseStudyLinkLabel("Python & AI Learning Platform")).toBe(
      "Python & AI Learning Platform case study",
    );
  });

  it("does not double the phrase case study", () => {
    expect(getCaseStudyLinkLabel("Adticks case study")).toBe(
      "Adticks case study",
    );
  });
});

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
