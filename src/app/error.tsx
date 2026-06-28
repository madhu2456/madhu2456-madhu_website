"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        An unexpected error occurred.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
        <button
          type="button"
          onClick={() => (window.location.href = "/")}
          className="px-4 py-2 border rounded-lg hover:bg-accent transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
