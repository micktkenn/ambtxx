import * as React from "react";
import { cn } from "./cn";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-card border border-amlbt-border bg-white p-4 shadow-card", className)} {...props} />;
}

export function SoftCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-card border border-amlbt-border-soft bg-amlbt-muted p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-sm font-semibold text-amlbt-text", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-amlbt-text-muted", className)} {...props} />;
}
