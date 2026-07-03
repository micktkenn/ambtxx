export type RiskLevel = "low" | "medium" | "high";
export type UserStatus = "active" | "restricted" | "frozen" | "suspended";
export type KycStatus = "not_started" | "pending" | "approved" | "rejected" | "requires_review" | "expired";
export type AdStatus = "active" | "paused" | "out_of_funds" | "suspended" | "draft";
export type OrderStatus =
  | "created"
  | "awaiting_escrow"
  | "escrow_funded"
  | "payment_pending"
  | "marked_paid"
  | "seller_reviewing_payment"
  | "release_pending"
  | "released"
  | "completed"
  | "disputed"
  | "cancelled"
  | "expired"
  | "refunded";
export type DisputeStatus = "open" | "waiting_for_evidence" | "under_review" | "resolved" | "escalated";
export type IntegrationStatus = "connected" | "healthy" | "setup_required" | "error" | "disabled";
export type ContentStatus = "draft" | "published" | "archived" | "scheduled";
export type NotificationChannel = "in_app" | "email" | "telegram" | "sms" | "push";

export type User = {
  id: string;
  username: string;
  displayName: string;
  email?: string;
  country: string;
  avatarInitials: string;
  kycLevel: 0 | 1 | 2 | 3;
  kycStatus: KycStatus;
  riskLevel: RiskLevel;
  status: UserStatus;
  completedTrades: number;
  completionRate: number;
  rating: number;
  averageReleaseMinutes?: number;
  walletAddress?: string;
  joinedAt: string;
};

export type Ad = {
  id: string;
  side: "buy" | "sell";
  asset: string;
  fiat: string;
  price: number;
  priceType?: "fixed" | "market_margin" | "market_discount";
  marginPercent?: number;
  availableAmount: number;
  minFiat: number;
  maxFiat: number;
  paymentMethods: string[];
  paymentWindowMinutes: number;
  traderId: string;
  terms: string;
  status: AdStatus;
  requirements?: TraderRequirement;
  createdAt?: string;
};

export type TraderRequirement = {
  minKycLevel: 0 | 1 | 2 | 3;
  minCompletedTrades: number;
  minRating: number;
  require2fa: boolean;
  allowedCountries?: string[];
};

export type Order = {
  id: string;
  side: "buy" | "sell";
  buyerId: string;
  sellerId: string;
  asset: string;
  assetAmount: number;
  fiat: string;
  fiatAmount: number;
  price: number;
  status: OrderStatus;
  escrowStatus: "not_funded" | "funded" | "release_pending" | "released" | "refunded";
  paymentMethod?: string;
  paymentAccountName?: string;
  paymentAccountMasked?: string;
  timerEndsAt?: string;
  escrowTx?: string;
  feeAmount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderEvent = {
  id: string;
  orderId: string;
  type:
    | "order_created"
    | "escrow_funded"
    | "payment_marked_paid"
    | "proof_uploaded"
    | "release_requested"
    | "released"
    | "dispute_opened"
    | "refunded"
    | "cancelled";
  label: string;
  description: string;
  actorType: "system" | "buyer" | "seller" | "admin" | "moderator";
  createdAt: string;
};

export type ChatMessage = {
  id: string;
  orderId: string;
  senderType: "user" | "counterparty" | "system" | "moderator";
  senderName?: string;
  body: string;
  attachmentName?: string;
  createdAt: string;
  readAt?: string;
};

export type EvidenceFile = {
  id: string;
  ownerId: string;
  relatedType: "order" | "dispute" | "kyc" | "support";
  relatedId: string;
  fileName: string;
  mimeType: string;
  sizeKb: number;
  status: "uploaded" | "virus_scan_pending" | "approved" | "rejected";
  createdAt: string;
};

export type Dispute = {
  id: string;
  orderId: string;
  reason: string;
  status: DisputeStatus;
  priority: "normal" | "high" | "urgent";
  amount: number;
  asset: string;
  buyerEvidenceCount: number;
  sellerEvidenceCount: number;
  assignedModerator?: string;
  createdAt: string;
};

export type Asset = {
  symbol: string;
  name: string;
  network: string;
  contract: string;
  decimals: number;
  status: "active" | "paused" | "testing" | "disabled";
  minTrade: number;
  maxTrade: number;
  icon?: string;
  escrowEnabled?: boolean;
};

export type Network = {
  name: string;
  chainId: number;
  rpcProvider: string;
  explorerUrl: string;
  escrowContract: string;
  confirmations: number;
  status: "active" | "paused" | "maintenance" | "disabled" | "testnet";
  latestSyncedBlock: number;
  gasPolicy?: "user_pays" | "platform_sponsored";
};

export type Integration = {
  key: string;
  name: string;
  category: string;
  status: IntegrationStatus;
  mode: "sandbox" | "production";
  lastSuccess?: string;
  lastError?: string;
  webhookUrl?: string;
  maskedKey?: string;
};

export type UserPaymentMethod = {
  id: string;
  userId: string;
  methodName: string;
  providerName: string;
  accountHolderName: string;
  accountMasked: string;
  fiat: string;
  instructions?: string;
  visibility: "visible" | "hidden";
  verified: boolean;
};

export type PlatformPaymentMethod = {
  id: string;
  name: string;
  type: "Bank transfer" | "Mobile money" | "Cash deposit" | "Wallet transfer" | "Other";
  country: string;
  fiat: string;
  status: "active" | "paused" | "disabled";
  kycLevel: 0 | 1 | 2 | 3;
  riskLevel: RiskLevel;
  minOrderAmount?: number;
  maxOrderAmount?: number;
};

export type Session = {
  id: string;
  userId: string;
  device: string;
  browser: string;
  locationApprox: string;
  ipMasked: string;
  current: boolean;
  lastActiveAt: string;
  createdAt: string;
};

export type SecuritySettings = {
  userId: string;
  securityScore: number;
  passwordUpdatedAt: string;
  totpEnabled: boolean;
  passkeyEnabled: boolean;
  emailOtpEnabled: boolean;
  smsOtpEnabled: boolean;
  telegramLinked: boolean;
  backupCodesRemaining: number;
  antiPhishingCode: string;
  sensitiveActionMethod: "totp_wallet_signature" | "passkey_wallet_signature" | "totp_only";
};

export type KycCase = {
  id: string;
  userId: string;
  requestedLevel: 1 | 2 | 3;
  status: KycStatus;
  provider: string;
  providerApplicantId: string;
  documentType?: string;
  country: string;
  riskTags: string[];
  reviewer?: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationTemplate = {
  id: string;
  key: string;
  channel: NotificationChannel;
  subject?: string;
  body: string;
  variables: string[];
  status: ContentStatus;
  updatedAt: string;
};

export type Notification = {
  id: string;
  type: "order" | "security" | "dispute" | "kyc" | "ad" | "system";
  title: string;
  body: string;
  channel: NotificationChannel;
  status: "sent" | "failed" | "queued";
  createdAt?: string;
};

export type FeeRule = {
  id: string;
  name: string;
  payer: "buyer" | "seller" | "split" | "platform";
  percentage: number;
  minFee: number;
  maxFee: number;
  asset: string;
  status: "active" | "paused" | "scheduled";
};

export type FeeTransaction = {
  id: string;
  orderId: string;
  userId: string;
  feeType: "trade" | "escrow" | "waiver";
  asset: string;
  amount: number;
  rate: number;
  payer: "buyer" | "seller" | "platform";
  status: "estimated" | "collected" | "failed" | "refunded" | "waived";
  txHash?: string;
  createdAt: string;
};

export type RiskFlag = {
  id: string;
  targetType: "user" | "order" | "ad" | "payment_method" | "session";
  targetId: string;
  ruleId: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "reviewing" | "resolved" | "false_positive";
  reason: string;
  createdAt: string;
  assignedTo?: string;
};

export type AuditLog = {
  id: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId: string;
  result: "success" | "failed";
  ipMasked: string;
  createdAt: string;
};

export type ContentItem = {
  id: string;
  type: "banner" | "faq" | "page" | "risk_warning" | "announcement";
  title: string;
  placement: string;
  status: ContentStatus;
  body: string;
  updatedAt: string;
};

export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  category: "order" | "wallet" | "kyc" | "security" | "general";
  status: "open" | "waiting_user" | "waiting_support" | "resolved";
  priority: "normal" | "high" | "urgent";
  createdAt: string;
};

export type AdminRole = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  adminCount: number;
};

export type SystemSetting = {
  key: string;
  label: string;
  value: boolean | string | number;
  description: string;
  category: "trading" | "security" | "maintenance" | "limits";
};

export type TradeLimit = {
  kycLevel: 0 | 1 | 2 | 3;
  dailyLimitFiat: number;
  monthlyLimitFiat: number;
  maxOrderFiat: number;
  canCreateAds: boolean;
};

export type PriceFeed = {
  asset: string;
  fiat: string;
  marketPrice: number;
  source: string;
  updatedAt: string;
  deviationWarningPercent: number;
};
