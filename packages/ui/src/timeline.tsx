export type TimelineItem = { id: string; label: string; description: string; createdAt: string };

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[20px_1fr] gap-3">
          <span className="mt-1 h-3 w-3 rounded-full bg-amlbt-primary ring-4 ring-amlbt-primary-soft" />
          <div>
            <div className="text-sm font-semibold">{item.label}</div>
            <div className="text-xs text-amlbt-text-muted">{item.description}</div>
            <div className="mt-1 text-[11px] text-amlbt-text-muted">{item.createdAt}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
