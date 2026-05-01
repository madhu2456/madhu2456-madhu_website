"use client";

import { useEffect } from "react";

export default function PortfolioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-8 text-center bg-card/50 rounded-2xl border border-dashed border-muted-foreground/20 m-6">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red-500"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2">Section Failed to Load</h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        We encountered a problem rendering this part of your portfolio. This is
        usually due to missing or malformed data.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all font-medium shadow-lg shadow-primary/20"
      >
        Try Refreshing Section
      </button>
    </div>
  );
}
