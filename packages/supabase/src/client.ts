import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { assertSupabaseEnv, getSupabaseEnv } from "./env";

export function isSupabaseConfigured() {
  return getSupabaseEnv().isConfigured;
}

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = assertSupabaseEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
