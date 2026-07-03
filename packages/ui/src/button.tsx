import * as React from "react";
import { cn } from "./cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "warning";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-amlbt-primary bg-amlbt-primary text-white hover:bg-amlbt-primary-dark",
  secondary: "border-amlbt-border bg-white text-amlbt-primary-dark hover:bg-amlbt-primary-soft",
  ghost: "border-transparent bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "border-amlbt-danger bg-amlbt-danger text-white hover:bg-red-700",
  warning: "border-amlbt-warning bg-amlbt-warning text-white hover:bg-amber-700"
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm"
};

export function Button({ className, variant = "primary", size = "md", isLoading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amlbt-primary focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
