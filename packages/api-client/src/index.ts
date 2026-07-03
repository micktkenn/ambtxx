import {
  adminDashboard,
  adminRoles,
  ads,
  assets,
  auditLogs,
  contentBanners,
  disputes,
  evidenceFiles,
  feeRules,
  feeTransactions,
  integrations,
  kycCases,
  messages,
  networks,
  notificationTemplates,
  notifications,
  orderEvents,
  orders,
  paymentMethods,
  platformPaymentMethods,
  priceFeeds,
  riskFlags,
  riskRules,
  securitySettings,
  sessions,
  supportTickets,
  systemSettings,
  tradeLimits,
  userPaymentMethods,
  users,
  wallet
} from "@amlbt/mock-data";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 20));

export async function getCurrentUser() {
  await wait();
  return users[0];
}

export async function loginMock() {
  await wait();
  return { success: true, requires2fa: true, user: users[0] };
}

export async function getOnboardingChecklist() {
  await wait();
  const user = users[0];
  return [
    { id: "email", title: "Verify email", done: true, href: "/settings/profile" },
    { id: "wallet", title: "Connect embedded wallet", done: Boolean(user.walletAddress), href: "/wallet" },
    { id: "security", title: "Enable authenticator app", done: securitySettings.totpEnabled, href: "/settings/security" },
    { id: "kyc", title: "Complete KYC Level 2", done: user.kycLevel >= 2, href: "/settings/verification" },
    { id: "payment", title: "Add payment method", done: userPaymentMethods.length > 0, href: "/settings/payment-methods" },
    { id: "telegram", title: "Connect Telegram alerts", done: securitySettings.telegramLinked, href: "/settings/telegram" }
  ];
}

export async function getMarketAds() {
  await wait();
  return ads.map((ad) => ({ ...ad, trader: users.find((user) => user.id === ad.traderId) }));
}

export async function getAdById(adId: string) {
  await wait();
  const ad = ads.find((item) => item.id === adId) ?? ads[0];
  return { ...ad, trader: users.find((user) => user.id === ad.traderId) };
}

export async function createOrderFromAd(adId: string, amountFiat: number) {
  await wait();
  const ad = ads.find((item) => item.id === adId) ?? ads[0];
  return { success: true, orderId: "TRD-MOCK", adId: ad.id, amountFiat, assetAmount: amountFiat / ad.price };
}

export async function getMyAds() {
  await wait();
  return ads.filter((ad) => ad.traderId === "user_001");
}

export async function saveAdDraft() {
  await wait();
  return { success: true, adId: "ad_draft_mock", status: "draft" };
}

export async function publishAd() {
  await wait();
  return { success: true, adId: "ad_draft_mock", status: "active" };
}

export async function getOrders() {
  await wait();
  return orders.map((order) => ({
    ...order,
    buyer: users.find((user) => user.id === order.buyerId),
    seller: users.find((user) => user.id === order.sellerId)
  }));
}

export async function getOrderById(orderId: string) {
  await wait();
  const order = orders.find((item) => item.id === orderId) ?? orders[0];
  return {
    ...order,
    buyer: users.find((user) => user.id === order.buyerId),
    seller: users.find((user) => user.id === order.sellerId),
    messages: messages.filter((message) => message.orderId === order.id),
    events: orderEvents.filter((event) => event.orderId === order.id),
    evidence: evidenceFiles.filter((file) => file.relatedId === order.id)
  };
}

export async function getOrderEvents(orderId: string) {
  await wait();
  return orderEvents.filter((event) => event.orderId === orderId);
}

export async function markOrderAsPaid(orderId: string) {
  await wait();
  return { success: true, orderId, status: "marked_paid" };
}

export async function prepareRelease(orderId: string) {
  await wait();
  return { success: true, orderId, requires: ["totp", "wallet_signature"], warning: "Only release crypto after fiat payment is visible in your account." };
}

export async function releaseOrder(orderId: string) {
  await wait();
  return { success: true, orderId, status: "released", txHash: "0xReleaseMockHash" };
}

export async function openDispute(orderId: string) {
  await wait();
  return { success: true, orderId, disputeId: "DSP-MOCK" };
}

export async function uploadEvidenceMock(relatedId: string, fileName: string) {
  await wait();
  return { success: true, relatedId, fileName, evidenceId: "ev_mock" };
}

export async function getWallet() {
  await wait();
  return wallet;
}

export async function getPublicProfile(username: string) {
  await wait();
  return users.find((user) => user.username.toLowerCase() === username.toLowerCase()) ?? users[1];
}

export async function getDisputes() {
  await wait();
  return disputes;
}

export async function getDisputeById(disputeId: string) {
  await wait();
  const dispute = disputes.find((item) => item.id === disputeId) ?? disputes[0];
  return {
    ...dispute,
    order: orders.find((order) => order.id === dispute.orderId),
    evidence: evidenceFiles.filter((file) => file.relatedId === dispute.id),
    messages: messages.filter((message) => message.orderId === dispute.orderId)
  };
}

export async function getNotifications() {
  await wait();
  return notifications;
}

export async function getNotificationTemplates() {
  await wait();
  return notificationTemplates;
}

export async function getUserPaymentMethods() {
  await wait();
  return userPaymentMethods;
}

export async function getSessions() {
  await wait();
  return sessions;
}

export async function getSecuritySettings() {
  await wait();
  return securitySettings;
}

export async function getTradeLimits() {
  await wait();
  return tradeLimits;
}

export async function getPriceFeeds() {
  await wait();
  return priceFeeds;
}

export async function getSupportTickets() {
  await wait();
  return supportTickets;
}

export async function getAdminDashboard() {
  await wait();
  return adminDashboard;
}

export async function getAdminUsers() {
  await wait();
  return users;
}

export async function getAdminUserById(userId: string) {
  await wait();
  return users.find((user) => user.id === userId) ?? users[0];
}

export async function getAdminOrders() {
  await wait();
  return orders;
}

export async function getAdminDisputes() {
  await wait();
  return disputes;
}

export async function getKycCases() {
  await wait();
  return kycCases.map((item) => ({ ...item, user: users.find((user) => user.id === item.userId) }));
}

export async function getKycCaseById(caseId: string) {
  await wait();
  const item = kycCases.find((caseItem) => caseItem.id === caseId) ?? kycCases[0];
  return { ...item, user: users.find((user) => user.id === item.userId), evidence: evidenceFiles.filter((file) => file.relatedId === item.id) };
}

export async function getAssets() {
  await wait();
  return assets;
}

export async function getNetworks() {
  await wait();
  return networks;
}

export async function getIntegrations() {
  await wait();
  return integrations;
}

export async function getIntegrationByKey(key: string) {
  await wait();
  return integrations.find((item) => item.key === key) ?? integrations[0];
}

export async function getFees() {
  await wait();
  return feeRules;
}

export async function getFeeTransactions() {
  await wait();
  return feeTransactions;
}

export async function getPaymentMethods() {
  await wait();
  return platformPaymentMethods;
}

export async function getRiskRules() {
  await wait();
  return riskRules;
}

export async function getRiskFlags() {
  await wait();
  return riskFlags;
}

export async function getContentBanners() {
  await wait();
  return contentBanners;
}

export async function getContentItems() {
  await wait();
  return contentBanners;
}

export async function getAuditLogs() {
  await wait();
  return auditLogs;
}

export async function getAdminRoles() {
  await wait();
  return adminRoles;
}

export async function getSystemSettings() {
  await wait();
  return systemSettings;
}

export * from "./supabase-repositories";
