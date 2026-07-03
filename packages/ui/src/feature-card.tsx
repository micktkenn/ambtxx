import { Card } from "./card";
import { StatusBadge } from "./status-badge";

export function FeatureCard({ icon, title, description, status }: { icon: string; title: string; description: string; status?: string }) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amlbt-primary-soft text-lg">{icon}</div>
        {status ? <StatusBadge status={status} /> : null}
      </div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-amlbt-text-muted">{description}</p>
    </Card>
  );
}
