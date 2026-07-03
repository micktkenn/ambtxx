import type { TextareaHTMLAttributes } from "react";
import { cn } from "./cn";

export function Textarea({ label, className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <label className="block space-y-1">
      {label ? <span className="text-xs font-semibold text-amlbt-text-muted">{label}</span> : null}
      <textarea className={cn("min-h-28 w-full rounded-xl border border-amlbt-border bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amlbt-primary", className)} {...props} />
    </label>
  );
}
