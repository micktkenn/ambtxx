import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { DisputesFlow } from "../../components/functional/UserFlows";

export default function DisputesPage() {
  return <AppShell><PageHeader title="Disputes" description="Track dispute status, upload evidence, start review, and escalate." /><DisputesFlow /></AppShell>;
}
