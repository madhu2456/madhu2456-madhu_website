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
  const [mounted, setMounted] = useState(false);
  const sidebarContext = useContext(SidebarContext);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const open = sidebarContext?.open ?? false;
  const openMobile = sidebarContext?.openMobile ?? false;
  const isMobile = sidebarContext?.isMobile ?? false;
  const isOpen = isMobile ? openMobile : open;

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  // Render absolutely nothing on the server or when the sidebar has not been opened yet.
  // This completely eliminates any early placeholder text from the DOM, optimizing indexing priority for primary content.
  if (!mounted || !hasOpened) {
    return null;
  }

  return <ChatWrapper profile={profile} />;
}
