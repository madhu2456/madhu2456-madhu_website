"use client";

import {
  IconBrandLinkedin,
  IconBrandReddit,
  IconBrandX,
  IconBrandYcombinator,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export function ShareButtons({ url, title, description }: ShareButtonsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || title);

  const shareLinks = [
    {
      name: "X (Twitter)",
      icon: <IconBrandX className="h-4 w-4" />,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-foreground hover:bg-white/10 hover:border-white/20",
    },
    {
      name: "LinkedIn",
      icon: <IconBrandLinkedin className="h-4 w-4" />,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
      color:
        "hover:text-[#0a66c2] hover:bg-[#0a66c2]/10 hover:border-[#0a66c2]/20",
    },
    {
      name: "Hacker News",
      icon: <IconBrandYcombinator className="h-4 w-4" />,
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
      color:
        "hover:text-[#ff6600] hover:bg-[#ff6600]/10 hover:border-[#ff6600]/20",
    },
    {
      name: "Reddit",
      icon: <IconBrandReddit className="h-4 w-4" />,
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      color:
        "hover:text-[#ff4500] hover:bg-[#ff4500]/10 hover:border-[#ff4500]/20",
    },
  ];

  // Prevent hydration mismatch on the client since URLs might differ slightly in edge cases
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-3 mt-16 pt-10 border-t border-border/60">
      <h3 className="font-display text-lg font-bold">Share this case study</h3>
      <div className="flex flex-wrap gap-3">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            className={`flex items-center gap-2 rounded-full border border-border bg-surface/50 px-4 py-2 text-sm text-muted-foreground transition-all duration-300 ${link.color}`}
          >
            {link.icon}
            <span>{link.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
