"use client";

import { useEffect, useState, useContext } from "react";
import { SidebarContext } from "@/components/ui/sidebar";
import Chat from "@/components/chat/Chat";
import type { CHAT_PROFILE_QUERYResult } from "@/../sanity.types";

/**
 * Defers mounting <Chat> until the sidebar is opened for the first time.
 *
 * Without this, Chat mounts on every page load and immediately:
 *  - Loads 1.1 MB of ChatKit CDN JS
 *  - Calls createSession() → OpenAI API
 *  - Adds ~4.7 s to the critical network path
 *
 * Once opened, the component stays mounted (chat state is preserved on close/reopen).
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

  if (!hasOpened) {
    // Sidebar has never been opened — render nothing so no scripts or API
    // calls are triggered. The SidebarSkeleton in AppSidebar covers the UI.
    return null;
  }

  return <Chat profile={profile} />;
}
