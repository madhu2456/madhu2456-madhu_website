"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { ChatMount } from "@/components/chat/ChatMount";
import { ChatProvider } from "./ChatProvider";

const CHAT_PROFILE_QUERY = `*[_id == "singleton-profile"][0]{
    firstName,
    lastName
  }`;

function ChatWrapper() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    client.fetch(CHAT_PROFILE_QUERY).then(setProfile);
  }, []);

  return (
    <div className="h-full w-full">
      <ChatProvider profile={profile}>
        <ChatMount profile={profile} />
      </ChatProvider>
    </div>
  );
}

export default ChatWrapper;
