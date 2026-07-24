/**
 * Homepage-only projections of CMS records.
 * Keeps long case-study / service bodies off the client RSC payload (audit v4 ~499KB home).
 */
import type {
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PageContent,
  Profile,
  ProjectItem,
  ServiceItem,
  SkillItem,
} from "@/lib/portfolio-data";

export type HomeProjectCard = Pick<
  ProjectItem,
  | "slug"
  | "title"
  | "tagline"
  | "category"
  | "coverImage"
  | "coverImageAlt"
  | "impactSummary"
  | "impactMetrics"
  | "technologies"
  | "liveUrl"
  | "githubUrl"
  | "featured"
  | "order"
>;

export type HomeServiceCard = Pick<
  ServiceItem,
  | "slug"
  | "title"
  | "shortDescription"
  | "features"
  | "technologies"
  | "featured"
  | "order"
>;

export type HomeCertificationCard = Pick<
  CertificationItem,
  "name" | "issuer" | "issueDate" | "credentialUrl" | "description" | "order"
>;

export type HomeExperienceCard = Pick<
  ExperienceItem,
  | "company"
  | "position"
  | "location"
  | "startDate"
  | "endDate"
  | "current"
  | "description"
  | "achievements"
  | "order"
>;

export type HomeEducationCard = Pick<
  EducationItem,
  | "institution"
  | "degree"
  | "fieldOfStudy"
  | "startDate"
  | "endDate"
  | "current"
  | "order"
  | "website"
  | "gpa"
  | "description"
  | "achievements"
>;

export type HomePageContent = {
  home: Pick<
    PageContent["home"],
    | "heroTitle"
    | "heroAvailabilityText"
    | "eyebrow"
    | "introParagraphs"
    | "primaryCta"
    | "secondaryCta"
    | "workedAtLabel"
    | "directAnswer"
    | "faqItems"
    | "testimonials"
  >;
  credentials?: {
    awards?: PageContent["credentials"]["awards"];
  };
};

export type HomeProfile = Pick<
  Profile,
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "headline"
  | "shortBio"
  | "location"
  | "availability"
  | "yearsOfExperience"
  | "profileImage"
  | "socialLinks"
  | "stats"
>;

export function slimHomeProjects(projects: ProjectItem[]): HomeProjectCard[] {
  return projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    coverImage: p.coverImage,
    coverImageAlt: p.coverImageAlt,
    impactSummary: p.impactSummary,
    impactMetrics: p.impactMetrics?.slice(0, 3),
    technologies: p.technologies?.slice(0, 8),
    liveUrl: p.liveUrl,
    githubUrl: p.githubUrl,
    featured: p.featured,
    order: p.order,
  }));
}

export function slimHomeServices(services: ServiceItem[]): HomeServiceCard[] {
  return services.map((s) => ({
    slug: s.slug,
    title: s.title,
    shortDescription: s.shortDescription,
    features: s.features?.slice(0, 5),
    technologies: s.technologies?.slice(0, 8),
    featured: s.featured,
    order: s.order,
  }));
}

export function slimHomeCertifications(
  certifications: CertificationItem[],
): HomeCertificationCard[] {
  return certifications.map((c) => ({
    name: c.name,
    issuer: c.issuer,
    issueDate: c.issueDate,
    credentialUrl: c.credentialUrl,
    // Only needed for coursework badge heuristic
    description: c.description?.slice(0, 80),
    order: c.order,
  }));
}

export function slimHomeExperiences(
  experiences: ExperienceItem[],
): HomeExperienceCard[] {
  return experiences.map((e) => ({
    company: e.company,
    position: e.position,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    description: e.description,
    achievements: e.achievements?.slice(0, 1),
    order: e.order,
  }));
}

export function slimHomeEducation(
  education: EducationItem[],
): HomeEducationCard[] {
  return education.map((e) => ({
    institution: e.institution,
    degree: e.degree,
    fieldOfStudy: e.fieldOfStudy,
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    order: e.order,
    website: e.website,
    gpa: e.gpa,
    description: e.description,
    achievements: e.achievements,
  }));
}

export function slimHomePageContent(pageContent: PageContent): HomePageContent {
  return {
    home: {
      heroTitle: pageContent.home.heroTitle,
      heroAvailabilityText: pageContent.home.heroAvailabilityText,
      eyebrow: pageContent.home.eyebrow,
      introParagraphs: pageContent.home.introParagraphs,
      primaryCta: pageContent.home.primaryCta,
      secondaryCta: pageContent.home.secondaryCta,
      workedAtLabel: pageContent.home.workedAtLabel,
      directAnswer: pageContent.home.directAnswer,
      faqItems: pageContent.home.faqItems,
      testimonials: pageContent.home.testimonials,
    },
    credentials: {
      awards: pageContent.credentials?.awards,
    },
  };
}

export function slimHomeProfile(profile: Profile): HomeProfile {
  return {
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    headline: profile.headline,
    shortBio: profile.shortBio,
    location: profile.location,
    availability: profile.availability,
    yearsOfExperience: profile.yearsOfExperience,
    profileImage: profile.profileImage,
    socialLinks: profile.socialLinks,
    stats: profile.stats,
  };
}

export function slimHomeSkills(skills: SkillItem[]): SkillItem[] {
  // Skills are already small; keep as-is
  return skills;
}
