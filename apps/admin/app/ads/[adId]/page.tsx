import { AdminShell } from "../../../components/layout/AdminShell";
import { PageHeader } from "../../../components/PageHeader";
import { AdsAdminFlow } from "../../../components/functional/AdminFlows";

export default function AdDetailPage({ params }: { params: { adId: string } }) {
  return <AdminShell><PageHeader title={`Ad ${params.adId}`} description="Functional ad moderation detail." /><AdsAdminFlow adId={params.adId} /></AdminShell>;
}
