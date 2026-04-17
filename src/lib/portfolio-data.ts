import { promises as fs } from "node:fs";
import path from "node:path";

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  medium?: string;
  devto?: string;
  youtube?: string;
  stackoverflow?: string;
};

export type ProfileStat = {
  label: string;
  value: string;
};

export type Profile = {
  firstName: string;
  lastName: string;
  headline: string;
  headlineStaticText: string;
  headlineAnimatedWords: string[];
  headlineAnimationDuration: number;
  shortBio: string;
  fullBioParagraphs: string[];
  email: string;
  phone?: string;
  location: string;
  availability: "available" | "open" | "unavailable";
  socialLinks: SocialLinks;
  yearsOfExperience: number;
  stats: ProfileStat[];
  profileImage?: string;
  updatedAt: string;
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  siteKeywords: string[];
  twitterHandle?: string;
  updatedAt: string;
};

export type Technology = {
  name: string;
  category?: string;
  color?: string;
};

export type ExperienceItem = {
  company: string;
  position: string;
  employmentType?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  responsibilities?: string[];
  achievements?: string[];
  technologies?: Technology[];
  companyLogo?: string;
  companyWebsite?: string;
  order: number;
  updatedAt: string;
};

export type EducationItem = {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  gpa?: string;
  description?: string;
  achievements?: string[];
  logo?: string;
  website?: string;
  order: number;
  updatedAt: string;
};

export type ImpactMetric = {
  label: string;
  value: string;
};

export type Citation = {
  label: string;
  url: string;
};

export type ProjectItem = {
  title: string;
  slug: string;
  tagline?: string;
  category?: string;
  impactSummary?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  coverImage?: string;
  coverImageAlt?: string;
  technologies?: Technology[];
  problemStatement?: string;
  solutionApproach?: string;
  impactMetrics?: ImpactMetric[];
  citations?: Citation[];
  order: number;
  updatedAt: string;
};

export type ServiceItem = {
  title: string;
  slug: string;
  icon?: string;
  shortDescription?: string;
  fullDescription?: string;
  features?: string[];
  technologies?: Technology[];
  deliverables?: string[];
  pricing?: {
    startingPrice?: number;
    priceType?: "hourly" | "project" | "monthly" | "custom";
    description?: string;
  };
  timeline?: string;
  featured?: boolean;
  order: number;
  updatedAt: string;
};

export type CertificationItem = {
  name: string;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
  description?: string;
  skills?: Technology[];
  order: number;
  updatedAt: string;
};

export type SkillItem = {
  name: string;
  category?: string;
  proficiency?: string;
  yearsOfExperience?: number;
  updatedAt: string;
};

export type NavigationItem = {
  title: string;
  href: string;
  icon: string;
  isExternal?: boolean;
  order: number;
};

export const profile: Profile = {
  firstName: "Madhu",
  lastName: "Dadi",
  headline: "Data, AI and Full-Stack Engineer",
  headlineStaticText: "I build",
  headlineAnimatedWords: [
    "AI-powered products",
    "analytics platforms",
    "automation systems",
    "full-stack web apps",
  ],
  headlineAnimationDuration: 3000,
  shortBio:
    "I design and ship AI, analytics, and full-stack solutions that turn messy business workflows into measurable outcomes.",
  fullBioParagraphs: [
    "I am a software and analytics engineer focused on practical impact. I enjoy taking ambiguous business problems, mapping them to reliable systems, and shipping solutions people can actually use.",
    "My work spans data engineering, product analytics, and application development. I build with a bias toward maintainability, observability, and clear decision support.",
    "I specialize in AI-enabled workflows, automation, and full-stack platforms. My approach is simple: understand the process deeply, keep architecture grounded, and optimize for long-term value.",
  ],
  email: "madhu.dadi@gmail.com",
  phone: "+91-00000-00000",
  location: "India (Remote)",
  availability: "open",
  socialLinks: {
    github: "https://github.com/madhu2456",
    linkedin: "https://www.linkedin.com/in/madhu-dadi",
    website: "https://madhudadi.in/blog",
  },
  yearsOfExperience: 7,
  stats: [
    { label: "Projects Delivered", value: "40+" },
    { label: "Years Experience", value: "7+" },
    { label: "Domains Covered", value: "10+" },
    { label: "Production Systems", value: "20+" },
  ],
  profileImage: "/icon-512.png",
  updatedAt: "2026-04-10T12:00:00.000Z",
};

export const siteSettings: SiteSettings = {
  siteTitle: "Madhu Dadi - Portfolio",
  siteDescription:
    "AI consultant and ML engineer delivering generative AI consulting, LLM applications, RAG systems, and full-stack product delivery.",
  siteKeywords: [
    "Madhu Dadi",
    "AI consultant",
    "AI consulting services",
    "AI consulting company",
    "AI consulting firms",
    "top AI consulting firms",
    "generative AI consulting",
    "generative AI consulting services",
    "AI strategy consulting",
    "enterprise AI consulting",
    "AI automation consulting",
    "AI transformation consulting",
    "AI integration services",
    "LLM consulting",
    "LLM development services",
    "RAG development services",
    "AI agent development services",
    "AI chatbot development services",
    "machine learning consulting services",
    "OpenAI consulting",
    "AI consulting company in India",
  ],
  twitterHandle: "madhudadi",
  updatedAt: "2026-04-17T15:56:54.057Z",
};

export const navigationItems: NavigationItem[] = [
  { title: "Home", href: "#home", icon: "IconHome", order: 1 },
  { title: "About", href: "#about", icon: "IconUser", order: 2 },
  { title: "Experience", href: "#experience", icon: "IconBriefcase", order: 3 },
  { title: "Projects", href: "#projects", icon: "IconCode", order: 4 },
  { title: "Services", href: "#services", icon: "IconTools", order: 5 },
  { title: "Education", href: "#education", icon: "IconSchool", order: 6 },
  {
    title: "Certifications",
    href: "#certifications",
    icon: "IconCertificate",
    order: 7,
  },
  { title: "Contact", href: "#contact", icon: "IconMail", order: 8 },
  {
    title: "Blog",
    href: "https://madhudadi.in/blog",
    icon: "IconNews",
    isExternal: true,
    order: 9,
  },
  {
    title: "GitHub",
    href: "https://github.com/madhu2456",
    icon: "IconBrandGithub",
    isExternal: true,
    order: 10,
  },
];

export const skills: SkillItem[] = [
  {
    name: "Python",
    category: "Backend",
    proficiency: "expert",
    yearsOfExperience: 7,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "TypeScript",
    category: "Frontend",
    proficiency: "advanced",
    yearsOfExperience: 5,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "Next.js",
    category: "Frontend",
    proficiency: "advanced",
    yearsOfExperience: 4,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "React",
    category: "Frontend",
    proficiency: "advanced",
    yearsOfExperience: 5,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "SQL",
    category: "Data",
    proficiency: "expert",
    yearsOfExperience: 7,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "AWS",
    category: "Cloud",
    proficiency: "advanced",
    yearsOfExperience: 4,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "LLM / RAG",
    category: "AI",
    proficiency: "advanced",
    yearsOfExperience: 3,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "Dataiku",
    category: "Analytics",
    proficiency: "advanced",
    yearsOfExperience: 4,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export const experiences: ExperienceItem[] = [
  {
    company: "Novartis",
    position: "Data and AI Engineer",
    employmentType: "Full-time",
    location: "India",
    startDate: "2022-04-01",
    current: true,
    description:
      "Built analytics and AI workflows for enterprise decision support, process optimization, and campaign intelligence.",
    responsibilities: [
      "Designed production analytics pipelines and KPI frameworks.",
      "Built AI-powered assistants and retrieval workflows for internal users.",
      "Collaborated across product, analytics, and engineering teams.",
    ],
    achievements: [
      "Improved turnaround time for reporting workflows.",
      "Raised trust in decisioning with reproducible data products.",
    ],
    technologies: [
      { name: "Python", category: "Backend" },
      { name: "SQL", category: "Data" },
      { name: "Dataiku", category: "Analytics" },
      { name: "LLM / RAG", category: "AI" },
    ],
    companyLogo: "/icon-512.png",
    order: 1,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    company: "redBus",
    position: "Data Analyst Engineer",
    employmentType: "Full-time",
    location: "India",
    startDate: "2020-01-01",
    endDate: "2022-03-31",
    description:
      "Worked on growth analytics, experimentation, and customer lifecycle performance for a large travel-tech product.",
    responsibilities: [
      "Built reusable dashboards and metrics definitions.",
      "Partnered with marketing and product for experimentation analysis.",
      "Automated recurring reporting pipelines.",
    ],
    achievements: [
      "Improved campaign attribution quality.",
      "Reduced manual reporting effort for business teams.",
    ],
    technologies: [
      { name: "SQL", category: "Data" },
      { name: "Python", category: "Backend" },
      { name: "Tableau", category: "Analytics" },
    ],
    companyLogo: "/icon-512.png",
    order: 2,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    company: "GroupM",
    position: "Marketing Analytics Specialist",
    employmentType: "Full-time",
    location: "India",
    startDate: "2018-06-01",
    endDate: "2019-12-31",
    description:
      "Delivered campaign analytics and optimization recommendations across multiple clients and digital channels.",
    responsibilities: [
      "Designed campaign measurement and performance models.",
      "Built weekly and monthly executive performance views.",
    ],
    achievements: [
      "Improved media performance visibility across teams.",
      "Helped standardize analytics templates for repeatable execution.",
    ],
    technologies: [
      { name: "SQL", category: "Data" },
      { name: "Python", category: "Backend" },
      { name: "Excel", category: "Analytics" },
    ],
    companyLogo: "/icon-512.png",
    order: 3,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export const education: EducationItem[] = [
  {
    institution: "Jawaharlal Nehru Technological University",
    degree: "Bachelor of Technology",
    fieldOfStudy: "Computer Science",
    startDate: "2014-06-01",
    endDate: "2018-05-31",
    gpa: "8.2/10",
    description:
      "Foundation in software engineering, data structures, and analytics.",
    achievements: [
      "Built multiple applied software projects.",
      "Participated in technical workshops and hackathons.",
    ],
    logo: "/icon-512.png",
    website: "https://www.jntuh.ac.in/",
    order: 1,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export const projects: ProjectItem[] = [
  {
    title: "Marketing Intelligence Platform",
    slug: "marketing-intelligence-platform",
    tagline: "Unified analytics and decision support for growth teams",
    category: "analytics",
    impactSummary:
      "Reduced reporting overhead and accelerated decision cycles with automated intelligence workflows.",
    liveUrl: "https://madhudadi.in",
    featured: true,
    coverImage: "/icon-512.png",
    technologies: [
      { name: "Python" },
      { name: "SQL" },
      { name: "Dataiku" },
      { name: "Next.js" },
    ],
    problemStatement:
      "Teams were spending significant time stitching fragmented campaign data before decisions could be made.",
    solutionApproach:
      "Built a unified data model, reusable analytics layer, and workflow automation for repeatable insights delivery.",
    impactMetrics: [
      { label: "Reporting Time", value: "-45%" },
      { label: "Decision Latency", value: "-35%" },
    ],
    citations: [{ label: "Portfolio", url: "https://madhudadi.in" }],
    order: 1,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    title: "AI Knowledge Assistant",
    slug: "ai-knowledge-assistant",
    tagline: "Context-aware assistant for internal knowledge retrieval",
    category: "ai-ml",
    impactSummary:
      "Enabled faster access to internal knowledge using retrieval pipelines and grounded responses.",
    liveUrl: "https://madhudadi.in",
    featured: true,
    coverImage: "/icon-512.png",
    technologies: [
      { name: "Python" },
      { name: "LLM / RAG" },
      { name: "Vector Search" },
      { name: "Next.js" },
    ],
    problemStatement:
      "Critical process and product knowledge was spread across disconnected systems, making answers slow and inconsistent.",
    solutionApproach:
      "Implemented document ingestion, chunking, retrieval, and response orchestration with verification-oriented prompts.",
    impactMetrics: [
      { label: "Response Time", value: "-60%" },
      { label: "Knowledge Coverage", value: "+3x" },
    ],
    citations: [
      { label: "Case Studies", url: "https://madhudadi.in/case-studies" },
    ],
    order: 2,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    title: "Portfolio and Case Study Engine",
    slug: "portfolio-case-study-engine",
    tagline:
      "SEO-oriented portfolio architecture with machine-readable endpoints",
    category: "web-app",
    liveUrl: "https://madhudadi.in",
    githubUrl: "https://github.com/madhu2456/madhu2456-madhu_website",
    featured: true,
    coverImage: "/icon-512.png",
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "Tailwind CSS" },
    ],
    problemStatement:
      "Portfolio content needed stronger discoverability across search and AI systems.",
    solutionApproach:
      "Built structured metadata, schema graph, llms.txt, ai-profile.json, and case-study-first information architecture.",
    impactMetrics: [
      { label: "Structured Endpoints", value: "5+" },
      { label: "SEO Surfaces", value: "Site-wide" },
    ],
    citations: [
      {
        label: "GitHub Repository",
        url: "https://github.com/madhu2456/madhu2456-madhu_website",
      },
    ],
    order: 3,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export const services: ServiceItem[] = [
  {
    title: "AI and LLM Applications",
    slug: "ai-llm-applications",
    icon: "/icon-512.png",
    shortDescription:
      "Design and delivery of production-focused AI systems including RAG and workflow copilots.",
    features: [
      "Use-case framing and architecture design",
      "RAG pipeline implementation",
      "Evaluation and guardrails setup",
    ],
    technologies: [
      { name: "Python" },
      { name: "LLM / RAG" },
      { name: "TypeScript" },
    ],
    pricing: {
      startingPrice: 2500,
      priceType: "project",
      description: "Depends on complexity and scope",
    },
    timeline: "2-8 weeks",
    featured: true,
    order: 1,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    title: "Analytics and Decision Engineering",
    slug: "analytics-decision-engineering",
    icon: "/icon-512.png",
    shortDescription:
      "KPI architecture, measurement frameworks, experimentation analytics, and reporting automation.",
    features: [
      "Data model and metric standardization",
      "Executive and operational dashboards",
      "Automation of recurring reporting",
    ],
    technologies: [{ name: "SQL" }, { name: "Python" }, { name: "Dataiku" }],
    pricing: {
      startingPrice: 1800,
      priceType: "project",
      description: "Custom roadmap and phased delivery",
    },
    timeline: "2-6 weeks",
    featured: true,
    order: 2,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    title: "Full-Stack Product Development",
    slug: "fullstack-product-development",
    icon: "/icon-512.png",
    shortDescription:
      "Modern web products with scalable APIs, clean UI, and reliable deployment pipelines.",
    features: [
      "End-to-end application development",
      "Performance and SEO optimization",
      "Production deployment and monitoring",
    ],
    technologies: [
      { name: "Next.js" },
      { name: "TypeScript" },
      { name: "AWS" },
    ],
    pricing: {
      startingPrice: 3000,
      priceType: "project",
      description: "Based on milestones and product depth",
    },
    timeline: "4-12 weeks",
    featured: false,
    order: 3,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export const certifications: CertificationItem[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    issueDate: "2024-05-01",
    expiryDate: "2027-05-01",
    credentialId: "AWS-XXXX-XXXX",
    credentialUrl: "https://www.credly.com/",
    logo: "/icon-512.png",
    description:
      "Foundational certification covering AWS cloud services and architecture basics.",
    skills: [{ name: "AWS" }, { name: "Cloud" }],
    order: 1,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
  {
    name: "Dataiku Core Designer",
    issuer: "Dataiku",
    issueDate: "2023-09-01",
    credentialId: "DIKU-XXXX-XXXX",
    credentialUrl: "https://academy.dataiku.com/",
    logo: "/icon-512.png",
    description:
      "Certification in end-to-end analytics workflow design and execution.",
    skills: [{ name: "Dataiku" }, { name: "Analytics" }],
    order: 2,
    updatedAt: "2026-04-10T12:00:00.000Z",
  },
];

export type PortfolioContent = {
  profile: Profile;
  siteSettings: SiteSettings;
  navigationItems: NavigationItem[];
  skills: SkillItem[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  services: ServiceItem[];
  certifications: CertificationItem[];
};

export type PortfolioData = PortfolioContent & {
  sortedNavigationItems: NavigationItem[];
  sortedExperiences: ExperienceItem[];
  sortedEducation: EducationItem[];
  sortedProjects: ProjectItem[];
  featuredProjects: ProjectItem[];
  sortedServices: ServiceItem[];
  featuredServices: ServiceItem[];
  sortedCertifications: CertificationItem[];
  portfolioLastUpdatedAt: string;
};

const PORTFOLIO_CONTENT_FILE_PATH = path.join(
  process.cwd(),
  "Data",
  "portfolio-content.json",
);

export const defaultPortfolioContent: PortfolioContent = {
  profile,
  siteSettings,
  navigationItems,
  skills,
  experiences,
  education,
  projects,
  services,
  certifications,
};

const cloneDefaultContent = (): PortfolioContent =>
  JSON.parse(JSON.stringify(defaultPortfolioContent)) as PortfolioContent;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isPortfolioContent = (value: unknown): value is PortfolioContent => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isRecord(value.profile) &&
    isRecord(value.siteSettings) &&
    Array.isArray(value.navigationItems) &&
    Array.isArray(value.skills) &&
    Array.isArray(value.experiences) &&
    Array.isArray(value.education) &&
    Array.isArray(value.projects) &&
    Array.isArray(value.services) &&
    Array.isArray(value.certifications)
  );
};

const ensurePortfolioContentFile = async () => {
  try {
    await fs.access(PORTFOLIO_CONTENT_FILE_PATH);
  } catch {
    await fs.mkdir(path.dirname(PORTFOLIO_CONTENT_FILE_PATH), {
      recursive: true,
    });
    await fs.writeFile(
      PORTFOLIO_CONTENT_FILE_PATH,
      JSON.stringify(cloneDefaultContent(), null, 2),
      "utf8",
    );
  }
};

const withUpdatedAt = <T extends { updatedAt: string }>(
  items: T[],
  updatedAt: string,
) =>
  items.map((item) => ({
    ...item,
    updatedAt,
  }));

const normalizeContentForSave = (
  content: PortfolioContent,
): PortfolioContent => {
  const now = new Date().toISOString();

  return {
    ...content,
    profile: {
      ...content.profile,
      updatedAt: now,
    },
    siteSettings: {
      ...content.siteSettings,
      updatedAt: now,
    },
    skills: withUpdatedAt(content.skills, now),
    experiences: withUpdatedAt(content.experiences, now),
    education: withUpdatedAt(content.education, now),
    projects: withUpdatedAt(content.projects, now),
    services: withUpdatedAt(content.services, now),
    certifications: withUpdatedAt(content.certifications, now),
  };
};

const buildDerivedData = (content: PortfolioContent): PortfolioData => {
  const sortedNavigationItems = [...content.navigationItems].sort(
    (a, b) => a.order - b.order,
  );
  const sortedExperiences = [...content.experiences].sort((a, b) =>
    b.startDate.localeCompare(a.startDate),
  );
  const sortedEducation = [...content.education].sort((a, b) =>
    (b.endDate || b.startDate).localeCompare(a.endDate || a.startDate),
  );
  const sortedProjects = [...content.projects].sort(
    (a, b) => a.order - b.order,
  );
  const featuredProjects = sortedProjects.filter((item) => item.featured);
  const sortedServices = [...content.services].sort(
    (a, b) => a.order - b.order,
  );
  const featuredServices = sortedServices.filter((item) => item.featured);
  const sortedCertifications = [...content.certifications].sort((a, b) =>
    (b.issueDate || "").localeCompare(a.issueDate || ""),
  );

  const updatedDates = [
    content.profile.updatedAt,
    content.siteSettings.updatedAt,
    ...sortedExperiences.map((item) => item.updatedAt),
    ...sortedEducation.map((item) => item.updatedAt),
    ...sortedProjects.map((item) => item.updatedAt),
    ...sortedServices.map((item) => item.updatedAt),
    ...sortedCertifications.map((item) => item.updatedAt),
    ...content.skills.map((item) => item.updatedAt),
  ];

  const timestamps = updatedDates
    .map((item) => new Date(item).getTime())
    .filter((item) => !Number.isNaN(item));
  const portfolioLastUpdatedAt = new Date(
    timestamps.length > 0 ? Math.max(...timestamps) : Date.now(),
  ).toISOString();

  return {
    ...content,
    sortedNavigationItems,
    sortedExperiences,
    sortedEducation,
    sortedProjects,
    featuredProjects,
    sortedServices,
    featuredServices,
    sortedCertifications,
    portfolioLastUpdatedAt,
  };
};

export const getPortfolioContentPath = () => PORTFOLIO_CONTENT_FILE_PATH;

export async function readPortfolioContent(): Promise<PortfolioContent> {
  await ensurePortfolioContentFile();
  const rawContent = await fs.readFile(PORTFOLIO_CONTENT_FILE_PATH, "utf8");
  const parsedContent: unknown = JSON.parse(rawContent);

  if (!isPortfolioContent(parsedContent)) {
    throw new Error("Portfolio content file is invalid.");
  }

  return parsedContent;
}

export async function savePortfolioContent(
  nextContent: PortfolioContent,
): Promise<PortfolioContent> {
  if (!isPortfolioContent(nextContent)) {
    throw new Error("Cannot save invalid portfolio content.");
  }

  const normalizedContent = normalizeContentForSave(nextContent);

  await fs.mkdir(path.dirname(PORTFOLIO_CONTENT_FILE_PATH), {
    recursive: true,
  });
  await fs.writeFile(
    PORTFOLIO_CONTENT_FILE_PATH,
    JSON.stringify(normalizedContent, null, 2),
    "utf8",
  );

  return normalizedContent;
}

export async function getPortfolioData(): Promise<PortfolioData> {
  const content = await readPortfolioContent();
  return buildDerivedData(content);
}

export async function getProjectBySlug(slug: string) {
  const { sortedProjects } = await getPortfolioData();
  return sortedProjects.find((item) => item.slug === slug);
}
