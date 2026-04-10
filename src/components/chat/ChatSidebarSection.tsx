"use client";

import dynamic from "next/dynamic";

const ChatWrapper = dynamic(() => import("./ChatWrapper"), {
  ssr: false,
});

export function ChatSidebarSection({ profile }: { profile: any }) {
  return <ChatWrapper profile={profile} />;
}
