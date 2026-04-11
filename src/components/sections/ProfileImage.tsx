"use client";

import { IconMessageCircle, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { useSidebar } from "../ui/sidebar";

interface ProfileImageProps {
  imageUrl: string;
  lqip?: string;
  firstName: string;
  lastName: string;
}

export function ProfileImage({
  imageUrl,
  lqip,
  firstName,
  lastName,
}: ProfileImageProps) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="relative rounded-xl overflow-hidden border-4 border-primary/20 block group cursor-pointer w-full h-full mx-auto"
      aria-label="Toggle AI Chat Sidebar"
    >
      <Image
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        fill
        sizes="(max-width: 768px) min(86vw, 300px), (max-width: 1280px) 340px, 380px"
        className="object-cover object-[center_35%] transition-transform duration-300 group-hover:scale-105"
        quality={60}
        placeholder={lqip ? "blur" : "empty"}
        blurDataURL={lqip}
      />

      {/* Online Badge */}
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <div className="relative">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-medium text-white">Online</span>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="flex flex-col items-center text-center gap-3 px-4 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {open ? (
            <IconX className="w-12 h-12 text-white" />
          ) : (
            <IconMessageCircle className="w-12 h-12 text-white" />
          )}

          <div className="text-white text-lg font-semibold leading-tight">
            {open ? "Close Chat" : "Chat with AI Twin"}
          </div>
          <div className="text-white/80 text-sm leading-tight">
            {open ? "Click to close chat" : "Click to open chat"}
          </div>
        </div>
      </div>
    </button>
  );
}
