export interface ChatProfile {
  firstName?: string | null;
  lastName?: string | null;
  headline?: string | null;
  shortBio?: string | null;
  location?: string | null;
  availability?: "available" | "open" | "unavailable" | null;
  yearsOfExperience?: number | null;
  socialLinks?: {
    github?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
    website?: string | null;
    medium?: string | null;
    devto?: string | null;
    youtube?: string | null;
    stackoverflow?: string | null;
  } | null;
  stats?: Array<{
    label?: string | null;
    value?: string | null;
  }> | null;
}
