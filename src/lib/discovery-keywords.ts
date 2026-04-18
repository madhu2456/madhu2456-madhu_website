type SkillLike = {
  name?: string | null;
  category?: string | null;
};

type ServiceLike = {
  title?: string | null;
};

type ProjectTechLike = {
  name?: string | null;
};

type ProjectLike = {
  category?: string | null;
  technologies?: Array<ProjectTechLike | null> | null;
};

export type DiscoveryKeywordInput = {
  siteKeywords?: string[] | null;
  headline?: string | null;
  location?: string | null;
  skills?: Array<SkillLike | null> | null;
  services?: Array<ServiceLike | null> | null;
  projects?: Array<ProjectLike | null> | null;
  maxKeywords?: number;
};

const DEFAULT_MAX_KEYWORDS = 70;
const MAX_KEYWORD_LENGTH = 80;
const DISCOVERY_TOPIC_PATTERN =
  /\b(ai|ml|machine learning|llm|rag|agent|chatbot|automation|analytics|data|full[- ]?stack|next\.?js|react|typescript|python|fastapi|sql|aws|cloud|seo|geo|aeo|web|software|product)\b/i;

const MODERN_AI_DISCOVERY_TERMS = [
  "agentic ai consulting",
  "ai workflow automation services",
  "enterprise genai solutions",
  "llm application development",
  "rag system development",
  "ai product engineering",
];

const normalizeWhitespace = (value: string) =>
  value.replace(/\s+/g, " ").trim();

const normalizeKeyword = (value?: string | null) => {
  if (!value) return null;
  const normalized = normalizeWhitespace(value).replace(/[,\s;:!?-]+$/, "");
  if (!normalized) return null;
  if (normalized.length > MAX_KEYWORD_LENGTH) return null;
  return normalized;
};

const normalizeLocation = (location?: string | null) => {
  const normalized = normalizeKeyword(location);
  if (!normalized) return null;
  return normalizeWhitespace(normalized.replace(/\([^)]*\)/g, ""));
};

const appendUnique = (
  target: string[],
  seen: Set<string>,
  value?: string | null,
) => {
  const normalized = normalizeKeyword(value);
  if (!normalized) return;
  const key = normalized.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  target.push(normalized);
};

export const normalizeKeywordList = (keywords?: string[] | null) => {
  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const keyword of keywords ?? []) {
    appendUnique(deduped, seen, keyword);
  }
  return deduped;
};

const buildSeedTerms = ({
  headline,
  skills,
  services,
  projects,
}: DiscoveryKeywordInput) => {
  const terms: string[] = [];
  const seen = new Set<string>();

  appendUnique(terms, seen, headline);

  for (const skill of skills ?? []) {
    appendUnique(terms, seen, skill?.name);
    appendUnique(terms, seen, skill?.category);
  }

  for (const service of services ?? []) {
    appendUnique(terms, seen, service?.title);
  }

  for (const project of projects ?? []) {
    appendUnique(terms, seen, project?.category);
    for (const technology of project?.technologies ?? []) {
      appendUnique(terms, seen, technology?.name);
    }
  }

  return terms.filter((term) => DISCOVERY_TOPIC_PATTERN.test(term));
};

const buildIntentKeywordVariants = (seed: string, location?: string | null) => {
  const variants = [
    `${seed} consultant`,
    `${seed} consulting services`,
    `${seed} development services`,
    `hire ${seed} expert`,
    `${seed} freelancer`,
  ];

  if (location) {
    variants.push(`${seed} in ${location}`);
    variants.push(`${seed} services in ${location}`);
  }

  return variants;
};

export const buildDiscoveryKeywords = ({
  siteKeywords,
  headline,
  location,
  skills,
  services,
  projects,
  maxKeywords = DEFAULT_MAX_KEYWORDS,
}: DiscoveryKeywordInput) => {
  const finalKeywords: string[] = [];
  const seen = new Set<string>();
  const normalizedLocation = normalizeLocation(location);

  for (const keyword of normalizeKeywordList(siteKeywords)) {
    appendUnique(finalKeywords, seen, keyword);
  }

  const seedTerms = buildSeedTerms({
    headline,
    skills,
    services,
    projects,
  });

  for (const seed of seedTerms.slice(0, 18)) {
    appendUnique(finalKeywords, seen, seed);
  }

  const hasAiSeed = seedTerms.some((term) =>
    /\b(ai|llm|rag|genai|agent)\b/i.test(term),
  );

  if (hasAiSeed) {
    for (const keyword of MODERN_AI_DISCOVERY_TERMS) {
      appendUnique(finalKeywords, seen, keyword);
      if (normalizedLocation) {
        appendUnique(
          finalKeywords,
          seen,
          `${keyword} in ${normalizedLocation.toLowerCase()}`,
        );
      }
    }
  }

  for (const seed of seedTerms.slice(0, 12)) {
    for (const keyword of buildIntentKeywordVariants(
      seed,
      normalizedLocation,
    )) {
      appendUnique(finalKeywords, seen, keyword);
    }
  }

  return finalKeywords.slice(0, maxKeywords);
};
