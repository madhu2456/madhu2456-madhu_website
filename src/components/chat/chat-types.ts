export type ChatRole = "assistant" | "user";

/** Allowlisted source chip from RAG (no chunk body). */
export type ChatSourceRef = {
  id: string;
  section: string;
  title: string;
  url: string;
  /** 1-based claim marker [n] in the answer body */
  n: number;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  suggestions?: string[];
  sources?: ChatSourceRef[];
};
