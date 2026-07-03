import { AdminShell } from "../../../components/layout/AdminShell";
import { PageHeader } from "../../../components/PageHeader";
import { FeesAdminFlow } from "../../../components/functional/AdminFlows";

export default function FeeTransactionsPage() {
  return <AdminShell><PageHeader title="Fee transactions" description="Collected, estimated, refunded, and waived fee records." /><FeesAdminFlow transactions /></AdminShell>;
}
