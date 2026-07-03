import { createSupabaseBrowserClient, isSupabaseConfigured } from "./client";
import type { Json } from "./database.types";

export type SnapshotApp = "web" | "admin";
export type SnapshotSource = "supabase" | "local-storage" | "seed";
export type SnapshotResult<T> = { data: T; source: SnapshotSource; error?: string };

const keyFor = (app: SnapshotApp) => `amlbt-${app}-state-v4`;
const rowIdFor = (app: SnapshotApp) => `${app}:functional-state`;

export function getLocalSnapshot<T>(app: SnapshotApp, fallback: T): SnapshotResult<T> {
  if (typeof window === "undefined") return { data: fallback, source: "seed" };
  try {
    const raw = window.localStorage.getItem(keyFor(app));
    if (!raw) return { data: fallback, source: "seed" };
    return { data: JSON.parse(raw) as T, source: "local-storage" };
  } catch (error) {
    return { data: fallback, source: "seed", error: error instanceof Error ? error.message : "Failed to read local storage" };
  }
}

export function saveLocalSnapshot<T>(app: SnapshotApp, data: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(keyFor(app), JSON.stringify(data));
}

export function clearLocalSnapshot(app: SnapshotApp) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(keyFor(app));
}

function isEmptyPayload(payload: unknown) {
  return Boolean(payload && typeof payload === "object" && !Array.isArray(payload) && Object.keys(payload as Record<string, unknown>).length === 0);
}

export async function loadSnapshot<T>(app: SnapshotApp, fallback: T): Promise<SnapshotResult<T>> {
  if (!isSupabaseConfigured()) return getLocalSnapshot(app, fallback);

  try {
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("app_state_snapshots")
      .select("payload")
      .eq("id", rowIdFor(app))
      .maybeSingle();

    if (error) throw error;
    if (!data?.payload || isEmptyPayload(data.payload)) {
      await saveSnapshot(app, fallback);
      return { data: fallback, source: "seed" };
    }

    return { data: data.payload as T, source: "supabase" };
  } catch (error) {
    const local = getLocalSnapshot(app, fallback);
    return { ...local, error: error instanceof Error ? error.message : "Failed to load Supabase snapshot" };
  }
}

export async function saveSnapshot<T>(app: SnapshotApp, data: T) {
  saveLocalSnapshot(app, data);
  if (!isSupabaseConfigured()) return { source: "local-storage" as const };

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.from("app_state_snapshots").upsert({
    id: rowIdFor(app),
    app,
    payload: data as Json,
    updated_at: new Date().toISOString()
  });

  if (error) throw error;
  return { source: "supabase" as const };
}

export async function resetSnapshot<T>(app: SnapshotApp, fallback: T) {
  clearLocalSnapshot(app);
  if (isSupabaseConfigured()) {
    const supabase = createSupabaseBrowserClient();
    await supabase.from("app_state_snapshots").upsert({
      id: rowIdFor(app),
      app,
      payload: fallback as Json,
      updated_at: new Date().toISOString()
    });
  }
}

export function getSnapshotModeLabel() {
  return isSupabaseConfigured() ? "Supabase database" : "Local mock storage";
}
