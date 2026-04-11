"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const CometCard = dynamic(
  () => import("@/components/ui/comet-card").then((m) => m.CometCard),
  { ssr: false },
);

interface LazyCometCardProps {
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  children: ReactNode;
}

export function LazyCometCard({
  rotateDepth,
  translateDepth,
  className,
  children,
}: LazyCometCardProps) {
  const [enabled, setEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (enabled || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "220px" },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [enabled]);

  if (enabled) {
    return (
      <CometCard
        rotateDepth={rotateDepth}
        translateDepth={translateDepth}
        className={className}
      >
        {children}
      </CometCard>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ perspective: "2000px", transformStyle: "preserve-3d" }}
      onPointerEnter={() => setEnabled(true)}
    >
      <div className="relative rounded-2xl">{children}</div>
    </div>
  );
}
