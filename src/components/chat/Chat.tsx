"use client";

import { IconArrowDown, IconLoader2, IconSend2, IconSparkles, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChatProfile } from "./chat-profile";
import type { ChatMessage } from "./chat-types";
import { MessageBubble } from "./chat-message";
import { ChatInitSkeleton, TypingDots } from "./chat-ui";
import { useSidebar } from "@/components/ui/sidebar";

const TYPEWRITER_TICK_MS = 12;
const TYPEWRITER_MAX_CHARS = 520;

type ChatApiResponse = {
  reply?: string;
  blocked?: boolean;
  suggestedPrompts?: string[];
  error?: string;
};

const STARTER_PROMPTS = [
  "Who are you?",
  "What's your experience?",
  "What projects have you built?",
  "What skills do you specialize in?",
];

const createId = () => `${Date.now().toString(36)}-${crypto.randomUUID()}`;

export function Chat({ profile }: { profile: ChatProfile | null }) {
  const displayName = useMemo(
    () => [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Madhu",
    [profile],
  );

  const { toggleSidebar } = useSidebar();

  const [booting, setBooting] = useState(true);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: "assistant",
      text: `Hi! I\u2019m ${displayName}. Ask me anything about my profile, projects, experience, skills, or services.`,
      suggestions: STARTER_PROMPTS,
    },
  ]);

  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [streamedText, setStreamedText] = useState("");
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const isAtBottomRef = useRef(true);

  useEffect(() => {
    const t = window.setTimeout(() => setBooting(false), 600);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isAtBottomRef.current) return;
    const el = viewportRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streamedText, sending]);

  const handleScroll = () => {
    const el = viewportRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 90;
    isAtBottomRef.current = near;
    setShowScrollBtn(!near);
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  const startTypewriter = useCallback(
    (fullText: string, msgId: string, suggestions: string[]) => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
      setStreamingId(msgId);
      setStreamedText("");

      if (fullText.length > TYPEWRITER_MAX_CHARS) {
        setStreamedText(fullText);
        setStreamingId(null);
        setMessages((p) => p.map((m) => (m.id === msgId ? { ...m, suggestions } : m)));
        return;
      }

      const step = Math.max(1, Math.ceil(fullText.length / 80));
      let idx = 0;
      typewriterRef.current = setInterval(() => {
        idx += step;
        setStreamedText(fullText.slice(0, idx));
        if (idx >= fullText.length) {
          clearInterval(typewriterRef.current!);
          typewriterRef.current = null;
          setStreamedText(fullText);
          setStreamingId(null);
          setMessages((p) => p.map((m) => (m.id === msgId ? { ...m, suggestions } : m)));
        }
      }, TYPEWRITER_TICK_MS);
    },
    [],
  );

  const sendMessage = async (directMessage?: string) => {
    const text = (directMessage ?? input).trim();
    if (!text || sending) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setSending(true);
    isAtBottomRef.current = true;

    const userMsg: ChatMessage = { id: createId(), role: "user", text };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    const history = nextMessages.slice(-12).map((m) => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ message: text, history }),
      });
      const payload = (await res.json()) as ChatApiResponse;
      if (!res.ok) throw new Error(payload.error || "Failed to get a response.");

      const reply =
        typeof payload.reply === "string" && payload.reply.trim()
          ? payload.reply.trim()
          : "I don\u2019t have that detail documented right now.";
      const suggestions = Array.isArray(payload.suggestedPrompts)
        ? payload.suggestedPrompts.filter((s): s is string => typeof s === "string").slice(0, 3)
        : [];

      const newId = createId();
      setMessages((p) => [...p, { id: newId, role: "assistant", text: reply, suggestions: [] }]);
      startTypewriter(reply, newId, suggestions);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "I couldn\u2019t answer right now. Please try again.";
      setMessages((p) => [...p, { id: createId(), role: "assistant", text: msg }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence>
        {booting && (
          <motion.div className="absolute inset-0 z-10" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <ChatInitSkeleton profile={profile} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex h-full w-full flex-col bg-background">
        {/* Header */}
        <div className="flex shrink-0 items-center gap-3 border-b border-foreground/8 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconSparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold leading-none">
              Chat with {profile?.firstName || "Me"}
            </p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">AI &middot; Agentic RAG</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                Live
              </span>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Close chat"
              className="flex h-7 w-7 items-center justify-center rounded-full text-foreground/40 transition-all hover:bg-foreground/8 hover:text-foreground"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={viewportRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-5">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isStreaming={msg.id === streamingId}
                  streamedText={streamedText}
                  sending={sending}
                  onSuggestionClick={(s: string) => { sendMessage(s).catch(() => undefined); }}
                />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {sending && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-end gap-2"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <IconSparkles className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-[4px] border border-foreground/8 bg-muted/40 px-4 py-3">
                    <TypingDots />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll-to-bottom */}
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.75 }}
              transition={{ duration: 0.15 }}
              type="button"
              onClick={() =>
                viewportRef.current?.scrollTo({
                  top: viewportRef.current.scrollHeight,
                  behavior: "smooth",
                })
              }
              className="absolute bottom-[76px] right-4 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-foreground/12 bg-background shadow-md text-foreground/50 hover:text-foreground transition-colors"
            >
              <IconArrowDown className="h-3.5 w-3.5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Input */}
        <div className="shrink-0 border-t border-foreground/8 px-3 pb-4 pt-3">
          <div className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                resizeTextarea();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder="Ask about experience, projects, skills\u2026"
              rows={1}
              disabled={sending}
              className="w-full resize-none rounded-xl border border-foreground/12 bg-background px-3.5 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground/60 outline-none transition-shadow focus:border-foreground/20 focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ minHeight: "44px", maxHeight: "160px" }}
            />
            <button
              type="button"
              onClick={() => void sendMessage()}
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {sending ? (
                <IconLoader2 className="h-4 w-4 animate-spin" />
              ) : (
                <IconSend2 className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-muted-foreground/55">
            Enter to send &middot; Shift+Enter for new line &middot; Portfolio facts only
          </p>
        </div>
      </div>
    </div>
  );
}

export default Chat;
