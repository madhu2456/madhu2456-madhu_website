import type { ChatProfile } from "./chat-profile";

const MAX_BIO_FACT_LENGTH = 120;

const AVAILABILITY_FACTS: Record<"available" | "open" | "unavailable", string> =
  {
    available: "Currently available for hire.",
    open: "Open to new opportunities.",
    unavailable: "Currently focused on active commitments.",
  };

const SOCIAL_LABELS: Record<string, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  twitter: "X / Twitter",
  website: "Personal website",
  medium: "Medium",
  devto: "Dev.to",
  youtube: "YouTube",
  stackoverflow: "Stack Overflow",
};

const fallbackFacts = [
  "You can ask about projects, experience, skills, certifications, and services.",
  "Try asking for portfolio highlights or a quick career summary.",
];

const truncateBioFact = (bio: string) => {
  const collapsed = bio.replace(/\s+/g, " ").trim();
  if (collapsed.length <= MAX_BIO_FACT_LENGTH) {
    return collapsed;
  }
  return `${collapsed.slice(0, MAX_BIO_FACT_LENGTH - 1).trimEnd()}…`;
};

export function buildProfileFacts(profile: ChatProfile | null): string[] {
  if (!profile) {
    return fallbackFacts;
  }

  const facts: string[] = [];
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");

  if (profile.headline) {
    facts.push(
      fullName ? `${fullName}'s focus: ${profile.headline}.` : profile.headline,
    );
  }

  if (
    typeof profile.yearsOfExperience === "number" &&
    Number.isFinite(profile.yearsOfExperience) &&
    profile.yearsOfExperience > 0
  ) {
    facts.push(
      `${fullName || "This profile"} has ${profile.yearsOfExperience}+ years of experience.`,
    );
  }

  if (profile.location) {
    facts.push(`Based in ${profile.location}.`);
  }

  if (profile.availability) {
    const availabilityFact = AVAILABILITY_FACTS[profile.availability];
    if (availabilityFact) {
      facts.push(availabilityFact);
    }
  }

  if (profile.socialLinks) {
    const linkedPlatforms = Object.entries(profile.socialLinks)
      .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
      .map(([platform]) => SOCIAL_LABELS[platform] ?? platform);

    if (linkedPlatforms.length > 0) {
      facts.push(`Public profiles linked: ${linkedPlatforms.join(", ")}.`);
    }
  }

  if (profile.stats && profile.stats.length > 0) {
    for (const stat of profile.stats.slice(0, 3)) {
      if (!stat?.label || !stat.value) {
        continue;
      }
      facts.push(`${stat.label}: ${stat.value}`);
    }
  }

  if (profile.shortBio) {
    facts.push(truncateBioFact(profile.shortBio));
  }

  const normalizedFacts = Array.from(
    new Set(facts.map((fact) => fact.trim()).filter((fact) => fact.length > 0)),
  );

  return normalizedFacts.length > 0 ? normalizedFacts : fallbackFacts;
}
