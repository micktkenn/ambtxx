import { Badge } from "./badge";

const labels: Record<string, string> = {
  active: "Active",
  paused: "Paused",
  draft: "Draft",
  pending: "Pending",
  payment_pending: "Payment pending",
  marked_paid: "Marked paid",
  escrow_funded: "Escrow funded",
  released: "Released",
  completed: "Completed",
  cancelled: "Cancelled",
  disputed: "Disputed",
  frozen: "Frozen",
  review: "Review",
  requires_review: "Review",
  connected: "Connected",
  healthy: "Healthy",
  error: "Error",
  setup_required: "Setup required",
  open: "Open",
  waiting_for_evidence: "Evidence needed",
  under_review: "Under review",
  resolved: "Resolved",
  escalated: "Escalated",
  restricted: "Restricted",
  approved: "Approved",
  rejected: "Rejected",
  not_started: "Not started",
  success: "Success",
  failed: "Failed",
  scheduled: "Scheduled",
  collected: "Collected",
  estimated: "Estimated",
  waived: "Waived",
  false_positive: "False positive"
};

function toneFor(status: string) {
  if (["active", "completed", "released", "connected", "healthy", "approved", "resolved", "success", "collected"].includes(status)) return "success" as const;
  if (["payment_pending", "marked_paid", "escrow_funded", "setup_required"].includes(status)) return "primary" as const;
  if (["pending", "review", "requires_review", "waiting_for_evidence", "under_review", "paused", "restricted", "scheduled", "estimated"].includes(status)) return "warning" as const;
  if (["disputed", "frozen", "error", "rejected", "escalated", "failed"].includes(status)) return "danger" as const;
  return "neutral" as const;
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge tone={toneFor(status)}>{labels[status] ?? status}</Badge>;
}
