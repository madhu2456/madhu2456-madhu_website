"use client";

import { IconMessage2, IconSparkles } from "@tabler/icons-react";
import { useSidebar } from "./ui/sidebar";

function SidebarToggle() {
  const { toggleSidebar, open, isMobile, openMobile } = useSidebar();

  const isSidebarOpen = isMobile ? openMobile : open;

  if (isSidebarOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Animated rings — transform+opacity only so they stay on the GPU compositing layer */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-25 animate-ping [animation-duration:2s] will-change-transform" />
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 animate-pulse [animation-duration:3s] will-change-transform" />

      {/* Sparkle badge */}
      <div className="absolute -top-1 -right-1 z-10">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center animate-bounce [animation-duration:2s] will-change-transform">
          <IconSparkles className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/40 dark:border-white/20 text-sm font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
        Chat with My AI Twin
        <div className="absolute -bottom-1 right-6 w-2 h-2 rotate-45 bg-white/90 dark:bg-black/90 border-r border-b border-white/40 dark:border-white/20" />
      </div>

      <button
        type="button"
        onClick={toggleSidebar}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 dark:from-violet-600 dark:via-purple-600 dark:to-fuchsia-600 shadow-[0_0_48px_12px_rgba(168,85,247,0.45)] hover:shadow-[0_0_64px_16px_rgba(168,85,247,0.65)] transition-all duration-500 hover:scale-110 hover:rotate-12 flex items-center justify-center"
        aria-label="Chat with AI Twin"
      >
        <IconMessage2 className="h-7 w-7 text-white transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}

export default SidebarToggle;
