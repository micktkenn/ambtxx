import { Button } from "./button";
import { Card } from "./card";

export function ConfirmDialogMock({ title, description, dangerLabel = "Confirm", safeLabel = "Cancel" }: { title: string; description: string; dangerLabel?: string; safeLabel?: string }) {
  return (
    <Card className="border-red-200 bg-amlbt-danger-soft">
      <h3 className="font-semibold text-amlbt-danger">{title}</h3>
      <p className="mt-1 text-sm text-red-700">{description}</p>
      <div className="mt-4 flex gap-2">
        <Button variant="secondary">{safeLabel}</Button>
        <Button variant="danger">{dangerLabel}</Button>
      </div>
    </Card>
  );
}
