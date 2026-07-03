import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { DisputesAdminFlow } from "../../components/functional/AdminFlows";

export default function DisputesPage() {
  return <AdminShell><PageHeader title="Dispute management" description="Resolve, refund, release, request evidence, or escalate disputes." /><DisputesAdminFlow /></AdminShell>;
}
