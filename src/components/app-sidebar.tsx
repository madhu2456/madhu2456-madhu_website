import { Suspense } from "react";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { ChatSidebarSection } from "./chat/ChatSidebarSection";

const CHAT_PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
    firstName,
    lastName
  }`);

function SidebarSkeleton() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-foreground/10">
        <div className="w-7 h-7 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-3.5 w-28 rounded-full bg-foreground/15 animate-pulse" />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
        <div className="h-4 w-3/4 rounded-full bg-foreground/15 animate-pulse" />
        <div className="h-4 w-1/2 rounded-full bg-foreground/15 animate-pulse" />
        <p className="text-xs text-foreground/40 mt-2">Loading…</p>
      </div>
      <div className="flex flex-col gap-2 px-4 pb-2">
        {[80, 65, 72, 60].map((w, i) => (
          <div
            key={i}
            className="h-10 rounded-xl bg-foreground/10 animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
      <div className="px-4 pb-4 pt-2">
        <div className="h-11 w-full rounded-xl bg-foreground/10 animate-pulse" />
      </div>
    </div>
  );
}

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: profile } = await sanityFetch({ query: CHAT_PROFILE_QUERY });

  return (
    <Sidebar {...props}>
      <SidebarContent className="h-full w-full">
        <Suspense fallback={<SidebarSkeleton />}>
          <ChatSidebarSection profile={profile} />
        </Suspense>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
