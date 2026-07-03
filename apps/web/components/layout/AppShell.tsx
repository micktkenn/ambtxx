"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@amlbt/ui";

const nav = [
  { label: "Home", href: "/dashboard", icon: "🏠" },
  { label: "Market", href: "/market", icon: "📈" },
  { label: "Orders", href: "/orders", icon: "🧾" },
  { label: "Wallet", href: "/wallet", icon: "👛" },
  { label: "Profile", href: "/settings", icon: "👤" }
];

const desktopNav = [
  ...nav,
  { label: "My Ads", href: "/ads", icon: "📣" },
  { label: "Disputes", href: "/disputes", icon: "⚖️" },
  { label: "Support", href: "/support", icon: "💬" },
  { label: "Onboarding", href: "/onboarding", icon: "✅" },
  { label: "Notifications", href: "/notifications", icon: "🔔" },
  { label: "Database", href: "/database", icon: "🗄️" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh bg-amlbt-muted text-amlbt-text">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-amlbt-border-soft bg-white p-4 md:block">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-amlbt-primary text-white">A</span>
          AMLBT
        </Link>
        <nav className="space-y-1">
          {desktopNav.map((item) => (
            <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-amlbt-text-muted", isActive(item.href) && "bg-amlbt-primary-soft text-amlbt-primary-dark")}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-amlbt-border-soft bg-white/95 px-4 backdrop-blur md:h-16 md:px-6">
          <div>
            <div className="font-semibold">AMLBT</div>
            <div className="hidden text-xs text-amlbt-text-muted sm:block">Secure P2P escrow trading</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-green-200 bg-amlbt-success-soft px-2 py-1 text-xs font-semibold text-amlbt-success sm:inline-flex">KYC L2</span>
            <button className="grid h-9 w-9 place-items-center rounded-xl border border-amlbt-border bg-white">🔔</button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-4 pb-24 md:px-6 md:py-6 md:pb-8">{children}</main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-amlbt-border-soft bg-white md:hidden">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium text-amlbt-text-muted", isActive(item.href) && "text-amlbt-primary-dark")}>
            <span className={cn("grid h-6 w-6 place-items-center rounded-lg bg-slate-100", isActive(item.href) && "bg-amlbt-primary-soft")}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
