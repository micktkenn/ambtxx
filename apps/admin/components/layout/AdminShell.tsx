"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@amlbt/ui";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "Users", href: "/users", icon: "👥" },
  { label: "KYC", href: "/kyc", icon: "✅" },
  { label: "Orders", href: "/orders", icon: "🧾" },
  { label: "Disputes", href: "/disputes", icon: "⚖️" },
  { label: "Ads", href: "/ads", icon: "📣" },
  { label: "Fees", href: "/fees", icon: "💸" },
  { label: "Assets", href: "/assets", icon: "🪙" },
  { label: "Networks", href: "/networks", icon: "🌐" },
  { label: "Payments", href: "/payment-methods", icon: "💳" },
  { label: "Integrations", href: "/integrations", icon: "🔌" },
  { label: "Notifications", href: "/notifications", icon: "🔔" },
  { label: "Content", href: "/content", icon: "📝" },
  { label: "Risk", href: "/risk", icon: "🛡️" },
  { label: "Support", href: "/support", icon: "💬" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
  { label: "Database", href: "/database", icon: "🗄️" }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  return (
    <div className="min-h-dvh bg-amlbt-muted text-amlbt-text">
      <aside className="fixed inset-y-0 left-0 hidden w-64 overflow-y-auto border-r border-amlbt-border-soft bg-white p-4 lg:block">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 font-bold"><span className="grid h-8 w-8 place-items-center rounded-xl bg-amlbt-primary text-white">A</span>AMLBT Admin</Link>
        <nav className="space-y-1">{nav.map((item) => <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-amlbt-text-muted", isActive(item.href) && "bg-amlbt-primary-soft text-amlbt-primary-dark")}><span>{item.icon}</span>{item.label}</Link>)}</nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-amlbt-border-soft bg-white/95 px-4 backdrop-blur lg:px-6"><div><div className="font-semibold">Admin Console</div><div className="text-xs text-amlbt-text-muted">All sensitive actions are logged.</div></div><span className="rounded-full border border-green-200 bg-amlbt-success-soft px-2 py-1 text-xs font-semibold text-amlbt-success">System healthy</span></header>
        <main className="mx-auto max-w-[1500px] px-4 py-4 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
