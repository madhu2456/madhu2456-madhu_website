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

    return () => {
      for (const eventName of ENABLE_EVENTS) {
        window.removeEventListener(eventName, handleIntent);
      }
    };
  }, [enabled]);

  return (
    <>
      <SidebarToggle />

      {enabled && (
        <div className="fixed md:bottom-6 md:right-24 top-4 right-18 md:top-auto md:left-auto z-20">
          <div className="w-11 h-11 md:w-12 md:h-12">
            <ModeToggle />
          </div>
        </div>
      )}
    </>
  );
}
