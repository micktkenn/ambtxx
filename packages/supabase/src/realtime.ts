import { createSupabaseBrowserClient, isSupabaseConfigured } from "./client";

export type RealtimeTable = "orders" | "order_messages" | "disputes" | "notifications" | "activity_events" | "admin_audit_logs";

export function subscribeToTable(table: RealtimeTable, onChange: (payload: unknown) => void) {
  if (!isSupabaseConfigured() || typeof window === "undefined") {
    return () => undefined;
  }

  const supabase = createSupabaseBrowserClient();
  const channel = supabase
    .channel(`amlbt:${table}`)
    .on("postgres_changes", { event: "*", schema: "public", table }, (payload) => onChange(payload))
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}
