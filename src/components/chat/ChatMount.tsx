"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "@/components/ui/sidebar";
import type { ChatProfile } from "./chat-profile";

const Chat = dynamic(() => import("@/components/chat/Chat"), {
  ssr: false,
});

/**
 * Manages the background script loading and conditional rendering of the Chat UI.
 */
export function ChatMount({
  profile,
}: {
  profile: ChatProfile | null;
}) {
  const context = useContext(SidebarContext);
  const [hasOpened, setHasOpened] = useState(false);

  const open = context?.open ?? false;
  const openMobile = context?.openMobile ?? false;
  const isMobile = context?.isMobile ?? false;

  const isOpen = isMobile ? openMobile : open;

  // Track if it has ever been opened to keep it mounted in the background
  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  return (
    <>
      {hasOpened && (
        <>
          <Script
            src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
            strategy="afterInteractive"
          />
          <Chat profile={profile} />
        </>
      )}
    </>
  );
}
