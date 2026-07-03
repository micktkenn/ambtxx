"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  ads as seedAds,
  assets,
  disputes as seedDisputes,
  messages as seedMessages,
  notifications as seedNotifications,
  orderEvents as seedEvents,
  orders as seedOrders,
  paymentMethods as platformPaymentMethods,
  securitySettings as seedSecurity,
  sessions as seedSessions,
  supportTickets as seedSupportTickets,
  userPaymentMethods as seedPaymentMethods,
  users,
  wallet as seedWallet
} from "@amlbt/mock-data";
import {
  createPersistentAd,
  createPersistentNotification,
  createPersistentOrder,
  getSnapshotModeLabel,
  loadSnapshot,
  openPersistentDispute,
  recordUserActivity,
  saveSnapshot,
  scheduleWebStateTableSync,
  sendPersistentOrderMessage,
  updatePersistentOrderStatus
} from "@amlbt/supabase";
import { Badge, Button, Card, Input, Select, SoftCard, StatusBadge, Textarea } from "@amlbt/ui";
import type { Ad, ChatMessage, Dispute, Notification, Order, Session, UserPaymentMethod } from "@amlbt/types";

type LogItem = { id: string; message: string; tone?: "success" | "warning" | "danger" | "primary" | "neutral"; at: string };
type AnyOrder = Order & { proofUploaded?: boolean; feedback?: string };
type AnyAd = Ad & { views?: number; orders?: number };
type AnyDispute = Dispute & { notes?: string[] };
type AnyMessage = ChatMessage;
type AnyPaymentMethod = UserPaymentMethod & { isDefault?: boolean; enabled?: boolean };
type AnyNotification = Notification & { read?: boolean };
type AnySession = Session;

type WebState = {
  auth: { loggedIn: boolean; step: "login" | "2fa" | "done"; email: string; newDevice: boolean };
  onboarding: Record<string, boolean>;
  orders: AnyOrder[];
  ads: AnyAd[];
  disputes: AnyDispute[];
  messages: AnyMessage[];
  events: typeof seedEvents;
  paymentMethods: AnyPaymentMethod[];
  notifications: AnyNotification[];
  sessions: AnySession[];
  security: typeof seedSecurity;
  wallet: typeof seedWallet & { connected?: boolean; network?: string };
  supportTickets: typeof seedSupportTickets;
  logs: LogItem[];
};

const initialState: WebState = {
  auth: { loggedIn: false, step: "login", email: "abel@example.com", newDevice: true },
  onboarding: { account: true, email: true, wallet: true, twofa: true, kyc: false, payment: false },
  orders: seedOrders.map((order) => ({ ...order })),
  ads: seedAds.map((ad, index) => ({ ...ad, views: 420 + index * 94, orders: index + 2 })),
  disputes: seedDisputes.map((item) => ({ ...item, notes: [] })),
  messages: seedMessages.map((item) => ({ ...item })),
  events: seedEvents.map((item) => ({ ...item })),
  paymentMethods: seedPaymentMethods.map((item, index) => ({ ...item, isDefault: index === 0, enabled: item.visibility !== "hidden" })),
  notifications: seedNotifications.map((item) => ({ ...item, read: false })),
  sessions: seedSessions.map((item) => ({ ...item })),
  security: { ...seedSecurity },
  wallet: { ...seedWallet, connected: true, network: "TRC20 (Tron)" },
  supportTickets: seedSupportTickets.map((item) => ({ ...item })),
  logs: []
};

const ETB_RATE = 58.8;
const currentUser = { name: "Abel Tesfaye", initials: "AT", avatar: "👨🏽" };

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
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

    scheduleWebStateTableSync(state, (result) => {
      if (result.errors.length) setSyncError(`Table sync warnings: ${result.errors.slice(0, 3).join(" | ")}`);
    });
  }, [state, ready]);

  const log = (message: string, tone: LogItem["tone"] = "success") => {
    setState((prev) => ({ ...prev, logs: [{ id: makeId("log"), message, tone, at: now() }, ...prev.logs].slice(0, 4) }));
    void recordUserActivity(message, { source: "visual-v0.7" }, tone);
  };

  return { state, setState, log, ready, source, syncError };
}

function traderFor(id: string) {
  return users.find((user) => user.id === id) ?? users[0];
}

function orderCounterparty(order: AnyOrder) {
  return traderFor(order.side === "buy" ? order.sellerId : order.buyerId);
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

function shortAddress(address: string) {
  if (address.length <= 18) return address;
  return `${address.slice(0, 10)}...${address.slice(-8)}`;
}

function AppPage({ children, state, syncError, source }: { children: ReactNode; state: WebState; syncError?: string; source?: string }) {
  return (
    <div className="space-y-4">
      {children}
      <div className="sr-only">Data source: {source ?? getSnapshotModeLabel()}. {syncError ?? "Automatic persistence enabled."}</div>
      {state.logs.length ? (
        <div className="fixed right-4 top-20 z-50 hidden w-80 space-y-2 xl:block">
          {state.logs.slice(0, 2).map((item) => (
            <div key={item.id} className="rounded-2xl border border-blue-100 bg-white/95 p-3 text-sm shadow-popover backdrop-blur">
              <Badge tone={item.tone ?? "success"}>{item.tone ?? "success"}</Badge>
              <span className="ml-2 text-slate-700">{item.message}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function PageGrid({ children, state }: { children: ReactNode; state: WebState }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <LeftRail state={state} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function LeftRail({ state }: { state: WebState }) {
  const usdt = state.wallet.balances.find((item) => item.asset === "USDT");
  const totalEtb = (usdt?.available ?? 0) * ETB_RATE;
  const escrowEtb = (usdt?.escrowLocked ?? 0) * ETB_RATE;
  return (
    <aside className="hidden space-y-5 xl:block">
      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-100 p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Wallet Summary</h3>
            <span className="text-slate-400">⌾</span>
          </div>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-sm text-slate-500">Available Balance</p>
            <div className="text-2xl font-black tracking-tight">{money(totalEtb)} ETB</div>
            <p className="text-sm text-slate-500">≈ {money(usdt?.available ?? 0)} USDT</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">In Escrow</p>
            <div className="text-2xl font-black tracking-tight">{money(escrowEtb)} ETB</div>
            <p className="text-sm text-slate-500">≈ {money(usdt?.escrowLocked ?? 0)} USDT</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/wallet/add-funds"><Button className="w-full">＋ Add Funds</Button></Link>
            <Link href="/wallet/send"><Button className="w-full" variant="secondary">✈ Send</Button></Link>
          </div>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="border-b border-slate-100 p-5"><h3 className="font-bold">Quick Actions</h3></div>
        <div className="divide-y divide-slate-100">
          <RailLink href="/market" icon="💵" title="Buy USDT" sub="Find the best offers" />
          <RailLink href="/ads/create" icon="📣" title="Create Ad" sub="Post a new P2P ad" />
          <RailLink href="/settings/payment-methods" icon="💳" title="Payment Methods" sub="Manage your payment options" />
          <RailLink href="/disputes" icon="🛡️" title="Disputes" sub="Manage your disputes" />
        </div>
      </Card>

      <Card className="space-y-3">
        <div className="flex items-center gap-2 font-bold text-slate-900">🛡️ Safety Tips</div>
        <p className="text-sm leading-6 text-slate-500">Always use AMLBT escrow for secure transactions. Never release assets outside the platform.</p>
        <Link href="/support" className="text-sm font-bold text-amlbt-primary-dark">Learn more →</Link>
      </Card>
    </aside>
  );
}

function RailLink({ href, icon, title, sub }: { href: string; icon: string; title: string; sub: string }) {
  return <Link href={href} className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-lg">{icon}</span><span className="min-w-0 flex-1"><b className="block text-sm">{title}</b><span className="block truncate text-xs text-slate-500">{sub}</span></span><span className="text-slate-400">›</span></Link>;
}

function AssetIcon({ symbol }: { symbol: string }) {
  const map: Record<string, string> = { USDT: "₮", BTC: "₿", ETH: "♦", BNB: "◎", USDC: "$" };
  const color: Record<string, string> = { USDT: "bg-emerald-600", BTC: "bg-orange-500", ETH: "bg-indigo-500", BNB: "bg-amber-500", USDC: "bg-blue-500" };
  return <span className={`grid h-10 w-10 place-items-center rounded-full text-sm font-black text-white ${color[symbol] ?? "bg-slate-700"}`}>{map[symbol] ?? symbol.slice(0, 1)}</span>;
}

function MiniStep({ n, label, done }: { n: number; label: string; done?: boolean }) {
  return <div className="flex items-center gap-3"><span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${done ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>{n}</span><span className="text-sm font-semibold text-slate-700">{label}</span></div>;
}

export function AuthFlow({ mode }: { mode: "login" | "register" }) {
  const { state, setState, log, source, syncError } = useWebState();
  const [email, setEmail] = useState(state.auth.email);
  const [otp, setOtp] = useState("");
  const submit = () => {
    setState((prev) => ({ ...prev, auth: { ...prev.auth, step: "2fa", email, newDevice: true } }));
    log(`${mode === "login" ? "Login" : "Registration"} accepted. New-device 2FA required.`, "primary");
  };
  const verify = () => {
    setState((prev) => ({ ...prev, auth: { ...prev.auth, loggedIn: true, step: "done", newDevice: false } }));
    log(`2FA verified with code ${otp || "000000"}.`, "success");
  };

  return (
    <main className="min-h-dvh bg-white text-slate-950">
      <header className="mx-auto flex max-w-[1480px] items-center justify-between border-b border-slate-100 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 text-3xl font-black text-blue-700"><span className="text-4xl">ᗩ</span> AMLBT</Link>
        <Link href={mode === "login" ? "/register" : "/login"}><Button variant="secondary">{mode === "login" ? "Create account" : "Sign in"}</Button></Link>
      </header>
      <section className="mx-auto grid max-w-[1440px] gap-0 px-5 py-12 lg:grid-cols-[0.82fr_1.18fr]">
        <Card className="rounded-r-none border-slate-200 p-10 shadow-none">
          <h1 className="text-4xl font-black tracking-tight">Welcome to AMLBT</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-slate-500">Sign in or create your account to start trading with confidence.</p>
          <div className="mt-12 space-y-5">
            <Input label="Sign in with email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} />
            {mode === "register" ? <Input label="Username" placeholder="Choose username" defaultValue="AbelTrade" /> : null}
            <Button className="h-14 w-full text-base" onClick={submit}>Continue with Email</Button>
            {state.auth.step === "2fa" || state.auth.step === "done" ? <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4"><div className="mb-2 flex items-center justify-between"><b>New-device 2FA</b><Badge tone={state.auth.step === "done" ? "success" : "warning"}>{state.auth.step === "done" ? "Verified" : "Required"}</Badge></div><Input label="Authenticator code" placeholder="123 456" value={otp} onChange={(event) => setOtp(event.target.value)} /><Button className="mt-3 w-full" onClick={verify} disabled={state.auth.step === "done"}>{state.auth.step === "done" ? "Verified" : "Verify and continue"}</Button></div> : null}
            <div className="grid gap-3">
              {["Continue with Google", "Continue with Apple", "Continue with Telegram", "Continue with Twitter"].map((label) => <Button key={label} variant="secondary" className="h-12 w-full">{label}</Button>)}
            </div>
            {state.auth.loggedIn ? <Link href="/dashboard"><Button className="w-full" size="lg">Open dashboard</Button></Link> : null}
          </div>
        </Card>
        <Card className="hidden rounded-l-none border-l-0 p-10 shadow-none lg:block">
          <Badge tone="primary">Secure. Simple. Built for traders.</Badge>
          <h2 className="mt-8 max-w-lg text-4xl font-black tracking-tight">Trade with a wallet you control</h2>
          <p className="mt-4 max-w-xl text-slate-500">AMLBT uses embedded wallets to give you a seamless and secure trading experience.</p>
          <div className="mt-10 grid grid-cols-4 gap-4 text-center text-sm text-slate-500">
            {["No seed phrases", "No extensions needed", "Fast onboarding", "You're in control"].map((item) => <div key={item} className="rounded-2xl bg-slate-50 p-4"><div className="mb-3 text-2xl text-blue-600">✦</div>{item}</div>)}
          </div>
          <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_220px]">
            <Card className="space-y-5 shadow-none">
              <h3 className="text-xl font-bold">Connect Wallet</h3>
              <div className="rounded-2xl border-2 border-blue-500 p-5"><div className="flex items-center justify-between"><b>Web3Auth / Embedded Wallet</b><Badge tone="primary">Recommended</Badge></div><p className="mt-2 text-sm text-slate-500">Secure, non-custodial wallet created for you by Web3Auth.</p></div>
              <div className="rounded-2xl border border-slate-200 p-5"><b>I already have a wallet</b><p className="mt-2 text-sm text-slate-500">Connect with MetaMask, WalletConnect or other wallets.</p></div>
              <Select label="Network" defaultValue="Ethereum (ETH)"><option>Ethereum (ETH)</option><option>TRC20 (Tron)</option><option>BNB Smart Chain</option></Select>
            </Card>
            <Card className="space-y-5 shadow-none">
              <h3 className="font-bold">Your onboarding journey</h3>
              <MiniStep n={1} label="Create account" done /><MiniStep n={2} label="Verify email" /><MiniStep n={3} label="Connect wallet" /><MiniStep n={4} label="Enable 2FA" /><MiniStep n={5} label="Start trading" />
            </Card>
          </div>
        </Card>
      </section>
      <div className="sr-only">{source} {syncError}</div>
    </main>
  );
}

export function DashboardFlow() {
  const { state, setState, log, source, syncError } = useWebState();
  const bestAds = state.ads.filter((ad) => ad.status === "active").slice(0, 5);
  return (
    <AppPage state={state} source={source} syncError={syncError}>
      <PageGrid state={state}>
        <div className="space-y-5">
          <WalletHero state={state} compact={false} />
          <Card className="overflow-hidden p-0">
            <div className="border-b border-slate-100 p-5"><div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><Input className="md:w-[520px]" placeholder="Search by username or payment method" /><div className="flex gap-2"><Select defaultValue="ETB" className="w-28"><option>ETB</option><option>USD</option></Select><Button variant="secondary">☰ Filter</Button></div></div></div>
            <div className="border-b border-slate-100 px-5"><div className="flex gap-10"><button className="border-b-4 border-blue-600 py-4 font-black text-blue-700">Buy</button><button className="py-4 font-semibold text-slate-500">Sell</button></div></div>
            <div className="grid gap-3 p-5 sm:grid-cols-4">{["USDT", "BTC", "ETH", "BNB"].map((asset) => <button key={asset} className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold"><AssetIcon symbol={asset} /> {asset}</button>)}</div>
            <div className="hidden overflow-x-auto md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-4">Traders</th><th>Price (ETB)</th><th>Limit (ETB)</th><th>Payment Methods</th><th>Completion</th><th className="pr-5">Action</th></tr></thead><tbody>{bestAds.map((ad, index) => <MarketRow key={ad.id} ad={ad} index={index} setState={setState} log={log} />)}</tbody></table></div>
            <div className="grid gap-3 p-4 md:hidden">{bestAds.map((ad, index) => <MarketCard key={ad.id} ad={ad} index={index} setState={setState} log={log} />)}</div>
          </Card>
        </div>
      </PageGrid>
    </AppPage>
  );
}

function WalletHero({ state, compact }: { state: WebState; compact?: boolean }) {
  const usdt = state.wallet.balances.find((item) => item.asset === "USDT");
  const totalEtb = (usdt?.available ?? 0) * ETB_RATE;
  const escrowEtb = (usdt?.escrowLocked ?? 0) * ETB_RATE;
  return <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-5 text-white shadow-card"><div className="flex items-center justify-between"><span className="text-sm font-medium opacity-90">Wallet Balance</span><span>⌾</span></div><div className="mt-3 grid gap-3 md:grid-cols-2"><div><p className="text-xs opacity-80">Available Balance</p><div className={`${compact ? "text-2xl" : "text-3xl"} font-black tracking-tight`}>{money(totalEtb)} ETB</div><p className="text-sm opacity-90">≈ {money(usdt?.available ?? 0)} USDT</p></div><div><p className="text-xs opacity-80">In Escrow</p><div className={`${compact ? "text-2xl" : "text-3xl"} font-black tracking-tight`}>{money(escrowEtb)} ETB</div><p className="text-sm opacity-90">≈ {money(usdt?.escrowLocked ?? 0)} USDT</p></div></div><div className="mt-5 grid grid-cols-2 gap-3"><Link href="/wallet/add-funds"><Button variant="secondary" className="w-full border-white/30 bg-white text-blue-700">＋ Add Funds</Button></Link><Link href="/wallet/send"><Button variant="secondary" className="w-full border-white/30 bg-white text-blue-700">✈ Send</Button></Link></div></div>;
}

function MarketRow({ ad, index, setState, log }: { ad: AnyAd; index: number; setState: Dispatch<SetStateAction<WebState>>; log: (message: string, tone?: LogItem["tone"]) => void }) {
  const trader = traderFor(ad.traderId);
  return <tr className="border-t border-slate-100"><td className="px-5 py-5"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-slate-900 text-lg font-black text-white">{trader.username.slice(0, 1)}</span><span><b>{trader.username}</b><span className="ml-1 text-blue-600">●</span><span className="block text-xs text-slate-500">{trader.completedTrades.toLocaleString()} orders · <span className="text-green-600">Online</span></span></span></div></td><td><b className="text-xl">{ad.price.toFixed(2)}</b><span className="block text-xs font-bold text-green-600">/ USDT</span></td><td>{money(ad.minFiat)} – {money(ad.maxFiat)}<br />ETB</td><td><div className="flex flex-wrap gap-1">{ad.paymentMethods.slice(0, 3).map((m) => <Badge key={m} tone="neutral">{m}</Badge>)}</div></td><td><span className="font-bold text-green-600">👍 {trader.completionRate}%</span><br /><span className="text-xs text-slate-500">({trader.completedTrades})</span></td><td className="pr-5"><BuyButton ad={ad} setState={setState} log={log} /></td></tr>;
}

function MarketCard({ ad, index, setState, log }: { ad: AnyAd; index: number; setState: Dispatch<SetStateAction<WebState>>; log: (message: string, tone?: LogItem["tone"]) => void }) {
  const trader = traderFor(ad.traderId);
  return <Card className="space-y-3 shadow-none"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-900 font-black text-white">{trader.username.slice(0, 1)}</span><div><b>{trader.username}</b><p className="text-xs text-slate-500">{trader.completedTrades} orders · {trader.completionRate}%</p></div></div><Badge tone="success">Online</Badge></div><div className="flex items-end justify-between"><div><div className="text-2xl font-black">{ad.price.toFixed(2)}</div><div className="text-xs font-bold text-green-600">ETB / USDT</div></div><BuyButton ad={ad} setState={setState} log={log} /></div><div className="text-sm text-slate-500">{money(ad.minFiat)} – {money(ad.maxFiat)} ETB</div><div className="flex flex-wrap gap-1">{ad.paymentMethods.map((m) => <Badge key={m}>{m}</Badge>)}</div></Card>;
}

function BuyButton({ ad, setState, log }: { ad: AnyAd; setState: Dispatch<SetStateAction<WebState>>; log: (message: string, tone?: LogItem["tone"]) => void }) {
  const create = () => {
    const order: AnyOrder = { id: `ORD-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, side: "buy", buyerId: "user_001", sellerId: ad.traderId, asset: ad.asset, assetAmount: 500, fiat: ad.fiat, fiatAmount: 500 * ad.price, price: ad.price, status: "payment_pending", escrowStatus: "funded", paymentMethod: ad.paymentMethods[0], paymentAccountName: traderFor(ad.traderId).displayName, paymentAccountMasked: "100 1234 5678 9012", createdAt: now() };
    setState((prev) => ({ ...prev, orders: [order, ...prev.orders] }));
    log(`Order ${order.id} created and saved automatically.`, "primary");
    void createPersistentOrder(order);
  };
  return <Button onClick={create}>Buy</Button>;
}

export function MarketFlow({ selectedAdId }: { selectedAdId?: string }) {
  return <DashboardFlow />;
}

export function OnboardingFlow() {
  const { state, setState, log, source, syncError } = useWebState();
  const steps = ["Create account", "Verify email", "Connect wallet", "Enable 2FA", "Start trading"];
  return <AppPage state={state} source={source} syncError={syncError}><div className="mx-auto max-w-5xl"><Card className="grid gap-8 p-8 lg:grid-cols-[1fr_300px]"><div><Badge tone="primary">Secure onboarding</Badge><h1 className="mt-4 text-4xl font-black tracking-tight">Trade with a wallet you control</h1><p className="mt-3 max-w-xl text-slate-500">Complete your account setup, connect wallet, enable 2FA, and start trading with confidence.</p><div className="mt-8 grid gap-3">{steps.map((step, index) => <div key={step} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4"><MiniStep n={index + 1} label={step} done={index < 2 || state.onboarding[step.toLowerCase().split(" ")[0]]} /><Button size="sm" variant="secondary" onClick={() => { setState((prev) => ({ ...prev, onboarding: { ...prev.onboarding, [step.toLowerCase().split(" ")[0]]: true } })); log(`${step} completed.`); }}>Complete</Button></div>)}</div></div><div className="space-y-5"><Card className="shadow-none"><h3 className="font-bold">Connect Wallet</h3><div className="mt-4 rounded-2xl border-2 border-blue-500 p-4"><b>Web3Auth / Embedded Wallet</b><p className="text-sm text-slate-500">Recommended non-custodial wallet.</p></div></Card><SoftCard className="text-sm text-blue-900">🔒 AMLBT does not store or have access to your private keys.</SoftCard></div></Card></div></AppPage>;
}

export function AdsFlow({ mode = "list" }: { mode?: "list" | "create" }) {
  const { state, setState, log, source, syncError } = useWebState();
  const [price, setPrice] = useState("118.50");
  const publish = () => {
    const ad: AnyAd = { id: makeId("ad"), side: "sell", asset: "USDT", fiat: "ETB", price: Number(price), priceType: "fixed", availableAmount: 5000, minFiat: 500, maxFiat: 50000, paymentMethods: ["CBE", "Telebirr", "Bank Transfer"], paymentWindowMinutes: 15, traderId: "user_001", terms: "Please send payment from your own account. No third-party payments.", status: "active", requirements: { minKycLevel: 1, minCompletedTrades: 10, minRating: 4, require2fa: true }, views: 0, orders: 0 };
    setState((prev) => ({ ...prev, ads: [ad, ...prev.ads] }));
    log("Sell ad published and saved to Supabase automatically.", "success");
    void createPersistentAd(ad);
  };
  if (mode === "create") return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="p-0 overflow-hidden"><div className="grid lg:grid-cols-[220px_minmax(0,1fr)_300px]"><aside className="hidden border-r border-slate-100 p-6 lg:block"><h3 className="mb-5 font-bold">Create Sell Ad</h3>{["Ad Details", "Pricing", "Payment & Terms", "Buyer Requirements", "Review & Publish"].map((s, i) => <div key={s} className={`mb-3 flex items-center gap-3 rounded-xl p-3 ${i === 0 ? "bg-blue-50 text-blue-700" : "text-slate-500"}`}><span className="grid h-8 w-8 place-items-center rounded-full border">{i + 1}</span><b className="text-sm">{s}</b></div>)}</aside><div className="space-y-6 p-6"><h1 className="text-2xl font-black">Ad Details</h1><div className="grid gap-4 md:grid-cols-4"><Select label="I want to"><option>Sell</option><option>Buy</option></Select><Select label="Asset"><option>USDT</option></Select><Select label="Network"><option>Tron (TRC20)</option><option>BNB Chain</option></Select><Select label="Fiat Currency"><option>ETB</option></Select></div><h2 className="text-xl font-black">Pricing</h2><div className="grid gap-4 md:grid-cols-2"><Input label="Price per USDT" value={price} onChange={(e) => setPrice(e.target.value)} /><Input label="Available Amount" defaultValue="5,000.00" /></div><div className="grid gap-4 md:grid-cols-3"><Input label="Min Trade Amount" defaultValue="500" /><Input label="Max Trade Amount" defaultValue="50,000" /><Select label="Payment Window"><option>15 Minutes</option><option>30 Minutes</option></Select></div><h2 className="text-xl font-black">Payment Methods</h2><div className="flex flex-wrap gap-2">{["CBE", "Telebirr", "Awash Bank", "Bank Transfer"].map((m) => <button key={m} className="rounded-xl border border-blue-300 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">☑ {m}</button>)}</div><Textarea label="Terms" defaultValue="Please send payment from your own account. No third-party payments. Make sure to double-check the amount before sending." /><Button className="w-full md:w-auto" onClick={publish}>Continue / Publish</Button></div><aside className="border-l border-slate-100 p-6"><h3 className="font-bold">Live Summary</h3><div className="mt-5 space-y-4"><div className="flex items-center gap-3"><AssetIcon symbol="USDT" /><b>USDT via Tron (TRC20)</b></div><Row label="Price" value={`${price} ETB / USDT`} /><Row label="Limits" value="500.00 – 50,000.00 ETB" /><Row label="Available" value="5,000.00 USDT" /><SoftCard>Est. Fee <b className="float-right">0.20%</b></SoftCard></div></aside></div></Card></PageGrid></AppPage>;
  return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h1 className="text-2xl font-black">My Ads</h1><Link href="/ads/create"><Button>＋ Create Ad</Button></Link></div><div className="divide-y divide-slate-100">{state.ads.map((ad) => <div key={ad.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-3"><AssetIcon symbol={ad.asset} /><div><b>{ad.side.toUpperCase()} {ad.asset}</b><p className="text-sm text-slate-500">{ad.price} {ad.fiat} · {money(ad.minFiat)}–{money(ad.maxFiat)} ETB</p></div></div><div className="flex gap-2"><StatusBadge status={ad.status} /><Button size="sm" variant="secondary" onClick={() => { const next = ad.status === "active" ? "paused" : "active"; setState((prev) => ({ ...prev, ads: prev.ads.map((x) => x.id === ad.id ? { ...x, status: next } : x) })); log(`Ad ${ad.id} ${next}.`, "warning"); }}>Toggle</Button></div></div>)}</div></Card></PageGrid></AppPage>;
}

function Row({ label, value }: { label: string; value: string }) { return <div className="border-b border-slate-100 py-3"><span className="text-sm text-slate-500">{label}</span><b className="float-right text-sm">{value}</b></div>; }

export function OrdersFlow({ orderId, mode = "list" }: { orderId?: string; mode?: "list" | "detail" | "release" | "dispute" }) {
  const { state, setState, log, source, syncError } = useWebState();
  const order = state.orders.find((item) => item.id === orderId) ?? state.orders[0];
  const relatedMessages = state.messages.filter((m) => m.orderId === order.id);
  const [chat, setChat] = useState("");
  const sendChat = () => { if (!chat.trim()) return; const msg: AnyMessage = { id: makeId("msg"), orderId: order.id, senderType: "user", senderName: currentUser.name, body: chat, createdAt: now() }; setState((prev) => ({ ...prev, messages: [...prev.messages, msg] })); log("Chat message saved remotely.", "primary"); void sendPersistentOrderMessage(msg); setChat(""); };
  const markPaid = (status: Order["status"]) => { setState((prev) => ({ ...prev, orders: prev.orders.map((o) => o.id === order.id ? { ...o, status, escrowStatus: status === "released" ? "released" : o.escrowStatus } : o) })); log(`Order ${order.id} moved to ${status}.`, status === "released" ? "danger" : "primary"); void updatePersistentOrderStatus(order.id, status); };
  if (mode === "list") return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="overflow-hidden p-0"><div className="border-b border-slate-100 p-5"><h1 className="text-2xl font-black">Orders</h1></div><div className="divide-y divide-slate-100">{state.orders.map((o) => <Link href={`/orders/${o.id}`} key={o.id} className="flex flex-col gap-3 p-5 hover:bg-slate-50 md:flex-row md:items-center md:justify-between"><div><b>Order #{o.id}</b><p className="text-sm text-slate-500">{o.assetAmount} {o.asset} · {money(o.fiatAmount)} {o.fiat} · {orderCounterparty(o).username}</p></div><StatusBadge status={o.status} /></Link>)}</div></Card></PageGrid></AppPage>;
  if (mode === "dispute") return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="mx-auto max-w-2xl space-y-4"><h1 className="text-2xl font-black">Open Dispute</h1><Textarea label="Reason" defaultValue="Payment issue. Please review evidence." /><Button variant="danger" onClick={() => { const d: AnyDispute = { id: `DSP-${Math.floor(Math.random()*900+100)}`, orderId: order.id, reason: "Payment issue", status: "open", priority: "normal", amount: order.assetAmount, asset: order.asset, buyerEvidenceCount: 0, sellerEvidenceCount: 0, assignedModerator: "Queue", createdAt: now(), notes: [] }; setState((prev) => ({ ...prev, disputes: [d, ...prev.disputes], orders: prev.orders.map((o) => o.id === order.id ? { ...o, status: "disputed" } : o) })); log(`Dispute ${d.id} opened.`, "danger"); void openPersistentDispute(d); }}>Submit dispute</Button></Card></PageGrid></AppPage>;
  if (mode === "release") return <AppPage state={state} source={source} syncError={syncError}><ReleasePanel order={order} release={() => markPaid("released")} /></AppPage>;
  return <AppPage state={state} source={source} syncError={syncError}><div className="space-y-5"><div className="flex items-center justify-between"><Link href="/orders" className="text-sm font-bold text-blue-700">← Back to Orders</Link><Button variant="secondary">⋮ Order Actions</Button></div><h1 className="text-3xl font-black tracking-tight">Order #{order.id}</h1><Card className="grid gap-5 md:grid-cols-5"><div><p className="text-xs text-slate-500">Asset</p><div className="mt-2 flex items-center gap-3"><AssetIcon symbol={order.asset} /><b>{order.asset}</b></div></div><Info label="Price" value={`${order.price} ETB`} /><Info label="Amount" value={`${order.assetAmount} ${order.asset}`} /><Info label="Counterparty" value={orderCounterparty(order).username} /><Info label="Status" value={order.status} /></Card><div className="grid gap-5 lg:grid-cols-[1fr_420px]"><div className="space-y-5"><Card className="border-green-200 bg-green-50"><div className="flex justify-between gap-3"><div><p className="font-bold text-green-700">Escrow Status</p><h2 className="mt-2 text-3xl font-black text-green-700">Escrow Funded</h2><p className="text-sm text-green-700">Seller has funded the escrow and is waiting for your payment.</p></div><div className="text-right"><p className="text-sm text-green-700">Time remaining to pay</p><div className="text-4xl font-black text-green-700">29:48</div></div></div><div className="mt-5 grid gap-3 md:grid-cols-3"><Button onClick={() => markPaid("marked_paid")}>Mark as Paid</Button><Link href={`/orders/${order.id}/dispute`}><Button className="w-full" variant="secondary">Open Dispute</Button></Link><Button variant="secondary" onClick={() => markPaid("cancelled")}>Cancel Order</Button></div></Card><Card><div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Chat</h2><Badge tone="success">Secure chat</Badge></div><div className="space-y-4">{relatedMessages.concat([{ id: "local1", orderId: order.id, senderType: "counterparty", senderName: orderCounterparty(order).username, body: "Hi, I've funded the escrow. Please check and make the payment.", createdAt: now() } as AnyMessage]).map((m) => <div key={m.id} className={`max-w-[78%] rounded-2xl p-4 text-sm ${m.senderType === "user" ? "ml-auto bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>{m.body}<div className="mt-1 text-right text-[11px] opacity-70">09:43</div></div>)}</div><div className="mt-4 flex gap-2"><Input placeholder="Type a message..." value={chat} onChange={(e) => setChat(e.target.value)} /><Button onClick={sendChat}>➤</Button></div></Card></div><div className="space-y-5"><Card><h2 className="font-bold">Payment Details</h2><div className="mt-5 space-y-4"><Info label="Method" value={order.paymentMethod ?? "Telebirr"} /><Info label="Account Name" value={order.paymentAccountName ?? "Biruk Alemu"} /><Info label="Account Number" value={order.paymentAccountMasked ?? "100 1234 5678 9012"} /></div><SoftCard className="mt-5 text-sm text-blue-900">ℹ️ Important: Send only from your own account. Third-party payments may lead to cancellation.</SoftCard></Card><Card><h2 className="font-bold">Order Timeline</h2><div className="mt-4 space-y-4">{["Order Created", "Escrow Funded by Seller", "Waiting for Payment", "Payment Confirmation", "Crypto Release", "Order Completed"].map((t, i) => <div key={t} className="flex gap-3"><span className={`mt-1 h-4 w-4 rounded-full ${i < 3 ? "bg-green-500" : "bg-slate-200"}`} /><div><b className="text-sm">{t}</b><p className="text-xs text-slate-500">May 24, 2025 · 09:4{i} AM</p></div></div>)}</div></Card></div></div></div></AppPage>;
}

function Info({ label, value }: { label: string; value: string }) { return <div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-bold">{value}</p></div>; }
function ReleasePanel({ order, release }: { order: AnyOrder; release: () => void }) { const [otp, setOtp] = useState(""); return <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-popover"><div className="mb-5 flex items-center justify-between"><h1 className="text-xl font-black">Release Crypto</h1><Link href={`/orders/${order.id}`}>×</Link></div><div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700"><b>⚠️ Release cannot be reversed.</b><p>Please make sure you have received the payment.</p></div><Input className="mt-5" label="Enter 2FA Code" placeholder="••••••" value={otp} onChange={(e) => setOtp(e.target.value)} /><Button className="mt-5 w-full" variant="danger" size="lg" onClick={release}>Release Crypto</Button><Link href={`/orders/${order.id}`} className="mt-4 block text-center text-sm font-bold text-blue-700">Cancel</Link></div>; }

export function WalletFlow() {
  const { state, setState, log, source, syncError } = useWebState();
  return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><div className="space-y-5"><div className="grid gap-5 lg:grid-cols-[1fr_320px]"><WalletHero state={state} /><Card className="space-y-3"><Link href="/wallet/add-funds"><Button className="w-full" size="lg">＋ Add Funds</Button></Link><Link href="/wallet/send"><Button className="w-full" size="lg" variant="secondary">✈ Send</Button></Link><Link href="/settings/payment-methods"><Button className="w-full" size="lg" variant="secondary">💳 Payment Methods</Button></Link></Card></div><Card className="overflow-hidden p-0"><div className="border-b border-slate-100 px-5"><div className="flex gap-12"><button className="border-b-4 border-blue-600 py-4 font-black text-blue-700">Assets</button><button className="py-4 text-slate-500">Activity</button><button className="py-4 text-slate-500">Escrow</button></div></div><div className="hidden md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="px-5 py-4">Asset</th><th>Available Balance</th><th>In Escrow</th><th>Approx. Value (ETB)</th><th></th></tr></thead><tbody>{["USDT", "BTC", "ETH", "BNB"].map((symbol, i) => <tr key={symbol} className="border-t border-slate-100"><td className="px-5 py-5"><div className="flex items-center gap-3"><AssetIcon symbol={symbol} /><span><b>{symbol}</b><span className="block text-xs text-slate-500">{assets.find((a) => a.symbol === symbol)?.name ?? symbol}</span></span></div></td><td>{i === 0 ? "1,234.56" : ["0.256789", "1.125000", "6.500000"][i - 1]} {symbol}</td><td>{["269.31", "0.050000", "0.250000", "0.200000"][i]} {symbol}</td><td><b>{["58,420.68", "8,640.35", "3,780.45", "1,719.20"][i]} ETB</b></td><td className="pr-5">›</td></tr>)}</tbody></table></div><div className="grid gap-3 p-4 md:hidden">{["USDT", "BTC", "ETH", "BNB"].map((symbol, i) => <Card key={symbol} className="shadow-none"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><AssetIcon symbol={symbol} /><div><b>{symbol}</b><p className="text-xs text-slate-500">In Escrow {i === 0 ? "269.31" : "0.05"} {symbol}</p></div></div><div className="text-right"><b>{["58,420.68", "8,640.35", "3,780.45", "1,719.20"][i]} ETB</b><p className="text-xs text-slate-500">≈ balance</p></div></div></Card>)}</div></Card><RecentActivity /></div></PageGrid></AppPage>;
}

function RecentActivity() { const rows = [["Deposit", "+ 500.00 USDT", "Completed", "success"], ["Send", "- 0.010000 BTC", "Completed", "danger"], ["Escrow Locked", "- 0.250000 ETH", "Locked", "warning"], ["Deposit", "+ 200.00 USDT", "Completed", "success"], ["Send", "- 100.00 USDT", "Completed", "danger"]]; return <Card className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-black">Recent Activity</h2><Link href="/wallet" className="text-sm font-bold text-blue-700">View All</Link></div><div className="divide-y divide-slate-100">{rows.map(([label, amount, status, tone]) => <div key={`${label}${amount}`} className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">{label === "Deposit" ? "↓" : label === "Send" ? "✈" : "↑"}</span><div><b className="text-sm">{label}</b><p className="text-xs text-slate-500">USDT</p></div></div><div className="text-right"><p className={`font-bold ${tone === "success" ? "text-green-600" : tone === "danger" ? "text-red-600" : "text-orange-500"}`}>{amount}</p><Badge tone={tone as any}>{status}</Badge></div></div>)}</div></Card>; }

export function SettingsFlow({ section }: { section: "index" | "profile" | "verification" | "security" | "sessions" | "payment-methods" | "notifications" | "telegram" | "privacy" | "limits" | "account-activity" }) {
  const { state, setState, log, source, syncError } = useWebState();
  if (section === "payment-methods") return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h1 className="text-2xl font-black">Payment Methods</h1><p className="text-sm text-slate-500">Manage your payment methods for buying and selling on AMLBT.</p></div><Button onClick={() => { const method: AnyPaymentMethod = { id: makeId("upm"), userId: "user_001", methodName: "New Bank", providerName: "New Bank", accountHolderName: currentUser.name, accountMasked: "****1234", fiat: "ETB", visibility: "visible", verified: false, enabled: true }; setState((prev) => ({ ...prev, paymentMethods: [method, ...prev.paymentMethods] })); log("Payment method added and synced."); }}>＋ Add New Payment Method</Button></div><div className="divide-y divide-slate-100">{state.paymentMethods.map((pm) => <div key={pm.id} className="grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_0.7fr_0.7fr_1fr]"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-green-600 text-white">💳</span><div><b>{pm.methodName}</b><Badge className="ml-2" tone="primary">Verified</Badge><p className="text-sm text-slate-500">{pm.providerName}</p></div></div><div><p className="text-sm">{pm.accountMasked}</p><p className="text-sm text-slate-500">{pm.accountHolderName}</p></div><Badge tone={pm.enabled === false ? "danger" : "success"}>{pm.enabled === false ? "Disabled" : "Active"}</Badge><Badge tone={pm.isDefault ? "primary" : "neutral"}>{pm.isDefault ? "Default" : "Set as Default"}</Badge><div className="flex gap-2"><Button size="sm" variant="secondary">Edit</Button><Button size="sm" variant="secondary" onClick={() => { setState((prev) => ({ ...prev, paymentMethods: prev.paymentMethods.map((x) => x.id === pm.id ? { ...x, enabled: x.enabled === false } : x) })); log(`${pm.methodName} status changed.`, "warning"); }}>{pm.enabled === false ? "Enable" : "Disable"}</Button></div></div>)}</div></Card></PageGrid></AppPage>;
  return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><div className="space-y-5"><Card><h1 className="text-2xl font-black">Verification & Security</h1><p className="text-slate-500">Verify your identity to unlock higher limits and secure your account.</p><div className="mt-6 grid gap-4 md:grid-cols-3"><Level title="Contact Verified" level="Level 1" done /><Level title="Identity Verification" level="Level 2" progress /><Level title="Enhanced Due Diligence" level="Level 3" /></div></Card><Card><div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-5"><div className="grid h-20 w-20 place-items-center rounded-full border-8 border-blue-600 text-lg font-black">1/3</div><div><h2 className="font-black">Complete verification to unlock higher limits</h2><p className="text-sm text-slate-500">You’ll unlock higher limits and more features as you complete each level.</p></div></div><Button onClick={() => log("KYC verification request saved.", "primary")}>Complete verification</Button></div></Card><Card className="overflow-hidden p-0"><div className="border-b border-slate-100 p-5"><h2 className="font-black">Security Settings</h2></div><SecurityRow label="Two-Factor Authentication (2FA)" enabled onClick={() => log("2FA setting updated.")} /><SecurityRow label="Backup Codes" action="View Codes" onClick={() => log("Backup codes viewed.")} /><SecurityRow label="Telegram Alerts" enabled onClick={() => log("Telegram alerts updated.")} /><SecurityRow label="Active Sessions" action="Manage" onClick={() => log("Sessions opened.")} /><div className="p-5"><h3 className="font-black">Preferred Sensitive-Action Method</h3><div className="mt-4 grid gap-3 md:grid-cols-3"><button className="rounded-2xl border-2 border-blue-500 bg-blue-50 p-4 text-left"><b>Authenticator App</b><Badge className="ml-2" tone="success">Recommended</Badge><p className="mt-2 text-sm text-slate-500">Verify using Google Authenticator or similar apps.</p></button><button className="rounded-2xl border border-slate-200 p-4 text-left"><b>SMS Verification</b><p className="mt-2 text-sm text-slate-500">Receive codes via SMS to your phone.</p></button><button className="rounded-2xl border border-slate-200 p-4 text-left"><b>Email Verification</b><p className="mt-2 text-sm text-slate-500">Receive codes via email.</p></button></div></div></Card></div></PageGrid></AppPage>;
}
function Level({ title, level, done, progress }: { title: string; level: string; done?: boolean; progress?: boolean }) { return <Card className="shadow-none"><div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-2xl">{done ? "👤" : progress ? "🪪" : "🛡️"}</div><p className="text-sm text-slate-500">{level}</p><h3 className="font-black">{title}</h3><div className="mt-4"><Badge tone={done ? "success" : progress ? "primary" : "neutral"}>{done ? "Completed" : progress ? "In progress" : "Locked"}</Badge></div></Card>; }
function SecurityRow({ label, enabled, action, onClick }: { label: string; enabled?: boolean; action?: string; onClick: () => void }) { return <div className="flex items-center justify-between border-b border-slate-100 p-5"><div><b>{label}</b><p className="text-sm text-slate-500">Protect your account with an extra layer of security.</p></div><button onClick={onClick} className="rounded-full border border-slate-200 px-3 py-1 text-sm font-bold text-blue-700">{enabled ? "Enabled" : action ?? "Manage"}</button></div>; }

export function NotificationsFlow() { const { state, setState, log, source, syncError } = useWebState(); return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="overflow-hidden p-0"><div className="border-b border-slate-100 p-5"><h1 className="text-2xl font-black">Notifications</h1></div><div className="divide-y divide-slate-100">{state.notifications.map((n) => <div key={n.id} className="flex items-center justify-between p-5"><div><b>{n.title}</b><p className="text-sm text-slate-500">{n.body}</p></div><Button size="sm" variant="secondary" onClick={() => { setState((prev) => ({ ...prev, notifications: prev.notifications.map((x) => x.id === n.id ? { ...x, read: true } : x) })); log("Notification marked as read."); }}>Mark read</Button></div>)}</div></Card></PageGrid></AppPage>; }
export function DisputesFlow({ disputeId }: { disputeId?: string }) { const { state, source, syncError } = useWebState(); return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="overflow-hidden p-0"><div className="border-b border-slate-100 p-5"><h1 className="text-2xl font-black">Disputes</h1></div><div className="divide-y divide-slate-100">{state.disputes.map((d) => <div key={d.id} className="p-5"><div className="flex items-center justify-between"><b>{d.id}</b><StatusBadge status={d.status === "resolved" ? "completed" : "disputed"} /></div><p className="mt-2 text-sm text-slate-500">Order {d.orderId} · {d.reason} · {d.amount} {d.asset}</p></div>)}</div></Card></PageGrid></AppPage>; }
export function SupportFlow() { const { state, setState, log, source, syncError } = useWebState(); return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="space-y-4"><h1 className="text-2xl font-black">Help Center</h1><Textarea label="Message" placeholder="How can we help?" /><Button onClick={() => { setState((prev) => ({ ...prev, supportTickets: [{ id: makeId("ticket"), userId: "user_001", subject: "New support request", category: "general", status: "open", priority: "normal", createdAt: now() }, ...prev.supportTickets] })); log("Support ticket created."); }}>Create support ticket</Button></Card></PageGrid></AppPage>; }
export function ProfileFlow({ username }: { username: string }) { const { state, log, source, syncError } = useWebState(); const user = users.find((u) => u.username === username) ?? users[1]; return <AppPage state={state} source={source} syncError={syncError}><PageGrid state={state}><Card className="mx-auto max-w-2xl text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blue-50 text-4xl">{user.avatarInitials}</div><h1 className="mt-4 text-3xl font-black">{user.username}</h1><p className="text-slate-500">{user.completedTrades} trades · {user.completionRate}% completion · {user.rating} rating</p><div className="mt-5 flex justify-center gap-2"><Badge tone="success">Verified</Badge><Badge tone="primary">KYC L{user.kycLevel}</Badge></div><div className="mt-8 grid gap-3 md:grid-cols-3"><Card className="shadow-none"><b>{user.completedTrades}</b><p className="text-sm text-slate-500">Trades</p></Card><Card className="shadow-none"><b>{user.completionRate}%</b><p className="text-sm text-slate-500">Completion</p></Card><Card className="shadow-none"><b>{user.averageReleaseMinutes ?? 5}m</b><p className="text-sm text-slate-500">Avg release</p></Card></div><Button className="mt-6" variant="secondary" onClick={() => log(`Profile ${user.username} reported for review.`, "warning")}>Report / Block</Button></Card></PageGrid></AppPage>; }
