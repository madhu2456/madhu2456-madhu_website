function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div
        role="status"
        aria-label="Loading"
        className="h-10 w-10 animate-spin rounded-full border border-border border-t-primary"
      />
    </div>
  );
}

export default Loading;
