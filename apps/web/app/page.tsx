import Link from "next/link";
import { Badge, Button, Card, CardDescription, CardTitle, StatCard } from "@amlbt/ui";

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-white">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-amlbt-primary text-white">A</span>
          AMLBT
        </Link>
        <div className="flex gap-2">
          <Link href="/login"><Button variant="secondary">Login</Button></Link>
          <Link href="/register"><Button>Create account</Button></Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-6 md:py-20">
        <div>
          <Badge tone="primary">P2P escrow marketplace</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-950 md:text-6xl">Buy and sell crypto safely with P2P escrow.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-amlbt-text-muted">Simple trades, secure smart-contract escrow, fast local payments, reputation, KYC, chat, and dispute support in one clean mobile-first experience.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/market"><Button size="lg">Explore market</Button></Link>
            <Link href="/dashboard"><Button size="lg" variant="secondary">View prototype</Button></Link>
          </div>
        </div>
        <Card className="space-y-4 rounded-[2rem] p-5">
          <div className="rounded-2xl border border-blue-200 bg-amlbt-primary-soft p-4">
            <div className="flex items-center justify-between"><Badge tone="primary">Escrow funded</Badge><span className="text-sm font-semibold text-amlbt-primary-dark">14:22</span></div>
            <div className="mt-4 text-2xl font-bold">Buy 150.00 USDT</div>
            <p className="text-sm text-amlbt-text-muted">Pay 19,920 ETB to verified seller account.</p>
            <Button className="mt-4 w-full">I have paid</Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Completed trades" value="1,248" hint="AbdiPay" />
            <StatCard label="Completion rate" value="99.2%" hint="Verified trader" />
          </div>
        </Card>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 pb-16 md:grid-cols-3 md:px-6">
        <Card><CardTitle>1. Choose an offer</CardTitle><CardDescription>Filter by asset, amount, fiat, payment method, and trader rating.</CardDescription></Card>
        <Card><CardTitle>2. Pay locally</CardTitle><CardDescription>Buyer sends fiat outside the app using supported payment methods.</CardDescription></Card>
        <Card><CardTitle>3. Escrow releases</CardTitle><CardDescription>Seller releases crypto after confirming payment. Disputes go to moderators.</CardDescription></Card>
      </section>
    </main>
  );
}
