import type { OrderStatus } from "@amlbt/types";

export type TradeAction =
  | "fund_escrow"
  | "mark_paid"
  | "seller_review"
  | "prepare_release"
  | "release"
  | "open_dispute"
  | "cancel"
  | "expire"
  | "refund";

export const orderStatusLabels: Record<OrderStatus, string> = {
  created: "Created",
  awaiting_escrow: "Awaiting escrow",
  escrow_funded: "Escrow funded",
  payment_pending: "Payment pending",
  marked_paid: "Marked paid",
  seller_reviewing_payment: "Seller reviewing payment",
  release_pending: "Release pending",
  released: "Released",
  completed: "Completed",
  disputed: "Disputed",
  cancelled: "Cancelled",
  expired: "Expired",
  refunded: "Refunded"
};

export const allowedTransitions: Record<OrderStatus, Partial<Record<TradeAction, OrderStatus>>> = {
  created: { fund_escrow: "escrow_funded", cancel: "cancelled", expire: "expired" },
  awaiting_escrow: { fund_escrow: "escrow_funded", cancel: "cancelled", expire: "expired" },
  escrow_funded: { mark_paid: "marked_paid", cancel: "cancelled", open_dispute: "disputed" },
  payment_pending: { mark_paid: "marked_paid", cancel: "cancelled", open_dispute: "disputed", expire: "expired" },
  marked_paid: { seller_review: "seller_reviewing_payment", prepare_release: "release_pending", open_dispute: "disputed" },
  seller_reviewing_payment: { prepare_release: "release_pending", open_dispute: "disputed" },
  release_pending: { release: "released", open_dispute: "disputed" },
  released: { release: "completed" },
  completed: {},
  disputed: { refund: "refunded", release: "released" },
  cancelled: {},
  expired: { refund: "refunded" },
  refunded: {}
};

export function canTransition(status: OrderStatus, action: TradeAction) {
  return Boolean(allowedTransitions[status]?.[action]);
}

export function nextStatus(status: OrderStatus, action: TradeAction) {
  return allowedTransitions[status]?.[action] ?? status;
}

export function requiredVerificationForAction(action: TradeAction) {
  if (["release", "refund"].includes(action)) return ["totp", "wallet_signature"];
  if (["open_dispute", "prepare_release"].includes(action)) return ["active_session"];
  return ["active_session"];
}
