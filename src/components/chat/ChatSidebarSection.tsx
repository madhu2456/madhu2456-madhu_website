"use client";

import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/components/ui/sidebar";
import type { ChatProfile } from "./chat-profile";

const ChatWrapper = dynamic(() => import("./ChatWrapper"), {
  ssr: false,
});

export function ChatSidebarSection({
  profile,
}: {
  profile: ChatProfile | null;
}) {
  const sidebarContext = useContext(SidebarContext);
  const [hasOpened, setHasOpened] = useState(false);

  const open = sidebarContext?.open ?? false;
  const openMobile = sidebarContext?.openMobile ?? false;
  const isMobile = sidebarContext?.isMobile ?? false;
  const isOpen = isMobile ? openMobile : open;

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  if (!hasOpened) {
    return (
      <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-foreground/60">
        Open chat to load AI assistant
      </div>
    );
  }

  return <ChatWrapper profile={profile} />;
}
