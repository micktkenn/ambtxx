import { AppShell } from "../../../components/layout/AppShell";
import { PageHeader } from "../../../components/PageHeader";
import { DisputesFlow } from "../../../components/functional/UserFlows";

export default function DisputeDetailPage({ params }: { params: { disputeId: string } }) {
  return <AppShell><PageHeader title={`Dispute ${params.disputeId}`} description="Functional dispute details with evidence and escalation actions." /><DisputesFlow disputeId={params.disputeId} /></AppShell>;
}
