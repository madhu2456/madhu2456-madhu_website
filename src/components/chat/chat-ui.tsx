"use client";

import { IconCheck, IconCopy, IconSparkles } from "@tabler/icons-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { ChatProfile } from "./chat-profile";
import type { ChatSourceRef } from "./chat-types";
import { buildProfileFacts } from "./profile-facts";

const FACT_ROTATION_INTERVAL_MS = 2600;

// ─── Inline Markdown (+ claim markers [n]) ────────────────────────────────────

function InlineMarkdown({
  text,
  sources = [],
  onCiteClick,
}: {
  text: string;
  sources?: ChatSourceRef[];
  onCiteClick?: (source: ChatSourceRef) => void;
}) {
  const sourceByN = useMemo(() => {
    const map = new Map<number, ChatSourceRef>();
    for (const s of sources) {
      if (typeof s.n === "number" && s.n > 0) map.set(s.n, s);
    }
    return map;
  }, [sources]);

  const parts = text
    .split(/(\*\*[^*]+\*\*|\[\d+\]|\bhttps?:\/\/\S+)/g)
    .map((part, index) => ({ part, id: String(index) }));

  return (
    <>
      {parts.map(({ part, id }) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={id} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const citeMatch = /^\[(\d+)\]$/.exec(part);
        if (citeMatch) {
          const n = Number.parseInt(citeMatch[1], 10);
          const source = sourceByN.get(n);
          if (!source) {
            return null;
          }
          return (
            <a
              key={id}
              href={source.url}
              onClick={() => onCiteClick?.(source)}
              className="ml-0.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded px-0.5 align-super text-[10px] font-semibold text-primary underline-offset-2 hover:underline"
              title={`${source.title} (${source.section})`}
              aria-label={`Citation ${n}: ${source.title}`}
            >
              [{n}]
            </a>
          );
        }
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={id}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 opacity-90 hover:opacity-60 transition-opacity"
            >
              {part}
            </a>
          );
        }
        return <span key={id}>{part}</span>;
      })}
    </>
  );
}

export function MarkdownText({
  text,
  sources,
  onCiteClick,
}: {
  text: string;
  sources?: ChatSourceRef[];
  onCiteClick?: (source: ChatSourceRef) => void;
}) {
  const lines = text
    .split("\n")
    .map((line, index) => ({ line, id: String(index) }));
  return (
    <div className="space-y-1">
      {lines.map(({ line, id }) => {
        if (!line.trim()) {
          return <div key={id} className="h-1.5" />;
        }
        if (/^[-*]\s/.test(line)) {
          return (
            <div key={id} className="flex items-start gap-2">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span className="leading-relaxed">
                <InlineMarkdown
                  text={line.replace(/^[-*]\s/, "")}
                  sources={sources}
                  onCiteClick={onCiteClick}
                />
              </span>
            </div>
          );
        }
        return (
          <p key={id} className="leading-relaxed">
            <InlineMarkdown
              text={line}
              sources={sources}
              onCiteClick={onCiteClick}
            />
          </p>
        );
      })}
    </div>
  );
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────

export function TypingDots() {
  const prefersReducedMotion = useReducedMotion();
  const dots = [0, 1, 2].map((val, index) => ({ val, id: String(index) }));
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {dots.map(({ val, id }) => {
        return (
          <motion.span
            key={id}
            className="block h-2 w-2 rounded-full bg-foreground/35"
            animate={
              prefersReducedMotion
                ? { opacity: 0.75 }
                : { y: [0, -5, 0], opacity: [0.35, 1, 0.35] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 0.75,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: val * 0.15,
                    ease: "easeInOut",
                  }
            }
          />
        );
      })}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

export function CopyButton({ text }: { text: string }) {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // silently ignore
    }
  };

  const iconProps = {
    initial: prefersReducedMotion ? undefined : { scale: 0.6, opacity: 0 },
    animate: prefersReducedMotion ? undefined : { scale: 1, opacity: 1 },
    exit: prefersReducedMotion ? undefined : { scale: 0.6, opacity: 0 },
    transition: { duration: prefersReducedMotion ? 0 : 0.15 },
  } as const;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex h-6 w-6 items-center justify-center rounded-md text-foreground/40 transition-all hover:bg-foreground/8 hover:text-foreground/60"
      aria-label="Copy message"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span key="check" {...iconProps}>
            <IconCheck className="h-3.5 w-3.5 text-green-500" />
          </motion.span>
        ) : (
          <motion.span key="copy" {...iconProps}>
            <IconCopy className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── ChatInitSkeleton ─────────────────────────────────────────────────────────

export function ChatInitSkeleton({ profile }: { profile: ChatProfile | null }) {
  const prefersReducedMotion = useReducedMotion();
  const facts = useMemo(() => buildProfileFacts(profile), [profile]);
  const [factIndex, setFactIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    setFactIndex(Math.floor(Math.random() * facts.length));
  }, [facts]);

  useEffect(() => {
    if (facts.length < 2) return;
    const timer = window.setInterval(() => {
      setFactIndex((current) => {
        let next = current;
        while (next === current) {
          next = Math.floor(Math.random() * facts.length);
        }
        return next;
      });
      setCycleKey((k) => k + 1);
    }, FACT_ROTATION_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [facts]);

  const activeFact =
    facts[factIndex] ?? facts[0] ?? "Loading portfolio insights...";
  const name = profile?.firstName;
  const chips = [75, 60, 68, 52].map((w, index) => ({ w, id: String(index) }));

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 border-b border-foreground/8 px-4 py-3">
        <div className="h-8 w-8 animate-pulse rounded-full bg-foreground/12" />
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-28 animate-pulse rounded-full bg-foreground/12" />
          <div className="h-2 w-20 animate-pulse rounded-full bg-foreground/8" />
        </div>
        <div className="ml-auto h-5 w-14 animate-pulse rounded-full bg-foreground/8" />
      </div>

      {/* Fact card */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <IconSparkles className="h-5 w-5" />
        </div>
        {name ? (
          <p className="text-sm font-medium text-foreground/80">
            Loading chat with {name}
          </p>
        ) : (
          <p className="text-sm font-medium text-foreground/80">
            Loading assistant
          </p>
        )}
        <motion.p
          key={cycleKey}
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 4 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          className="max-w-xs text-center text-xs text-muted-foreground"
        >
          {activeFact}
        </motion.p>
        <div className="flex flex-wrap justify-center gap-2">
          {chips.map(({ w, id }) => (
            <div
              key={id}
              className="h-6 animate-pulse rounded-full bg-foreground/8"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
