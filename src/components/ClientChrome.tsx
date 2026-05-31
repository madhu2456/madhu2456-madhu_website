"use client";

import dynamic from "next/dynamic";

const SidebarToggle = dynamic(() => import("@/components/SidebarToggle"), {
  ssr: false,
});

export function ClientChrome() {
  return <SidebarToggle />;
}
