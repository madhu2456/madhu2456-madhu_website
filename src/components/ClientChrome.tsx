"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ModeToggle = dynamic(
  () => import("@/components/DarkModeToggle").then((m) => m.ModeToggle),
  { ssr: false },
);

const SidebarToggle = dynamic(() => import("@/components/SidebarToggle"), {
  ssr: false,
});

const ENABLE_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

export function ClientChrome() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (enabled) return;

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const activate = () => setEnabled(true);

    const handleIntent = () => {
      activate();
      for (const eventName of ENABLE_EVENTS) {
        window.removeEventListener(eventName, handleIntent);
      }
    };

    for (const eventName of ENABLE_EVENTS) {
      window.addEventListener(eventName, handleIntent, {
        passive: true,
        once: true,
      });
    }

    if (typeof requestIdleCallback !== "undefined") {
      idleId = requestIdleCallback(activate, { timeout: 1600 });
    } else {
      timeoutId = window.setTimeout(activate, 500);
    }

    return () => {
      for (const eventName of ENABLE_EVENTS) {
        window.removeEventListener(eventName, handleIntent);
      }
      if (idleId !== null && typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <>
      <SidebarToggle />

      <div className="fixed md:bottom-6 md:right-24 top-4 right-18 md:top-auto md:left-auto z-20">
        <div className="w-11 h-11 md:w-12 md:h-12">
          <ModeToggle />
        </div>
      </div>
    </>
  );
}
