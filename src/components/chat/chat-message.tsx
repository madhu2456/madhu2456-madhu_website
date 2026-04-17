"use client";

import { IconSparkles } from "@tabler/icons-react";
import { motion } from "motion/react";
import type { ChatMessage } from "./chat-types";
import { CopyButton, MarkdownText } from "./chat-ui";

export type { ChatMessage };

type Props = {
  msg: ChatMessage;
  isStreaming: boolean;
  streamedText: string;
  sending: boolean;
  onSuggestionClick: (text: string) => void;
};

export function MessageBubble({
  msg,
  isStreaming,
  streamedText,
  sending,
  onSuggestionClick,
}: Props) {
  const isUser = msg.role === "user";
  const displayText = isStreaming ? streamedText : msg.text;

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="space-y-2"
    >
      {/* Bubble row */}
      <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
        {/* AI avatar */}
        {!isUser && (
          <div className="mb-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconSparkles className="h-3.5 w-3.5" />
          </div>
        )}

        <div className={`group relative ${isUser ? "max-w-[82%]" : "max-w-[88%] flex-1"}`}>
          <div
            className={`rounded-2xl px-4 py-2.5 text-sm ${
              isUser
                ? "rounded-br-[4px] border border-primary/20 bg-primary/10 text-foreground"
                : "rounded-bl-[4px] border border-foreground/8 bg-muted/40 text-foreground/95"
            }`}
          >
            {isUser ? (
              <span className="whitespace-pre-wrap leading-relaxed">{displayText}</span>
            ) : (
              <>
                <MarkdownText text={displayText || "\u00a0"} />
                {isStreaming && (
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{
                      duration: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="ml-0.5 inline-block h-3.5 w-[2px] rounded-full bg-foreground/50 align-middle"
                  />
                )}
              </>
            )}
          </div>

          {/* Copy on hover — completed AI messages only */}
          {!isUser && !isStreaming && displayText && (
            <div className="absolute -bottom-1.5 right-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <CopyButton text={displayText} />
            </div>
          )}
        </div>
      </div>

      {/* Suggestion chips — staggered in */}
      {!isUser && !isStreaming && (msg.suggestions?.length ?? 0) > 0 && (
        <div className="ml-8 flex flex-wrap gap-1.5">
          {msg.suggestions!.map((s, idx) => (
            <motion.button
              key={`${msg.id}-${s}`}
              type="button"
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06, duration: 0.18, ease: "easeOut" }}
              onClick={() => onSuggestionClick(s)}
              disabled={sending}
              className="rounded-full border border-foreground/12 bg-background px-3 py-1.5 text-xs font-medium text-foreground/65 transition-all hover:border-primary/35 hover:bg-primary/6 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
