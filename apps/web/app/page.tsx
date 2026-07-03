import Link from "next/link";
import { Badge, Button, Card } from "@amlbt/ui";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-white text-slate-950">
      <header className="mx-auto flex max-w-[1480px] items-center justify-between border-b border-slate-100 px-5 py-5">
        <Link href="/" className="flex items-center gap-3 text-3xl font-black text-blue-700"><span className="text-4xl">ᗩ</span> AMLBT</Link>
        <div className="flex gap-3"><Link href="/login"><Button variant="secondary">Sign in</Button></Link><Link href="/register"><Button>Create account</Button></Link></div>
      </header>
      <section className="mx-auto grid max-w-[1480px] gap-10 px-5 py-14 lg:grid-cols-[1fr_520px] lg:py-24">
        <div>
          <Badge tone="primary">Secure P2P escrow marketplace</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">Trade crypto with a wallet you control.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-500">AMLBT combines P2P ads, escrow orders, trade-room chat, wallet controls, KYC, security settings, and dispute handling in one clean mobile-first interface.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/dashboard"><Button size="lg">Open prototype</Button></Link><Link href="/market"><Button size="lg" variant="secondary">Explore market</Button></Link></div>
          <div className="mt-12 grid gap-4 sm:grid-cols-3"><MiniStat value="1,248" label="Trader orders" /><MiniStat value="99.2%" label="Completion" /><MiniStat value="2FA + Wallet" label="Release security" /></div>
        </div>
        <Card className="overflow-hidden rounded-[2rem] p-0 shadow-popover">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white"><p className="text-sm opacity-90">Total Portfolio Value</p><div className="mt-2 text-4xl font-black">72,560.68 ETB</div><p className="mt-1 text-sm opacity-90">≈ 1,234.56 USDT</p><div className="mt-8 h-24 rounded-2xl border border-white/20 bg-white/10" /></div>
          <div className="grid grid-cols-3 gap-3 p-5"><Action icon="＋" label="Add Funds" /><Action icon="✈" label="Send" /><Action icon="◷" label="History" /></div>
          <div className="divide-y divide-slate-100 p-5 pt-0">{["USDT", "BTC", "ETH", "BNB"].map((asset, i) => <div key={asset} className="flex items-center justify-between py-4"><div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-full text-white ${i === 0 ? "bg-emerald-600" : i === 1 ? "bg-orange-500" : i === 2 ? "bg-indigo-500" : "bg-amber-500"}`}>{asset[0]}</span><b>{asset}</b></div><div className="text-right"><b>{["58,420.68", "8,640.35", "3,780.45", "1,719.20"][i]} ETB</b><p className="text-xs text-slate-500">≈ balance</p></div></div>)}</div>
        </Card>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return <Card className="shadow-none"><div className="text-2xl font-black">{value}</div><div className="text-sm text-slate-500">{label}</div></Card>;
}
function Action({ icon, label }: { icon: string; label: string }) {
  return <div className="rounded-2xl border border-slate-200 p-4 text-center"><div className="mx-auto mb-2 grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-xl text-white">{icon}</div><b className="text-sm">{label}</b></div>;
}
