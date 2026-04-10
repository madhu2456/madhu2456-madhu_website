"use client";

import { useChatKit } from "@openai/chatkit-react";
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { CHAT_PROFILE_QUERYResult } from "@/../sanity.types";
import { createSession } from "@/app/actions/create-session";
import { SidebarContext } from "../ui/sidebar";

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
  profile: CHAT_PROFILE_QUERYResult | null;
}) {
  const sidebarContext = useContext(SidebarContext);
  const toggleSidebar = sidebarContext?.toggleSidebar ?? (() => {});

  const [isReady, setIsReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const getGreeting = useCallback(() => {
    if (!profile?.firstName) {
      return "Hi there! Ask me anything about my work, experience, or projects.";
    }
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");
    return `Hi! I'm ${fullName}. Ask me anything about my work, experience, or projects.`;
  }, [profile]);

  const { control } = useChatKit({
    api: {
      getClientSecret: async (_existingSecret) => {
        try {
          const secret = await createSession();
          setIsReady(true);
          return secret;
        } catch (err) {
          const msg =
            err instanceof Error ? err.message : "Failed to start chat session";
          setSessionError(msg);
          setIsReady(true);
          throw err;
        }
      },
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
