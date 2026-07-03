import * as React from "react";
import { cn } from "./cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
};

export function Input({ label, helper, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <label className="block space-y-1" htmlFor={inputId}>
      {label ? <span className="text-xs font-semibold text-amlbt-text-muted">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          "h-11 w-full rounded-xl border border-amlbt-border bg-white px-3 text-sm outline-none transition placeholder:text-slate-400",
          "focus:border-amlbt-primary focus:ring-2 focus:ring-amlbt-primary-soft",
          error && "border-amlbt-danger",
          className
        )}
        {...props}
      />
      {helper ? <span className="text-xs text-amlbt-text-muted">{helper}</span> : null}
      {error ? <span className="text-xs font-medium text-amlbt-danger">{error}</span> : null}
    </label>
  );
}
