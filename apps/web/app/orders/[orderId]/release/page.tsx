import { AppShell } from "../../../../components/layout/AppShell";
import { PageHeader } from "../../../../components/PageHeader";
import { OrdersFlow } from "../../../../components/functional/UserFlows";

export default function ReleasePage({ params }: { params: { orderId: string } }) {
  return <AppShell><PageHeader title={`Release crypto #${params.orderId}`} description="Sensitive release mock with irreversible warning, 2FA, and wallet-signature action." /><OrdersFlow orderId={params.orderId} mode="release" /></AppShell>;
}
