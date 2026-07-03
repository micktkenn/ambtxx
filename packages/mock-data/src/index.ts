import type {
  Ad,
  AdminRole,
  Asset,
  AuditLog,
  ChatMessage,
  ContentItem,
  Dispute,
  EvidenceFile,
  FeeRule,
  FeeTransaction,
  Integration,
  KycCase,
  Network,
  Notification,
  NotificationTemplate,
  Order,
  OrderEvent,
  PlatformPaymentMethod,
  PriceFeed,
  RiskFlag,
  SecuritySettings,
  Session,
  SupportTicket,
  SystemSetting,
  TradeLimit,
  User,
  UserPaymentMethod
} from "@amlbt/types";

export const users: User[] = [
  { id: "user_001", username: "MilkessaT", displayName: "Milkessa Tesso", email: "milkessa@example.com", country: "Ethiopia", avatarInitials: "MT", kycLevel: 2, kycStatus: "approved", riskLevel: "low", status: "active", completedTrades: 42, completionRate: 98.4, rating: 4.8, averageReleaseMinutes: 6, walletAddress: "0x7b21E9f7A91dF4c8aF00291c9A21b771114A91dF", joinedAt: "2025-01-14T10:15:00Z" },
  { id: "user_002", username: "AbdiPay", displayName: "Abdi Tesfaye", email: "merchant@amlbt.mock", country: "Ethiopia", avatarInitials: "AB", kycLevel: 3, kycStatus: "approved", riskLevel: "low", status: "active", completedTrades: 1248, completionRate: 99.2, rating: 4.9, averageReleaseMinutes: 4, walletAddress: "0xA91dF4c8Af00291c9A21B771114A91Df7b21E9f7", joinedAt: "2024-09-08T09:30:00Z" },
  { id: "user_003", username: "HanaMarket", displayName: "Hana Bekele", country: "Ethiopia", avatarInitials: "HM", kycLevel: 2, kycStatus: "approved", riskLevel: "low", status: "active", completedTrades: 728, completionRate: 97.8, rating: 4.7, averageReleaseMinutes: 7, joinedAt: "2024-11-03T12:00:00Z" },
  { id: "user_004", username: "DawitFX", displayName: "Dawit Alemu", country: "Ethiopia", avatarInitials: "DF", kycLevel: 3, kycStatus: "approved", riskLevel: "low", status: "active", completedTrades: 2014, completionRate: 98.7, rating: 4.9, averageReleaseMinutes: 3, joinedAt: "2024-03-22T08:00:00Z" },
  { id: "user_005", username: "LomiTrade", displayName: "Lomi Gebre", country: "Ethiopia", avatarInitials: "LM", kycLevel: 1, kycStatus: "requires_review", riskLevel: "medium", status: "restricted", completedTrades: 421, completionRate: 96.4, rating: 4.5, joinedAt: "2025-06-01T14:00:00Z" },
  { id: "user_006", username: "BirukFast", displayName: "Biruk K.", country: "Ethiopia", avatarInitials: "BK", kycLevel: 0, kycStatus: "not_started", riskLevel: "high", status: "frozen", completedTrades: 8, completionRate: 71.2, rating: 3.1, joinedAt: "2026-06-20T14:00:00Z" }
];

export const ads: Ad[] = [
  { id: "ad_001", side: "sell", asset: "USDT", fiat: "ETB", price: 132.8, priceType: "fixed", availableAmount: 2450, minFiat: 1000, maxFiat: 80000, paymentMethods: ["CBE", "Telebirr", "Bank transfer"], paymentWindowMinutes: 30, traderId: "user_002", terms: "Pay using your own verified account only.", status: "active", requirements: { minKycLevel: 1, minCompletedTrades: 0, minRating: 0, require2fa: true, allowedCountries: ["Ethiopia"] }, createdAt: "2026-07-01T10:00:00+03:00" },
  { id: "ad_002", side: "sell", asset: "USDT", fiat: "ETB", price: 133.15, priceType: "fixed", availableAmount: 910, minFiat: 500, maxFiat: 30000, paymentMethods: ["Awash", "Dashen"], paymentWindowMinutes: 20, traderId: "user_003", terms: "Fast release after confirmed payment.", status: "active", requirements: { minKycLevel: 1, minCompletedTrades: 1, minRating: 4, require2fa: true }, createdAt: "2026-07-01T11:00:00+03:00" },
  { id: "ad_003", side: "sell", asset: "USDT", fiat: "ETB", price: 133.45, priceType: "market_margin", marginPercent: 0.4, availableAmount: 7500, minFiat: 5000, maxFiat: 250000, paymentMethods: ["Bank transfer"], paymentWindowMinutes: 45, traderId: "user_004", terms: "Merchant orders only. No third-party payments.", status: "active", requirements: { minKycLevel: 2, minCompletedTrades: 10, minRating: 4.5, require2fa: true }, createdAt: "2026-06-29T10:00:00+03:00" },
  { id: "ad_004", side: "buy", asset: "USDT", fiat: "ETB", price: 131.9, priceType: "market_discount", marginPercent: -0.3, availableAmount: 1500, minFiat: 1000, maxFiat: 60000, paymentMethods: ["CBE"], paymentWindowMinutes: 30, traderId: "user_001", terms: "I pay from verified bank account.", status: "paused", requirements: { minKycLevel: 1, minCompletedTrades: 0, minRating: 0, require2fa: false }, createdAt: "2026-06-25T10:00:00+03:00" },
  { id: "ad_005", side: "sell", asset: "USDC", fiat: "ETB", price: 132.2, priceType: "fixed", availableAmount: 400, minFiat: 2000, maxFiat: 20000, paymentMethods: ["CBE", "Awash"], paymentWindowMinutes: 25, traderId: "user_003", terms: "USDC pilot offer. Release after confirmed payment.", status: "draft", requirements: { minKycLevel: 2, minCompletedTrades: 5, minRating: 4, require2fa: true }, createdAt: "2026-07-02T09:00:00+03:00" }
];

export const orders: Order[] = [
  { id: "TRD-9021", side: "buy", buyerId: "user_001", sellerId: "user_002", asset: "USDT", assetAmount: 150, fiat: "ETB", fiatAmount: 19920, price: 132.8, status: "payment_pending", escrowStatus: "funded", paymentMethod: "CBE", paymentAccountName: "Abdi Tesfaye", paymentAccountMasked: "****4432", timerEndsAt: "2026-07-03T15:00:00+03:00", escrowTx: "0x8a4219f74a90127e2dd44caa0019f", feeAmount: 0.45, createdAt: "2026-07-03T14:14:00+03:00", updatedAt: "2026-07-03T14:16:00+03:00" },
  { id: "TRD-9018", side: "sell", buyerId: "user_003", sellerId: "user_001", asset: "USDT", assetAmount: 75, fiat: "ETB", fiatAmount: 9960, price: 132.8, status: "marked_paid", escrowStatus: "funded", paymentMethod: "Telebirr", feeAmount: 0.23, createdAt: "2026-07-03T12:15:00+03:00", updatedAt: "2026-07-03T12:36:00+03:00" },
  { id: "TRD-9007", side: "buy", buyerId: "user_001", sellerId: "user_004", asset: "USDT", assetAmount: 48.5, fiat: "ETB", fiatAmount: 6438, price: 132.75, status: "completed", escrowStatus: "released", feeAmount: 0.15, createdAt: "2026-07-02T16:00:00+03:00", updatedAt: "2026-07-02T16:18:00+03:00" },
  { id: "TRD-8975", side: "sell", buyerId: "user_006", sellerId: "user_002", asset: "USDT", assetAmount: 220, fiat: "ETB", fiatAmount: 29260, price: 133, status: "disputed", escrowStatus: "funded", paymentMethod: "CBE", feeAmount: 0.66, createdAt: "2026-07-03T10:20:00+03:00", updatedAt: "2026-07-03T11:40:00+03:00" }
];

export const orderEvents: OrderEvent[] = [
  { id: "evt_001", orderId: "TRD-9021", type: "order_created", label: "Order created", description: "MilkessaT accepted AbdiPay's offer.", actorType: "buyer", createdAt: "2026-07-03T14:14:00+03:00" },
  { id: "evt_002", orderId: "TRD-9021", type: "escrow_funded", label: "Escrow funded", description: "150 USDT locked in smart-contract escrow.", actorType: "system", createdAt: "2026-07-03T14:15:00+03:00" },
  { id: "evt_003", orderId: "TRD-9018", type: "payment_marked_paid", label: "Payment marked paid", description: "Buyer uploaded Telebirr receipt.", actorType: "buyer", createdAt: "2026-07-03T12:36:00+03:00" },
  { id: "evt_004", orderId: "TRD-8975", type: "dispute_opened", label: "Dispute opened", description: "Seller reported payment not received.", actorType: "seller", createdAt: "2026-07-03T11:40:00+03:00" }
];

export const messages: ChatMessage[] = [
  { id: "msg_001", orderId: "TRD-9021", senderType: "system", body: "Escrow funded. Buyer can now pay the seller.", createdAt: "2026-07-03T14:15:00+03:00" },
  { id: "msg_002", orderId: "TRD-9021", senderType: "counterparty", senderName: "AbdiPay", body: "Hi, please use the CBE account shown in the payment details.", createdAt: "2026-07-03T14:16:00+03:00" },
  { id: "msg_003", orderId: "TRD-9021", senderType: "user", senderName: "MilkessaT", body: "Okay. I will pay now and upload the receipt.", createdAt: "2026-07-03T14:17:00+03:00" },
  { id: "msg_004", orderId: "TRD-9021", senderType: "counterparty", senderName: "AbdiPay", body: "Please include order ID in the payment note.", createdAt: "2026-07-03T14:18:00+03:00" },
  { id: "msg_005", orderId: "TRD-8975", senderType: "moderator", senderName: "Sara Admin", body: "Please upload seller bank statement for the trade window.", createdAt: "2026-07-03T11:45:00+03:00" }
];

export const evidenceFiles: EvidenceFile[] = [
  { id: "ev_001", ownerId: "user_003", relatedType: "order", relatedId: "TRD-9018", fileName: "telebirr_receipt_9018.jpg", mimeType: "image/jpeg", sizeKb: 420, status: "approved", createdAt: "2026-07-03T12:35:00+03:00" },
  { id: "ev_002", ownerId: "user_006", relatedType: "dispute", relatedId: "DSP-401", fileName: "cbe_transfer_receipt.png", mimeType: "image/png", sizeKb: 615, status: "approved", createdAt: "2026-07-03T11:42:00+03:00" },
  { id: "ev_003", ownerId: "user_002", relatedType: "dispute", relatedId: "DSP-401", fileName: "seller_statement.pdf", mimeType: "application/pdf", sizeKb: 1240, status: "virus_scan_pending", createdAt: "2026-07-03T12:01:00+03:00" }
];

export const disputes: Dispute[] = [
  { id: "DSP-401", orderId: "TRD-8975", reason: "Payment not received", status: "waiting_for_evidence", priority: "urgent", amount: 220, asset: "USDT", buyerEvidenceCount: 2, sellerEvidenceCount: 1, assignedModerator: "Sara Admin", createdAt: "2026-07-03T11:40:00+03:00" }
];

export const wallet = {
  userId: "user_001",
  address: "0x7b21E9f7A91dF4c8aF00291c9A21b771114A91dF",
  network: "BNB Chain",
  latestSyncedBlock: 41289118,
  balances: [
    { asset: "USDT", available: 1248.5, escrowLocked: 320 },
    { asset: "BNB", available: 0.028, escrowLocked: 0 },
    { asset: "USDC", available: 125.0, escrowLocked: 0 }
  ],
  transactions: [
    { id: "tx_001", type: "Escrow funded", amount: "150 USDT", status: "pending", hash: "0x8a...19f" },
    { id: "tx_002", type: "Crypto released", amount: "48.5 USDT", status: "completed", hash: "0x7b...81a" },
    { id: "tx_003", type: "Fee collected", amount: "0.15 USDT", status: "completed", hash: "0x11...9bc" }
  ]
};

export const assets: Asset[] = [
  { symbol: "USDT", name: "Tether USD", network: "BNB Chain", contract: "0x55d398326f99059fF775485246999027B3197955", decimals: 18, status: "active", minTrade: 10, maxTrade: 20000, icon: "₮", escrowEnabled: true },
  { symbol: "USDC", name: "USD Coin", network: "Polygon", contract: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6, status: "paused", minTrade: 10, maxTrade: 10000, icon: "$", escrowEnabled: false },
  { symbol: "BNB", name: "BNB", network: "BNB Chain", contract: "native", decimals: 18, status: "active", minTrade: 0, maxTrade: 0, icon: "◎", escrowEnabled: false }
];

export const networks: Network[] = [
  { name: "BNB Smart Chain", chainId: 56, rpcProvider: "Alchemy", explorerUrl: "https://bscscan.com", escrowContract: "0xEscrowMockA102", confirmations: 12, status: "active", latestSyncedBlock: 41289118, gasPolicy: "user_pays" },
  { name: "Polygon", chainId: 137, rpcProvider: "Alchemy", explorerUrl: "https://polygonscan.com", escrowContract: "0xEscrowMockB880", confirmations: 64, status: "paused", latestSyncedBlock: 58902441, gasPolicy: "user_pays" }
];

export const integrations: Integration[] = [
  { key: "wallet_provider", name: "MetaMask Embedded Wallets", category: "Wallet", status: "connected", mode: "sandbox", lastSuccess: "2026-07-03T13:12:00+03:00", maskedKey: "pk_test_••••91df" },
  { key: "rpc", name: "Alchemy RPC", category: "Blockchain", status: "healthy", mode: "sandbox", lastSuccess: "2026-07-03T14:01:00+03:00", webhookUrl: "/webhooks/blockchain" },
  { key: "kyc", name: "Sumsub Sandbox", category: "Verification", status: "setup_required", mode: "sandbox", webhookUrl: "/webhooks/kyc" },
  { key: "telegram", name: "Telegram Bot", category: "Notifications", status: "connected", mode: "sandbox", lastSuccess: "2026-07-03T13:55:00+03:00", webhookUrl: "/telegram/webhook" },
  { key: "email", name: "Resend", category: "Notifications", status: "connected", mode: "sandbox", lastSuccess: "2026-07-03T13:59:00+03:00" },
  { key: "aml", name: "AML Screening", category: "Risk", status: "error", mode: "sandbox", lastError: "API key missing in sandbox" },
  { key: "storage", name: "DigitalOcean Spaces", category: "Files", status: "setup_required", mode: "sandbox" },
  { key: "monitoring", name: "Sentry", category: "Monitoring", status: "connected", mode: "sandbox", lastSuccess: "2026-07-03T13:00:00+03:00" }
];

export const feeRules: FeeRule[] = [
  { id: "fee_001", name: "Standard P2P trade", payer: "seller", percentage: 0.3, minFee: 0.1, maxFee: 20, asset: "USDT", status: "active" },
  { id: "fee_002", name: "Merchant tier", payer: "seller", percentage: 0.2, minFee: 0.05, maxFee: 15, asset: "USDT", status: "active" },
  { id: "fee_003", name: "Launch promo", payer: "platform", percentage: 0, minFee: 0, maxFee: 0, asset: "USDT", status: "scheduled" }
];

export const fees = feeRules;

export const feeTransactions: FeeTransaction[] = [
  { id: "fee_tx_001", orderId: "TRD-9007", userId: "user_004", feeType: "trade", asset: "USDT", amount: 0.15, rate: 0.3, payer: "seller", status: "collected", txHash: "0xfee...9007", createdAt: "2026-07-02T16:18:00+03:00" },
  { id: "fee_tx_002", orderId: "TRD-9018", userId: "user_001", feeType: "trade", asset: "USDT", amount: 0.23, rate: 0.3, payer: "seller", status: "estimated", createdAt: "2026-07-03T12:36:00+03:00" },
  { id: "fee_tx_003", orderId: "TRD-8975", userId: "user_002", feeType: "trade", asset: "USDT", amount: 0.66, rate: 0.3, payer: "seller", status: "estimated", createdAt: "2026-07-03T11:40:00+03:00" }
];

export const platformPaymentMethods: PlatformPaymentMethod[] = [
  { id: "pm_001", name: "CBE Bank", type: "Bank transfer", country: "Ethiopia", fiat: "ETB", status: "active", kycLevel: 1, riskLevel: "low", minOrderAmount: 500, maxOrderAmount: 250000 },
  { id: "pm_002", name: "Telebirr", type: "Mobile money", country: "Ethiopia", fiat: "ETB", status: "active", kycLevel: 1, riskLevel: "medium", minOrderAmount: 100, maxOrderAmount: 50000 },
  { id: "pm_003", name: "Awash Bank", type: "Bank transfer", country: "Ethiopia", fiat: "ETB", status: "active", kycLevel: 1, riskLevel: "low", minOrderAmount: 500, maxOrderAmount: 150000 },
  { id: "pm_004", name: "Dashen Bank", type: "Bank transfer", country: "Ethiopia", fiat: "ETB", status: "paused", kycLevel: 1, riskLevel: "low", minOrderAmount: 500, maxOrderAmount: 100000 }
];

export const paymentMethods = platformPaymentMethods;

export const userPaymentMethods: UserPaymentMethod[] = [
  { id: "upm_001", userId: "user_001", methodName: "CBE Bank", providerName: "Commercial Bank of Ethiopia", accountHolderName: "Milkessa Tesso", accountMasked: "****2210", fiat: "ETB", visibility: "visible", verified: true, instructions: "Include the order ID in transfer note." },
  { id: "upm_002", userId: "user_001", methodName: "Telebirr", providerName: "Telebirr", accountHolderName: "Milkessa Tesso", accountMasked: "+251•••418", fiat: "ETB", visibility: "visible", verified: true },
  { id: "upm_003", userId: "user_001", methodName: "Awash Bank", providerName: "Awash Bank", accountHolderName: "Milkessa Tesso", accountMasked: "****8801", fiat: "ETB", visibility: "hidden", verified: false }
];

export const sessions: Session[] = [
  { id: "ses_001", userId: "user_001", device: "Windows Desktop", browser: "Chrome 149", locationApprox: "Addis Ababa, Ethiopia", ipMasked: "196.188.xxx.xxx", current: true, lastActiveAt: "2026-07-03T14:20:00+03:00", createdAt: "2026-07-03T10:12:00+03:00" },
  { id: "ses_002", userId: "user_001", device: "iPhone", browser: "Safari", locationApprox: "Addis Ababa, Ethiopia", ipMasked: "196.189.xxx.xxx", current: false, lastActiveAt: "2026-07-02T21:10:00+03:00", createdAt: "2026-06-22T10:12:00+03:00" },
  { id: "ses_003", userId: "user_001", device: "Android", browser: "Chrome Mobile", locationApprox: "Adama, Ethiopia", ipMasked: "196.190.xxx.xxx", current: false, lastActiveAt: "2026-06-30T09:00:00+03:00", createdAt: "2026-06-28T10:12:00+03:00" }
];

export const securitySettings: SecuritySettings = {
  userId: "user_001",
  securityScore: 94,
  passwordUpdatedAt: "2026-06-21T10:00:00+03:00",
  totpEnabled: true,
  passkeyEnabled: false,
  emailOtpEnabled: true,
  smsOtpEnabled: false,
  telegramLinked: true,
  backupCodesRemaining: 8,
  antiPhishingCode: "AMLBT-92",
  sensitiveActionMethod: "totp_wallet_signature"
};

export const kycCases: KycCase[] = [
  { id: "KYC-8841", userId: "user_005", requestedLevel: 2, status: "requires_review", provider: "Sumsub Sandbox", providerApplicantId: "applicant_lomi_8841", documentType: "Passport", country: "Ethiopia", riskTags: ["Low lighting selfie", "Name transliteration mismatch"], reviewer: "Sara Admin", createdAt: "2026-07-03T09:00:00+03:00", updatedAt: "2026-07-03T12:00:00+03:00" },
  { id: "KYC-8839", userId: "user_001", requestedLevel: 2, status: "approved", provider: "Sumsub Sandbox", providerApplicantId: "applicant_milkessa_8839", documentType: "National ID", country: "Ethiopia", riskTags: [], reviewer: "KYC Reviewer", createdAt: "2026-06-20T09:00:00+03:00", updatedAt: "2026-06-20T12:00:00+03:00" },
  { id: "KYC-8831", userId: "user_006", requestedLevel: 1, status: "rejected", provider: "Sumsub Sandbox", providerApplicantId: "applicant_biruk_8831", documentType: "Unknown", country: "Ethiopia", riskTags: ["Document unreadable"], reviewer: "KYC Reviewer", createdAt: "2026-06-29T09:00:00+03:00", updatedAt: "2026-06-29T12:00:00+03:00" }
];

export const notifications: Notification[] = [
  { id: "ntf_001", type: "order", title: "Order payment pending", body: "Order #TRD-9021 is waiting for payment.", channel: "in_app", status: "sent", createdAt: "2026-07-03T14:15:00+03:00" },
  { id: "ntf_002", type: "security", title: "New device login", body: "Chrome on Windows signed in.", channel: "email", status: "sent", createdAt: "2026-07-03T10:12:00+03:00" },
  { id: "ntf_003", type: "dispute", title: "Evidence needed", body: "Moderator requested more evidence for #DSP-401.", channel: "telegram", status: "failed", createdAt: "2026-07-03T11:45:00+03:00" }
];

export const notificationTemplates: NotificationTemplate[] = [
  { id: "tpl_001", key: "order.payment_pending", channel: "email", subject: "Your AMLBT order needs payment", body: "Hi {{username}}, order {{orderId}} is waiting for payment.", variables: ["username", "orderId"], status: "published", updatedAt: "2026-07-01T10:00:00+03:00" },
  { id: "tpl_002", key: "security.new_device", channel: "telegram", body: "New login detected from {{device}}. If this was not you, secure your account.", variables: ["device"], status: "published", updatedAt: "2026-07-01T10:00:00+03:00" },
  { id: "tpl_003", key: "dispute.evidence_needed", channel: "in_app", body: "Moderator requested more evidence for {{disputeId}}.", variables: ["disputeId"], status: "draft", updatedAt: "2026-07-02T10:00:00+03:00" }
];

export const riskRules = [
  { id: "rule_001", name: "New account high-value trade", trigger: "> 1000 USDT within 24h", severity: "high", status: "active" },
  { id: "rule_002", name: "Payment method changed recently", trigger: "Changed within 48h", severity: "medium", status: "active" },
  { id: "rule_003", name: "Price outlier", trigger: "±8% from market median", severity: "medium", status: "active" },
  { id: "rule_004", name: "High dispute rate", trigger: "3+ disputes in 30 days", severity: "high", status: "active" }
];

export const riskFlags: RiskFlag[] = [
  { id: "flag_001", targetType: "order", targetId: "TRD-8975", ruleId: "rule_001", severity: "high", status: "reviewing", reason: "High-value trade opened by low-history buyer.", createdAt: "2026-07-03T10:21:00+03:00", assignedTo: "Risk Analyst" },
  { id: "flag_002", targetType: "user", targetId: "user_006", ruleId: "rule_004", severity: "critical", status: "open", reason: "Repeated disputes and low completion rate.", createdAt: "2026-07-03T11:40:00+03:00", assignedTo: "Sara Admin" },
  { id: "flag_003", targetType: "ad", targetId: "ad_003", ruleId: "rule_003", severity: "medium", status: "open", reason: "Offer price deviates from market median.", createdAt: "2026-07-02T17:00:00+03:00" }
];

export const contentBanners: ContentItem[] = [
  { id: "banner_001", type: "banner", title: "Network maintenance tonight", placement: "dashboard", status: "scheduled", body: "BNB Chain sync may be delayed between 01:00–01:30.", updatedAt: "2026-07-03T08:00:00+03:00" },
  { id: "banner_002", type: "risk_warning", title: "Escrow safety reminder", placement: "market", status: "published", body: "Never release crypto until fiat payment is visible in your account.", updatedAt: "2026-07-01T08:00:00+03:00" },
  { id: "faq_001", type: "faq", title: "How does escrow protect me?", placement: "home_faq", status: "published", body: "Crypto is locked until the seller confirms fiat payment or a dispute is resolved.", updatedAt: "2026-06-20T08:00:00+03:00" },
  { id: "page_001", type: "page", title: "Fees and limits", placement: "footer", status: "draft", body: "Fee and trading limit explanation for public page.", updatedAt: "2026-07-02T08:00:00+03:00" }
];

export const supportTickets: SupportTicket[] = [
  { id: "SUP-210", userId: "user_001", subject: "Payment receipt upload failed", category: "order", status: "waiting_support", priority: "normal", createdAt: "2026-07-03T13:50:00+03:00" },
  { id: "SUP-209", userId: "user_005", subject: "KYC review taking long", category: "kyc", status: "open", priority: "high", createdAt: "2026-07-03T09:12:00+03:00" }
];

export const auditLogs: AuditLog[] = [
  { id: "audit_001", adminName: "Sara Admin", action: "disputes.request_evidence", targetType: "dispute", targetId: "DSP-401", result: "success", ipMasked: "196.188.xxx.xxx", createdAt: "2026-07-03T11:45:00+03:00" },
  { id: "audit_002", adminName: "KYC Reviewer", action: "kyc.request_more_info", targetType: "kyc_case", targetId: "KYC-8841", result: "success", ipMasked: "196.188.xxx.xxx", createdAt: "2026-07-03T12:00:00+03:00" },
  { id: "audit_003", adminName: "Risk Analyst", action: "risk.flag_assigned", targetType: "risk_flag", targetId: "flag_001", result: "success", ipMasked: "196.188.xxx.xxx", createdAt: "2026-07-03T12:10:00+03:00" }
];

export const adminRoles: AdminRole[] = [
  { id: "role_001", name: "Support Agent", description: "Can read users and support tickets, but cannot resolve disputes.", permissions: ["users.read", "support.read", "orders.read"], adminCount: 4 },
  { id: "role_002", name: "Moderator", description: "Can manage disputes and request evidence.", permissions: ["disputes.read", "disputes.resolve", "orders.read", "audit.read"], adminCount: 3 },
  { id: "role_003", name: "Compliance Admin", description: "Can review KYC and compliance reports.", permissions: ["kyc.read", "kyc.approve", "risk.read", "audit.read"], adminCount: 2 },
  { id: "role_004", name: "Super Admin", description: "Can manage platform configuration but cannot move user funds.", permissions: ["admins.manage", "fees.manage", "assets.manage", "networks.manage", "audit.read"], adminCount: 1 }
];

export const systemSettings: SystemSetting[] = [
  { key: "registration_enabled", label: "Public registration", value: true, description: "Allow new user registration.", category: "security" },
  { key: "trading_enabled", label: "Trading enabled", value: true, description: "Allow users to open new orders.", category: "trading" },
  { key: "ad_creation_enabled", label: "Ad creation", value: true, description: "Allow users to create new ads.", category: "trading" },
  { key: "maintenance_mode", label: "Maintenance mode", value: false, description: "Show maintenance banner and block new trades.", category: "maintenance" },
  { key: "admin_2fa_required", label: "Admin 2FA", value: true, description: "Require 2FA for all admin users.", category: "security" },
  { key: "max_order_fiat_l2", label: "KYC L2 max order", value: 250000, description: "Maximum ETB order for KYC L2 users.", category: "limits" }
];

export const tradeLimits: TradeLimit[] = [
  { kycLevel: 0, dailyLimitFiat: 0, monthlyLimitFiat: 0, maxOrderFiat: 0, canCreateAds: false },
  { kycLevel: 1, dailyLimitFiat: 50000, monthlyLimitFiat: 300000, maxOrderFiat: 25000, canCreateAds: false },
  { kycLevel: 2, dailyLimitFiat: 250000, monthlyLimitFiat: 1500000, maxOrderFiat: 150000, canCreateAds: true },
  { kycLevel: 3, dailyLimitFiat: 1000000, monthlyLimitFiat: 6000000, maxOrderFiat: 500000, canCreateAds: true }
];

export const priceFeeds: PriceFeed[] = [
  { asset: "USDT", fiat: "ETB", marketPrice: 132.55, source: "Mock price oracle", updatedAt: "2026-07-03T14:20:00+03:00", deviationWarningPercent: 8 },
  { asset: "USDC", fiat: "ETB", marketPrice: 132.25, source: "Mock price oracle", updatedAt: "2026-07-03T14:20:00+03:00", deviationWarningPercent: 8 }
];

export const adminDashboard = {
  activeUsers: 8412,
  activeOrders: 312,
  openDisputes: 14,
  pendingKyc: 47,
  flaggedUsers: 23,
  totalVolume24h: 91240,
  feesEarnedMonth: 2840,
  systemHealth: "healthy",
  failedBlockchainSync: 0,
  queuedNotifications: 18,
  failedWebhooks: 2,
  unresolvedRiskFlags: 11,
  supportTicketsOpen: 9
};
