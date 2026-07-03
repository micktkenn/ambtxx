import { createSupabaseBrowserClient } from "./client";

export async function getProfiles() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAds() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.from("ads").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createOrderFromAd(input: {
  adId: string;
  buyerId: string;
  sellerId: string;
  side: "buy" | "sell";
  asset: string;
  assetAmount: number;
  fiat: string;
  fiatAmount: number;
  price: number;
  paymentMethod?: string;
}) {
  const supabase = createSupabaseBrowserClient();
  const id = `TRD-${Math.floor(1000 + Math.random() * 9000)}`;
  const { data, error } = await supabase
    .from("orders")
    .insert({
      id,
      buyer_id: input.buyerId,
      seller_id: input.sellerId,
      side: input.side,
      asset: input.asset,
      asset_amount: input.assetAmount,
      fiat: input.fiat,
      fiat_amount: input.fiatAmount,
      price: input.price,
      payment_method: input.paymentMethod ?? null,
      status: "payment_pending",
      escrow_status: "funded",
      escrow_tx: `0xmock${Math.random().toString(16).slice(2, 12)}`
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function sendOrderMessage(input: { orderId: string; senderType: string; senderName?: string; body: string }) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("order_messages")
    .insert({ id: `msg_${Math.random().toString(36).slice(2, 10)}`, order_id: input.orderId, sender_type: input.senderType, sender_name: input.senderName ?? null, body: input.body })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createAuditLog(action: string, targetType = "prototype", targetId = "mock") {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("admin_audit_logs")
    .insert({ id: `AUD-${Math.floor(Math.random() * 99999)}`, admin_name: "Super Admin", action, target_type: targetType, target_id: targetId, result: "success" })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
