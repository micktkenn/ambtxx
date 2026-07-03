import { cn } from "./cn";

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger";

const tones: Record<BadgeTone, string> = {
  neutral: "border-slate-200 bg-slate-100 text-slate-600",
  primary: "border-blue-200 bg-amlbt-primary-soft text-amlbt-primary-dark",
  success: "border-green-200 bg-amlbt-success-soft text-amlbt-success",
  warning: "border-orange-200 bg-amlbt-warning-soft text-amlbt-warning",
  danger: "border-red-200 bg-amlbt-danger-soft text-amlbt-danger"
};

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: BadgeTone; className?: string }) {
  return <span className={cn("inline-flex h-6 items-center rounded-full border px-2 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}
