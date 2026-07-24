import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { ChatSidebarSection } from "./chat/ChatSidebarSection";

/**
 * Chat shell only — no portfolio data on the initial RSC tree (audit v5).
 * Profile for chat is fetched client-side when the sidebar first opens.
 */
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarContent className="h-full w-full">
        <ChatSidebarSection />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
