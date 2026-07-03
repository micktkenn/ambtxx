export function LoadingState({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => <div key={index} className="h-16 animate-pulse rounded-card border border-amlbt-border bg-white" />)}
    </div>
  );
}
