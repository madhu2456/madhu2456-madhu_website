import { IconHome } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background px-6 py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.12),transparent_45%)]" />

      <div className="relative container mx-auto max-w-3xl">
        <div className="rounded-2xl border bg-card/95 backdrop-blur p-8 md:p-12 text-center shadow-sm space-y-8">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-primary">
              404
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Page not found
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              The page you are looking for does not exist or may have been
              moved.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Button asChild size="lg">
              <a href="/" aria-label="Go back to homepage">
                <IconHome className="size-4" />
                Back to home
              </a>
            </Button>

            <Button asChild variant="outline" size="lg">
              <a href="/case-studies" aria-label="Go to case studies">
                View case studies
              </a>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
