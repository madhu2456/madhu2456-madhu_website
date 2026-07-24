"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const AppSidebar = dynamic(
  () =>
    import("@/components/app-sidebar").then((mod) => ({
      default: mod.AppSidebar,
    })),
  { ssr: false },
);

const SidebarToggle = dynamic(() => import("@/components/SidebarToggle"), {
  ssr: false,
});

/**
 * Chat sidebar + FAB load client-only (audit v5 HTML payload).
 * Provider stays here so toggle and sidebar share context without SSR weight.
 */
export function ClientChrome({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset>{children}</SidebarInset>
      <AppSidebar side="right" />
      <SidebarToggle />
    </SidebarProvider>
  );
}
