import { AppShell } from "../../../components/layout/AppShell";
import { PageHeader } from "../../../components/PageHeader";
import { AdsFlow } from "../../../components/functional/UserFlows";

export default function CreateAdPage() {
  return <AppShell><PageHeader title="Create ad" description="Functional ad wizard with preview, draft save, and publish action." /><AdsFlow mode="create" /></AppShell>;
}
