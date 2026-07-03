import { AppShell } from "../../../components/layout/AppShell";
import { PageHeader } from "../../../components/PageHeader";
import { OrdersFlow } from "../../../components/functional/UserFlows";

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  return <AppShell><PageHeader title={`Trade room #${params.orderId}`} description="Functional escrow room with payment actions, proof upload, chat, timeline, release, and dispute flow." /><OrdersFlow orderId={params.orderId} mode="detail" /></AppShell>;
}
