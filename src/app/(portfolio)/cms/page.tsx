import { IconLock, IconTerminal2 } from "@tabler/icons-react";
import type { Metadata } from "next";
import { CmsEditor } from "@/components/cms/CmsEditor";

export const metadata: Metadata = {
  title: "Local CMS Manager | AI & Analytics Portfolio",
  description:
    "Advanced local content management system for Madhu Dadi's AI & Analytics Portfolio. Securely edit profiles, projects, skills, and professional site settings.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CmsPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 md:px-8 md:py-12 selection:bg-primary/30">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="relative overflow-hidden rounded-2xl border border-foreground/5 bg-card/30 p-8 backdrop-blur-md">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-primary/5 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-primary">
                <IconTerminal2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.3em]">
                  Control Center
                </span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter md:text-5xl">
                Portfolio <span className="text-primary">CMS</span>
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                Manage your professional identity. Updates made here are
                persisted to your local data store and reflected site-wide
                instantly.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start rounded-xl border border-foreground/5 bg-foreground/5 px-4 py-2 md:self-center">
              <IconLock className="h-4 w-4 text-muted-foreground" />
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Local Environment Only
              </div>
            </div>
          </div>
        </header>

        <CmsEditor />
      </div>
    </main>
  );
}
