import { cn } from "./cn";

export function Tabs({ items, active }: { items: string[]; active: string }) {
  return (
    <div className="flex gap-2 overflow-x-auto">
      {items.map((item) => <span key={item} className={cn("whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold", active === item ? "border-blue-200 bg-amlbt-primary-soft text-amlbt-primary-dark" : "border-amlbt-border bg-white text-amlbt-text-muted")}>{item}</span>)}
    </div>
  );
}
