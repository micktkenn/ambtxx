import { AppShell } from "../../../components/layout/AppShell";
import { PageHeader } from "../../../components/PageHeader";
import { MarketFlow } from "../../../components/functional/UserFlows";

export default function AdDetailPage({ params }: { params: { adId: string } }) {
  return <AppShell><PageHeader title={`Offer ${params.adId}`} description="Functional offer detail: create order, apply filters, and inspect payment options." /><MarketFlow selectedAdId={params.adId} /></AppShell>;
}
