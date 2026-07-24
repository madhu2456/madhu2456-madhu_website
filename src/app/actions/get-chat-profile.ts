"use server";

import type { ChatProfile } from "@/components/chat/chat-profile";
import { getPortfolioData } from "@/lib/portfolio-data";

/** Slim profile for the portfolio chat — loaded only when the sidebar opens. */
export async function getChatProfile(): Promise<ChatProfile> {
  const { profile } = await getPortfolioData();
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    headline: profile.headline,
    shortBio: profile.shortBio,
    location: profile.location,
    availability: profile.availability,
    yearsOfExperience: profile.yearsOfExperience,
    socialLinks: profile.socialLinks,
    stats: profile.stats?.map((stat) => ({
      label: stat.label,
      value: stat.value,
    })),
  };
}
