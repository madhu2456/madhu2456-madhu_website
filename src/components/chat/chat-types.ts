export type ChatRole = "assistant" | "user";

/** Allowlisted source chip from RAG (no chunk body). */
export type ChatSourceRef = {
  id: string;
  section: string;
  title: string;
  url: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  suggestions?: string[];
  sources?: ChatSourceRef[];
};
