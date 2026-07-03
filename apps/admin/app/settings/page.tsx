import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { ConfigAdminFlow } from "../../components/functional/AdminFlows";

export default function AdminConfigPage() {
  return <AdminShell><PageHeader title="System settings" description="Functional admin controls with local mock state and audit logging." /><ConfigAdminFlow kind="system" /></AdminShell>;
}
