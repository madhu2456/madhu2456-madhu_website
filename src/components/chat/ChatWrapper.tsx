"use client";

import { ChatMount } from "@/components/chat/ChatMount";
import { ChatProvider } from "./ChatProvider";

function ChatWrapper({ profile }: { profile: any }) {
  return (
    <div className="h-full w-full">
      <ChatProvider profile={profile}>
        <ChatMount profile={profile} />
      </ChatProvider>
    </div>
  );
}

export default ChatWrapper;
