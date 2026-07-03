import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { OrdersAdminFlow } from "../../components/functional/AdminFlows";

export default function OrdersPage() {
  return <AdminShell><PageHeader title="Orders management" description="Flag, assign, escalate, and inspect P2P order state." /><OrdersAdminFlow /></AdminShell>;
}
