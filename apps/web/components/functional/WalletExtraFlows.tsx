"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, Card, Input, Select, SoftCard } from "@amlbt/ui";
import { persistWebActivity } from "@amlbt/supabase";

function AssetIcon({ symbol }: { symbol: string }) {
  const map: Record<string, string> = { USDT: "₮", BTC: "₿", ETH: "♦", BNB: "◎" };
  const color: Record<string, string> = { USDT: "bg-emerald-600", BTC: "bg-orange-500", ETH: "bg-indigo-500", BNB: "bg-amber-500" };
  return <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-black text-white ${color[symbol]}`}>{map[symbol]}</span>;
}

function WalletSideSummary() {
  return (
    <aside className="hidden space-y-5 xl:block">
      <Card className="space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-black">Wallet Summary</h3><span className="text-slate-400">⌾</span></div>
        <div><p className="text-sm text-slate-500">Available Balance</p><div className="text-2xl font-black">58,420.68 ETB</div><p className="text-sm text-slate-500">≈ 1,234.56 USDT</p></div>
        <div><p className="text-sm text-slate-500">In Escrow</p><div className="text-2xl font-black">12,750.00 ETB</div><p className="text-sm text-slate-500">≈ 269.31 USDT</p></div>
        <div className="grid grid-cols-2 gap-3"><Link href="/wallet/add-funds"><Button className="w-full">＋ Add Funds</Button></Link><Link href="/wallet/send"><Button className="w-full" variant="secondary">✈ Send</Button></Link></div>
      </Card>
      <Card className="space-y-3"><h3 className="font-black">Quick Actions</h3>{["Buy USDT", "Sell Crypto", "Create Ad", "Payment Methods"].map((item) => <div key={item} className="flex items-center justify-between rounded-xl p-3 hover:bg-slate-50"><span className="font-semibold">{item}</span><span>›</span></div>)}</Card>
      <Card><h3 className="font-black">Safety Tips</h3><p className="mt-3 text-sm leading-6 text-slate-500">Always use AMLBT escrow for secure transactions. Never release assets outside the platform.</p></Card>
    </aside>
  );
}

export function WalletAddFundsFlow() {
  const [asset, setAsset] = useState("USDT");
  const address = "TXzR7uSks1234567890abcdefGhijLkMnOpQ";
  const copy = () => void persistWebActivity("wallet.deposit_address.copy", { asset, address }, "primary");
  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <WalletSideSummary />
      <div className="space-y-5">
        <div className="flex items-center justify-between"><div><Link href="/wallet" className="text-sm font-bold text-blue-700">← Back to Wallet</Link><h1 className="mt-2 text-3xl font-black tracking-tight">Add Funds / Receive Crypto</h1><p className="text-slate-500">Send crypto to your AMLBT wallet using the details below.</p></div><Button variant="secondary">? How it works</Button></div>
        <Card className="overflow-hidden p-0">
          <section className="border-b border-slate-100 p-5"><h2 className="mb-4 font-black"><span className="mr-2 rounded-full bg-slate-100 px-3 py-1 text-sm">1</span>Select Asset</h2><div className="flex flex-wrap gap-3">{["USDT", "BTC", "ETH", "BNB"].map((s) => <button key={s} onClick={() => setAsset(s)} className={`flex items-center gap-2 rounded-xl border px-4 py-3 font-bold ${asset === s ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200"}`}><AssetIcon symbol={s} />{s}</button>)}</div></section>
          <section className="border-b border-slate-100 p-5"><h2 className="mb-4 font-black"><span className="mr-2 rounded-full bg-slate-100 px-3 py-1 text-sm">2</span>Select Network</h2><Select defaultValue="TRC20 (Tron)"><option>TRC20 (Tron)</option><option>BNB Smart Chain</option><option>Ethereum ERC20</option></Select></section>
          <section className="grid gap-5 border-b border-slate-100 p-5 lg:grid-cols-[1fr_280px]"><div><h2 className="mb-4 font-black"><span className="mr-2 rounded-full bg-slate-100 px-3 py-1 text-sm">3</span>Deposit Details</h2><Input label="Wallet Address" value={address} readOnly /><Button className="mt-3" variant="secondary" onClick={copy}>Copy</Button><SoftCard className="mt-4 border-orange-200 bg-orange-50 text-sm text-orange-800">⚠️ Send only {asset} to this address on TRC20 network. Sending any other asset may result in permanent loss.</SoftCard></div><Card className="grid place-items-center shadow-none"><div className="grid h-44 w-44 place-items-center rounded-2xl border-8 border-slate-900 bg-white text-4xl font-black">QR</div><Button className="mt-4" variant="secondary">Download QR</Button></Card></section>
          <section className="p-5"><SoftCard className="border-blue-200 bg-blue-50"><div className="flex justify-between gap-3"><div><b>Minimum Deposit Confirmations</b><p className="text-sm text-slate-500">Your deposit will be credited after network confirmations.</p></div><div className="text-right font-black text-blue-700">20 Confirmations<br /><span className="text-xs font-normal text-slate-500">≈ 3 – 5 minutes</span></div></div></SoftCard></section>
        </Card>
        <Card className="overflow-hidden p-0"><div className="flex items-center justify-between border-b border-slate-100 p-5"><h2 className="font-black">Recent Incoming Transfers</h2><Link href="/wallet" className="text-sm font-bold text-blue-700">View all</Link></div><div className="divide-y divide-slate-100">{["a1b2c3d4...e5f6g7h8", "d4c3b2a1...h8g7f6e5", "f6e5d4c3...a1b2c3d4"].map((tx, i) => <div key={tx} className="flex items-center justify-between p-4"><div className="flex items-center gap-3"><AssetIcon symbol="USDT" /><span><b>{tx}</b><p className="text-xs text-slate-500">USDT · TRC20</p></span></div><div className="text-right"><b>{[250, 120.5, 75][i]} USDT</b><p className="text-xs text-slate-500">{["2 min ago", "18 min ago", "32 min ago"][i]}</p></div></div>)}</div></Card>
      </div>
    </div>
  );
}

export function WalletSendFlow() {
  const [confirmed, setConfirmed] = useState(false);
  const [otp, setOtp] = useState("");
  const submit = () => void persistWebActivity("wallet.send.confirm", { asset: "USDT", amount: 250, recipient: "TQ8x...i9o7p" }, "danger");
  return (
    <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
      <WalletSideSummary />
      <Card className="mx-auto w-full max-w-4xl space-y-5">
        <Link href="/wallet" className="text-sm font-bold text-blue-700">← Back to Wallet</Link>
        <h1 className="text-3xl font-black tracking-tight">Send Funds</h1><p className="text-slate-500">Send crypto securely to any wallet address.</p>
        <div className="grid gap-4 md:grid-cols-[1fr_220px]"><Select label="Asset"><option>USDT · Tether (USDT)</option></Select><div><p className="text-xs font-bold text-slate-500">Available Balance</p><p className="pt-3 font-black">1,234.56 USDT</p></div></div>
        <Input label="Recipient Address" defaultValue="TQ8xk9qX2mFz7eJ3q8w6y5r4t2u1i9o7p" />
        <Select label="Network"><option>TRC20 (Tron)</option><option>BNB Smart Chain</option></Select>
        <Input label="Amount" defaultValue="250" />
        <div className="flex justify-between border-b border-slate-100 pb-4"><span className="text-slate-500">Estimated Network Fee</span><b>1.00 USDT</b></div>
        <Input label="Note (Optional)" defaultValue="Payment for invoice #INV-2024-045" />
        <SoftCard className="border-blue-200 bg-blue-50"><h3 className="font-black text-blue-700">Confirm Safety</h3><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} /> I confirm the address is correct and want to proceed.</label></SoftCard>
        <Card className="shadow-none"><h3 className="font-black">Step-up Security</h3><p className="text-sm text-slate-500">For your protection, 2FA verification is required before sending funds.</p><div className="mt-4 flex gap-3"><Input placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} /><Button variant="secondary">Verify</Button></div></Card>
        <Card className="shadow-none"><div className="flex justify-between"><span>You send</span><b>250.00 USDT</b></div><div className="mt-3 flex justify-between"><span>Network fee</span><b>1.00 USDT</b></div><div className="mt-3 flex justify-between border-t border-slate-100 pt-3"><span>Recipient receives</span><b>249.00 USDT</b></div></Card>
        <Button className="w-full" size="lg" disabled={!confirmed} onClick={submit}>Confirm Transfer</Button>
        <p className="text-center text-xs text-slate-500">AMLBT never shares your 2FA codes or asks for your password.</p>
      </Card>
    </div>
  );
}
