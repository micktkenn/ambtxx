import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { SupportFlow } from "../../components/functional/UserFlows";

export default function SupportPage() {
  return <AppShell><PageHeader title="Support" description="Create mock support tickets and track their status." /><SupportFlow /></AppShell>;
}
