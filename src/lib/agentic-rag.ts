import type { PortfolioData } from "@/lib/portfolio-data";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatSection =
  | "profile"
  | "experience"
  | "project"
  | "service"
  | "skills"
  | "education"
  | "certification"
  | "contact";

type KnowledgeChunk = {
  id: string;
  section: ChatSection;
  title: string;
  content: string;
  searchable: string;
};

const PROFILE_KEYWORDS = new Set([
  "madhu",
  "profile",
  "portfolio",
  "experience",
  "role",
  "career",
  "project",
  "case",
  "study",
  // "skills" → toTokens strips trailing s → "skill"; keep both forms
  "skills",
  "skill",
  "technology",
  "tech",
  "stack",
  "service",
  "offer",
  "education",
  "certification",
  "credential",
  "contact",
  "email",
  "phone",
  "location",
  "availability",
  "hire",
  "work",
  "background",
  "summary",
  "about",
  "linkedin",
  "github",
  "your",
  "yourself",
  // common intro-question words that should always resolve as on-topic
  "who",
  "what",
  "tell",
]);

const FOLLOW_UP_HINTS = new Set([
  "more",
  "detail",
  "details",
  "elaborate",
  "expand",
  "continue",
  "further",
  "that",
  "those",
  "them",
  "it",
  "his",
  "her",
  "their",
]);

const PROFILE_INTENT_PHRASES = [
  "who are you",
  "tell me about yourself",
  "introduce yourself",
  "what do you do",
  "what can you do",
  "what is your background",
];

const OFF_TOPIC_REPLY =
  "I can only answer questions about my professional profile, experience, projects, skills, services, education, certifications, and contact details.";

const UNKNOWN_REPLY = "I don't have that detail documented right now.";
const OPENAI_TIMEOUT_MS = 20_000;

const SECTION_SUGGESTIONS: Record<ChatSection, string[]> = {
  profile: [
    "Would you like a quick summary of my experience or my main projects?",
    "Want me to break down my skills or services next?",
    "Would you like my contact details as well?",
  ],
  experience: [
    "Would you like a role-by-role breakdown?",
    "Want details on responsibilities and achievements in one role?",
    "Would you like to see the technologies I used in those roles?",
  ],
  project: [
    "Would you like a deeper breakdown of one project?",
    "Want links for live demo, GitHub, and case study?",
    "Would you like impact metrics for the project?",
  ],
  service: [
    "Would you like service-wise timelines and deliverables?",
    "Want details on which service fits your use case?",
    "Would you like pricing-related details where available?",
  ],
  skills: [
    "Would you like my skills grouped by category?",
    "Want a quick shortlist of strongest skills?",
    "Would you like experience years per skill?",
  ],
  education: [
    "Would you like full education timeline details?",
    "Want field of study and institution breakdown?",
    "Would you like related certifications too?",
  ],
  certification: [
    "Would you like issuer and credential links for each certification?",
    "Want certifications mapped to relevant skills?",
    "Would you like latest certifications first?",
  ],
  contact: [
    "Would you like my preferred contact channel?",
    "Want profile links like GitHub and LinkedIn?",
    "Would you like location and availability details too?",
  ],
};

const toTokens = (value: string) =>
  (value.toLowerCase().match(/[a-z0-9+#.-]+/g) ?? [])
    .map((token) =>
      token.endsWith("s") && token.length > 3 ? token.slice(0, -1) : token,
    )
    .filter((token) => token.length > 1);

const toSearchable = (value: string) =>
  value.toLowerCase().replace(/\s+/g, " ").trim();

const hasProfileKeyword = (text: string) => {
  const tokens = toTokens(text);
  return tokens.some((token) => PROFILE_KEYWORDS.has(token));
};

const isFollowUpPrompt = (text: string) => {
  const normalized = text.toLowerCase().trim();
  if (!normalized) return false;
  if (normalized.length > 56) return false;
  return toTokens(normalized).some((token) => FOLLOW_UP_HINTS.has(token));
};

const isProfileQuestion = (message: string, history: ChatTurn[]) => {
  const normalized = message.toLowerCase();
  if (PROFILE_INTENT_PHRASES.some((phrase) => normalized.includes(phrase))) {
    return true;
  }

  if (hasProfileKeyword(message)) {
    return true;
  }

  if (!isFollowUpPrompt(message)) {
    return false;
  }

  for (let index = history.length - 1; index >= 0; index -= 1) {
    const turn = history[index];
    if (turn.role !== "user") continue;
    return hasProfileKeyword(turn.content);
  }

  return false;
};

const pushChunk = (
  chunks: KnowledgeChunk[],
  chunk: Omit<KnowledgeChunk, "searchable">,
) => {
  const cleanContent = chunk.content.replace(/\s+/g, " ").trim();
  if (!cleanContent) return;
  chunks.push({
    ...chunk,
    content: cleanContent,
    searchable: toSearchable(`${chunk.title} ${cleanContent}`),
  });
};

export const buildKnowledgeChunks = (data: PortfolioData): KnowledgeChunk[] => {
  const chunks: KnowledgeChunk[] = [];

  pushChunk(chunks, {
    id: "profile-summary",
    section: "profile",
    title: "Profile summary",
    content: [
      `${data.profile.firstName} ${data.profile.lastName}`,
      data.profile.headline,
      data.profile.shortBio,
      `Location: ${data.profile.location}`,
      `Availability: ${data.profile.availability}`,
      `Years of experience: ${data.profile.yearsOfExperience}+`,
    ].join(" | "),
  });

  pushChunk(chunks, {
    id: "profile-contact",
    section: "contact",
    title: "Contact details",
    content: [
      `Email: ${data.profile.email}`,
      data.profile.phone ? `Phone: ${data.profile.phone}` : "",
      data.profile.socialLinks.github
        ? `GitHub: ${data.profile.socialLinks.github}`
        : "",
      data.profile.socialLinks.linkedin
        ? `LinkedIn: ${data.profile.socialLinks.linkedin}`
        : "",
      data.profile.socialLinks.website
        ? `Website: ${data.profile.socialLinks.website}`
        : "",
    ]
      .filter(Boolean)
      .join(" | "),
  });

  for (const item of data.sortedExperiences) {
    pushChunk(chunks, {
      id: `experience-${item.order}`,
      section: "experience",
      title: `${item.position} at ${item.company}`,
      content: [
        `Role: ${item.position}`,
        `Company: ${item.company}`,
        item.location ? `Location: ${item.location}` : "",
        `Duration: ${item.startDate} - ${item.current ? "present" : (item.endDate ?? "N/A")}`,
        item.description ? `Summary: ${item.description}` : "",
        item.responsibilities?.length
          ? `Responsibilities: ${item.responsibilities.join("; ")}`
          : "",
        item.achievements?.length
          ? `Achievements: ${item.achievements.join("; ")}`
          : "",
        item.technologies?.length
          ? `Technologies: ${item.technologies.map((tech) => tech.name).join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join(" | "),
    });
  }

  for (const item of data.sortedProjects) {
    pushChunk(chunks, {
      id: `project-${item.slug}`,
      section: "project",
      title: item.title,
      content: [
        `Title: ${item.title}`,
        item.tagline ? `Tagline: ${item.tagline}` : "",
        item.category ? `Category: ${item.category}` : "",
        item.impactSummary ? `Impact: ${item.impactSummary}` : "",
        item.problemStatement ? `Problem: ${item.problemStatement}` : "",
        item.solutionApproach ? `Solution: ${item.solutionApproach}` : "",
        item.liveUrl ? `Live URL: ${item.liveUrl}` : "",
        item.githubUrl ? `GitHub URL: ${item.githubUrl}` : "",
        item.citations?.length
          ? `Citations: ${item.citations.map((citation) => citation.url).join(", ")}`
          : "",
        `Case Study URL: https://madhudadi.in/case-studies/${item.slug}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
  }

  for (const skill of data.skills) {
    pushChunk(chunks, {
      id: `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      section: "skills",
      title: `Skill: ${skill.name}`,
      content: [
        `Skill: ${skill.name}`,
        skill.category ? `Category: ${skill.category}` : "",
        skill.proficiency ? `Proficiency: ${skill.proficiency}` : "",
        typeof skill.yearsOfExperience === "number"
          ? `Years: ${skill.yearsOfExperience}+`
          : "",
      ]
        .filter(Boolean)
        .join(" | "),
    });
  }

  for (const item of data.sortedServices) {
    pushChunk(chunks, {
      id: `service-${item.slug}`,
      section: "service",
      title: item.title,
      content: [
        `Service: ${item.title}`,
        item.shortDescription ? `Summary: ${item.shortDescription}` : "",
        item.fullDescription ? `Description: ${item.fullDescription}` : "",
        item.timeline ? `Timeline: ${item.timeline}` : "",
        item.features?.length ? `Features: ${item.features.join("; ")}` : "",
        item.deliverables?.length
          ? `Deliverables: ${item.deliverables.join("; ")}`
          : "",
      ]
        .filter(Boolean)
        .join(" | "),
    });
  }

  for (const item of data.sortedEducation) {
    pushChunk(chunks, {
      id: `education-${item.order}`,
      section: "education",
      title: `${item.degree} at ${item.institution}`,
      content: [
        `Institution: ${item.institution}`,
        `Degree: ${item.degree}`,
        item.fieldOfStudy ? `Field: ${item.fieldOfStudy}` : "",
        `Duration: ${item.startDate} - ${item.current ? "present" : (item.endDate ?? "N/A")}`,
        item.description ? `Summary: ${item.description}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    });
  }

  for (const item of data.sortedCertifications) {
    pushChunk(chunks, {
      id: `certification-${item.order}`,
      section: "certification",
      title: item.name,
      content: [
        `Certification: ${item.name}`,
        item.issuer ? `Issuer: ${item.issuer}` : "",
        item.issueDate ? `Issue date: ${item.issueDate}` : "",
        item.expiryDate ? `Expiry date: ${item.expiryDate}` : "",
        item.credentialId ? `Credential ID: ${item.credentialId}` : "",
        item.credentialUrl ? `Credential URL: ${item.credentialUrl}` : "",
        item.description ? `Summary: ${item.description}` : "",
      ]
        .filter(Boolean)
        .join(" | "),
    });
  }

  return chunks;
};

const scoreChunk = (chunk: KnowledgeChunk, query: string) => {
  const queryTokens = toTokens(query);
  if (queryTokens.length === 0) {
    return 0;
  }

  let score = 0;
  for (const token of queryTokens) {
    if (chunk.searchable.includes(token)) {
      score += 2;
    }
  }

  if (chunk.searchable.includes(query.toLowerCase().trim())) {
    score += 8;
  }

  return score;
};

export const retrieveRelevantChunks = (
  chunks: KnowledgeChunk[],
  message: string,
  history: ChatTurn[],
  limit = 10,
) => {
  const recentUserQuestions = history
    .filter((turn) => turn.role === "user")
    .map((turn) => turn.content)
    .slice(-3);
  const retrievalQuery = [...recentUserQuestions, message].join(" ");

  return [...chunks]
    .map((chunk) => ({
      chunk,
      score: scoreChunk(chunk, retrievalQuery),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk);
};

const parseResponseText = (payload: unknown) => {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const responsePayload = payload as {
    output_text?: unknown;
    output?: Array<{
      content?: Array<{ type?: string; text?: string }>;
    }>;
  };

  if (typeof responsePayload.output_text === "string") {
    return responsePayload.output_text.trim();
  }

  const content =
    responsePayload.output?.flatMap((item) => item.content ?? []) ?? [];
  const textParts = content
    .filter(
      (part) => part.type === "output_text" && typeof part.text === "string",
    )
    .map((part) => part.text as string);

  return textParts.join("\n").trim();
};

const toFields = (content: string) => {
  const map = new Map<string, string>();
  for (const part of content.split("|")) {
    const [rawKey, ...rawRest] = part.split(":");
    if (!rawKey || rawRest.length === 0) continue;
    const key = rawKey.trim().toLowerCase();
    const value = rawRest.join(":").trim();
    if (!value) continue;
    map.set(key, value);
  }
  return map;
};

const formatFallbackChunk = (chunk: KnowledgeChunk) => {
  const fields = toFields(chunk.content);

  switch (chunk.section) {
    case "experience": {
      const role = fields.get("role") || chunk.title;
      const company = fields.get("company");
      const duration = fields.get("duration");
      const location = fields.get("location");
      return `${role}${company ? ` at ${company}` : ""}${duration ? ` (${duration})` : ""}${location ? `, ${location}` : ""}.`;
    }
    case "project": {
      const tagline = fields.get("tagline");
      const impact = fields.get("impact");
      const liveUrl = fields.get("live url");
      const caseStudyUrl = fields.get("case study url");
      const githubUrl = fields.get("github url");
      const links = [caseStudyUrl, liveUrl, githubUrl]
        .filter(Boolean)
        .join(" | ");
      return `${chunk.title}${tagline ? ` — ${tagline}` : ""}${impact ? ` — ${impact}` : ""}${links ? ` (${links})` : ""}.`;
    }
    case "skills": {
      const skill =
        fields.get("skill") || chunk.title.replace(/^Skill:\s*/i, "");
      const proficiency = fields.get("proficiency");
      const years = fields.get("years");
      return `${skill}${proficiency ? ` (${proficiency})` : ""}${years ? `, ${years}` : ""}.`;
    }
    case "service": {
      const summary = fields.get("summary") || fields.get("description");
      const timeline = fields.get("timeline");
      return `${chunk.title}${summary ? ` — ${summary}` : ""}${timeline ? ` (timeline: ${timeline})` : ""}.`;
    }
    case "education": {
      const institution = fields.get("institution");
      const degree = fields.get("degree");
      const duration = fields.get("duration");
      return `${degree || chunk.title}${institution ? ` at ${institution}` : ""}${duration ? ` (${duration})` : ""}.`;
    }
    case "certification": {
      const issuer = fields.get("issuer");
      const issueDate = fields.get("issue date");
      const credentialUrl = fields.get("credential url");
      return `${chunk.title}${issuer ? ` — ${issuer}` : ""}${issueDate ? ` (issued ${issueDate})` : ""}${credentialUrl ? ` (${credentialUrl})` : ""}.`;
    }
    case "contact": {
      const email = fields.get("email");
      const phone = fields.get("phone");
      const linkedin = fields.get("linkedin");
      const github = fields.get("github");
      const website = fields.get("website");
      return [
        email ? `Email: ${email}` : "",
        phone ? `Phone: ${phone}` : "",
        linkedin ? `LinkedIn: ${linkedin}` : "",
        github ? `GitHub: ${github}` : "",
        website ? `Website: ${website}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
    }
    default: {
      return chunk.content.replace(/\s*\|\s*/g, " | ");
    }
  }
};

const fallbackReplyFromChunks = (chunks: KnowledgeChunk[]) => {
  const lines = chunks
    .slice(0, 6)
    .map((chunk) => `- ${formatFallbackChunk(chunk)}`);
  if (lines.length === 0) {
    return UNKNOWN_REPLY;
  }

  const primarySection = chunks[0]?.section ?? "profile";
  const followUp = SECTION_SUGGESTIONS[primarySection][0];
  return `Here are the documented details from my portfolio:\n${lines.join("\n")}\n\n${followUp}`;
};

const inferPrimarySection = (chunks: KnowledgeChunk[]): ChatSection => {
  if (chunks.length === 0) return "profile";

  const counts = new Map<ChatSection, number>();
  for (const chunk of chunks) {
    counts.set(chunk.section, (counts.get(chunk.section) ?? 0) + 1);
  }

  let best: ChatSection = chunks[0].section;
  let max = 0;
  for (const [section, count] of counts) {
    if (count > max) {
      best = section;
      max = count;
    }
  }

  return best;
};

export async function answerWithAgenticRag(
  message: string,
  history: ChatTurn[],
  data: PortfolioData,
) {
  if (!isProfileQuestion(message, history)) {
    return {
      blocked: true,
      reply: OFF_TOPIC_REPLY,
      suggestedPrompts: SECTION_SUGGESTIONS.profile.slice(0, 3),
      usedChunks: [] as KnowledgeChunk[],
    };
  }

  const chunks = buildKnowledgeChunks(data);
  let relevantChunks = retrieveRelevantChunks(chunks, message, history, 10);

  // Fallback: profile intro phrases (e.g. "who are you") match the intent guard
  // but generic tokens ("who", "are", "you") score 0 against every chunk.
  // In that case, serve the profile summary + contact chunks directly.
  if (relevantChunks.length === 0) {
    const normalized = message.toLowerCase();
    const isIntroPhrase = PROFILE_INTENT_PHRASES.some((p) =>
      normalized.includes(p),
    );
    if (isIntroPhrase) {
      relevantChunks = chunks
        .filter((c) => c.section === "profile" || c.section === "contact")
        .slice(0, 5);
    }
  }

  if (relevantChunks.length === 0) {
    return {
      blocked: false,
      reply: UNKNOWN_REPLY,
      suggestedPrompts: SECTION_SUGGESTIONS.profile.slice(0, 3),
      usedChunks: [] as KnowledgeChunk[],
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY not configured");
  }

  const model = process.env.OPENAI_CHAT_MODEL?.trim() || "gpt-4.1-mini";
  const contextBlock = relevantChunks
    .map(
      (chunk, index) =>
        `Chunk ${index + 1}\nSection: ${chunk.section}\nTitle: ${chunk.title}\nContent: ${chunk.content}`,
    )
    .join("\n\n");
  const historyBlock = history
    .slice(-8)
    .map((turn) => `${turn.role.toUpperCase()}: ${turn.content}`)
    .join("\n");

  const systemPrompt = `
You are Madhu Dadi's portfolio AI assistant.
Rules:
1. Answer ONLY from the supplied context chunks.
2. If information is not in context, reply exactly: "${UNKNOWN_REPLY}"
3. Keep responses factual and specific.
4. Support follow-up questions by using conversation history.
5. Do not answer non-profile questions.
6. Use short, clear paragraphs or bullets depending on what is most readable.
7. End with one short conversational follow-up question offering 2-3 relevant options.
`.trim();

  const userPrompt = `
Conversation history:
${historyBlock || "No prior conversation."}

User question:
${message}

Context chunks:
${contextBlock}
`.trim();

  let reply = "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [{ type: "input_text", text: systemPrompt }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: userPrompt }],
          },
        ],
        temperature: 0.2,
        max_output_tokens: 420,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const payload = (await response.json()) as unknown;
      reply = parseResponseText(payload);
    }
  } catch {
    reply = "";
  }

  const primarySection = inferPrimarySection(relevantChunks);

  return {
    blocked: false,
    reply: reply || fallbackReplyFromChunks(relevantChunks),
    suggestedPrompts: SECTION_SUGGESTIONS[primarySection].slice(0, 3),
    usedChunks: relevantChunks,
  };
}
