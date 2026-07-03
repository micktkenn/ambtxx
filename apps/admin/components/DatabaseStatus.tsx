"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient, isSupabaseConfigured } from "@amlbt/supabase";
import { Badge, Button, Card } from "@amlbt/ui";

type Status = { ok: boolean; message: string; rowCount?: number };

export function DatabaseStatus() {
  const [status, setStatus] = useState<Status>({ ok: false, message: "Checking Supabase configuration..." });

  const check = async () => {
    if (!isSupabaseConfigured()) {
      setStatus({ ok: false, message: "Supabase env vars are missing. Admin uses local mock storage." });
      return;
    }

    try {
      const supabase = createSupabaseBrowserClient();
      const { count, error } = await supabase.from("app_state_snapshots").select("id", { count: "exact", head: true });
      if (error) throw error;
      setStatus({ ok: true, message: "Connected to Supabase. Admin actions and audit-like state persist in the database.", rowCount: count ?? 0 });
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
          <p className="text-sm text-amlbt-text-muted">Uses publishable browser access only. Never expose service-role keys in admin frontend.</p>
        </div>
        <Badge tone={status.ok ? "success" : "warning"}>{status.ok ? "connected" : "local mode"}</Badge>
      </div>
      <div className="rounded-2xl border border-amlbt-border-soft bg-amlbt-muted p-4 text-sm">
        {status.message}
        {typeof status.rowCount === "number" ? <div className="mt-1 text-amlbt-text-muted">Snapshot rows found: {status.rowCount}</div> : null}
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-2xl border border-amlbt-border p-4">
          <h3 className="font-semibold">Admin database setup</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-amlbt-text-muted">
            <li>Run the Supabase SQL files.</li>
            <li>Add env vars in Vercel admin project.</li>
            <li>Restart the admin app.</li>
            <li>Use admin actions and confirm snapshots update.</li>
          </ol>
        </div>
        <div className="rounded-2xl border border-amlbt-border p-4">
          <h3 className="font-semibold">Production direction</h3>
          <p className="mt-2 text-sm text-amlbt-text-muted">Keep admin permissions and sensitive writes behind the backend API before production. Supabase browser writes are for prototype mode only.</p>
        </div>
      </div>
      <Button variant="secondary" onClick={check}>Recheck connection</Button>
    </Card>
  );
}
