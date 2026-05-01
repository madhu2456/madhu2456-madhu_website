import { describe, expect, it } from "vitest";
import { portfolioContentSchema } from "../cms-schema";

describe("portfolioContentSchema", () => {
  const validData = {
    profile: {
      firstName: "Madhu",
      lastName: "Dadi",
      headline: "AI Developer",
      headlineStaticText: "I build",
      headlineAnimatedWords: ["AI", "Web"],
      headlineAnimationDuration: 3000,
      shortBio: "Bio",
      fullBioParagraphs: ["Para 1"],
      email: "madhu.dadi@gmail.com",
      location: "India",
      availability: "available",
      socialLinks: {
        github: "https://github.com/madhu2456",
      },
      yearsOfExperience: 7,
      stats: [{ label: "Projects", value: "40+" }],
      updatedAt: new Date().toISOString(),
    },
    siteSettings: {
      siteTitle: "Portfolio",
      siteDescription: "Desc",
      siteKeywords: ["key"],
      updatedAt: new Date().toISOString(),
    },
    navigationItems: [{ title: "Home", href: "/", icon: "IconHome", order: 1 }],
    skills: [{ name: "React", updatedAt: new Date().toISOString() }],
    experiences: [],
    education: [],
    projects: [],
    services: [],
    certifications: [],
  };

  it("should validate a correct portfolio payload", () => {
    const result = portfolioContentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail if required fields are missing", () => {
    const invalidData = {
      ...validData,
      profile: { ...validData.profile, firstName: "" },
    };
    const result = portfolioContentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain("firstName");
    }
  });

  it("should fail on invalid email", () => {
    const invalidData = {
      ...validData,
      profile: { ...validData.profile, email: "not-an-email" },
    };
    const result = portfolioContentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should fail on invalid social link URL", () => {
    const invalidData = {
      ...validData,
      profile: {
        ...validData.profile,
        socialLinks: { github: "not-a-url" },
      },
    };
    const result = portfolioContentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
