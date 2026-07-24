"use client";

import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { getChatProfile } from "@/app/actions/get-chat-profile";
import { SidebarContext } from "@/components/ui/sidebar";
import type { ChatProfile } from "./chat-profile";

const ChatWrapper = dynamic(() => import("./ChatWrapper"), {
  ssr: false,
});

export function ChatSidebarSection() {
  const [mounted, setMounted] = useState(false);
  const sidebarContext = useContext(SidebarContext);
  const [hasOpened, setHasOpened] = useState(false);
  const [profile, setProfile] = useState<ChatProfile | null>(null);
  const [profileError, setProfileError] = useState(false);

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

  useEffect(() => {
    if (!hasOpened || profile || profileError) return;
    let cancelled = false;
    getChatProfile()
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch(() => {
        if (!cancelled) setProfileError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [hasOpened, profile, profileError]);

  // Nothing on the server or until the sidebar has been opened once.
  if (!mounted || !hasOpened) {
    return null;
  }

  if (!profile && !profileError) {
    return (
      <div
        role="status"
        className="flex h-full w-full items-center justify-center"
        aria-busy="true"
        aria-label="Loading assistant"
      >
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
      </div>
    );
  }

  return <ChatWrapper profile={profileError ? null : profile} />;
}
