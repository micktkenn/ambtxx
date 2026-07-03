import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { OrdersFlow } from "../../components/functional/UserFlows";

export default function OrdersPage() {
  return <AppShell><PageHeader title="Orders" description="Mark paid, cancel, open trade rooms, and mutate order states." /><OrdersFlow /></AppShell>;
}
