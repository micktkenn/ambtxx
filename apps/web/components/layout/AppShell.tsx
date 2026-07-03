"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { cn } from "@amlbt/ui";

const topNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Market", href: "/market" },
  { label: "Orders", href: "/orders" },
  { label: "Wallet", href: "/wallet" },
  { label: "Disputes", href: "/disputes" },
  { label: "Help", href: "/support" }
];

const mobileNav = [
  { label: "Home", href: "/dashboard", icon: "⌂" },
  { label: "Market", href: "/market", icon: "⇅" },
  { label: "Wallet", href: "/wallet", icon: "▣" },
  { label: "Orders", href: "/orders", icon: "▤" },
  { label: "Profile", href: "/settings", icon: "○" }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-dvh bg-[#f8fafc] text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1520px] items-center justify-between px-4 md:px-8">
          <Link href="/dashboard" className="flex items-center gap-3 text-3xl font-black tracking-tight text-blue-700">
            <span className="text-4xl leading-none">ᗩ</span>
            <span>AMLBT</span>
          </Link>
          <nav className="hidden items-center gap-9 lg:flex">
            {topNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex h-[76px] items-center text-sm font-bold text-slate-600 transition hover:text-blue-700",
                  isActive(item.href) && "text-blue-700 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:rounded-t-full after:bg-blue-600"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden h-10 w-10 place-items-center rounded-full text-xl text-slate-700 hover:bg-slate-100 md:grid">⌕</button>
            <button className="relative grid h-10 w-10 place-items-center rounded-full text-xl text-slate-700 hover:bg-slate-100">
              ♧
              <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-[10px] font-black text-white">3</span>
            </button>
            <Link href="/settings" className="hidden items-center gap-3 rounded-full py-1 pl-1 pr-3 hover:bg-slate-50 md:flex">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-slate-800 to-slate-950 text-lg text-white">👨🏽</span>
              <span className="text-sm font-bold text-slate-700">Abel Tesfaye</span>
              <span className="text-slate-400">⌄</span>
            </Link>
            <button className="grid h-10 w-10 place-items-center rounded-full text-2xl lg:hidden">☰</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1520px] px-4 py-6 pb-24 md:px-8 lg:py-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid h-[74px] grid-cols-5 border-t border-slate-200 bg-white lg:hidden">
        {mobileNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn("flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-slate-500", isActive(item.href) && "text-blue-700")}
          >
            <span className={cn("grid h-7 w-7 place-items-center rounded-lg text-lg", isActive(item.href) && "bg-blue-50")}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
