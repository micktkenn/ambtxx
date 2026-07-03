import { runRemoteTableAction, type RemoteActionTone } from "./remote-action-engine";

const webActor = {
  app: "web" as const,
  actorType: "user" as const,
  actorId: "user_001",
  actorName: "MilkessaT",
};

export async function persistWebActivity(actionKey: string, payload?: Record<string, unknown>, tone: RemoteActionTone = "success") {
  return runRemoteTableAction({
    ...webActor,
    actionKey,
    operation: "activity",
    targetType: String(payload?.targetType ?? "ui"),
    targetId: String(payload?.targetId ?? "prototype"),
    payload,
    tone,
  });
}

export async function persistAdCreateRemote(ad: {
  id: string;
  traderId: string;
  side: "buy" | "sell";
  asset: string;
  fiat: string;
  price: number;
  priceType?: string;
  marginPercent?: number;
  availableAmount: number;
  minFiat: number;
  maxFiat: number;
  paymentMethods: string[];
  paymentWindowMinutes?: number;
  terms?: string;
  requirements?: Record<string, unknown>;
  status?: string;
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "ads.create",
    operation: "upsert",
    tableName: "ads",
    targetType: "ad",
    targetId: ad.id,
    values: {
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
      payment_methods: ad.paymentMethods,
      payment_window_minutes: ad.paymentWindowMinutes ?? 30,
      terms: ad.terms ?? null,
      requirements: ad.requirements ?? {},
      status: ad.status ?? "active",
    },
    payload: { ad },
  });
}

export async function persistAdStatusRemote(adId: string, status: string) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "ads.status.update",
    operation: "update",
    tableName: "ads",
    targetType: "ad",
    targetId: adId,
    match: { id: adId },
    values: { status, updated_at: new Date().toISOString() },
    payload: { adId, status },
    tone: status === "active" ? "success" : "warning",
  });
}

export async function persistOrderCreateRemote(order: {
  id: string;
  adId?: string;
  buyerId: string;
  sellerId: string;
  side: "buy" | "sell";
  asset: string;
  assetAmount: number;
  fiat: string;
  fiatAmount: number;
  price: number;
  status?: string;
  escrowStatus?: string;
  paymentMethod?: string;
  paymentAccountName?: string;
  paymentAccountMasked?: string;
  timerEndsAt?: string;
  escrowTx?: string;
  feeAmount?: number;
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "orders.create",
    operation: "upsert",
    tableName: "orders",
    targetType: "order",
    targetId: order.id,
    values: {
      id: order.id,
      ad_id: order.adId ?? null,
      buyer_id: order.buyerId,
      seller_id: order.sellerId,
      side: order.side,
      asset: order.asset,
      asset_amount: order.assetAmount,
      fiat: order.fiat,
      fiat_amount: order.fiatAmount,
      price: order.price,
      status: order.status ?? "payment_pending",
      escrow_status: order.escrowStatus ?? "funded",
      payment_method: order.paymentMethod ?? null,
      payment_account_name: order.paymentAccountName ?? null,
      payment_account_masked: order.paymentAccountMasked ?? null,
      timer_ends_at: order.timerEndsAt ?? null,
      escrow_tx: order.escrowTx ?? `0xmock${Math.random().toString(16).slice(2, 12)}`,
      fee_amount: order.feeAmount ?? 0,
    },
    payload: { order },
  });
}

export async function persistOrderStatusRemote(orderId: string, status: string, escrowStatus?: string) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "orders.status.update",
    operation: "update",
    tableName: "orders",
    targetType: "order",
    targetId: orderId,
    match: { id: orderId },
    values: {
      status,
      escrow_status: escrowStatus ?? (status === "released" ? "released" : status === "refunded" ? "refunded" : undefined),
      updated_at: new Date().toISOString(),
    },
    payload: { orderId, status, escrowStatus },
    tone: status === "released" || status === "cancelled" ? "danger" : "primary",
  });
}

export async function persistOrderEventRemote(event: {
  id: string;
  orderId: string;
  type: string;
  label: string;
  description?: string;
  actorType?: string;
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "orders.event.create",
    operation: "upsert",
    tableName: "order_events",
    targetType: "order",
    targetId: event.orderId,
    values: {
      id: event.id,
      order_id: event.orderId,
      type: event.type,
      label: event.label,
      description: event.description ?? null,
      actor_type: event.actorType ?? "user",
    },
    payload: { event },
  });
}

export async function persistOrderMessageRemote(message: {
  id: string;
  orderId: string;
  senderId?: string;
  senderType: string;
  senderName?: string;
  body: string;
  attachmentUrl?: string;
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "chat.message.send",
    operation: "upsert",
    tableName: "order_messages",
    targetType: "order",
    targetId: message.orderId,
    values: {
      id: message.id,
      order_id: message.orderId,
      sender_id: message.senderId ?? null,
      sender_type: message.senderType,
      sender_name: message.senderName ?? null,
      body: message.body,
      attachment_url: message.attachmentUrl ?? null,
    },
    payload: { message },
    tone: "primary",
  });
}

export async function persistEvidenceRemote(file: {
  id: string;
  ownerId?: string;
  relatedType: string;
  relatedId: string;
  fileName: string;
  mimeType: string;
  sizeKb: number;
  storagePath?: string;
  status?: string;
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "evidence.upload",
    operation: "upsert",
    tableName: "evidence_files",
    targetType: file.relatedType,
    targetId: file.relatedId,
    values: {
      id: file.id,
      owner_id: file.ownerId ?? "user_001",
      related_type: file.relatedType,
      related_id: file.relatedId,
      file_name: file.fileName,
      mime_type: file.mimeType,
      size_kb: file.sizeKb,
      storage_path: file.storagePath ?? null,
      status: file.status ?? "uploaded",
    },
    payload: { file },
    tone: "primary",
  });
}

export async function persistDisputeOpenRemote(dispute: {
  id: string;
  orderId: string;
  reason: string;
  amount: number;
  asset: string;
  priority?: string;
  buyerEvidenceCount?: number;
  sellerEvidenceCount?: number;
  assignedModerator?: string;
  moderatorNotes?: string[];
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "disputes.open",
    operation: "upsert",
    tableName: "disputes",
    targetType: "dispute",
    targetId: dispute.id,
    values: {
      id: dispute.id,
      order_id: dispute.orderId,
      reason: dispute.reason,
      status: "open",
      priority: dispute.priority ?? "high",
      amount: dispute.amount,
      asset: dispute.asset,
      buyer_evidence_count: dispute.buyerEvidenceCount ?? 0,
      seller_evidence_count: dispute.sellerEvidenceCount ?? 0,
      assigned_moderator: dispute.assignedModerator ?? "Auto queue",
      moderator_notes: dispute.moderatorNotes ?? [],
    },
    payload: { dispute },
    tone: "warning",
  });
}

export async function persistPaymentMethodRemote(method: {
  id: string;
  userId: string;
  methodName?: string;
  methodType?: string;
  providerName: string;
  accountHolderName: string;
  accountMasked: string;
  fiat: string;
  instructions?: string;
  visibility?: string;
  verified?: boolean;
}) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "payment_methods.save",
    operation: "upsert",
    tableName: "user_payment_methods",
    targetType: "payment_method",
    targetId: method.id,
    values: {
      id: method.id,
      user_id: method.userId,
      method_type: method.methodType ?? method.methodName ?? "Bank transfer",
      provider_name: method.providerName,
      account_holder_name: method.accountHolderName,
      account_identifier_masked: method.accountMasked,
      currency: method.fiat,
      instructions: method.instructions ?? null,
      status: method.verified === false ? "pending" : "active",
      visible: method.visibility !== "hidden",
    },
    payload: { method },
  });
}

export async function persistSupportTicketRemote(ticket: { id: string; userId: string; subject: string; category: string; status: string; priority: string }) {
  return runRemoteTableAction({
    ...webActor,
    actionKey: "support.ticket.create",
    operation: "upsert",
    tableName: "support_tickets",
    targetType: "support_ticket",
    targetId: ticket.id,
    values: {
      id: ticket.id,
      user_id: ticket.userId,
      subject: ticket.subject,
      category: ticket.category,
      status: ticket.status,
      priority: ticket.priority,
    },
    payload: { ticket },
    tone: "primary",
  });
}
