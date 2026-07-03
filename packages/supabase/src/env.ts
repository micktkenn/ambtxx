export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const enabled = process.env.NEXT_PUBLIC_AMLBT_USE_SUPABASE !== "false";
  return { url, publishableKey, enabled, isConfigured: Boolean(enabled && url && publishableKey) };
}

export function assertSupabaseEnv() {
  const env = getSupabaseEnv();
  if (!env.isConfigured || !env.url || !env.publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  return { url: env.url, publishableKey: env.publishableKey };
}
