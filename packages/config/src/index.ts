export const appConfig = {
  name: "AMLBT",
  webUrl: process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000",
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:3001",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"
};

export const userRoutes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  market: "/market",
  ads: "/ads",
  createAd: "/ads/create",
  orders: "/orders",
  wallet: "/wallet",
  settings: "/settings",
  disputes: "/disputes",
  support: "/support"
};

export const adminRoutes = {
  login: "/login",
  dashboard: "/dashboard",
  users: "/users",
  kyc: "/kyc",
  orders: "/orders",
  disputes: "/disputes",
  ads: "/ads",
  fees: "/fees",
  assets: "/assets",
  networks: "/networks",
  paymentMethods: "/payment-methods",
  integrations: "/integrations",
  notifications: "/notifications",
  content: "/content",
  risk: "/risk",
  settings: "/settings"
};

export const orderStatuses = [
  "created",
  "awaiting_escrow",
  "escrow_funded",
  "payment_pending",
  "marked_paid",
  "seller_reviewing_payment",
  "released",
  "completed",
  "disputed",
  "cancelled",
  "expired",
  "refunded"
] as const;

export const adminRoles = [
  "Support Agent",
  "Moderator",
  "KYC Reviewer",
  "Risk Analyst",
  "Finance Admin",
  "Compliance Admin",
  "Technical Admin",
  "Super Admin"
] as const;

export const permissions = [
  "users.read",
  "users.restrict",
  "kyc.read",
  "kyc.approve",
  "orders.read",
  "orders.flag",
  "disputes.read",
  "disputes.resolve",
  "ads.suspend",
  "fees.manage",
  "assets.manage",
  "networks.manage",
  "notifications.manage",
  "content.manage",
  "risk.manage",
  "audit.read"
] as const;
