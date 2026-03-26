"use client";

import { useUser } from "@clerk/nextjs";
import Chat from "@/components/chat/Chat";

export default function ChatGate({ profile }: { profile: any }) {
  const { isSignedIn, isLoaded } = useUser();

  // wait for auth state
  if (!isLoaded) return null;

  // ❌ DO NOT mount Chat if not signed in
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Please sign in to use the AI chat
      </div>
    );
  }

  return <Chat profile={profile} />;
}
