import { createSupabaseBrowserClient, isSupabaseConfigured } from "./client";
import type { Json } from "./database.types";

export type RemoteActionApp = "web" | "admin";
export type RemoteActionActorType = "user" | "admin" | "system";
export type RemoteActionOperation = "insert" | "update" | "upsert" | "delete" | "activity";
export type RemoteActionTone = "success" | "warning" | "danger" | "primary" | "neutral";

export type RemoteActionInput = {
  app: RemoteActionApp;
  actionKey: string;
  actorType: RemoteActionActorType;
  actorId?: string;
  actorName?: string;
  operation: RemoteActionOperation;
  tableName?: string;
  targetType?: string;
  targetId?: string;
  match?: Record<string, unknown>;
  values?: Record<string, unknown>;
  payload?: Record<string, unknown>;
  tone?: RemoteActionTone;
  audit?: boolean;
};

export type RemoteActionResult = {
  source: "supabase" | "local-storage";
  status: "ok" | "fallback" | "error";
  actionId: string;
  error?: string;
  data?: unknown;
};

const localOutboxKey = "amlbt-remote-action-outbox-v6";

export function makeRemoteActionId(prefix = "act") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function now() {
  return new Date().toISOString();
}

function toJson(value?: Record<string, unknown>): Json {
  return (value ?? {}) as Json;
}

function saveLocalOutbox(input: RemoteActionInput, status: RemoteActionResult["status"], error?: string) {
  if (typeof window === "undefined") return;
  const row = {
    id: makeRemoteActionId("local"),
    ...input,
    status,
    error,
    createdAt: now(),
  };
  const raw = window.localStorage.getItem(localOutboxKey);
  const rows = raw ? JSON.parse(raw) : [];
  window.localStorage.setItem(localOutboxKey, JSON.stringify([row, ...rows].slice(0, 500)));
}

export function getLocalRemoteActionOutbox() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(localOutboxKey);
  return raw ? JSON.parse(raw) : [];
}

async function insertOutbox(input: RemoteActionInput, status: "pending" | "applied" | "failed", result?: Record<string, unknown>) {
  if (!isSupabaseConfigured()) return;
  const supabase = createSupabaseBrowserClient();
  await supabase.from("action_outbox").insert({
    id: makeRemoteActionId("outbox"),
    app: input.app,
    action_key: input.actionKey,
    actor_type: input.actorType,
    actor_id: input.actorId ?? null,
    actor_name: input.actorName ?? null,
    operation: input.operation,
    table_name: input.tableName ?? null,
    target_type: input.targetType ?? input.tableName ?? "ui",
    target_id: input.targetId ?? "prototype",
    status,
    payload: toJson(input.payload ?? { match: input.match, values: input.values }),
    result: toJson(result),
    processed_at: status === "pending" ? null : now(),
  });
}

export async function enqueueRemoteAction(input: RemoteActionInput): Promise<RemoteActionResult> {
  const actionId = makeRemoteActionId(input.app === "admin" ? "adm" : "usr");

  saveLocalOutbox(input, "ok");

  if (!isSupabaseConfigured()) {
    return { source: "local-storage", status: "fallback", actionId };
  }

  try {
    await insertOutbox(input, "pending");
    return { source: "supabase", status: "ok", actionId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to enqueue remote action";
    saveLocalOutbox(input, "fallback", message);
    return { source: "local-storage", status: "fallback", actionId, error: message };
  }
}

export async function runRemoteTableAction(input: RemoteActionInput): Promise<RemoteActionResult> {
  const actionId = makeRemoteActionId(input.app === "admin" ? "adm" : "usr");
  saveLocalOutbox(input, "ok");

  if (!isSupabaseConfigured()) {
    return { source: "local-storage", status: "fallback", actionId };
  }

  if (!input.tableName || input.operation === "activity") {
    await enqueueRemoteAction(input);
    return { source: "supabase", status: "ok", actionId };
  }

  const supabase = createSupabaseBrowserClient();

  try {
    await insertOutbox(input, "pending");

    let query: any = supabase.from(input.tableName as never);
    let data: unknown;
    let error: { message: string } | null = null;

    if (input.operation === "insert") {
      const result = await query.insert(input.values as never).select("*");
      data = result.data;
      error = result.error;
    }

    if (input.operation === "upsert") {
      const result = await query.upsert(input.values as never).select("*");
      data = result.data;
      error = result.error;
    }

    if (input.operation === "update") {
      query = query.update(input.values as never);
      for (const [column, value] of Object.entries(input.match ?? {})) {
        query = query.eq(column, value as never);
      }
      const result = await query.select("*");
      data = result.data;
      error = result.error;
    }

    if (input.operation === "delete") {
      query = query.delete();
      for (const [column, value] of Object.entries(input.match ?? {})) {
        query = query.eq(column, value as never);
      }
      const result = await query.select("*");
      data = result.data;
      error = result.error;
    }

    if (error) throw new Error(error.message);

    await insertOutbox(input, "applied", { data });
    return { source: "supabase", status: "ok", actionId, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to run remote table action";
    saveLocalOutbox(input, "fallback", message);
    try {
      await insertOutbox(input, "failed", { error: message });
    } catch {
      // Ignore failure logging errors so UI actions do not crash.
    }
    return { source: "local-storage", status: "fallback", actionId, error: message };
  }
}
