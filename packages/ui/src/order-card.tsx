import type { Order, User } from "@amlbt/types";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import { StatusBadge } from "./status-badge";

export function OrderCard({ order, counterparty }: { order: Order; counterparty?: User }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Badge tone={order.side === "buy" ? "primary" : "success"}>{order.side === "buy" ? "Buy" : "Sell"} {order.asset}</Badge>
        <StatusBadge status={order.status} />
      </div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="font-semibold">#{order.id}</div>
          <div className="font-bold">{order.assetAmount} {order.asset}</div>
        </div>
        <div className="text-sm text-amlbt-text-muted">{counterparty?.username ?? "Counterparty"} · {order.fiatAmount.toLocaleString()} {order.fiat}</div>
      </div>
      {order.status === "payment_pending" ? <div className="rounded-xl border border-orange-200 bg-amlbt-warning-soft p-2 text-xs font-semibold text-amlbt-warning">Action required: payment timer active</div> : null}
      <Button className="w-full">Open trade room</Button>
    </Card>
  );
}
