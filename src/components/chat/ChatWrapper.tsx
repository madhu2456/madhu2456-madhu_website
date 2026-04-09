import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { ChatMount } from "@/components/chat/ChatMount";
import { ChatProvider } from "./ChatProvider";

const CHAT_PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
    firstName,
    lastName
  }`);

async function ChatWrapper() {
  const { data: profile } = await sanityFetch({ query: CHAT_PROFILE_QUERY });

  return (
    <div className="h-full w-full">
      <ChatProvider profile={profile}>
        <ChatMount profile={profile} />
      </ChatProvider>
    </div>
  );
}

export default ChatWrapper;
