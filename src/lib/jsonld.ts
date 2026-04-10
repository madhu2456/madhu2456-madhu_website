type SocialLinks = {
  github?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  website?: string | null;
  medium?: string | null;
  devto?: string | null;
  youtube?: string | null;
  stackoverflow?: string | null;
};

type Project = {
  title: string;
  tagline?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  category?: string | null;
};

type Experience = {
  company: string;
  position: string;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
  location?: string | null;
};

// ---------------------------------------------------------------------------
// Person
// ---------------------------------------------------------------------------
export function buildPersonSchema({
  fullName,
  headline,
  bio,
  email,
  location,
  profileImageUrl,
  siteUrl,
  socialLinks,
  yearsOfExperience,
}: {
  fullName: string;
  headline?: string | null;
  bio?: string | null;
  email?: string | null;
  location?: string | null;
  profileImageUrl?: string;
  siteUrl: string;
  socialLinks?: SocialLinks;
  yearsOfExperience?: number | null;
}) {
  const sameAs = Object.values(socialLinks ?? {}).filter(
    (v): v is string => typeof v === "string" && v.length > 0,
  );

  // Build a single description — prefer the short bio, fall back to headline,
  // append years of experience if available. Multiple spread of the same key
  // produces invalid JSON-LD so we consolidate here.
  const descriptionParts: string[] = [];
  if (bio) descriptionParts.push(bio);
  else if (headline) descriptionParts.push(headline);
  if (yearsOfExperience) {
    descriptionParts.push(
      `${yearsOfExperience}+ years of professional experience.`,
    );
  }
  const description = descriptionParts.join(" ") || undefined;

  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: fullName,
    url: siteUrl,
    ...(description && { description }),
    ...(headline && { jobTitle: headline }),
    ...(email && { email }),
    ...(location && {
      address: {
        "@type": "PostalAddress",
        addressLocality: location,
      },
    }),
    ...(profileImageUrl && {
      image: {
        "@type": "ImageObject",
        "@id": `${siteUrl}/#personImage`,
        url: profileImageUrl,
        contentUrl: profileImageUrl,
      },
    }),
    ...(sameAs.length > 0 && { sameAs }),
    hasOccupation: { "@id": `${siteUrl}/#occupation` },
    knowsAbout: [
      "Software Engineering",
      "Full-Stack Development",
      "AI & Machine Learning",
      "Data Analytics",
      "Digital Transformation",
      "Next.js",
      "React",
      "TypeScript",
      "Node.js",
      "Python",
    ],
  };
}

// ---------------------------------------------------------------------------
// Occupation
// ---------------------------------------------------------------------------
export function buildOccupationSchema({
  siteUrl,
  jobTitle,
  location,
}: {
  siteUrl: string;
  jobTitle?: string | null;
  location?: string | null;
}) {
  return {
    "@type": "Occupation",
    "@id": `${siteUrl}/#occupation`,
    name: jobTitle || "Software Engineer",
    occupationLocation: {
      "@type": "AdministrativeArea",
      name: location ?? "Remote",
    },
    skills:
      "Full-Stack Development, React, Next.js, TypeScript, Node.js, AI/ML, Cloud Infrastructure",
  };
}

// ---------------------------------------------------------------------------
// WebSite
// ---------------------------------------------------------------------------
export function buildWebSiteSchema({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description?: string | null;
}) {
  return {
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name,
    url,
    ...(description && { description }),
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ---------------------------------------------------------------------------
// ProfilePage  (schema.org/ProfilePage — the right type for portfolio sites)
// ---------------------------------------------------------------------------
export function buildProfilePageSchema({
  fullName,
  url,
  description,
  profileImageUrl,
  dateModified,
}: {
  fullName: string;
  url: string;
  description?: string | null;
  profileImageUrl?: string;
  dateModified?: string;
}) {
  return {
    "@type": "ProfilePage",
    "@id": `${url}/#profilepage`,
    name: `${fullName} — Portfolio`,
    url,
    ...(description && { description }),
    inLanguage: "en-US",
    isPartOf: { "@id": `${url}/#website` },
    about: { "@id": `${url}/#person` },
    mainEntity: { "@id": `${url}/#person` },
    dateModified: dateModified ?? new Date().toISOString(),
    ...(profileImageUrl && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: profileImageUrl,
      },
    }),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["#home", "#about", "#experience"],
    },
  };
}

// ---------------------------------------------------------------------------
// Projects — ItemList of SoftwareApplication nodes
// ---------------------------------------------------------------------------
export function buildProjectsListSchema({
  siteUrl,
  projects,
}: {
  siteUrl: string;
  projects: Project[];
}) {
  if (projects.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": `${siteUrl}/#projects`,
    name: "Portfolio Projects",
    description: "Software projects built by Madhu Dadi",
    numberOfItems: projects.length,
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareApplication",
        name: p.title,
        ...(p.tagline && { description: p.tagline }),
        ...(p.liveUrl && { url: p.liveUrl }),
        ...(p.githubUrl && { codeRepository: p.githubUrl }),
        ...(p.category && { applicationCategory: p.category }),
        author: { "@id": `${siteUrl}/#person` },
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// WorkExperience — ItemList of WorkExperience nodes
// ---------------------------------------------------------------------------
export function buildWorkExperienceSchema({
  siteUrl,
  experiences,
}: {
  siteUrl: string;
  experiences: Experience[];
}) {
  if (experiences.length === 0) return null;

  return {
    "@type": "ItemList",
    "@id": `${siteUrl}/#workexperience`,
    name: "Work Experience",
    itemListElement: experiences.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "OrganizationRole",
        roleName: e.position,
        ...(e.startDate && { startDate: e.startDate }),
        ...(!e.current && e.endDate && { endDate: e.endDate }),
        memberOf: {
          "@type": "Organization",
          name: e.company,
          ...(e.location && {
            location: {
              "@type": "PostalAddress",
              addressLocality: e.location,
            },
          }),
        },
      },
    })),
  };
}

// ---------------------------------------------------------------------------
// BreadcrumbList
// ---------------------------------------------------------------------------
export function buildBreadcrumbSchema(url: string) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${url}/#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: url,
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Unified @graph — bundles all schemas into one linked-data document
// This lets search engines and AI models understand the full knowledge graph
// in a single <script> rather than multiple disconnected ones.
// ---------------------------------------------------------------------------
export function buildFullGraph(nodes: (object | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}
