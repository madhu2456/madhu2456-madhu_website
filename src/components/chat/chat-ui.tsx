"use client";

import { IconCheck, IconCopy, IconSparkles } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import type { ChatProfile } from "./chat-profile";
import { buildProfileFacts } from "./profile-facts";

const FACT_ROTATION_INTERVAL_MS = 2600;

// ─── Inline Markdown ──────────────────────────────────────────────────────────

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\bhttps?:\/\/\S+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (/^https?:\/\//.test(part)) {
          return (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 opacity-90 hover:opacity-60 transition-opacity"
            >
              {part}
            </a>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function MarkdownText({ text }: { text: string }) {
  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1.5" />;
        if (/^[-*]\s/.test(line)) {
          return (
            <div key={i} className="flex items-start gap-2">
              <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
              <span className="leading-relaxed">
                <InlineMarkdown text={line.replace(/^[-*]\s/, "")} />
              </span>
            </div>
          );
        }
        return (
          <p key={i} className="leading-relaxed">
            <InlineMarkdown text={line} />
          </p>
        );
      })}
    </div>
  );
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────

export function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block h-2 w-2 rounded-full bg-foreground/35"
          animate={{ y: [0, -5, 0], opacity: [0.35, 1, 0.35] }}
          transition={{
            duration: 0.75,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Copy Button ──────────────────────────────────────────────────────────────

export function CopyButton({ text }: { text: string }) {
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

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex h-6 w-6 items-center justify-center rounded-md text-foreground/25 transition-all hover:bg-foreground/8 hover:text-foreground/60"
      aria-label="Copy message"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <IconCheck className="h-3.5 w-3.5 text-green-500" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <IconCopy className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ─── ChatInitSkeleton ─────────────────────────────────────────────────────────

export function ChatInitSkeleton({ profile }: { profile: ChatProfile | null }) {
  const facts = useMemo(() => buildProfileFacts(profile), [profile]);
  const [factIndex, setFactIndex] = useState(() =>
    Math.floor(Math.random() * facts.length),
  );
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
        <div className="w-full max-w-xs overflow-hidden rounded-2xl border border-primary/15 bg-primary/5 p-4">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/60">
            <IconSparkles className="h-3 w-3" />
            Did you know?
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={cycleKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mt-2 text-sm leading-relaxed text-foreground/80"
            >
              {activeFact}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="text-xs text-foreground/35">
          {name ? `Connecting to ${name}'s AI\u2026` : "Connecting\u2026"}
        </p>
      </div>

      {/* Skeleton prompt chips */}
      <div className="flex flex-col gap-2 px-4 pb-3">
        {[75, 60, 68, 52].map((w, i) => (
          <div
            key={i}
            className="h-9 animate-pulse rounded-xl bg-foreground/8"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>

      {/* Skeleton input */}
      <div className="border-t border-foreground/8 px-4 py-3">
        <div className="h-11 w-full animate-pulse rounded-xl bg-foreground/8" />
      </div>
    </div>
  );
}
