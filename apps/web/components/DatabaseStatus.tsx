"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@amlbt/supabase";
import { Badge, Button, Card } from "@amlbt/ui";

type Status = { ok: boolean; message: string; rowCount?: number };

export function DatabaseStatus() {
  const [status, setStatus] = useState<Status>({ ok: false, message: "Checking Supabase configuration..." });

  const check = async () => {
    if (!isSupabaseConfigured()) {
      setStatus({ ok: false, message: "Supabase env vars are missing. The app is using local mock storage." });
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { count, error } = await supabase.from("app_state_snapshots").select("id", { count: "exact", head: true });
      if (error) throw error;
      setStatus({ ok: true, message: "Connected to Supabase. Functional state will persist in the database.", rowCount: count ?? 0 });
    } catch (error) {
      setStatus({ ok: false, message: error instanceof Error ? error.message : "Could not connect to Supabase." });
    }
  };

  useEffect(() => { void check(); }, []);

  return (
    <Card className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black tracking-tight">Supabase database mode</h2>
          <p className="text-sm text-amlbt-text-muted">Uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.</p>
        </div>
        <Badge tone={status.ok ? "success" : "warning"}>{status.ok ? "connected" : "local mode"}</Badge>
      </div>
      <div className="rounded-2xl border border-amlbt-border-soft bg-amlbt-muted p-4 text-sm">
        {status.message}
        {typeof status.rowCount === "number" ? <div className="mt-1 text-amlbt-text-muted">Snapshot rows found: {status.rowCount}</div> : null}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-2xl border border-amlbt-border p-4">
          <h3 className="font-semibold">Required setup</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-amlbt-text-muted">
            <li>Run infra/supabase/001_schema.sql.</li>
            <li>Run infra/supabase/002_seed.sql.</li>
            <li>Add env vars to web and admin apps.</li>
            <li>Restart Next.js dev servers.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-amlbt-border p-4">
          <h3 className="font-semibold">Prototype behavior</h3>
          <p className="mt-2 text-sm text-amlbt-text-muted">All current buttons and flows save a JSON snapshot to Supabase. Normalized tables are also included for the production backend path.</p>
        </div>
      </div>
      <Button variant="secondary" onClick={check}>Recheck connection</Button>
    </Card>
  );
}
