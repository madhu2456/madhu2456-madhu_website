"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

interface NavItem {
  title?: string | null;
  href?: string | null;
  icon?: string | null;
  isExternal?: boolean | null;
}

const FloatingDockClient = dynamic(
  () =>
    import("@/components/FloatingDockClient").then((m) => m.FloatingDockClient),
  { ssr: false },
);

const ENABLE_EVENTS = ["pointerdown", "keydown", "touchstart"] as const;

export function FloatingDockMount({ navItems }: { navItems: NavItem[] }) {
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
      idleId = requestIdleCallback(activate, { timeout: 1800 });
    } else {
      timeoutId = window.setTimeout(activate, 600);
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

  return <FloatingDockClient navItems={navItems} />;
}
