import { AppShell } from "../../../../components/layout/AppShell";
import { PageHeader } from "../../../../components/PageHeader";
import { OrdersFlow } from "../../../../components/functional/UserFlows";

export default function OpenDisputePage({ params }: { params: { orderId: string } }) {
  return <AppShell><PageHeader title={`Open dispute #${params.orderId}`} description="Submit reason, evidence, and create a functional dispute record." /><OrdersFlow orderId={params.orderId} mode="dispute" /></AppShell>;
}
