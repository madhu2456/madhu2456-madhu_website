"use client";

import Chat from "./Chat";
import { ChatErrorBoundary } from "./ChatErrorBoundary";
import type { ChatProfile } from "./chat-profile";

function ChatWrapper({ profile }: { profile: ChatProfile | null }) {
  return (
    <div className="h-full w-full">
      <ChatErrorBoundary>
        <Chat profile={profile} />
      </ChatErrorBoundary>
    </div>
  );
}

export default ChatWrapper;
