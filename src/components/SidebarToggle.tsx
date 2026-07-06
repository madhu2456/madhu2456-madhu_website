"use client";

import { IconMessageCircle, IconSparkles } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useSidebar } from "./ui/sidebar";

function SidebarToggle() {
  const pathname = usePathname();
  const { toggleSidebar, open, isMobile, openMobile } = useSidebar();

  const isSidebarOpen = isMobile ? openMobile : open;

  if (isSidebarOpen) return null;
  if (pathname === "/contact" || pathname === "/contact/") return null;

  return (
    <div className="group fixed right-5 bottom-5 z-50 sm:right-6 sm:bottom-6">
      <div
        aria-hidden
        className="absolute inset-0 rounded-full bg-primary/20 blur-xl transition-opacity group-hover:opacity-80"
      />
      <div className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
        <IconSparkles className="h-3 w-3" aria-hidden />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-full mb-3 origin-bottom-right scale-95 rounded-xl border border-border bg-surface/90 px-3 py-2 text-xs font-medium whitespace-nowrap text-foreground opacity-0 shadow-card backdrop-blur-xl transition-all group-hover:translate-y-[-2px] group-hover:scale-100 group-hover:opacity-100"
      >
        Chat with my AI twin
        <div className="absolute right-6 -bottom-1 h-2 w-2 rotate-45 border-r border-b border-border bg-surface/90" />
      </div>

      <button
        type="button"
        onClick={toggleSidebar}
        className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border bg-primary text-primary-foreground shadow-card transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:scale-100"
        aria-label="Open AI assistant"
      >
        <IconMessageCircle className="h-7 w-7" aria-hidden />
      </button>
    </div>
  );
}

export default SidebarToggle;
