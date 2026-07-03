import { cn } from "./cn";

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span className={cn("inline-grid h-9 w-9 shrink-0 place-items-center rounded-full border border-blue-200 bg-amlbt-primary-soft text-xs font-bold text-amlbt-primary-dark", className)}>
      {initials}
    </span>
  );
}
