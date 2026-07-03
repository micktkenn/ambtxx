import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { AdsFlow } from "../../components/functional/UserFlows";

export default function AdsPage() {
  return <AppShell><PageHeader title="My ads" description="Pause, resume, delete, and monitor ads with local mock state." /><AdsFlow /></AppShell>;
}
