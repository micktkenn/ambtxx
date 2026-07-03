import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMLBT P2P Exchange",
  description: "Buy and sell crypto safely with P2P escrow.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#2584FF"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
