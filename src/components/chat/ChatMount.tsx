"use client";

import { useEffect, useState, useContext } from "react";
import Script from "next/script";
import { SidebarContext } from "@/components/ui/sidebar";
import Chat from "@/components/chat/Chat";
import type { CHAT_PROFILE_QUERYResult } from "@/../sanity.types";

/**
 * Defers mounting <Chat> until the sidebar is opened for the first time.
 */
export function ChatMount({ profile }: { profile: CHAT_PROFILE_QUERYResult | null }) {
  const context = useContext(SidebarContext);
  const [hasOpened, setHasOpened] = useState(false);

  const open = context?.open ?? false;
  const openMobile = context?.openMobile ?? false;
  const isMobile = context?.isMobile ?? false;

  const isOpen = isMobile ? openMobile : open;

  useEffect(() => {
    if (isOpen && !hasOpened) {
      setHasOpened(true);
    }
  }, [isOpen, hasOpened]);

  return (
    <>
      {/* 
        Pre-warm the ChatKit library as soon as the Sidebar chunk is loaded.
        This overlaps script download (~1.1MB) with user idle time so it's
        ready instantly when they click.
      */}
      <Script
        src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
        strategy="afterInteractive"
      />

      {hasOpened ? (
        <Chat profile={profile} />
      ) : null}
    </>
  );
}
