import type { Ad, User } from "@amlbt/types";
import { Avatar } from "./avatar";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card } from "./card";
import { StatusBadge } from "./status-badge";

export function OfferCard({ ad, trader }: { ad: Ad; trader?: User }) {
  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar initials={trader?.avatarInitials ?? "TR"} />
          <div>
            <div className="font-semibold">{trader?.username ?? "Trader"}</div>
            <div className="text-xs text-amlbt-text-muted">{trader?.completedTrades ?? 0} trades · {trader?.completionRate ?? 0}% complete</div>
          </div>
        </div>
        <StatusBadge status={trader?.kycStatus === "approved" ? "approved" : "review"} />
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs text-amlbt-text-muted">Price</div>
          <div className="text-lg font-bold">{ad.price.toFixed(2)} {ad.fiat} / {ad.asset}</div>
        </div>
        <Badge tone={ad.side === "sell" ? "primary" : "success"}>{ad.side === "sell" ? "Buy" : "Sell"}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-2">
          <div className="text-amlbt-text-muted">Available</div>
          <div className="font-semibold">{ad.availableAmount} {ad.asset}</div>
        </div>
        <div className="rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-2">
          <div className="text-amlbt-text-muted">Limits</div>
          <div className="font-semibold">{ad.minFiat}–{ad.maxFiat} {ad.fiat}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {ad.paymentMethods.map((method) => <Badge key={method}>{method}</Badge>)}
      </div>
      <Button className="w-full">{ad.side === "sell" ? `Buy ${ad.asset}` : `Sell ${ad.asset}`}</Button>
    </Card>
  );
}
