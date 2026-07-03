import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { DashboardFlow } from "../../components/functional/UserFlows";

export default function DashboardPage() {
  return <AppShell><PageHeader title="Dashboard" description="Functional mock dashboard with wallet, orders, notifications, and pending actions." /><DashboardFlow /></AppShell>;
}
