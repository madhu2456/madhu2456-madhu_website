"use client";

import { useChatKit } from "@openai/chatkit-react";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { CREATE_SESSION_ENDPOINT } from "@/lib/config";
import { SidebarContext } from "../ui/sidebar";
import type { ChatProfile } from "./chat-profile";
import {
  clearPrefetchedClientSecret,
  readPrefetchedClientSecret,
} from "./session-cache";

type ChatContextType = {
  control: any;
  isReady: boolean;
  sessionError: string | null;
  resetSession: () => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: ChatProfile | null;
}) {
  const sidebarContext = useContext(SidebarContext);
  const toggleSidebar = sidebarContext?.toggleSidebar ?? (() => {});

  const [isReady, setIsReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const sessionPromiseRef = useRef<Promise<string> | null>(null);

  const getGreeting = useCallback(() => {
    if (!profile?.firstName) {
      return "Hi there! Ask me anything about my work, experience, or projects.";
    }
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");
    return `Hi! I'm ${fullName}. Ask me anything about my work, experience, or projects.`;
  }, [profile]);

  const requestClientSecret = useCallback(async () => {
    const prefetchedSecret = readPrefetchedClientSecret();
    if (prefetchedSecret) {
      clearPrefetchedClientSecret();
      return prefetchedSecret;
    }

    const response = await fetch(CREATE_SESSION_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = (await response.json().catch(() => null)) as
      | { clientSecret?: string; error?: string }
      | null;

    if (!response.ok) {
      const errorMessage =
        data?.error ||
        `Failed to create session (HTTP ${response.status.toString()})`;
      throw new Error(errorMessage);
    }

    if (
      !data ||
      typeof data.clientSecret !== "string" ||
      data.clientSecret.length === 0
    ) {
      throw new Error("Missing client secret from session endpoint");
    }

    return data.clientSecret;
  }, []);

  const getClientSecret = useCallback(
    async (existingSecret: string | null) => {
      try {
        if (existingSecret) {
          setSessionError(null);
          setIsReady(true);
          return existingSecret;
        }

        if (!sessionPromiseRef.current) {
          sessionPromiseRef.current = requestClientSecret();
        }

        const secret = await sessionPromiseRef.current;
        setSessionError(null);
        setIsReady(true);
        return secret;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Failed to start chat session";
        setSessionError(msg);
        setIsReady(true);
        sessionPromiseRef.current = null;
        throw err;
      }
    },
    [requestClientSecret],
  );

  const { control } = useChatKit({
    api: {
      getClientSecret,
    },
    theme: {},
    header: {
      title: { text: `Chat with ${profile?.firstName || "Me"}` },
      leftAction: {
        icon: "close",
        onClick: () => toggleSidebar(),
      },
    },
    startScreen: {
      greeting: getGreeting(),
      prompts: [
        {
          icon: "suitcase",
          label: "What's your experience?",
          prompt:
            "Tell me about your professional experience and previous roles",
        },
        {
          icon: "square-code",
          label: "What skills do you have?",
          prompt:
            "What technologies and programming languages do you specialize in?",
        },
        {
          icon: "cube",
          label: "What have you built?",
          prompt: "Show me some of your most interesting projects",
        },
        {
          icon: "profile",
          label: "Who are you?",
          prompt: "Tell me more about yourself and your background",
        },
      ],
    },
    composer: {
      models: [
        { id: "crisp", label: "Crisp", description: "Concise and factual" },
        { id: "clear", label: "Clear", description: "Focused and helpful" },
        {
          id: "chatty",
          label: "Chatty",
          description: "Conversational companion",
        },
      ],
    },
    disclaimer: {
      text: "Disclaimer: This is my AI-powered twin. It may not be 100% accurate and should be verified for accuracy.",
    },
  });

  const resetSession = useCallback(() => {
    setIsReady(false);
    setSessionError(null);
    sessionPromiseRef.current = null;
    clearPrefetchedClientSecret();
    // Note: ChatKit usually handles reconnection,
    // but we can add manual logic here if needed.
  }, []);

  const value = useMemo(
    () => ({
      control,
      isReady,
      sessionError,
      resetSession,
    }),
    [control, isReady, sessionError, resetSession],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
