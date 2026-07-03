import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { AdminDashboardFlow } from "../../components/functional/AdminFlows";

export default function AdminDashboardPage() {
  return <AdminShell><PageHeader title="Operations dashboard" description="Functional admin dashboard with queues, health actions, and audit-producing mock buttons." /><AdminDashboardFlow /></AdminShell>;
}
