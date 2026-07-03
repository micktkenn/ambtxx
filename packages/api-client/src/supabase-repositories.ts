// Real database repositories for the v0.4 Supabase mode.
// Import from this file when gradually replacing mock API calls with normalized Supabase queries.

export {
  getProfiles as getSupabaseProfiles,
  getAds as getSupabaseAds,
  createOrderFromAd as createSupabaseOrderFromAd,
  updateOrderStatus as updateSupabaseOrderStatus,
  sendOrderMessage as sendSupabaseOrderMessage,
  createAuditLog as createSupabaseAuditLog
} from "@amlbt/supabase";
