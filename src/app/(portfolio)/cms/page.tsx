import type { Metadata } from "next";
import { CmsEditor } from "@/components/cms/CmsEditor";

export const metadata: Metadata = {
  title: "Local CMS",
  description: "Local content manager for portfolio sections.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CmsPage() {
  return (
    <main className="min-h-screen bg-muted/20 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-xl border bg-card p-6">
          <h1 className="text-3xl font-bold md:text-4xl">
            Local Portfolio CMS
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            This editor updates your portfolio content source directly and
            triggers route revalidation.
          </p>
        </header>

        <CmsEditor />
      </div>
    </main>
  );
}
