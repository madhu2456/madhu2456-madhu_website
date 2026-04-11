"use client";

import { ChatMount } from "@/components/chat/ChatMount";
import type { ChatProfile } from "./chat-profile";
import { ChatProvider } from "./ChatProvider";

function ChatWrapper({ profile }: { profile: ChatProfile | null }) {
  return (
    <div className="h-full w-full">
      <ChatProvider profile={profile}>
        <ChatMount profile={profile} />
      </ChatProvider>
    </div>
  );
}

export default ChatWrapper;
