"use client";

import Chat from "./Chat";
import type { ChatProfile } from "./chat-profile";

function ChatWrapper({ profile }: { profile: ChatProfile | null }) {
  return (
    <div className="h-full w-full">
      <Chat profile={profile} />
    </div>
  );
}

export default ChatWrapper;
