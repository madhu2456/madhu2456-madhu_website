"use client";

import dynamic from "next/dynamic";
import { IconQuestionMark } from "@tabler/icons-react";
import { memo } from "react";

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

type IconComp = React.ComponentType<{ className?: string }>;

// Module-level cache so we never call dynamic() twice for the same icon name.
// Calling dynamic() inside a render function creates a new component reference
// on every render, causing unnecessary remounts.
const iconCache = new Map<string, IconComp>();

function getIconComponent(name: string): IconComp {
  if (!iconCache.has(name)) {
    const Loaded = dynamic<{ className?: string }>(
      () =>
        import("@tabler/icons-react").then((mod) => {
          const Icon = (mod as Record<string, IconComp>)[name];
          // Fall back to question-mark if the name doesn't exist in the library
          return { default: Icon ?? IconQuestionMark };
        }),
      {
        // Skip SSR — icons are decorative and don't affect crawlability.
        // This moves the entire Tabler bundle into an async chunk so it
        // never blocks the main-thread / critical rendering path.
        ssr: false,
        loading: () => (
          <IconQuestionMark
            className="h-full w-full text-neutral-500 dark:text-neutral-300 opacity-30"
          />
        ),
      },
    );
    iconCache.set(name, Loaded);
  }
  // biome-ignore lint/style/noNonNullAssertion: set above
  return iconCache.get(name)!;
}

export const DynamicIcon = memo(function DynamicIcon({
  iconName,
  className = "h-full w-full text-neutral-500 dark:text-neutral-300",
}: DynamicIconProps) {
  const Icon = getIconComponent(iconName);
  return <Icon className={className} />;
});
