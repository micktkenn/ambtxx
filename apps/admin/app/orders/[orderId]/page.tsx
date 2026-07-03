import { AdminShell } from "../../../components/layout/AdminShell";
import { PageHeader } from "../../../components/PageHeader";
import { OrdersAdminFlow } from "../../../components/functional/AdminFlows";

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  return <AdminShell><PageHeader title={`Order ${params.orderId}`} description="Functional admin order detail with review and escalation controls." /><OrdersAdminFlow orderId={params.orderId} /></AdminShell>;
}
