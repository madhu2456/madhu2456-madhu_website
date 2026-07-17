"use client";

import { IconExternalLink, IconSparkles } from "@tabler/icons-react";
import { motion, useReducedMotion } from "motion/react";
import { trackChatInteraction } from "@/lib/gtm";
import type { ChatMessage, ChatSourceRef } from "./chat-types";
import { CopyButton, MarkdownText } from "./chat-ui";

export type { ChatMessage };

type Props = {
  msg: ChatMessage;
  isStreaming: boolean;
  streamedText: string;
  sending: boolean;
  onSuggestionClick: (text: string) => void;
};

const trackSourceClick = (source: ChatSourceRef) => {
  let path = source.url;
  try {
    path = new URL(source.url).pathname;
  } catch {
    // keep raw allowlisted url
  }
  trackChatInteraction("click_source", {
    source_id: source.id,
    source_section: source.section,
    source_n: source.n,
    source_path: path,
    // never: full prompt, reply body, or raw titles if sensitive — title is public CMS
  });
};

export function MessageBubble({
  msg,
  isStreaming,
  streamedText,
  sending,
  onSuggestionClick,
}: Props) {
  const prefersReducedMotion = useReducedMotion();
  const isUser = msg.role === "user";
  const displayText = isStreaming ? streamedText : msg.text;
  const suggestionCounts = new Map<string, number>();
  const sources = msg.sources ?? [];

  return (
    <motion.div
      key={msg.id}
      initial={
        prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: 0.98 }
      }
      animate={
        prefersReducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }
      }
      transition={{
        duration: prefersReducedMotion ? 0 : 0.22,
        ease: "easeOut",
      }}
      className="space-y-2"
    >
      {/* Bubble row */}
      <div
        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
      >
        {!isUser && (
          <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconSparkles className="h-3.5 w-3.5" />
          </div>
        )}

        <div
          className={`group relative ${isUser ? "max-w-[82%]" : "max-w-[88%] flex-1"}`}
        >
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isUser
                ? "rounded-br-[4px] border border-primary/20 bg-primary/10 text-foreground"
                : "rounded-bl-[4px] border border-foreground/8 bg-muted/40 text-foreground/95"
            }`}
          >
            {isUser ? (
              <span className="whitespace-pre-wrap leading-relaxed">
                {displayText}
              </span>
            ) : (
              <>
                <MarkdownText
                  text={displayText || "\u00a0"}
                  sources={sources}
                  onCiteClick={trackSourceClick}
                />
                {isStreaming && (
                  <motion.span
                    animate={
                      prefersReducedMotion
                        ? { opacity: 1 }
                        : { opacity: [1, 0] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 0.5,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          }
                    }
                    className="ml-0.5 inline-block h-3.5 w-[2px] rounded-full bg-foreground/50 align-middle"
                  />
                )}
              </>
            )}
          </div>

          {!isUser && !isStreaming && displayText && (
            <div className="absolute -bottom-1.5 right-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <CopyButton text={displayText} />
            </div>
          )}
        </div>
      </div>

      {!isUser && !isStreaming && sources.length > 0 && (
        <nav
          className="ml-8 space-y-1.5"
          aria-label="Sources used for this answer"
        >
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/70">
            Sources
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {sources.map((source, idx) => (
              <motion.li
                key={`${msg.id}-src-${source.id}`}
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, y: 4 }
                }
                animate={
                  prefersReducedMotion ? undefined : { opacity: 1, y: 0 }
                }
                transition={{
                  delay: prefersReducedMotion ? 0 : idx * 0.04,
                  duration: prefersReducedMotion ? 0 : 0.16,
                }}
              >
                <a
                  href={source.url}
                  onClick={() => trackSourceClick(source)}
                  className="inline-flex max-w-full items-center gap-1 rounded-full border border-foreground/10 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground/70 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-foreground"
                  title={`${source.section}: ${source.title}`}
                >
                  <span className="tabular-nums text-primary/80">
                    [{source.n}]
                  </span>
                  <span className="truncate">{source.title}</span>
                  <IconExternalLink
                    className="h-3 w-3 shrink-0 opacity-50"
                    aria-hidden
                  />
                  <span className="sr-only">
                    {` Open ${source.title} (${source.section})`}
                  </span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
      )}

      {!isUser && !isStreaming && (msg.suggestions?.length ?? 0) > 0 && (
        <div className="ml-8 flex flex-wrap gap-1.5">
          {msg.suggestions?.map((s, idx) => {
            const occurrence = suggestionCounts.get(s) ?? 0;
            suggestionCounts.set(s, occurrence + 1);

            return (
              <motion.button
                key={`${msg.id}-${s}-${occurrence}`}
                type="button"
                initial={
                  prefersReducedMotion ? undefined : { opacity: 0, scale: 0.88 }
                }
                animate={
                  prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }
                }
                transition={{
                  delay: prefersReducedMotion ? 0 : idx * 0.06,
                  duration: prefersReducedMotion ? 0 : 0.18,
                  ease: "easeOut",
                }}
                onClick={() => onSuggestionClick(s)}
                disabled={sending}
                className="rounded-full border border-foreground/12 bg-background px-3 py-1.5 text-xs font-medium text-foreground/65 transition-all hover:border-primary/35 hover:bg-primary/6 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              >
                {s}
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
