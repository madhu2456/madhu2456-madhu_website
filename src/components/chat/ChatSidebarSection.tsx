"use client";

import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { CREATE_SESSION_ENDPOINT } from "@/lib/config";
import { SidebarContext } from "@/components/ui/sidebar";
import {
  readPrefetchedClientSecret,
  writePrefetchedClientSecret,
} from "./session-cache";

const ChatWrapper = dynamic(() => import("./ChatWrapper"), {
  ssr: false,
});

export function ChatSidebarSection({ profile }: { profile: any }) {
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

  useEffect(() => {
    if (hasOpened) {
      return;
    }

    let disposed = false;

    const runPrefetch = async () => {
      if (disposed || readPrefetchedClientSecret()) {
        return;
      }

      const response = await fetch(CREATE_SESSION_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { clientSecret?: string };
      if (typeof data.clientSecret === "string" && data.clientSecret.length > 0) {
        writePrefetchedClientSecret(data.clientSecret);
      }
    };

    const schedulePrefetch = () => {
      const execute = () => {
        void runPrefetch().catch((err) => {
          console.warn("Chat session prefetch failed", err);
        });
      };

      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(execute, { timeout: 2_500 });
      } else {
        setTimeout(execute, 0);
      }
    };

    const interactionEvents = ["mousemove", "scroll", "touchstart", "keydown"];
    const handleInteraction = () => {
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, handleInteraction);
      }
      schedulePrefetch();
    };

    for (const eventName of interactionEvents) {
      window.addEventListener(eventName, handleInteraction, {
        passive: true,
        once: true,
      });
    }

    return () => {
      disposed = true;
      for (const eventName of interactionEvents) {
        window.removeEventListener(eventName, handleInteraction);
      }
    };
  }, [hasOpened]);

  if (!hasOpened) {
    return (
      <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-foreground/60">
        Open chat to load AI twin
      </div>
    );
  }

  return <ChatWrapper profile={profile} />;
}
