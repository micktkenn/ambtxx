"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  ads as seedAds,
  disputes as seedDisputes,
  evidenceFiles as seedEvidence,
  messages as seedMessages,
  notifications as seedNotifications,
  orderEvents as seedEvents,
  orders as seedOrders,
  paymentMethods as seedPlatformPaymentMethods,
  priceFeeds,
  securitySettings as seedSecurity,
  sessions as seedSessions,
  supportTickets as seedSupportTickets,
  tradeLimits,
  userPaymentMethods as seedPaymentMethods,
  users,
  wallet as seedWallet
} from "@amlbt/mock-data";
import { createPersistentAd, createPersistentOrder, openPersistentDispute, recordUserActivity, sendPersistentOrderMessage, updatePersistentOrderStatus, getSnapshotModeLabel, loadSnapshot, resetSnapshot, saveSnapshot, scheduleWebStateTableSync } from "@amlbt/supabase";
import { Badge, Button, Card, ChatPanel, Input, Select, SoftCard, StatusBadge, Textarea, Timeline } from "@amlbt/ui";

type LogItem = { id: string; message: string; tone?: "success" | "warning" | "danger" | "primary" | "neutral"; at: string };
type AnyOrder = (typeof seedOrders)[number] & { proofUploaded?: boolean; feedback?: string };
type AnyAd = (typeof seedAds)[number] & { views?: number; orders?: number };
type AnyDispute = (typeof seedDisputes)[number] & { notes?: string[] };
type AnyMessage = (typeof seedMessages)[number];
type AnyPaymentMethod = (typeof seedPaymentMethods)[number];
type AnyNotification = (typeof seedNotifications)[number] & { read?: boolean };
type AnySession = (typeof seedSessions)[number];

type WebState = {
  auth: { loggedIn: boolean; step: "login" | "2fa" | "done"; email: string; newDevice: boolean };
  onboarding: Record<string, boolean>;
  orders: AnyOrder[];
  ads: AnyAd[];
  disputes: AnyDispute[];
  messages: AnyMessage[];
  events: typeof seedEvents;
  evidence: typeof seedEvidence;
  paymentMethods: AnyPaymentMethod[];
  notifications: AnyNotification[];
  sessions: AnySession[];
  security: typeof seedSecurity;
  wallet: typeof seedWallet & { connected?: boolean; network?: string };
  supportTickets: typeof seedSupportTickets;
  logs: LogItem[];
};

const initialState: WebState = {
  auth: { loggedIn: false, step: "login", email: "milkessa@example.com", newDevice: true },
  onboarding: { email: true, username: true, country: true, wallet: true, twofa: true, kyc: true, payment: true, telegram: true },
  orders: seedOrders.map((order) => ({ ...order })),
  ads: seedAds.map((ad, index) => ({ ...ad, views: 120 + index * 37, orders: index + 1 })),
  disputes: seedDisputes.map((item) => ({ ...item, notes: [] })),
  messages: seedMessages.map((item) => ({ ...item })),
  events: seedEvents.map((item) => ({ ...item })),
  evidence: seedEvidence.map((item) => ({ ...item })),
  paymentMethods: seedPaymentMethods.map((item) => ({ ...item })),
  notifications: seedNotifications.map((item) => ({ ...item, read: false })),
  sessions: seedSessions.map((item) => ({ ...item })),
  security: { ...seedSecurity },
  wallet: { ...seedWallet, connected: true, network: seedWallet.network },
  supportTickets: seedSupportTickets.map((item) => ({ ...item })),
  logs: []
};

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function useWebState() {
  const [state, setState] = useState<WebState>(initialState);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState("loading");
  const [syncError, setSyncError] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    loadSnapshot<WebState>("web", initialState)
      .then((result) => {
        if (cancelled) return;
        setState({ ...initialState, ...result.data });
        setSource(result.source);
        setSyncError(result.error);
        setReady(true);
      })
      .catch((error) => {
        if (cancelled) return;
        setState(initialState);
        setSource("seed");
        setSyncError(error instanceof Error ? error.message : "Failed to load state");
        setReady(true);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveSnapshot("web", state)
      .then((result) => setSource(result.source))
      .catch((error) => {
        setSource("local-storage");
        setSyncError(error instanceof Error ? error.message : "Failed to save Supabase state");
      });

    // v0.6: auto-sync important user data tables after any UI state change.
    // A user click updates local UI immediately, then this writes ads/orders/chat/disputes/evidence/etc.
    // to normal Supabase tables without requiring a reset/database page.
    scheduleWebStateTableSync(state, (result) => {
      if (result.errors.length) {
        setSyncError(`Table sync warnings: ${result.errors.slice(0, 3).join(" | ")}`);
      }
    });
  }, [state, ready]);

  const log = (message: string, tone: LogItem["tone"] = "success") => {
    setState((prev) => ({ ...prev, logs: [{ id: makeId("log"), message, tone, at: now() }, ...prev.logs].slice(0, 6) }));
    void recordUserActivity(message, { source: "ui-flow" }, tone);
  };

  const reset = async () => {
    setState(initialState);
    setSyncError(undefined);
    await resetSnapshot("web", initialState);
    setSource(getSnapshotModeLabel());
  };

  return { state, setState, log, reset, ready, source, syncError };
}

function FlowShell({ children, logs, source, syncError }: { children: ReactNode; logs: LogItem[]; reset?: () => void | Promise<void>; source?: string; syncError?: string }) {
  return (
    <div className="space-y-4">
      {children}
      <Card className="border-blue-100 bg-amlbt-primary-soft/40">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold">Live action persistence</h3>
            <p className="text-sm text-amlbt-text-muted">Data source: <span className="font-semibold">{source ?? getSnapshotModeLabel()}</span>. User actions save automatically to Supabase when env vars are configured; otherwise they stay in local mock storage.</p>
            {syncError ? <p className="mt-1 text-sm text-red-700">Supabase sync fallback: {syncError}</p> : null}
          </div>
        </div>
        <div className="mt-3 grid gap-2">
          {logs.length ? logs.map((item) => <div key={item.id} className="rounded-xl border border-amlbt-border-soft bg-white p-2 text-sm"><Badge tone={item.tone ?? "success"}>{item.tone ?? "success"}</Badge><span className="ml-2">{item.message}</span></div>) : <div className="text-sm text-amlbt-text-muted">No actions yet. Try any button on this page.</div>}
        </div>
      </Card>
    </div>
  );
}

function traderFor(id: string) {
  return users.find((user) => user.id === id) ?? users[0];
}

function orderCounterparty(order: AnyOrder) {
  return traderFor(order.side === "buy" ? order.sellerId : order.buyerId);
}

export function AuthFlow({ mode }: { mode: "login" | "register" }) {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const [email, setEmail] = useState(state.auth.email);
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("MilkessaT");

  const submit = () => {
    if (mode === "register") {
      setState((prev) => ({ ...prev, auth: { ...prev.auth, step: "2fa", email, newDevice: true } }));
      log(`Registered ${username}. Verification email and 2FA challenge generated.`, "primary");
      return;
    }
    setState((prev) => ({ ...prev, auth: { ...prev.auth, step: "2fa", email, newDevice: true } }));
    log("Login accepted. New-device 2FA required.", "warning");
  };

  const verify = () => {
    setState((prev) => ({ ...prev, auth: { ...prev.auth, loggedIn: true, step: "done", newDevice: false } }));
    log(`2FA verified with code ${otp || "000000"}. Session is now active.`, "success");
  };

  return (
    <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}>
      <div className="mx-auto max-w-xl space-y-4">
        <Card className="space-y-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight">{mode === "login" ? "Login to AMLBT" : "Create your AMLBT account"}</h2>
            <p className="text-sm text-amlbt-text-muted">This mock auth flow includes email, password, new-device detection, and 2FA.</p>
          </div>
          {mode === "register" ? <Input label="Username" value={username} onChange={(event) => setUsername(event.target.value)} /> : null}
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Input label="Password" type="password" value="mock-password" onChange={() => {}} />
          {mode === "register" ? <Select label="Country" defaultValue="Ethiopia"><option>Ethiopia</option><option>Kenya</option><option>Uganda</option></Select> : null}
          <Button className="w-full" size="lg" onClick={submit}>{mode === "login" ? "Login" : "Create account"}</Button>
        </Card>

        {state.auth.step === "2fa" || state.auth.step === "done" ? (
          <Card className="space-y-3 border-orange-200 bg-amlbt-warning-soft">
            <div className="flex items-center justify-between"><h3 className="font-semibold">New device verification</h3><StatusBadge status={state.auth.step === "done" ? "active" : "pending"} /></div>
            <p className="text-sm text-orange-800">Enter authenticator code before wallet, orders, or release actions become available.</p>
            <Input label="Authenticator code" placeholder="123 456" value={otp} onChange={(event) => setOtp(event.target.value)} />
            <Button onClick={verify} disabled={state.auth.step === "done"}>{state.auth.step === "done" ? "Verified" : "Verify 2FA"}</Button>
          </Card>
        ) : null}

        {state.auth.loggedIn ? <Link href="/dashboard"><Button className="w-full" variant="secondary">Continue to dashboard</Button></Link> : null}
      </div>
    </FlowShell>
  );
}

export function DashboardFlow() {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const activeOrders = state.orders.filter((order) => !["completed", "cancelled", "refunded"].includes(order.status));
  const usdt = state.wallet.balances.find((item) => item.asset === "USDT");

  return (
    <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}>
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Card className="border-blue-200 bg-amlbt-primary-soft">
            <div className="flex items-center justify-between"><span className="text-sm font-semibold text-amlbt-primary-dark">Estimated balance</span><Badge tone="success">KYC L2</Badge></div>
            <div className="mt-3 text-3xl font-black tracking-tight">{usdt?.available.toLocaleString()} USDT</div>
            <p className="text-sm text-amlbt-text-muted">Escrow locked: {usdt?.escrowLocked} USDT · network: {state.wallet.network}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Link href="/market"><Button className="w-full">Buy crypto</Button></Link>
              <Link href="/ads/create"><Button className="w-full" variant="secondary">Create ad</Button></Link>
              <Button className="w-full" variant="secondary" onClick={() => { setState((prev) => ({ ...prev, wallet: { ...prev.wallet, balances: prev.wallet.balances.map((b) => b.asset === "USDT" ? { ...b, available: b.available + 10 } : b) } })); log("Mock wallet balance refreshed and +10 test USDT added."); }}>Refresh wallet</Button>
            </div>
          </Card>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Card><div className="text-2xl font-black">{activeOrders.length}</div><div className="text-sm text-amlbt-text-muted">Active orders</div></Card>
            <Card><div className="text-2xl font-black">{state.security.securityScore}%</div><div className="text-sm text-amlbt-text-muted">Security score</div></Card>
            <Card><div className="text-2xl font-black">{state.notifications.filter((n) => !n.read).length}</div><div className="text-sm text-amlbt-text-muted">Unread alerts</div></Card>
            <Card><div className="text-2xl font-black">{state.ads.filter((ad) => ad.status === "active").length}</div><div className="text-sm text-amlbt-text-muted">Active market ads</div></Card>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {activeOrders.slice(0, 2).map((order) => (
              <Card key={order.id} className="space-y-3">
                <div className="flex items-center justify-between"><b>#{order.id}</b><StatusBadge status={order.status} /></div>
                <p className="text-sm text-amlbt-text-muted">{order.side.toUpperCase()} {order.assetAmount} {order.asset} with {orderCounterparty(order).username}</p>
                <div className="flex gap-2"><Link href={`/orders/${order.id}`}><Button>Open</Button></Link><Button variant="secondary" onClick={() => { setState((prev) => ({ ...prev, orders: prev.orders.map((o) => o.id === order.id ? { ...o, status: "marked_paid" } : o) })); log(`#${order.id} marked paid from dashboard.`); }}>Mark paid</Button></div>
              </Card>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <Card><h2 className="mb-3 font-semibold">Pending actions</h2><div className="space-y-2"><ActionItem label="Complete onboarding" href="/onboarding" status={Object.values(state.onboarding).every(Boolean) ? "completed" : "pending"} /><ActionItem label="Review active orders" href="/orders" status={activeOrders.length ? "payment_pending" : "completed"} /><ActionItem label="Check security" href="/settings/security" status={state.security.securityScore >= 90 ? "active" : "review"} /></div></Card>
          <Card><h2 className="mb-3 font-semibold">Notification actions</h2><div className="space-y-2">{state.notifications.slice(0, 4).map((n) => <div key={n.id} className="rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div className="flex items-center justify-between gap-3"><b className="text-sm">{n.title}</b><Button size="sm" variant="secondary" onClick={() => { setState((prev) => ({ ...prev, notifications: prev.notifications.map((item) => item.id === n.id ? { ...item, read: true } : item) })); log(`Notification read: ${n.title}`); }}>Mark read</Button></div><p className="text-xs text-amlbt-text-muted">{n.body}</p></div>)}</div></Card>
        </aside>
      </div>
    </FlowShell>
  );
}

function ActionItem({ label, href, status }: { label: string; href: string; status: string }) {
  return <div className="flex items-center justify-between gap-3 rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><Link className="text-sm font-medium" href={href}>{label}</Link><StatusBadge status={status} /></div>;
}

export function OnboardingFlow() {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const steps = [
    ["email", "Verify email", "/settings/profile"],
    ["username", "Choose username", "/settings/profile"],
    ["country", "Select country and fiat", "/settings/profile"],
    ["wallet", "Connect embedded wallet", "/wallet"],
    ["twofa", "Enable authenticator app", "/settings/security"],
    ["kyc", "Complete KYC Level 2", "/settings/verification"],
    ["payment", "Add payment method", "/settings/payment-methods"],
    ["telegram", "Connect Telegram alerts", "/settings/telegram"]
  ] as const;
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><Card><h2 className="mb-1 text-xl font-bold">Onboarding checklist</h2><p className="mb-4 text-sm text-amlbt-text-muted">Every item is clickable and updates the prototype state.</p><div className="space-y-3">{steps.map(([id, label, href]) => <div key={id} className="flex items-center justify-between gap-3 rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div><b>{label}</b><div className="text-xs text-amlbt-text-muted">Required before higher limits and safer trades.</div></div><div className="flex gap-2"><Link href={href}><Button size="sm" variant="secondary">Open</Button></Link><Button size="sm" onClick={() => { setState((prev) => ({ ...prev, onboarding: { ...prev.onboarding, [id]: !prev.onboarding[id] } })); log(`${label} set to ${state.onboarding[id] ? "not done" : "done"}.`, state.onboarding[id] ? "warning" : "success"); }}>{state.onboarding[id] ? "Done" : "Complete"}</Button></div></div>)}</div></Card><Card><h3 className="font-semibold">Progress</h3><div className="mt-3 text-4xl font-black">{Object.values(state.onboarding).filter(Boolean).length}/{steps.length}</div><p className="text-sm text-amlbt-text-muted">Completed onboarding tasks</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full bg-amlbt-primary" style={{ width: `${Object.values(state.onboarding).filter(Boolean).length / steps.length * 100}%` }} /></div></Card></div></FlowShell>;
}

export function MarketFlow({ selectedAdId }: { selectedAdId?: string }) {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState(5000);
  const [method, setMethod] = useState("all");
  const [createdOrder, setCreatedOrder] = useState<string | null>(null);

  const availableAds = state.ads.filter((ad) => selectedAdId ? ad.id === selectedAdId : ad.status === "active").filter((ad) => (side === "buy" ? ad.side === "sell" : ad.side === "buy")).filter((ad) => method === "all" || ad.paymentMethods.includes(method));

  function createOrder(ad: AnyAd) {
    const orderId = `TRD-${Math.floor(9100 + Math.random() * 899)}`;
    const assetAmount = Number((amount / ad.price).toFixed(2));
    const order: AnyOrder = {
      id: orderId,
      side: side,
      buyerId: side === "buy" ? "user_001" : ad.traderId,
      sellerId: side === "buy" ? ad.traderId : "user_001",
      asset: ad.asset,
      assetAmount,
      fiat: ad.fiat,
      fiatAmount: amount,
      price: ad.price,
      status: "payment_pending",
      escrowStatus: "funded",
      paymentMethod: ad.paymentMethods[0],
      paymentAccountName: traderFor(ad.traderId).displayName,
      paymentAccountMasked: "****4432",
      timerEndsAt: now(),
      escrowTx: `0x${Math.random().toString(16).slice(2)}escrow`,
      feeAmount: Number((assetAmount * 0.003).toFixed(2)),
      createdAt: now(),
      updatedAt: now()
    };
    const event = { id: makeId("evt"), orderId, type: "escrow_funded" as const, label: "Escrow funded", description: `${assetAmount} ${ad.asset} locked in mock escrow.`, actorType: "system" as const, createdAt: now() };
    setState((prev) => ({ ...prev, orders: [order, ...prev.orders], events: [event, ...prev.events], ads: prev.ads.map((item) => item.id === ad.id ? { ...item, orders: (item.orders ?? 0) + 1 } : item) }));
    void createPersistentOrder({ id: orderId, adId: ad.id, buyerId: order.buyerId, sellerId: order.sellerId, side: order.side, asset: order.asset, assetAmount: order.assetAmount, fiat: order.fiat, fiatAmount: order.fiatAmount, price: order.price, paymentMethod: order.paymentMethod, feeAmount: order.feeAmount });
    setCreatedOrder(orderId);
    log(`Created order #${orderId} from ${traderFor(ad.traderId).username}. Escrow funded.`, "success");
  }

  return (
    <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}>
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card className="space-y-3">
          <h2 className="text-lg font-bold">Market filters</h2>
          <Select label="Action" value={side} onChange={(e) => setSide(e.target.value as "buy" | "sell")}><option value="buy">Buy crypto</option><option value="sell">Sell crypto</option></Select>
          <Input label="Amount in ETB" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
          <Select label="Payment method" value={method} onChange={(e) => setMethod(e.target.value)}><option value="all">All methods</option>{[...new Set(state.ads.flatMap((ad) => ad.paymentMethods))].map((m) => <option key={m}>{m}</option>)}</Select>
          <div className="rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3 text-sm">Reference price: <b>{priceFeeds[0]?.priceFiat ?? 132.7} ETB</b> / USDT</div>
          {createdOrder ? <Link href={`/orders/${createdOrder}`}><Button className="w-full">Open created order</Button></Link> : null}
        </Card>
        <div className="grid gap-3 md:grid-cols-2">
          {availableAds.map((ad) => {
            const trader = traderFor(ad.traderId);
            return <Card key={ad.id} className="space-y-3"><div className="flex justify-between gap-3"><div><h3 className="font-semibold">{trader.username}</h3><p className="text-xs text-amlbt-text-muted">{trader.completedTrades} trades · {trader.completionRate}% complete · ⭐ {trader.rating}</p></div><StatusBadge status={ad.status} /></div><div className="text-2xl font-black">{ad.price.toFixed(2)} {ad.fiat}</div><div className="grid grid-cols-2 gap-2 text-sm"><SoftCard><b>{ad.availableAmount}</b><br />{ad.asset} available</SoftCard><SoftCard><b>{ad.minFiat}-{ad.maxFiat}</b><br />{ad.fiat} limits</SoftCard></div><div className="flex flex-wrap gap-2">{ad.paymentMethods.map((m) => <Badge key={m}>{m}</Badge>)}</div><div className="flex gap-2"><Link href={`/market/${ad.id}`}><Button variant="secondary">Details</Button></Link><Button onClick={() => createOrder(ad)}>{side === "buy" ? `Buy ${ad.asset}` : `Sell ${ad.asset}`}</Button></div></Card>;
          })}
          {!availableAds.length ? <Card><h3 className="font-semibold">No offers found</h3><p className="text-sm text-amlbt-text-muted">Adjust filters or create your own ad.</p><Link href="/ads/create"><Button className="mt-3">Create ad</Button></Link></Card> : null}
        </div>
      </div>
    </FlowShell>
  );
}

export function AdsFlow({ mode = "list" }: { mode?: "list" | "create" }) {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const [draft, setDraft] = useState({ side: "sell", asset: "USDT", fiat: "ETB", price: 132.95, minFiat: 1000, maxFiat: 75000, paymentMethod: "CBE", terms: "Pay using your own verified account only." });
  const myAds = state.ads.filter((ad) => ad.traderId === "user_001" || mode === "list");

  const publish = () => {
    const newAd: AnyAd = { id: `ad_${Math.floor(Math.random() * 9999)}`, side: draft.side as "buy" | "sell", asset: draft.asset, fiat: draft.fiat, price: Number(draft.price), priceType: "fixed", availableAmount: 1500, minFiat: Number(draft.minFiat), maxFiat: Number(draft.maxFiat), paymentMethods: [draft.paymentMethod], paymentWindowMinutes: 30, traderId: "user_001", terms: draft.terms, status: "active", requirements: { minKycLevel: 1, minCompletedTrades: 0, minRating: 0, require2fa: true }, createdAt: now(), views: 0, orders: 0 };
    setState((prev) => ({ ...prev, ads: [newAd, ...prev.ads] }));
    void createPersistentAd({ id: newAd.id, traderId: newAd.traderId, side: newAd.side, asset: newAd.asset, fiat: newAd.fiat, price: newAd.price, availableAmount: newAd.availableAmount, minFiat: newAd.minFiat, maxFiat: newAd.maxFiat, paymentMethods: newAd.paymentMethods, terms: newAd.terms, status: newAd.status });
    log(`Published ${draft.side} ad ${newAd.id}.`, "success");
  };

  if (mode === "create") {
    return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><Card className="space-y-3"><h2 className="text-xl font-bold">Create ad wizard</h2><div className="grid gap-3 md:grid-cols-2"><Select label="Side" value={draft.side} onChange={(e) => setDraft({ ...draft, side: e.target.value })}><option value="sell">Sell USDT</option><option value="buy">Buy USDT</option></Select><Select label="Asset" value={draft.asset} onChange={(e) => setDraft({ ...draft, asset: e.target.value })}><option>USDT</option><option>USDC</option></Select><Input label="Price" type="number" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /><Select label="Payment" value={draft.paymentMethod} onChange={(e) => setDraft({ ...draft, paymentMethod: e.target.value })}>{seedPlatformPaymentMethods.map((m) => <option key={m.id}>{m.name}</option>)}</Select><Input label="Minimum ETB" type="number" value={draft.minFiat} onChange={(e) => setDraft({ ...draft, minFiat: Number(e.target.value) })} /><Input label="Maximum ETB" type="number" value={draft.maxFiat} onChange={(e) => setDraft({ ...draft, maxFiat: Number(e.target.value) })} /></div><Textarea label="Terms" value={draft.terms} onChange={(e) => setDraft({ ...draft, terms: e.target.value })} /><div className="flex gap-2"><Button variant="secondary" onClick={() => log("Draft saved locally.", "primary")}>Save draft</Button><Button onClick={publish}>Publish ad</Button></div></Card><Card className="space-y-3"><h3 className="font-semibold">Live preview</h3><Badge tone="primary">{draft.side.toUpperCase()} {draft.asset}</Badge><div className="text-2xl font-black">{Number(draft.price).toFixed(2)} {draft.fiat}</div><p className="text-sm text-amlbt-text-muted">Limits {draft.minFiat}-{draft.maxFiat} {draft.fiat}</p><p className="text-sm">{draft.terms}</p></Card></div></FlowShell>;
  }

  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{myAds.map((ad) => <Card key={ad.id} className="space-y-3"><div className="flex items-center justify-between"><b>{ad.side.toUpperCase()} {ad.asset}</b><StatusBadge status={ad.status} /></div><div className="text-2xl font-black">{ad.price} {ad.fiat}</div><p className="text-sm text-amlbt-text-muted">{ad.availableAmount} {ad.asset} · {ad.views ?? 0} views · {ad.orders ?? 0} orders</p><div className="flex flex-wrap gap-2">{ad.paymentMethods.map((m) => <Badge key={m}>{m}</Badge>)}</div><div className="grid grid-cols-2 gap-2"><Button variant="secondary" onClick={() => { setState((prev) => ({ ...prev, ads: prev.ads.map((item) => item.id === ad.id ? { ...item, status: item.status === "active" ? "paused" : "active" } : item) })); log(`${ad.id} ${ad.status === "active" ? "paused" : "resumed"}.`, "primary"); }}>{ad.status === "active" ? "Pause" : "Resume"}</Button><Button variant="danger" onClick={() => { setState((prev) => ({ ...prev, ads: prev.ads.filter((item) => item.id !== ad.id) })); log(`${ad.id} deleted.`, "danger"); }}>Delete</Button></div></Card>)}</div></FlowShell>;
}

export function OrdersFlow({ orderId, mode = "list" }: { orderId?: string; mode?: "list" | "detail" | "release" | "dispute" }) {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const order = state.orders.find((item) => item.id === orderId) ?? state.orders[0];
  const [chat, setChat] = useState("");
  const [proof, setProof] = useState("receipt.jpg");
  const [otp, setOtp] = useState("");
  const [reason, setReason] = useState("Payment not received");
  const [description, setDescription] = useState("");

  const mutateOrder = (id: string, patch: Partial<AnyOrder>) => {
    setState((prev) => ({ ...prev, orders: prev.orders.map((item) => item.id === id ? { ...item, ...patch } : item) }));
    if (patch.status) void updatePersistentOrderStatus(id, patch.status, `Order ${id} ${patch.status}`);
  };
  const addEvent = (id: string, label: string, description: string, type: any = "payment_marked_paid") => setState((prev) => ({ ...prev, events: [{ id: makeId("evt"), orderId: id, type, label, description, actorType: "user", createdAt: now() }, ...prev.events] }));

  if (mode === "release") {
    return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="mx-auto max-w-2xl space-y-4"><Card className="border-red-200 bg-amlbt-danger-soft"><h2 className="text-xl font-bold text-amlbt-danger">Release crypto confirmation</h2><p className="text-sm text-red-700">Only release {order.assetAmount} {order.asset} after fiat payment is visible in your account. This cannot be reversed.</p></Card><Card className="space-y-3"><div className="grid gap-2 sm:grid-cols-2"><SoftCard><b>Order</b><br />#{order.id}</SoftCard><SoftCard><b>Buyer</b><br />{traderFor(order.buyerId).username}</SoftCard><SoftCard><b>Amount</b><br />{order.assetAmount} {order.asset}</SoftCard><SoftCard><b>Proof</b><br />{order.proofUploaded ? "Uploaded" : "Not uploaded"}</SoftCard></div><Input label="Authenticator code" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123 456" /><Button variant="danger" disabled={!otp} onClick={() => { mutateOrder(order.id, { status: "released", escrowStatus: "released" }); addEvent(order.id, "Crypto released", `${order.assetAmount} ${order.asset} released to buyer.`, "released"); log(`Released ${order.assetAmount} ${order.asset} for #${order.id}.`, "danger"); }}>Verify + sign wallet release</Button><Link href={`/orders/${order.id}`}><Button className="w-full" variant="secondary">Back to trade room</Button></Link></Card></div></FlowShell>;
  }

  if (mode === "dispute") {
    return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="mx-auto max-w-2xl space-y-4"><Card className="space-y-3"><h2 className="text-xl font-bold">Open dispute for #{order.id}</h2><Select label="Reason" value={reason} onChange={(e) => setReason(e.target.value)}><option>Payment not received</option><option>Wrong amount received</option><option>Payment from third-party name</option><option>Seller not responding</option><option>Buyer not responding</option><option>Fraud suspicion</option><option>Other</option></Select><Textarea label="Describe the issue" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Explain what happened and what evidence you have." /><Input label="Evidence filename" value={proof} onChange={(e) => setProof(e.target.value)} /><Button onClick={() => { const disputeId = `DSP-${Math.floor(500 + Math.random() * 499)}`; const dispute: AnyDispute = { id: disputeId, orderId: order.id, reason, status: "open", priority: "high", amount: order.assetAmount, asset: order.asset, buyerEvidenceCount: 1, sellerEvidenceCount: 0, assignedModerator: "Auto queue", createdAt: now(), notes: [description] }; setState((prev) => ({ ...prev, disputes: [dispute, ...prev.disputes], orders: prev.orders.map((o) => o.id === order.id ? { ...o, status: "disputed" } : o), evidence: [{ id: makeId("ev"), ownerId: "user_001", relatedType: "dispute", relatedId: disputeId, fileName: proof, mimeType: "image/jpeg", sizeKb: 240, status: "uploaded", createdAt: now() }, ...prev.evidence] })); addEvent(order.id, "Dispute opened", reason, "dispute_opened"); void openPersistentDispute({ id: disputeId, orderId: order.id, reason, amount: order.assetAmount, asset: order.asset, note: description }); log(`Opened dispute ${disputeId} for #${order.id}.`, "warning"); }}>Submit dispute</Button></Card><Link href="/disputes"><Button variant="secondary">View disputes</Button></Link></div></FlowShell>;
  }

  if (mode === "detail") {
    const orderMessages = state.messages.filter((m) => m.orderId === order.id);
    const orderEvents = state.events.filter((e) => e.orderId === order.id);
    const orderEvidence = state.evidence.filter((e) => e.relatedId === order.id);
    return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[1fr_380px]"><div className="space-y-4"><Card className="border-blue-200 bg-amlbt-primary-soft"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><div className="text-sm font-semibold text-amlbt-primary-dark">Escrow status</div><div className="text-3xl font-black tracking-tight">{order.assetAmount} {order.asset}</div><p className="text-sm text-amlbt-text-muted">Pay {order.fiatAmount.toLocaleString()} {order.fiat} · Fee {order.feeAmount} {order.asset}</p></div><StatusBadge status={order.status} /></div><div className="mt-4 flex flex-wrap gap-2"><Button onClick={() => { mutateOrder(order.id, { status: "marked_paid" }); addEvent(order.id, "Buyer marked paid", "Buyer confirmed fiat payment was sent."); log(`#${order.id} marked as paid.`); }}>I have paid</Button><Button variant="secondary" onClick={() => { setState((prev) => ({ ...prev, evidence: [{ id: makeId("ev"), ownerId: "user_001", relatedType: "order", relatedId: order.id, fileName: proof, mimeType: "image/jpeg", sizeKb: 310, status: "uploaded", createdAt: now() }, ...prev.evidence], orders: prev.orders.map((o) => o.id === order.id ? { ...o, proofUploaded: true } : o) })); addEvent(order.id, "Proof uploaded", proof, "proof_uploaded"); log(`Uploaded ${proof} for #${order.id}.`, "primary"); }}>Upload proof</Button><Link href={`/orders/${order.id}/release`}><Button variant="secondary">Release flow</Button></Link><Link href={`/orders/${order.id}/dispute`}><Button variant="secondary">Open dispute</Button></Link><Button variant="danger" onClick={() => { mutateOrder(order.id, { status: "cancelled" }); addEvent(order.id, "Order cancelled", "Order cancelled by user.", "cancelled"); log(`#${order.id} cancelled.`, "danger"); }}>Cancel</Button></div></Card><div className="grid gap-4 md:grid-cols-3"><Card><h2 className="mb-2 font-semibold">Payment details</h2><div className="text-sm text-amlbt-text-muted">{order.paymentMethod ?? "N/A"}</div><div className="font-semibold">{order.paymentAccountName ?? "Hidden"}</div><div className="text-sm">{order.paymentAccountMasked}</div></Card><Card><h2 className="mb-2 font-semibold">Escrow transaction</h2><div className="break-all text-sm text-amlbt-text-muted">{order.escrowTx ?? "Not funded"}</div></Card><Card><h2 className="mb-2 font-semibold">Evidence</h2><div className="text-sm text-amlbt-text-muted">{orderEvidence.length} files uploaded</div>{orderEvidence.map((file) => <div key={file.id} className="text-xs">📎 {file.fileName}</div>)}</Card></div><Card><h2 className="mb-3 font-semibold">Timeline</h2><Timeline items={orderEvents} /></Card></div><aside className="space-y-4"><Card><h2 className="mb-3 font-semibold">Trade chat</h2><ChatPanel messages={orderMessages} /><div className="mt-3 flex gap-2"><Input placeholder="Message counterparty..." value={chat} onChange={(e) => setChat(e.target.value)} /><Button onClick={() => { if (!chat) return; const body = chat; setState((prev) => ({ ...prev, messages: [...prev.messages, { id: makeId("msg"), orderId: order.id, senderType: "user", senderName: "MilkessaT", body, createdAt: now() }] })); void sendPersistentOrderMessage({ orderId: order.id, senderId: "user_001", senderType: "user", senderName: "MilkessaT", body }); setChat(""); log("Chat message sent."); }}>Send</Button></div></Card></aside></div></FlowShell>;
  }

  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{state.orders.map((item) => <Card key={item.id} className="space-y-3"><div className="flex items-center justify-between"><b>#{item.id}</b><StatusBadge status={item.status} /></div><p className="text-sm text-amlbt-text-muted">{item.side.toUpperCase()} {item.assetAmount} {item.asset} · {item.fiatAmount.toLocaleString()} {item.fiat}</p><p className="text-xs text-amlbt-text-muted">Counterparty: {orderCounterparty(item).username}</p><div className="flex flex-wrap gap-2"><Link href={`/orders/${item.id}`}><Button>Open</Button></Link><Button variant="secondary" onClick={() => { mutateOrder(item.id, { status: "marked_paid" }); log(`#${item.id} marked paid.`); }}>Mark paid</Button><Button variant="danger" onClick={() => { mutateOrder(item.id, { status: "cancelled" }); log(`#${item.id} cancelled.`, "danger"); }}>Cancel</Button></div></Card>)}</div></FlowShell>;
}

export function WalletFlow() {
  const { state, setState, log, reset, source, syncError } = useWebState();
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><Card className="space-y-4 border-blue-200 bg-amlbt-primary-soft"><div className="flex items-center justify-between"><h2 className="text-xl font-bold">Embedded wallet</h2><StatusBadge status={state.wallet.connected ? "connected" : "not_started"} /></div><div className="break-all rounded-xl border border-blue-200 bg-white p-3 font-mono text-sm">{state.wallet.address}</div><div className="flex flex-wrap gap-2"><Button onClick={() => { navigator.clipboard?.writeText(state.wallet.address); log("Wallet address copied."); }}>Copy address</Button><Button variant="secondary" onClick={() => { setState((prev) => ({ ...prev, wallet: { ...prev.wallet, connected: !prev.wallet.connected } })); log(state.wallet.connected ? "Wallet disconnected." : "Wallet connected.", state.wallet.connected ? "warning" : "success"); }}>{state.wallet.connected ? "Disconnect" : "Connect"}</Button><Button variant="secondary" onClick={() => { setState((prev) => ({ ...prev, wallet: { ...prev.wallet, network: prev.wallet.network === "BNB Chain" ? "Polygon" : "BNB Chain" } })); log("Network switched.", "primary"); }}>Switch network</Button></div></Card><Card><h3 className="font-semibold">Security reminder</h3><p className="mt-2 text-sm text-amlbt-text-muted">AMLBT never stores private keys. Release and refund actions require 2FA plus wallet signature.</p></Card><div className="grid gap-3 lg:col-span-2 md:grid-cols-2">{state.wallet.balances.map((b) => <Card key={b.asset}><div className="text-3xl font-black">{b.available}</div><div className="text-sm text-amlbt-text-muted">{b.asset} available</div><div className="mt-2 text-sm">Escrow locked: <b>{b.escrowLocked}</b></div></Card>)}</div></div></FlowShell>;
}

export function SettingsFlow({ section }: { section: "index" | "profile" | "verification" | "security" | "sessions" | "payment-methods" | "notifications" | "telegram" | "privacy" | "limits" | "account-activity" }) {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const user = users[0];
  if (section === "security") return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><Card className="space-y-3"><h2 className="text-xl font-bold">Security settings</h2><div className="grid gap-3 md:grid-cols-2"><SecurityToggle label="Authenticator app" checked={state.security.totpEnabled} onClick={() => { setState((p) => ({ ...p, security: { ...p.security, totpEnabled: !p.security.totpEnabled, securityScore: p.security.totpEnabled ? p.security.securityScore - 15 : p.security.securityScore + 15 } })); log("Authenticator setting changed."); }} /><SecurityToggle label="Passkey" checked={state.security.passkeyEnabled} onClick={() => { setState((p) => ({ ...p, security: { ...p.security, passkeyEnabled: !p.security.passkeyEnabled, securityScore: p.security.passkeyEnabled ? p.security.securityScore - 6 : p.security.securityScore + 6 } })); log("Passkey setting changed."); }} /><SecurityToggle label="Email OTP" checked={state.security.emailOtpEnabled} onClick={() => { setState((p) => ({ ...p, security: { ...p.security, emailOtpEnabled: !p.security.emailOtpEnabled } })); log("Email OTP setting changed."); }} /><SecurityToggle label="SMS OTP" checked={state.security.smsOtpEnabled} onClick={() => { setState((p) => ({ ...p, security: { ...p.security, smsOtpEnabled: !p.security.smsOtpEnabled } })); log("SMS OTP setting changed."); }} /></div><SoftCard>Security score: <b>{state.security.securityScore}%</b> · Backup codes remaining: <b>{state.security.backupCodesRemaining}</b> · Anti-phishing code: <b>{state.security.antiPhishingCode}</b></SoftCard><Button onClick={() => { setState((p) => ({ ...p, security: { ...p.security, backupCodesRemaining: 10 } })); log("New backup codes generated.", "primary"); }}>Generate backup codes</Button></Card></FlowShell>;
  if (section === "payment-methods") return <PaymentMethodsFlow state={state} setState={setState} log={log} reset={reset} source={source} syncError={syncError} />;
  if (section === "sessions" || section === "account-activity") return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><Card><h2 className="mb-3 text-xl font-bold">Sessions and account activity</h2><div className="space-y-3">{state.sessions.map((s) => <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div><b>{s.device}</b><div className="text-xs text-amlbt-text-muted">{s.browser} · {s.locationApprox} · {s.ipMasked}</div></div><div className="flex gap-2"><StatusBadge status={s.current ? "active" : "pending"} /><Button size="sm" variant="danger" disabled={s.current} onClick={() => { setState((p) => ({ ...p, sessions: p.sessions.filter((item) => item.id !== s.id) })); log(`${s.device} logged out.`, "danger"); }}>Logout</Button></div></div>)}</div></Card></FlowShell>;
  if (section === "verification") return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[1fr_340px]"><Card><h2 className="text-xl font-bold">Verification</h2><p className="text-sm text-amlbt-text-muted">Current level: KYC L{user.kycLevel}. Higher levels unlock more limits.</p><div className="mt-4 space-y-3">{[0,1,2,3].map((lvl) => <div key={lvl} className="flex items-center justify-between rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div><b>Level {lvl}</b><div className="text-xs text-amlbt-text-muted">{["Email verified", "Contact verified", "Identity verified", "Enhanced verification"][lvl]}</div></div><StatusBadge status={user.kycLevel >= lvl ? "approved" : "pending"} /></div>)}</div></Card><Card><h3 className="font-semibold">Mock provider session</h3><p className="mt-2 text-sm text-amlbt-text-muted">Start a provider session, submit documents, then move to pending review.</p><Button className="mt-3 w-full" onClick={() => log("KYC provider session opened. Status changed to pending review.", "warning")}>Start verification</Button></Card></div></FlowShell>;
  if (section === "notifications") return <NotificationsFlow />;
  if (section === "telegram") return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><Card className="space-y-3"><h2 className="text-xl font-bold">Telegram alerts</h2><p className="text-sm text-amlbt-text-muted">Telegram is for alerts and confirmations, not the only factor for fund movement.</p><SoftCard>Connection code: <b>AMLBT-482190</b></SoftCard><div className="flex gap-2"><Button onClick={() => { setState((p) => ({ ...p, security: { ...p.security, telegramLinked: true } })); log("Telegram linked to @milkessa_alerts."); }}>Connect Telegram</Button><Button variant="secondary" onClick={() => log("Test Telegram message sent.", "primary")}>Send test</Button><Button variant="danger" onClick={() => { setState((p) => ({ ...p, security: { ...p.security, telegramLinked: false } })); log("Telegram disconnected.", "danger"); }}>Disconnect</Button></div><StatusBadge status={state.security.telegramLinked ? "connected" : "setup_required"} /></Card></FlowShell>;
  if (section === "limits") return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2">{tradeLimits.map((limit) => <Card key={limit.kycLevel}><div className="flex items-center justify-between"><b>KYC Level {limit.kycLevel}</b><StatusBadge status={limit.canCreateAds ? "active" : "pending"} /></div><p className="mt-2 text-sm text-amlbt-text-muted">Daily: {limit.dailyLimitFiat.toLocaleString()} ETB · Monthly: {limit.monthlyLimitFiat.toLocaleString()} ETB · Max order: {limit.maxOrderFiat.toLocaleString()} ETB</p><Button className="mt-3" variant="secondary" onClick={() => log(`Upgrade request submitted for KYC Level ${limit.kycLevel}.`, "primary")}>Request higher limit</Button></Card>)}</div></FlowShell>;
  if (section === "profile" || section === "privacy") return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><Card className="space-y-3"><h2 className="text-xl font-bold">{section === "profile" ? "Profile settings" : "Privacy settings"}</h2><div className="grid gap-3 md:grid-cols-2"><Input label="Username" defaultValue={user.username} /><Input label="Display name" defaultValue={user.displayName} /><Select label="Default fiat"><option>ETB</option><option>USD</option></Select><Select label="Language"><option>English</option><option>Amharic</option></Select></div><Button onClick={() => log(`${section === "profile" ? "Profile" : "Privacy"} settings saved.`)}>Save changes</Button></Card></FlowShell>;
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{[["Profile", "/settings/profile", "👤"], ["Verification", "/settings/verification", "✅"], ["Security", "/settings/security", "🔐"], ["Sessions", "/settings/sessions", "🕒"], ["Payment Methods", "/settings/payment-methods", "💳"], ["Notifications", "/settings/notifications", "🔔"], ["Telegram", "/settings/telegram", "✈️"], ["Privacy", "/settings/privacy", "🛡️"], ["Limits", "/settings/limits", "📏"], ["Account Activity", "/settings/account-activity", "📜"]].map(([label, href, icon]) => <Link key={href} href={href}><Card className="transition hover:border-blue-200 hover:bg-amlbt-primary-soft"><div className="text-2xl">{icon}</div><h3 className="mt-2 font-semibold">{label}</h3><p className="text-sm text-amlbt-text-muted">Open and manage {label.toLowerCase()}.</p></Card></Link>)}</div></FlowShell>;
}

function SecurityToggle({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return <div className="flex items-center justify-between rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div><b>{label}</b><div className="text-xs text-amlbt-text-muted">{checked ? "Enabled" : "Disabled"}</div></div><Button variant={checked ? "secondary" : "primary"} onClick={onClick}>{checked ? "Disable" : "Enable"}</Button></div>;
}

function PaymentMethodsFlow({ state, setState, log, reset, source, syncError }: { state: WebState; setState: Dispatch<SetStateAction<WebState>>; log: (m: string, tone?: LogItem["tone"]) => void; reset: () => void | Promise<void>; source?: string; syncError?: string }) {
  const [form, setForm] = useState({ methodName: "CBE Bank", providerName: "Commercial Bank of Ethiopia", accountHolderName: "Milkessa Tesso", accountMasked: "****1234", fiat: "ETB" });
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[1fr_360px]"><div className="space-y-3">{state.paymentMethods.map((pm) => <Card key={pm.id} className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><h3 className="font-semibold">{pm.methodName}</h3><p className="text-sm text-amlbt-text-muted">{pm.providerName} · {pm.accountHolderName} · {pm.accountMasked}</p></div><div className="flex gap-2"><StatusBadge status={pm.verified ? "approved" : "pending"} /><Button size="sm" variant="secondary" onClick={() => { setState((p) => ({ ...p, paymentMethods: p.paymentMethods.map((item) => item.id === pm.id ? { ...item, visibility: item.visibility === "visible" ? "hidden" : "visible" } : item) })); log(`${pm.methodName} visibility changed.`); }}>{pm.visibility === "visible" ? "Hide" : "Show"}</Button><Button size="sm" variant="danger" onClick={() => { setState((p) => ({ ...p, paymentMethods: p.paymentMethods.filter((item) => item.id !== pm.id) })); log(`${pm.methodName} deleted.`, "danger"); }}>Delete</Button></div></Card>)}</div><Card className="space-y-3"><h3 className="font-semibold">Add payment method</h3><Input label="Method" value={form.methodName} onChange={(e) => setForm({ ...form, methodName: e.target.value })} /><Input label="Provider" value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })} /><Input label="Account holder" value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} /><Input label="Masked account" value={form.accountMasked} onChange={(e) => setForm({ ...form, accountMasked: e.target.value })} /><Button onClick={() => { setState((p) => ({ ...p, paymentMethods: [{ id: makeId("upm"), userId: "user_001", ...form, visibility: "visible", verified: false }, ...p.paymentMethods] })); log(`Added ${form.methodName}.`, "success"); }}>Add method</Button></Card></div></FlowShell>;
}

export function NotificationsFlow() {
  const { state, setState, log, reset, source, syncError } = useWebState();
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><Card><div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center"><h2 className="text-xl font-bold">Notification center</h2><div className="flex gap-2"><Button variant="secondary" onClick={() => { setState((p) => ({ ...p, notifications: p.notifications.map((n) => ({ ...n, read: true })) })); log("All notifications marked read."); }}>Mark all read</Button><Button onClick={() => { const n: AnyNotification = { id: makeId("ntf"), type: "order", title: "Test order alert", body: "This is a mock notification from the frontend.", channel: "in_app", status: "sent", createdAt: now(), read: false }; setState((p) => ({ ...p, notifications: [n, ...p.notifications] })); log("Test notification created."); }}>Send test</Button></div></div><div className="space-y-3">{state.notifications.map((n) => <div key={n.id} className="flex items-start justify-between gap-3 rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div><b>{n.title}</b><p className="text-sm text-amlbt-text-muted">{n.body}</p><Badge>{n.channel}</Badge></div><Button size="sm" variant={n.read ? "secondary" : "primary"} onClick={() => { setState((p) => ({ ...p, notifications: p.notifications.map((item) => item.id === n.id ? { ...item, read: !item.read } : item) })); log(`${n.title} ${n.read ? "unread" : "read"}.`); }}>{n.read ? "Unread" : "Read"}</Button></div>)}</div></Card></FlowShell>;
}

export function DisputesFlow({ disputeId }: { disputeId?: string }) {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const disputes = disputeId ? state.disputes.filter((d) => d.id === disputeId) : state.disputes;
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="space-y-3">{disputes.map((d) => <Card key={d.id} className="space-y-3"><div className="flex items-center justify-between"><h3 className="font-semibold">{d.id}</h3><StatusBadge status={d.status} /></div><p className="text-sm text-amlbt-text-muted">Order #{d.orderId} · {d.reason} · {d.amount} {d.asset}</p><div className="grid gap-2 sm:grid-cols-3"><SoftCard>Buyer evidence: <b>{d.buyerEvidenceCount}</b></SoftCard><SoftCard>Seller evidence: <b>{d.sellerEvidenceCount}</b></SoftCard><SoftCard>Moderator: <b>{d.assignedModerator ?? "Unassigned"}</b></SoftCard></div><div className="flex flex-wrap gap-2"><Button onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((item) => item.id === d.id ? { ...item, status: "under_review" } : item) })); log(`${d.id} moved under review.`, "warning"); }}>Start review</Button><Button variant="secondary" onClick={() => log(`Evidence uploaded for ${d.id}.`, "primary")}>Upload evidence</Button><Button variant="danger" onClick={() => { setState((p) => ({ ...p, disputes: p.disputes.map((item) => item.id === d.id ? { ...item, status: "escalated" } : item) })); log(`${d.id} escalated.`, "danger"); }}>Escalate</Button></div></Card>)}</div></FlowShell>;
}

export function SupportFlow() {
  const { state, setState, log, reset, source, syncError } = useWebState();
  const [subject, setSubject] = useState("Question about payment proof");
  const [body, setBody] = useState("");
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[360px_1fr]"><Card className="space-y-3"><h2 className="text-xl font-bold">Create support ticket</h2><Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} /><Textarea label="Message" value={body} onChange={(e) => setBody(e.target.value)} /><Button onClick={() => { const ticket = { id: `SUP-${Math.floor(100 + Math.random() * 899)}`, userId: "user_001", subject, status: "open" as const, priority: "normal" as const, category: "general", createdAt: now() }; setState((p) => ({ ...p, supportTickets: [ticket, ...p.supportTickets] })); log(`Support ticket ${ticket.id} created.`); }}>Create ticket</Button></Card><div className="space-y-3">{state.supportTickets.map((t) => <Card key={t.id}><div className="flex items-center justify-between"><b>{t.id}</b><StatusBadge status={t.status} /></div><p className="text-sm text-amlbt-text-muted">{t.subject} · {t.priority}</p></Card>)}</div></div></FlowShell>;
}

export function ProfileFlow({ username }: { username: string }) {
  const { state, log, reset, source, syncError } = useWebState();
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase()) ?? users[1];
  const userAds = state.ads.filter((ad) => ad.traderId === user.id && ad.status === "active");
  const userOrders = state.orders.filter((order) => order.buyerId === user.id || order.sellerId === user.id);
  return <FlowShell logs={state.logs} reset={reset} source={source} syncError={syncError}><div className="grid gap-4 lg:grid-cols-[360px_1fr]"><Card className="space-y-3"><div className="grid h-20 w-20 place-items-center rounded-full bg-amlbt-primary-soft text-2xl font-black text-amlbt-primary-dark">{user.avatarInitials}</div><div><h2 className="text-2xl font-black">{user.username}</h2><p className="text-sm text-amlbt-text-muted">{user.displayName} · {user.country}</p></div><div className="flex flex-wrap gap-2"><StatusBadge status={user.kycStatus} /><Badge tone={user.riskLevel === "high" ? "danger" : user.riskLevel === "medium" ? "warning" : "success"}>{user.riskLevel} risk</Badge></div><div className="grid grid-cols-2 gap-2"><SoftCard><b>{user.completedTrades}</b><br />Trades</SoftCard><SoftCard><b>{user.completionRate}%</b><br />Completion</SoftCard><SoftCard><b>{user.averageReleaseMinutes ?? 6}m</b><br />Avg release</SoftCard><SoftCard><b>{user.rating}</b><br />Rating</SoftCard></div><div className="flex gap-2"><Button variant="secondary" onClick={() => log(`${user.username} reported to support queue.`, "warning")}>Report</Button><Button variant="danger" onClick={() => log(`${user.username} blocked locally.`, "danger")}>Block</Button></div></Card><div className="space-y-4"><Card><h3 className="mb-3 font-semibold">Active ads</h3><div className="grid gap-3 md:grid-cols-2">{userAds.length ? userAds.map((ad) => <div key={ad.id} className="rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><div className="flex justify-between"><b>{ad.side.toUpperCase()} {ad.asset}</b><StatusBadge status={ad.status} /></div><p className="text-sm text-amlbt-text-muted">{ad.price} {ad.fiat} · {ad.paymentMethods.join(", ")}</p><Link href={`/market/${ad.id}`}><Button size="sm" className="mt-2">Open offer</Button></Link></div>) : <p className="text-sm text-amlbt-text-muted">No active public ads.</p>}</div></Card><Card><h3 className="mb-3 font-semibold">Public trade history</h3><div className="space-y-2">{userOrders.slice(0, 5).map((order) => <div key={order.id} className="flex items-center justify-between rounded-xl border border-amlbt-border-soft bg-amlbt-muted p-3"><span className="text-sm">#{order.id} · {order.assetAmount} {order.asset}</span><StatusBadge status={order.status} /></div>)}</div></Card></div></div></FlowShell>;
}
