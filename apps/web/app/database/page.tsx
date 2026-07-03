import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { DatabaseStatus } from "../../components/DatabaseStatus";

export default function DatabasePage() {
  return (
    <AppShell>
      <PageHeader title="Database" description="Connect the functional prototype to Supabase for real persisted data." />
      <DatabaseStatus />
    </AppShell>
  );
}
