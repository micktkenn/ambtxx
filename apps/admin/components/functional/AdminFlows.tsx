"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  adminDashboard as seedDashboard,
  adminRoles as seedRoles,
  ads as seedAds,
  assets as seedAssets,
  auditLogs as seedAuditLogs,
  contentBanners as seedContent,
  disputes as seedDisputes,
  feeRules as seedFeeRules,
  feeTransactions as seedFeeTransactions,
  integrations as seedIntegrations,
  kycCases as seedKycCases,
  networks as seedNetworks,
  notificationTemplates as seedTemplates,
  orders as seedOrders,
  paymentMethods as seedPaymentMethods,
  riskFlags as seedRiskFlags,
  riskRules as seedRiskRules,
  supportTickets as seedSupportTickets,
  systemSettings as seedSystemSettings,
  users as seedUsers
} from "@amlbt/mock-data";
import { getSnapshotModeLabel, loadSnapshot, resetSnapshot, saveSnapshot, recordAdminActivity, updatePersistentProfileStatus, scheduleAdminStateTableSync } from "@amlbt/supabase";
import { Badge, Button, Card, DataTable, Input, Select, SoftCard, StatusBadge, Textarea } from "@amlbt/ui";

type Tone = "success" | "warning" | "danger" | "primary" | "neutral";
type AdminLog = { id: string; message: string; tone: Tone; at: string };

type AdminState = {
  users: typeof seedUsers;
  orders: typeof seedOrders;
  disputes: typeof seedDisputes;
  ads: typeof seedAds;
  kycCases: typeof seedKycCases;
  feeRules: typeof seedFeeRules;
  feeTransactions: typeof seedFeeTransactions;
  assets: typeof seedAssets;
  networks: typeof seedNetworks;
  paymentMethods: typeof seedPaymentMethods;
  integrations: typeof seedIntegrations;
  templates: typeof seedTemplates;
  content: typeof seedContent;
  riskFlags: typeof seedRiskFlags;
  riskRules: typeof seedRiskRules;
  roles: typeof seedRoles;
  auditLogs: typeof seedAuditLogs;
  supportTickets: typeof seedSupportTickets;
  systemSettings: typeof seedSystemSettings;
  dashboard: typeof seedDashboard;
  logs: AdminLog[];
};

const initialAdminState: AdminState = {
  users: seedUsers.map((x) => ({ ...x })),
  orders: seedOrders.map((x) => ({ ...x })),
  disputes: seedDisputes.map((x) => ({ ...x })),
  ads: seedAds.map((x) => ({ ...x })),
  kycCases: seedKycCases.map((x) => ({ ...x })),
  feeRules: seedFeeRules.map((x) => ({ ...x })),
  feeTransactions: seedFeeTransactions.map((x) => ({ ...x })),
  assets: seedAssets.map((x) => ({ ...x })),
  networks: seedNetworks.map((x) => ({ ...x })),
  paymentMethods: seedPaymentMethods.map((x) => ({ ...x })),
  integrations: seedIntegrations.map((x) => ({ ...x })),
  templates: seedTemplates.map((x) => ({ ...x })),
  content: seedContent.map((x) => ({ ...x })),
  riskFlags: seedRiskFlags.map((x) => ({ ...x })),
  riskRules: seedRiskRules.map((x) => ({ ...x })),
  roles: seedRoles.map((x) => ({ ...x })),
  auditLogs: seedAuditLogs.map((x) => ({ ...x })),
  supportTickets: seedSupportTickets.map((x) => ({ ...x })),
  systemSettings: seedSystemSettings.map((x) => ({ ...x })),
  dashboard: seedDashboard,
  logs: []
};

function now() { return new Date().toISOString(); }
function makeId(prefix: string) { return `${prefix}_${Math.random().toString(36).slice(2, 8)}`; }

function useAdminState() {
  const [state, setState] = useState<AdminState>(initialAdminState);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState("loading");
  const [syncError, setSyncError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    loadSnapshot<AdminState>("admin", initialAdminState)
      .then((result) => {
        if (cancelled) return;
        setState({ ...initialAdminState, ...result.data });
        setSource(result.source);
        setSyncError(result.error);
        setReady(true);
      })
      .catch((error) => {
        if (cancelled) return;
        setState(initialAdminState);
        setSource("seed");
        setSyncError(error instanceof Error ? error.message : "Failed to load admin state");
        setReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveSnapshot("admin", state)
      .then((result) => setSource(result.source))
      .catch((error) => {
        setSource("local-storage");
        setSyncError(error instanceof Error ? error.message : "Failed to save admin state");
      });

    // v0.6: auto-sync admin data tables after any admin UI state change.
    // Every freeze/approve/resolve/toggle/publish/test action writes to Supabase tables
    // plus activity_events/admin_audit_logs automatically.
    scheduleAdminStateTableSync(state, (result) => {
      if (result.errors.length) {
        setSyncError(`Table sync warnings: ${result.errors.slice(0, 3).join(" | ")}`);
      }
    });
  }, [ready, state]);

  const log = (message: string, tone: Tone = "success") => {
    setState((prev) => ({ ...prev, logs: [{ id: makeId("log"), message, tone, at: now() }, ...prev.logs].slice(0, 8), auditLogs: [{ id: `AUD-${Math.floor(Math.random() * 9999)}`, adminName: "Super Admin", action: message, targetType: "prototype", targetId: "mock", ipMasked: "196.188.xxx.xxx", createdAt: now(), result: "success" }, ...prev.auditLogs] } as AdminState));
    void recordAdminActivity(message, { targetType: "prototype", targetId: "mock" }, tone);
  };

  const reset = async () => {
    setState(initialAdminState);
    setSyncError(undefined);
    await resetSnapshot("admin", initialAdminState);
    setSource(getSnapshotModeLabel());
  };

  return { state, setState, log, reset, source, syncError };
}

function AdminFlowShell({ children, logs, source, syncError }: { children: ReactNode; logs: AdminLog[]; reset: () => void | Promise<void>; source?: string; syncError?: string }) {
  return <div className="space-y-4">{children}<Card className="border-blue-100 bg-amlbt-primary-soft/40"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><div><h3 className="font-semibold">Admin live action persistence</h3><p className="text-sm text-amlbt-text-muted">Data source: <span className="font-semibold">{source ?? getSnapshotModeLabel()}</span>. Admin actions are automatically logged to Supabase activity events and audit logs when env vars are configured.</p>{syncError ? <p className="mt-1 text-sm text-red-700">Supabase sync fallback: {syncError}</p> : null}</div></div><div className="mt-3 grid gap-2">{logs.length ? logs.map((log) => <div key={log.id} className="rounded-xl border border-amlbt-border-soft bg-white p-2 text-sm"><Badge tone={log.tone}>{log.tone}</Badge><span className="ml-2">{log.message}</span></div>) : <p className="text-sm text-amlbt-text-muted">No admin action yet.</p>}</div></Card></div>;
}

function userFor(id: string) { return seedUsers.find((u) => u.id === id) ?? seedUsers[0]; }

export function AdminLoginFlow() {
  const { state, log, reset, source, syncError } = useAdminState();
  const [step, setStep] = useState<"login" | "2fa" | "done">("login");
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="mx-auto max-w-lg"><Card className="space-y-3"><h2 className="text-2xl font-black">Admin login</h2><p className="text-sm text-amlbt-text-muted">Admin access requires password and 2FA. All actions are logged.</p><Input label="Admin email" defaultValue="admin@amlbt.mock" /><Input label="Password" type="password" defaultValue="secure-admin-password" />{step !== "login" ? <Input label="2FA code" defaultValue="482190" /> : null}<Button className="w-full" onClick={() => { if (step === "login") { setStep("2fa"); log("Admin password accepted. 2FA challenge required.", "warning"); } else { setStep("done"); log("Admin 2FA verified. Session active."); } }}>{step === "login" ? "Continue" : step === "2fa" ? "Verify 2FA" : "Logged in"}</Button>{step === "done" ? <Link href="/dashboard"><Button variant="secondary" className="w-full">Open dashboard</Button></Link> : null}</Card></div></AdminFlowShell>;
}

export function AdminDashboardFlow() {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"><Metric label="Active users" value={state.users.filter((u) => u.status === "active").length} /><Metric label="Active orders" value={state.orders.filter((o) => !["completed", "cancelled"].includes(o.status)).length} /><Metric label="Open disputes" value={state.disputes.filter((d) => d.status !== "resolved").length} /><Metric label="Pending KYC" value={state.kycCases.filter((k) => k.status === "requires_review" || k.status === "pending").length} /><Metric label="Flagged users" value={state.riskFlags.filter((f) => f.targetType === "user").length} /><Metric label="Active ads" value={state.ads.filter((a) => a.status === "active").length} /><Metric label="Fees collected" value={`${state.feeTransactions.length} tx`} /><Metric label="Integrations" value={state.integrations.filter((i) => i.status === "connected" || i.status === "healthy").length} /></div><div className="mt-4 grid gap-4 lg:grid-cols-2"><Card><h2 className="mb-3 font-semibold">Priority queue</h2><div className="space-y-3">{state.disputes.slice(0, 3).map((d) => <div key={d.id} className="flex items-center justify-between rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div><b>{d.id}</b><p className="text-xs text-amlbt-text-muted">{d.reason} · {d.amount} {d.asset}</p></div><div className="flex gap-2"><StatusBadge status={d.status} /><Button size="sm" onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((item) => item.id === d.id ? { ...item, status: "under_review" } : item) })); log(`${d.id} assigned and moved under review.`, "warning"); }}>Review</Button></div></div>)}</div></Card><Card><h2 className="mb-3 font-semibold">System actions</h2><div className="flex flex-wrap gap-2"><Button onClick={() => log("Manual blockchain resync queued.", "primary")}>Run chain resync</Button><Button variant="secondary" onClick={() => log("Webhook retry job started.", "primary")}>Retry webhooks</Button><Button variant="warning" onClick={() => log("Maintenance banner published.", "warning")}>Publish maintenance banner</Button></div></Card></div></AdminFlowShell>;
}

function Metric({ label, value }: { label: string; value: string | number }) { return <Card><div className="text-3xl font-black">{value}</div><div className="text-sm text-amlbt-text-muted">{label}</div></Card>; }

export function UsersAdminFlow({ userId }: { userId?: string }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  const [query, setQuery] = useState("");
  const rows = state.users.filter((u) => userId ? u.id === userId : `${u.username} ${u.email}`.toLowerCase().includes(query.toLowerCase()));
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}>{!userId ? <Card><div className="mb-3 flex flex-col gap-2 sm:flex-row"><Input placeholder="Search users" value={query} onChange={(e) => setQuery(e.target.value)} /><Select className="sm:max-w-48"><option>All statuses</option><option>Active</option><option>Restricted</option><option>Frozen</option></Select></div><DataTable data={rows} columns={[{ header: "User", render: (u) => <div><b>{u.username}</b><div className="text-xs text-amlbt-text-muted">{u.email}</div></div> }, { header: "KYC", render: (u) => <StatusBadge status={u.kycStatus} /> }, { header: "Risk", render: (u) => <Badge tone={u.riskLevel === "high" ? "danger" : u.riskLevel === "medium" ? "warning" : "neutral"}>{u.riskLevel}</Badge> }, { header: "Status", render: (u) => <StatusBadge status={u.status} /> }, { header: "Actions", render: (u) => <div className="flex flex-wrap gap-2"><Link href={`/users/${u.id}`}><Button size="sm" variant="secondary">Open</Button></Link><Button size="sm" variant="warning" onClick={() => { setState((p) => ({ ...p, users: p.users.map((x) => x.id === u.id ? { ...x, status: "restricted" } : x) })); log(`${u.username} restricted.`, "warning"); }}>Restrict</Button><Button size="sm" variant="danger" onClick={() => { setState((p) => ({ ...p, users: p.users.map((x) => x.id === u.id ? { ...x, status: "frozen" } : x) })); log(`${u.username} frozen.`, "danger"); }}>Freeze</Button></div> }]} /></Card> : rows.map((u) => <Card key={u.id} className="space-y-4"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h2 className="text-2xl font-black">{u.username}</h2><p className="text-sm text-amlbt-text-muted">{u.displayName} · {u.country} · {u.walletAddress}</p></div><StatusBadge status={u.status} /></div><div className="grid gap-3 md:grid-cols-4"><Metric label="Trades" value={u.completedTrades} /><Metric label="Completion" value={`${u.completionRate}%`} /><Metric label="KYC" value={`L${u.kycLevel}`} /><Metric label="Rating" value={u.rating} /></div><div className="flex flex-wrap gap-2"><Button variant="warning" onClick={() => { setState((p) => ({ ...p, users: p.users.map((x) => x.id === u.id ? { ...x, status: "restricted" } : x) })); log(`${u.username} restricted.`); }}>Restrict trading</Button><Button variant="danger" onClick={() => { setState((p) => ({ ...p, users: p.users.map((x) => x.id === u.id ? { ...x, status: "frozen" } : x) })); log(`${u.username} frozen.`, "danger"); }}>Freeze account</Button><Button variant="secondary" onClick={() => log(`2FA reset required for ${u.username}.`, "warning")}>Require 2FA reset</Button><Button variant="secondary" onClick={() => log(`Admin note added for ${u.username}.`, "primary")}>Add note</Button></div></Card>)}</AdminFlowShell>;
}

export function KycAdminFlow({ caseId }: { caseId?: string }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  const cases = caseId ? state.kycCases.filter((c) => c.id === caseId) : state.kycCases;
  const [note, setNote] = useState("");
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="space-y-3">{cases.map((k) => <Card key={k.id} className="space-y-3"><div className="flex items-center justify-between"><div><h3 className="font-semibold">{k.id}</h3><p className="text-sm text-amlbt-text-muted">{userFor(k.userId).username} · requested L{k.requestedLevel} · {k.provider}</p></div><StatusBadge status={k.status} /></div>{caseId ? <div className="grid gap-3 md:grid-cols-3"><SoftCard>Document: <b>{k.documentType ?? "N/A"}</b></SoftCard><SoftCard>Country: <b>{k.country}</b></SoftCard><SoftCard>Risk tags: <b>{k.riskTags.length}</b></SoftCard></div> : null}<Textarea label="Decision note" value={note} onChange={(e) => setNote(e.target.value)} /><div className="flex flex-wrap gap-2"><Button onClick={() => { setState((p) => ({ ...p, kycCases: p.kycCases.map((x) => x.id === k.id ? { ...x, status: "approved" } : x), users: p.users.map((u) => u.id === k.userId ? { ...u, kycStatus: "approved", kycLevel: k.requestedLevel } : u) })); log(`${k.id} approved. ${note}`, "success"); }}>Approve</Button><Button variant="warning" onClick={() => { setState((p) => ({ ...p, kycCases: p.kycCases.map((x) => x.id === k.id ? { ...x, status: "requires_review" } : x) })); log(`${k.id} requested more info.`, "warning"); }}>Request more info</Button><Button variant="danger" onClick={() => { setState((p) => ({ ...p, kycCases: p.kycCases.map((x) => x.id === k.id ? { ...x, status: "rejected" } : x) })); log(`${k.id} rejected.`, "danger"); }}>Reject</Button></div></Card>)}</div></AdminFlowShell>;
}

export function OrdersAdminFlow({ orderId }: { orderId?: string }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  const orders = orderId ? state.orders.filter((o) => o.id === orderId) : state.orders;
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="space-y-3">{orders.map((o) => <Card key={o.id} className="space-y-3"><div className="flex items-center justify-between"><div><h3 className="font-semibold">#{o.id}</h3><p className="text-sm text-amlbt-text-muted">{o.assetAmount} {o.asset} · {o.fiatAmount} {o.fiat} · buyer {userFor(o.buyerId).username} / seller {userFor(o.sellerId).username}</p></div><StatusBadge status={o.status} /></div><div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => log(`#${o.id} flagged for admin review.`, "warning")}>Flag order</Button><Button variant="warning" onClick={() => log(`#${o.id} assigned to moderator.`, "warning")}>Assign moderator</Button><Button variant="danger" onClick={() => { setState((p) => ({ ...p, orders: p.orders.map((x) => x.id === o.id ? { ...x, status: "disputed" } : x) })); log(`#${o.id} escalated to dispute.`, "danger"); }}>Escalate</Button></div></Card>)}</div></AdminFlowShell>;
}

export function DisputesAdminFlow({ disputeId }: { disputeId?: string }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  const disputes = disputeId ? state.disputes.filter((d) => d.id === disputeId) : state.disputes;
  const [note, setNote] = useState("Evidence reviewed. Decision recorded.");
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="space-y-3">{disputes.map((d) => <Card key={d.id} className="space-y-3"><div className="flex items-center justify-between"><div><h3 className="font-semibold">{d.id}</h3><p className="text-sm text-amlbt-text-muted">Order {d.orderId} · {d.reason} · {d.amount} {d.asset}</p></div><StatusBadge status={d.status} /></div>{disputeId ? <div className="grid gap-3 md:grid-cols-3"><SoftCard>Buyer evidence: <b>{d.buyerEvidenceCount}</b></SoftCard><SoftCard>Seller evidence: <b>{d.sellerEvidenceCount}</b></SoftCard><SoftCard>Priority: <b>{d.priority}</b></SoftCard></div> : null}<Textarea label="Moderator note" value={note} onChange={(e) => setNote(e.target.value)} /><div className="flex flex-wrap gap-2"><Button onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((x) => x.id === d.id ? { ...x, status: "resolved" } : x), orders: p.orders.map((o) => o.id === d.orderId ? { ...o, status: "released", escrowStatus: "released" } : o) })); log(`${d.id}: released escrow to buyer. ${note}`, "danger"); }}>Release to buyer</Button><Button variant="secondary" onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((x) => x.id === d.id ? { ...x, status: "resolved" } : x), orders: p.orders.map((o) => o.id === d.orderId ? { ...o, status: "refunded", escrowStatus: "refunded" } : o) })); log(`${d.id}: refunded escrow to seller.`, "warning"); }}>Refund seller</Button><Button variant="warning" onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((x) => x.id === d.id ? { ...x, status: "waiting_for_evidence" } : x) })); log(`${d.id}: more evidence requested.`, "warning"); }}>Request evidence</Button><Button variant="danger" onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((x) => x.id === d.id ? { ...x, status: "escalated" } : x) })); log(`${d.id} escalated.`, "danger"); }}>Escalate</Button></div></Card>)}</div></AdminFlowShell>;
}

export function AdsAdminFlow({ adId }: { adId?: string }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  const ads = adId ? state.ads.filter((a) => a.id === adId) : state.ads;
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={ads} columns={[{ header: "Ad", render: (a) => <div><b>{a.side.toUpperCase()} {a.asset}</b><div className="text-xs text-amlbt-text-muted">{userFor(a.traderId).username} · {a.price} {a.fiat}</div></div> }, { header: "Status", render: (a) => <StatusBadge status={a.status} /> }, { header: "Payments", render: (a) => a.paymentMethods.join(", ") }, { header: "Actions", render: (a) => <div className="flex flex-wrap gap-2"><Button size="sm" variant="secondary" onClick={() => { setState((p) => ({ ...p, ads: p.ads.map((x) => x.id === a.id ? { ...x, status: x.status === "active" ? "suspended" : "active" } : x) })); log(`${a.id} ${a.status === "active" ? "suspended" : "restored"}.`, a.status === "active" ? "danger" : "success"); }}>{a.status === "active" ? "Suspend" : "Restore"}</Button><Button size="sm" variant="warning" onClick={() => log(`${a.id} flagged as price outlier.`, "warning")}>Flag</Button></div> }]} /></AdminFlowShell>;
}

export function FeesAdminFlow({ transactions = false }: { transactions?: boolean }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  const [rate, setRate] = useState(0.3);
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}>{transactions ? <DataTable data={state.feeTransactions} columns={[{ header: "Transaction", render: (t) => <b>{t.id}</b> }, { header: "Order", render: (t) => t.orderId }, { header: "Amount", render: (t) => `${t.amount} ${t.asset}` }, { header: "Status", render: (t) => <StatusBadge status={t.status.toLowerCase()} /> }]} /> : <div className="grid gap-4 lg:grid-cols-[1fr_320px]"><DataTable data={state.feeRules} columns={[{ header: "Rule", render: (r) => <b>{r.name}</b> }, { header: "Payer", render: (r) => r.payer }, { header: "Rate", render: (r) => `${r.percentage}%` }, { header: "Status", render: (r) => <StatusBadge status={r.status} /> }, { header: "Action", render: (r) => <Button size="sm" variant="secondary" onClick={() => { setState((p) => ({ ...p, feeRules: p.feeRules.map((x) => x.id === r.id ? { ...x, status: x.status === "active" ? "paused" : "active" } : x) })); log(`${r.name} status changed.`); }}>Toggle</Button> }]} /><Card className="space-y-3"><h3 className="font-semibold">Edit standard fee</h3><Input label="Fee percentage" type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} /><Button onClick={() => { setState((p) => ({ ...p, feeRules: p.feeRules.map((r) => r.id === "fee_001" ? { ...r, percentage: rate } : r) })); log(`Standard fee updated to ${rate}%.`, "warning"); }}>Save fee rule</Button></Card></div>}</AdminFlowShell>;
}

export function ConfigAdminFlow({ kind }: { kind: "assets" | "networks" | "payment-methods" | "integrations" | "notifications" | "content" | "risk" | "roles" | "system" | "audit" | "support" }) {
  const { state, setState, log, reset, source, syncError } = useAdminState();
  if (kind === "assets") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.assets} columns={[{ header: "Asset", render: (a) => <b>{a.symbol}</b> }, { header: "Network", render: (a) => a.network }, { header: "Limits", render: (a) => `${a.minTrade}-${a.maxTrade}` }, { header: "Status", render: (a) => <StatusBadge status={a.status} /> }, { header: "Action", render: (a) => <Button size="sm" variant="secondary" onClick={() => { setState((p) => ({ ...p, assets: p.assets.map((x) => x.symbol === a.symbol ? { ...x, status: x.status === "active" ? "paused" : "active" } : x) })); log(`${a.symbol} trading toggled.`, "warning"); }}>Toggle trading</Button> }]} /></AdminFlowShell>;
  if (kind === "networks") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.networks.map((x, id) => ({ ...x, id: String(id) }))} columns={[{ header: "Network", render: (n) => <b>{n.name}</b> }, { header: "Chain", render: (n) => n.chainId }, { header: "Block", render: (n) => n.latestSyncedBlock.toLocaleString() }, { header: "Status", render: (n) => <StatusBadge status={n.status} /> }, { header: "Action", render: (n) => <Button size="sm" onClick={() => log(`${n.name} manual resync queued.`, "primary")}>Resync</Button> }]} /></AdminFlowShell>;
  if (kind === "payment-methods") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.paymentMethods} columns={[{ header: "Method", render: (p) => <b>{p.name}</b> }, { header: "Country", render: (p) => p.country }, { header: "KYC", render: (p) => `L${p.kycLevel}` }, { header: "Status", render: (p) => <StatusBadge status={p.status} /> }, { header: "Action", render: (p) => <Button size="sm" variant="secondary" onClick={() => { setState((s) => ({ ...s, paymentMethods: s.paymentMethods.map((x) => x.id === p.id ? { ...x, status: x.status === "active" ? "paused" : "active" } : x) })); log(`${p.name} toggled.`); }}>Toggle</Button> }]} /></AdminFlowShell>;
  if (kind === "integrations") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{state.integrations.map((i) => <Card key={i.key} className="space-y-3"><div className="flex items-center justify-between"><h3 className="font-semibold">{i.name}</h3><StatusBadge status={i.status} /></div><p className="text-sm text-amlbt-text-muted">{i.category} · {i.mode} · {i.maskedKey ?? "No key shown"}</p><div className="flex gap-2"><Button onClick={() => { setState((p) => ({ ...p, integrations: p.integrations.map((x) => x.key === i.key ? { ...x, status: "healthy", lastSuccess: now(), lastError: undefined } : x) })); log(`${i.name} test passed.`); }}>Test</Button><Button variant="secondary" onClick={() => { setState((p) => ({ ...p, integrations: p.integrations.map((x) => x.key === i.key ? { ...x, status: x.status === "disabled" ? "setup_required" : "disabled" } : x) })); log(`${i.name} enabled/disabled changed.`, "warning"); }}>Toggle</Button></div></Card>)}</div></AdminFlowShell>;
  if (kind === "notifications") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.templates} columns={[{ header: "Key", render: (t) => <b>{t.key}</b> }, { header: "Channel", render: (t) => t.channel }, { header: "Status", render: (t) => <StatusBadge status={t.status} /> }, { header: "Actions", render: (t) => <div className="flex gap-2"><Button size="sm" onClick={() => log(`Test sent for ${t.key}.`, "primary")}>Test</Button><Button size="sm" variant="secondary" onClick={() => { setState((p) => ({ ...p, templates: p.templates.map((x) => x.id === t.id ? { ...x, status: x.status === "published" ? "draft" : "published" } : x) })); log(`${t.key} published/drafted.`); }}>Publish</Button></div> }]} /></AdminFlowShell>;
  if (kind === "content") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.content} columns={[{ header: "Title", render: (c) => <b>{c.title}</b> }, { header: "Placement", render: (c) => c.placement }, { header: "Status", render: (c) => <StatusBadge status={c.status} /> }, { header: "Action", render: (c) => <Button size="sm" onClick={() => { setState((p) => ({ ...p, content: p.content.map((x) => x.id === c.id ? { ...x, status: "published" } : x) })); log(`${c.title} published.`); }}>Publish</Button> }]} /></AdminFlowShell>;
  if (kind === "risk") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="space-y-4"><DataTable data={state.riskFlags} columns={[{ header: "Flag", render: (f) => <b>{f.id}</b> }, { header: "Target", render: (f) => `${f.targetType}:${f.targetId}` }, { header: "Severity", render: (f) => <Badge tone={f.severity === "critical" || f.severity === "high" ? "danger" : "warning"}>{f.severity}</Badge> }, { header: "Status", render: (f) => <StatusBadge status={f.status} /> }, { header: "Action", render: (f) => <Button size="sm" onClick={() => { setState((p) => ({ ...p, riskFlags: p.riskFlags.map((x) => x.id === f.id ? { ...x, status: "resolved" } : x) })); log(`${f.id} resolved.`); }}>Resolve</Button> }]} /><DataTable data={state.riskRules} columns={[{ header: "Rule", render: (r) => <b>{r.name}</b> }, { header: "Trigger", render: (r) => r.trigger }, { header: "Severity", render: (r) => r.severity }, { header: "Status", render: (r) => <StatusBadge status={r.status} /> }]} /></div></AdminFlowShell>;
  if (kind === "roles") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.roles} columns={[{ header: "Role", render: (r) => <b>{r.name}</b> }, { header: "Permissions", render: (r) => r.permissions.length }, { header: "Action", render: (r) => <Button size="sm" variant="secondary" onClick={() => log(`${r.name} permission set saved.`, "warning")}>Save permissions</Button> }]} /></AdminFlowShell>;
  if (kind === "system") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2">{state.systemSettings.map((s) => <Card key={s.key} className="flex items-center justify-between gap-3"><div><b>{s.label}</b><p className="text-sm text-amlbt-text-muted">{s.description}</p></div><Button variant={Boolean(s.value) ? "secondary" : "primary"} onClick={() => { setState((p) => ({ ...p, systemSettings: p.systemSettings.map((x) => x.key === s.key ? { ...x, value: !Boolean(x.value) } : x) })); log(`${s.label} ${Boolean(s.value) ? "disabled" : "enabled"}.`, "warning"); }}>{Boolean(s.value) ? "Disable" : "Enable"}</Button></Card>)}</div></AdminFlowShell>;
  if (kind === "audit") return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.auditLogs} columns={[{ header: "Admin", render: (a) => a.adminName }, { header: "Action", render: (a) => a.action }, { header: "Target", render: (a) => `${a.targetType}:${a.targetId}` }, { header: "Result", render: (a) => <StatusBadge status={a.result} /> }]} /></AdminFlowShell>;
  return <AdminFlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><DataTable data={state.supportTickets} columns={[{ header: "Ticket", render: (t) => <b>{t.id}</b> }, { header: "Subject", render: (t) => t.subject }, { header: "Priority", render: (t) => t.priority }, { header: "Status", render: (t) => <StatusBadge status={t.status} /> }, { header: "Action", render: (t) => <Button size="sm" onClick={() => { setState((p) => ({ ...p, supportTickets: p.supportTickets.map((x) => x.id === t.id ? { ...x, status: "resolved" } : x) })); log(`${t.id} resolved.`); }}>Resolve</Button> }]} /></AdminFlowShell>;
}
