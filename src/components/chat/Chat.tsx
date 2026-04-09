"use client";

import { IconX } from "@tabler/icons-react";
import { ChatKit } from "@openai/chatkit-react";
import { useChat } from "./ChatProvider";

function ChatInitSkeleton({ name }: { name?: string }) {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10">
        <div className="w-7 h-7 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-3.5 w-28 rounded-full bg-foreground/15 animate-pulse" />
      </div>

      {/* Greeting area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
        <div className="h-4 w-3/4 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-4 w-1/2 rounded-full bg-foreground/15 animate-pulse" />
        <p className="text-xs text-foreground/40 mt-2">
          {name ? `Connecting to ${name}'s AI…` : "Connecting…"}
        </p>
      </div>

      {/* Prompt chips */}
      <div className="flex flex-col gap-2 px-4 pb-2">
        {[80, 65, 72, 60].map((w, i) => (
          <div
            key={i}
            className="h-10 rounded-xl bg-foreground/10 animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>

      {/* Composer */}
      <div className="px-4 pb-4 pt-2">
        <div className="h-11 w-full rounded-xl bg-foreground/10 animate-pulse" />
      </div>
    </div>
  );
}

export function Chat({
  name,
}: {
  name?: string;
}) {
  const { control, isReady, sessionError } = useChat();

  return (
    <div className="relative h-full w-full">
      {/* Skeleton overlays on top until ChatKit signals it's ready */}
      {!isReady && (
        <div className="absolute inset-0 z-10">
          <ChatInitSkeleton name={name} />
        </div>
      )}

      {sessionError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-6 text-center bg-background/95 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <IconX className="w-6 h-6 text-destructive" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Connection Issue</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I couldn't start the chat session. This usually happens due to a network glitch or configuration limit.
            </p>
            {sessionError && (
              <p className="text-[10px] font-mono text-muted-foreground/50 bg-muted p-2 rounded break-all">
                {sessionError}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Always mounted so ChatKit can initialise properly */}
      <ChatKit control={control} className="h-full w-full z-50" />
    </div>
  );
}

export default Chat;
