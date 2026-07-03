import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { DatabaseStatus } from "../../components/DatabaseStatus";

export default function AdminDatabasePage() {
  return (
    <AdminShell>
      <PageHeader title="Database" description="Supabase status and setup for real persisted admin prototype data." />
      <DatabaseStatus />
    </AdminShell>
  );
}
