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

  if (!enabled) {
    return null;
  }

  return <FloatingDockClient navItems={navItems} />;
}
