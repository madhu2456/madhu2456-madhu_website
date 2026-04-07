"use client";

import { useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import type { CHAT_PROFILE_QUERYResult } from "@/../sanity.types";
import { createSession } from "@/app/actions/create-session";
import { useSidebar } from "../ui/sidebar";

function ChatInitSkeleton({ name }: { name?: string }) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10">
        <div className="w-7 h-7 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-3.5 w-28 rounded-full bg-foreground/15 animate-pulse" />
      </div>

      {/* Greeting area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
        <div className="h-4 w-3/4 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-4 w-1/2 rounded-full bg-foreground/15 animate-pulse" />
        <p className="text-xs text-foreground/40 mt-2">
          {name ? `Connecting to ${name}'s AI…` : "Connecting…"}
        </p>
      </div>

      {/* Prompt chips */}
      <div className="flex flex-col gap-2 px-4 pb-2">
        {[80, 65, 72, 60].map((w, i) => (
          <div
            key={i}
            className="h-10 rounded-xl bg-foreground/10 animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>

      {/* Composer */}
      <div className="px-4 pb-4 pt-2">
        <div className="h-11 w-full rounded-xl bg-foreground/10 animate-pulse" />
      </div>
    </div>
  );
}

export function Chat({
  profile,
}: {
  profile: CHAT_PROFILE_QUERYResult | null;
}) {
  const { toggleSidebar } = useSidebar();
  const [isReady, setIsReady] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const getGreeting = () => {
    if (!profile?.firstName) {
      return "Hi there! Ask me anything about my work, experience, or projects.";
    }
    const fullName = [profile.firstName, profile.lastName]
      .filter(Boolean)
      .join(" ");
    return `Hi! I'm ${fullName}. Ask me anything about my work, experience, or projects.`;
  };

  const { control } = useChatKit({
    api: {
      getClientSecret: async (_existingSecret) => {
        try {
          const secret = await createSession();
          setIsReady(true);
          return secret;
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to start chat session";
          setSessionError(msg);
          setIsReady(true); // exit skeleton so user sees the error
          throw err;
        }
      },
    },
    theme: {},
    header: {
      title: {
        text: `Chat with ${profile?.firstName || "Me"} `,
      },
      leftAction: {
        icon: "close",
        onClick: () => {
          toggleSidebar();
        },
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
        {
          id: "crisp",
          label: "Crisp",
          description: "Concise and factual",
        },
        {
          id: "clear",
          label: "Clear",
          description: "Focused and helpful",
        },
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

  return (
    <div className="relative h-full w-full">
      {/* Skeleton overlays on top until ChatKit signals it's ready */}
      {!isReady && (
        <div className="absolute inset-0 z-10">
          <ChatInitSkeleton name={profile?.firstName ?? undefined} />
        </div>
      )}

      {sessionError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <p className="text-sm text-destructive">Failed to start chat session.</p>
          <p className="text-xs text-foreground/50">{sessionError}</p>
        </div>
      )}

      {/* Always mounted so ChatKit can initialise properly */}
      <ChatKit control={control} className="h-full w-full z-50" />
    </div>
  );
}

export default Chat;
