import { createSupabaseBrowserClient, isSupabaseConfigured } from "./client";
import type { Json } from "./database.types";

export type ActivityActorType = "user" | "admin" | "system";
export type ActivityTone = "success" | "warning" | "danger" | "primary" | "neutral";

export type ActivityInput = {
  app: "web" | "admin";
  actorType: ActivityActorType;
  actorId?: string;
  actorName?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  tone?: ActivityTone;
  payload?: Record<string, unknown>;
};

const localActivityKey = "amlbt-local-activity-events-v5";

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function toSnakePayload(payload?: Record<string, unknown>): Json {
  return (payload ?? {}) as Json;
}

function saveLocalActivity(input: ActivityInput) {
  if (typeof window === "undefined") return;
  const event = { id: makeId("act"), ...input, createdAt: now() };
  const raw = window.localStorage.getItem(localActivityKey);
  const current = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(localActivityKey, JSON.stringify([event, ...current].slice(0, 250)));
}

export function getLocalActivityEvents() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(localActivityKey);
  return raw ? JSON.parse(raw) : [];
}

export async function recordActivity(input: ActivityInput) {
  saveLocalActivity(input);

  if (!isSupabaseConfigured()) {
    return { source: "local-storage" as const };
  }

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("activity_events")
    .insert({
      id: makeId("ACT"),
      app: input.app,
      actor_type: input.actorType,
      actor_id: input.actorId ?? null,
      actor_name: input.actorName ?? null,
      action: input.action,
      target_type: input.targetType ?? "ui",
      target_id: input.targetId ?? "prototype",
      tone: input.tone ?? "success",
      payload: toSnakePayload(input.payload),
    })
    .select("*")
    .single();

  if (error) {
    saveLocalActivity({ ...input, action: `${input.action} (Supabase activity fallback: ${error.message})`, tone: "warning" });
    return { source: "local-storage" as const, error: error.message };
  }

  return { source: "supabase" as const, data };
}

export async function recordUserActivity(action: string, payload?: Record<string, unknown>, tone: ActivityTone = "success") {
  return recordActivity({ app: "web", actorType: "user", actorId: "user_001", actorName: "MilkessaT", action, tone, payload });
}

export async function recordAdminActivity(action: string, payload?: Record<string, unknown>, tone: ActivityTone = "success") {
  const result = await recordActivity({ app: "admin", actorType: "admin", actorId: "admin_super", actorName: "Super Admin", action, tone, payload });

  if (isSupabaseConfigured()) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("admin_audit_logs").insert({
      id: `AUD-${Math.floor(Math.random() * 999999)}`,
      admin_name: "Super Admin",
      action,
      target_type: String(payload?.targetType ?? "ui"),
      target_id: String(payload?.targetId ?? "prototype"),
      result: "success",
    });
  }

  return result;
}

export async function createPersistentAd(input: {
  id?: string;
  traderId: string;
  side: "buy" | "sell";
  asset: string;
  fiat: string;
  price: number;
  availableAmount: number;
  minFiat: number;
  maxFiat: number;
  paymentMethods: string[];
  terms?: string;
  status?: string;
}) {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const id = input.id ?? `ad_${Math.random().toString(36).slice(2, 9)}`;
  const { data, error } = await supabase.from("ads").insert({
    id,
    trader_id: input.traderId,
    side: input.side,
    asset: input.asset,
    fiat: input.fiat,
    price: input.price,
    available_amount: input.availableAmount,
    min_fiat: input.minFiat,
    max_fiat: input.maxFiat,
    payment_methods: input.paymentMethods,
    terms: input.terms ?? null,
    status: input.status ?? "active",
  }).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };
  await recordUserActivity(`Created ad ${id}`, { targetType: "ad", targetId: id }, "success");
  return { source: "supabase" as const, data };
}

export async function createPersistentOrder(input: {
  id?: string;
  adId?: string;
  buyerId: string;
  sellerId: string;
  side: "buy" | "sell";
  asset: string;
  assetAmount: number;
  fiat: string;
  fiatAmount: number;
  price: number;
  paymentMethod?: string;
  feeAmount?: number;
}) {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const id = input.id ?? `TRD-${Math.floor(10000 + Math.random() * 89999)}`;
  const { data, error } = await supabase.from("orders").insert({
    id,
    ad_id: input.adId ?? null,
    buyer_id: input.buyerId,
    seller_id: input.sellerId,
    side: input.side,
    asset: input.asset,
    asset_amount: input.assetAmount,
    fiat: input.fiat,
    fiat_amount: input.fiatAmount,
    price: input.price,
    status: "payment_pending",
    escrow_status: "funded",
    payment_method: input.paymentMethod ?? null,
    fee_amount: input.feeAmount ?? 0,
    escrow_tx: `0xmock${Math.random().toString(16).slice(2, 12)}`,
  }).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };

  await supabase.from("order_events").insert({
    id: `evt_${Math.random().toString(36).slice(2, 10)}`,
    order_id: id,
    type: "escrow_funded",
    label: "Escrow funded",
    description: `${input.assetAmount} ${input.asset} locked in escrow.`,
    actor_type: "system",
  });
  await recordUserActivity(`Created order ${id}`, { targetType: "order", targetId: id, adId: input.adId }, "success");
  return { source: "supabase" as const, data };
}

export async function updatePersistentOrderStatus(orderId: string, status: string, label?: string) {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const patch: Record<string, unknown> = { status, updated_at: now() };
  if (status === "released") patch.escrow_status = "released";
  if (status === "refunded") patch.escrow_status = "refunded";
  const { data, error } = await supabase.from("orders").update(patch as never).eq("id", orderId).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };
  await supabase.from("order_events").insert({
    id: `evt_${Math.random().toString(36).slice(2, 10)}`,
    order_id: orderId,
    type: status,
    label: label ?? status.replaceAll("_", " "),
    actor_type: "user",
  });
  await recordUserActivity(`Order ${orderId} changed to ${status}`, { targetType: "order", targetId: orderId }, status === "released" ? "danger" : "primary");
  return { source: "supabase" as const, data };
}

export async function sendPersistentOrderMessage(input: { orderId: string; senderId?: string; senderType: string; senderName?: string; body: string; attachmentUrl?: string }) {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("order_messages").insert({
    id: `msg_${Math.random().toString(36).slice(2, 10)}`,
    order_id: input.orderId,
    sender_id: input.senderId ?? null,
    sender_type: input.senderType,
    sender_name: input.senderName ?? null,
    body: input.body,
    attachment_url: input.attachmentUrl ?? null,
  }).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };
  await recordUserActivity(`Sent chat message in ${input.orderId}`, { targetType: "order", targetId: input.orderId }, "primary");
  return { source: "supabase" as const, data };
}

export async function openPersistentDispute(input: { id?: string; orderId: string; reason: string; amount: number; asset: string; note?: string }) {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const id = input.id ?? `DSP-${Math.floor(100 + Math.random() * 899)}`;
  const { data, error } = await supabase.from("disputes").insert({
    id,
    order_id: input.orderId,
    reason: input.reason,
    status: "open",
    priority: "high",
    amount: input.amount,
    asset: input.asset,
    assigned_moderator: "Auto queue",
    moderator_notes: input.note ? [input.note] : [],
  }).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };
  await updatePersistentOrderStatus(input.orderId, "disputed", "Dispute opened");
  await recordUserActivity(`Opened dispute ${id}`, { targetType: "dispute", targetId: id, orderId: input.orderId }, "warning");
  return { source: "supabase" as const, data };
}

export async function updatePersistentProfileStatus(userId: string, status: string, action = "Profile status changed") {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("profiles").update({ status, updated_at: now() }).eq("id", userId).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };
  await recordAdminActivity(action, { targetType: "user", targetId: userId, status }, status === "frozen" ? "danger" : "warning");
  return { source: "supabase" as const, data };
}

export async function createPersistentNotification(input: { userId?: string; type: string; title: string; body: string; channel?: string; status?: string }) {
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("notifications").insert({
    id: `ntf_${Math.random().toString(36).slice(2, 10)}`,
    user_id: input.userId ?? null,
    type: input.type,
    title: input.title,
    body: input.body,
    channel: input.channel ?? "in_app",
    status: input.status ?? "sent",
  }).select("*").single();
  if (error) return { source: "local-storage" as const, error: error.message };
  return { source: "supabase" as const, data };
}
