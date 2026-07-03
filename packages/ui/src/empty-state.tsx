import { Button } from "./button";
import { Card } from "./card";

export function EmptyState({ icon = "○", title, description, actionLabel }: { icon?: string; title: string; description: string; actionLabel?: string }) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-amlbt-primary-soft text-xl">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-amlbt-text-muted">{description}</p>
      {actionLabel ? <Button className="mt-4">{actionLabel}</Button> : null}
    </Card>
  );
}
