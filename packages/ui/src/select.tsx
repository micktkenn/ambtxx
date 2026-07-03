import type { SelectHTMLAttributes } from "react";
import { cn } from "./cn";

export function Select({ label, className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs font-semibold text-amlbt-text-muted">{label}</span> : null}
      <select className={cn("h-11 w-full rounded-xl border border-amlbt-border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-amlbt-primary", className)} {...props}>
        {children}
      </select>
    </label>
  );
}
