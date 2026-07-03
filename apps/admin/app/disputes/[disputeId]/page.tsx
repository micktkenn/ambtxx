import { AdminShell } from "../../../components/layout/AdminShell";
import { PageHeader } from "../../../components/PageHeader";
import { DisputesAdminFlow } from "../../../components/functional/AdminFlows";

export default function DisputeDetailPage({ params }: { params: { disputeId: string } }) {
  return <AdminShell><PageHeader title={`Dispute ${params.disputeId}`} description="Functional dispute decision panel with moderator note and audit logs." /><DisputesAdminFlow disputeId={params.disputeId} /></AdminShell>;
}
