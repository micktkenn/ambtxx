import { createSupabaseBrowserClient, isSupabaseConfigured } from "./client";
import type { Json } from "./database.types";

export type StateTableSyncResult = {
  source: "supabase" | "local-storage";
  syncedTables: string[];
  errors: string[];
};

let syncTimer: ReturnType<typeof setTimeout> | undefined;

function toJson(value: unknown): Json {
  return (value ?? {}) as Json;
}

function defined<T extends Record<string, unknown>>(row: T) {
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== undefined)) as T;
}

async function upsertRows(table: string, rows: Array<Record<string, unknown>>, errors: string[], onConflict?: string) {
  if (!rows.length) return false;
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from(table as never).upsert(rows as never, onConflict ? { onConflict } as never : undefined);
  if (error) {
    errors.push(`${table}: ${error.message}`);
    return false;
  }
  return true;
}

function mapProfile(user: any) {
  return defined({
    id: user.id,
    username: user.username,
    display_name: user.displayName ?? user.username,
    email: user.email ?? null,
    country: user.country ?? null,
    avatar_initials: user.avatarInitials ?? null,
    kyc_level: user.kycLevel ?? 0,
    kyc_status: user.kycStatus ?? "not_started",
    risk_level: user.riskLevel ?? "low",
    status: user.status ?? "active",
    completed_trades: user.completedTrades ?? 0,
    completion_rate: user.completionRate ?? 0,
    rating: user.rating ?? 0,
    average_release_minutes: user.averageReleaseMinutes ?? null,
    wallet_address: user.walletAddress ?? null,
    created_at: user.joinedAt ?? undefined,
  });
}

function mapAd(ad: any) {
  return defined({
    id: ad.id,
    trader_id: ad.traderId,
    side: ad.side,
    asset: ad.asset,
    fiat: ad.fiat,
    price: ad.price,
    price_type: ad.priceType ?? "fixed",
    margin_percent: ad.marginPercent ?? null,
    available_amount: ad.availableAmount,
    min_fiat: ad.minFiat,
    max_fiat: ad.maxFiat,
    payment_methods: ad.paymentMethods ?? [],
    payment_window_minutes: ad.paymentWindowMinutes ?? 30,
    terms: ad.terms ?? null,
    requirements: toJson(ad.requirements ?? {}),
    status: ad.status ?? "draft",
    created_at: ad.createdAt ?? undefined,
  });
}

function mapOrder(order: any) {
  return defined({
    id: order.id,
    ad_id: order.adId ?? null,
    side: order.side,
    buyer_id: order.buyerId,
    seller_id: order.sellerId,
    asset: order.asset,
    asset_amount: order.assetAmount,
    fiat: order.fiat,
    fiat_amount: order.fiatAmount,
    price: order.price,
    status: order.status,
    escrow_status: order.escrowStatus,
    payment_method: order.paymentMethod ?? null,
    payment_account_name: order.paymentAccountName ?? null,
    payment_account_masked: order.paymentAccountMasked ?? null,
    timer_ends_at: order.timerEndsAt ?? null,
    escrow_tx: order.escrowTx ?? null,
    fee_amount: order.feeAmount ?? 0,
    created_at: order.createdAt ?? undefined,
    updated_at: order.updatedAt ?? new Date().toISOString(),
  });
}

function mapOrderEvent(event: any) {
  return defined({
    id: event.id,
    order_id: event.orderId,
    type: event.type,
    label: event.label,
    description: event.description ?? null,
    actor_type: event.actorType ?? "system",
    created_at: event.createdAt ?? undefined,
  });
}

function mapMessage(message: any) {
  return defined({
    id: message.id,
    order_id: message.orderId,
    sender_id: message.senderId ?? null,
    sender_type: message.senderType,
    sender_name: message.senderName ?? null,
    body: message.body,
    attachment_url: message.attachmentUrl ?? null,
    read_at: message.readAt ?? null,
    created_at: message.createdAt ?? undefined,
  });
}

function mapEvidence(file: any) {
  return defined({
    id: file.id,
    owner_id: file.ownerId ?? null,
    related_type: file.relatedType,
    related_id: file.relatedId,
    file_name: file.fileName,
    mime_type: file.mimeType,
    size_kb: file.sizeKb ?? 0,
    storage_path: file.storagePath ?? null,
    status: file.status ?? "uploaded",
    created_at: file.createdAt ?? undefined,
  });
}

function mapDispute(dispute: any) {
  return defined({
    id: dispute.id,
    order_id: dispute.orderId,
    reason: dispute.reason,
    status: dispute.status,
    priority: dispute.priority ?? "normal",
    amount: dispute.amount,
    asset: dispute.asset,
    buyer_evidence_count: dispute.buyerEvidenceCount ?? 0,
    seller_evidence_count: dispute.sellerEvidenceCount ?? 0,
    assigned_moderator: dispute.assignedModerator ?? null,
    moderator_notes: dispute.notes ?? dispute.moderatorNotes ?? [],
    created_at: dispute.createdAt ?? undefined,
  });
}

function mapUserPaymentMethod(method: any) {
  return defined({
    id: method.id,
    user_id: method.userId,
    method_type: method.methodType ?? method.methodName ?? "Bank transfer",
    provider_name: method.providerName,
    account_holder_name: method.accountHolderName,
    account_identifier_masked: method.accountMasked ?? method.accountIdentifierMasked,
    currency: method.fiat ?? method.currency ?? "ETB",
    instructions: method.instructions ?? null,
    status: method.verified === false ? "pending" : "active",
    visible: method.visibility !== "hidden",
  });
}

function mapNotification(notification: any) {
  return defined({
    id: notification.id,
    user_id: notification.userId ?? null,
    type: notification.type,
    title: notification.title,
    body: notification.body,
    channel: notification.channel ?? "in_app",
    status: notification.status ?? "sent",
    read_at: notification.read ? new Date().toISOString() : notification.readAt ?? null,
    created_at: notification.createdAt ?? undefined,
  });
}

function mapSession(session: any) {
  return defined({
    id: session.id,
    user_id: session.userId,
    device: session.device,
    browser: session.browser,
    location_approx: session.locationApprox,
    ip_masked: session.ipMasked,
    current: Boolean(session.current),
    last_active_at: session.lastActiveAt ?? null,
    created_at: session.createdAt ?? undefined,
  });
}

function mapSecuritySettings(settings: any) {
  return defined({
    user_id: settings.userId ?? "user_001",
    security_score: settings.securityScore ?? 0,
    password_updated_at: settings.passwordUpdatedAt ?? null,
    totp_enabled: Boolean(settings.totpEnabled),
    passkey_enabled: Boolean(settings.passkeyEnabled),
    email_otp_enabled: Boolean(settings.emailOtpEnabled),
    sms_otp_enabled: Boolean(settings.smsOtpEnabled),
    telegram_linked: Boolean(settings.telegramLinked),
    backup_codes_remaining: settings.backupCodesRemaining ?? 0,
    anti_phishing_code: settings.antiPhishingCode ?? null,
    sensitive_action_method: settings.sensitiveActionMethod ?? "totp_wallet_signature",
  });
}

function mapSupportTicket(ticket: any) {
  return defined({
    id: ticket.id,
    user_id: ticket.userId ?? null,
    subject: ticket.subject,
    category: ticket.category ?? "support",
    status: ticket.status,
    priority: ticket.priority ?? "normal",
    created_at: ticket.createdAt ?? undefined,
    updated_at: ticket.updatedAt ?? undefined,
  });
}

function mapKycCase(item: any) {
  return defined({
    id: item.id,
    user_id: item.userId,
    requested_level: item.requestedLevel,
    status: item.status,
    provider: item.provider,
    provider_applicant_id: item.providerApplicantId ?? null,
    document_type: item.documentType ?? null,
    country: item.country ?? null,
    risk_tags: item.riskTags ?? [],
    reviewer: item.reviewer ?? null,
    review_note: item.reviewNote ?? null,
    created_at: item.createdAt ?? undefined,
    updated_at: item.updatedAt ?? undefined,
  });
}

function mapAsset(item: any) {
  return defined({ symbol: item.symbol, name: item.name, network: item.network, contract: item.contract, decimals: item.decimals, status: item.status, min_trade: item.minTrade, max_trade: item.maxTrade, icon: item.icon ?? null, escrow_enabled: item.escrowEnabled ?? true });
}

function mapNetwork(item: any) {
  return defined({ name: item.name, chain_id: item.chainId, rpc_provider: item.rpcProvider ?? null, explorer_url: item.explorerUrl ?? null, escrow_contract: item.escrowContract ?? null, confirmations: item.confirmations ?? 12, status: item.status, latest_synced_block: item.latestSyncedBlock ?? 0, gas_policy: item.gasPolicy ?? "user_pays" });
}

function mapPlatformPaymentMethod(item: any) {
  return defined({ id: item.id, name: item.name, type: item.type, country: item.country, fiat: item.fiat, status: item.status, kyc_level: item.kycLevel ?? 0, risk_level: item.riskLevel ?? "low", min_order_amount: item.minOrderAmount ?? 0, max_order_amount: item.maxOrderAmount ?? 0, instructions: item.instructions ?? null });
}

function mapFeeRule(item: any) {
  return defined({ id: item.id, name: item.name, payer: item.payer, percentage: item.percentage, min_fee: item.minFee ?? 0, max_fee: item.maxFee ?? 0, asset: item.asset, status: item.status });
}

function mapIntegration(item: any) {
  return defined({ key: item.key, name: item.name, category: item.category ?? "integration", status: item.status, mode: item.mode ?? "sandbox", masked_key: item.maskedKey ?? null, webhook_url: item.webhookUrl ?? null, last_success: item.lastSuccess ?? null, last_error: item.lastError ?? null });
}

function mapTemplate(item: any) {
  return defined({ id: item.id, key: item.key, channel: item.channel, subject: item.subject ?? null, body: item.body, variables: item.variables ?? [], status: item.status });
}

function mapContent(item: any) {
  return defined({ id: item.id, title: item.title, placement: item.placement, body: item.body, status: item.status, type: item.type ?? "content", updated_at: item.updatedAt ?? undefined });
}

function mapRiskRule(item: any) {
  return defined({ id: item.id, name: item.name, trigger: item.trigger, severity: item.severity, status: item.status });
}

function mapRiskFlag(item: any) {
  return defined({ id: item.id, target_type: item.targetType, target_id: item.targetId, severity: item.severity, reason: item.reason, status: item.status, assigned_to: item.assignedTo ?? null, rule_id: item.ruleId ?? null, created_at: item.createdAt ?? undefined, resolved_at: item.resolvedAt ?? null });
}

function mapAuditLog(item: any) {
  return defined({ id: item.id, admin_name: item.adminName, action: item.action, target_type: item.targetType, target_id: item.targetId, ip_masked: item.ipMasked ?? null, result: item.result ?? "success", created_at: item.createdAt ?? undefined });
}

function mapSystemSetting(item: any) {
  return defined({ key: item.key, label: item.label, description: item.description ?? null, value: toJson(item.value), updated_at: new Date().toISOString() });
}

export async function syncWebStateTables(state: any): Promise<StateTableSyncResult> {
  if (!isSupabaseConfigured()) return { source: "local-storage", syncedTables: [], errors: [] };
  const errors: string[] = [];
  const syncedTables: string[] = [];

  const jobs: Array<[string, Array<Record<string, unknown>>, string?]> = [
    ["ads", (state.ads ?? []).map(mapAd)],
    ["orders", (state.orders ?? []).map(mapOrder)],
    ["order_events", (state.events ?? []).map(mapOrderEvent)],
    ["order_messages", (state.messages ?? []).map(mapMessage)],
    ["evidence_files", (state.evidence ?? []).map(mapEvidence)],
    ["disputes", (state.disputes ?? []).map(mapDispute)],
    ["user_payment_methods", (state.paymentMethods ?? []).map(mapUserPaymentMethod)],
    ["notifications", (state.notifications ?? []).map(mapNotification)],
    ["user_sessions", (state.sessions ?? []).map(mapSession)],
    ["user_security_settings", state.security ? [mapSecuritySettings(state.security)] : []],
    ["support_tickets", (state.supportTickets ?? []).map(mapSupportTicket)],
  ];

  for (const [table, rows, onConflict] of jobs) {
    const ok = await upsertRows(table, rows, errors, onConflict);
    if (ok) syncedTables.push(table);
  }

  return { source: "supabase", syncedTables, errors };
}

export async function syncAdminStateTables(state: any): Promise<StateTableSyncResult> {
  if (!isSupabaseConfigured()) return { source: "local-storage", syncedTables: [], errors: [] };
  const errors: string[] = [];
  const syncedTables: string[] = [];

  const jobs: Array<[string, Array<Record<string, unknown>>, string?]> = [
    ["profiles", (state.users ?? []).map(mapProfile)],
    ["ads", (state.ads ?? []).map(mapAd)],
    ["orders", (state.orders ?? []).map(mapOrder)],
    ["disputes", (state.disputes ?? []).map(mapDispute)],
    ["kyc_cases", (state.kycCases ?? []).map(mapKycCase)],
    ["fee_rules", (state.feeRules ?? []).map(mapFeeRule)],
    ["assets", (state.assets ?? []).map(mapAsset)],
    ["networks", (state.networks ?? []).map(mapNetwork), "chain_id"],
    ["payment_methods", (state.paymentMethods ?? []).map(mapPlatformPaymentMethod)],
    ["integrations", (state.integrations ?? []).map(mapIntegration)],
    ["notification_templates", (state.templates ?? []).map(mapTemplate)],
    ["content_items", (state.content ?? []).map(mapContent)],
    ["risk_rules", (state.riskRules ?? []).map(mapRiskRule)],
    ["risk_flags", (state.riskFlags ?? []).map(mapRiskFlag)],
    ["admin_audit_logs", (state.auditLogs ?? []).map(mapAuditLog)],
    ["support_tickets", (state.supportTickets ?? []).map(mapSupportTicket)],
    ["system_settings", (state.systemSettings ?? []).map(mapSystemSetting)],
  ];

  for (const [table, rows, onConflict] of jobs) {
    const ok = await upsertRows(table, rows, errors, onConflict);
    if (ok) syncedTables.push(table);
  }

  return { source: "supabase", syncedTables, errors };
}

export function scheduleWebStateTableSync(state: any, callback?: (result: StateTableSyncResult) => void) {
  if (!isSupabaseConfigured()) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncWebStateTables(state).then(callback).catch((error) => callback?.({ source: "supabase", syncedTables: [], errors: [error instanceof Error ? error.message : "Failed web table sync"] }));
  }, 600);
}

export function scheduleAdminStateTableSync(state: any, callback?: (result: StateTableSyncResult) => void) {
  if (!isSupabaseConfigured()) return;
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncAdminStateTables(state).then(callback).catch((error) => callback?.({ source: "supabase", syncedTables: [], errors: [error instanceof Error ? error.message : "Failed admin table sync"] }));
  }, 600);
}
