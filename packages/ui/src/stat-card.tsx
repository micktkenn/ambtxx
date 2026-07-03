import { Card } from "./card";

export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <Card className="space-y-1">
      <div className="text-xs font-semibold text-amlbt-text-muted">{label}</div>
      <div className="text-2xl font-bold tracking-tight text-amlbt-text">{value}</div>
      {hint ? <div className="text-xs text-amlbt-text-muted">{hint}</div> : null}
    </Card>
  );
}
