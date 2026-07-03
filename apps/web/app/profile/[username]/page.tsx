import { AppShell } from "../../../components/layout/AppShell";
import { PageHeader } from "../../../components/PageHeader";
import { ProfileFlow } from "../../../components/functional/UserFlows";

export default function ProfilePage({ params }: { params: { username: string } }) {
  return <AppShell><PageHeader title={`Profile ${params.username}`} description="Public reputation, active ads, trade history, block, and report actions." /><ProfileFlow username={params.username} /></AppShell>;
}
