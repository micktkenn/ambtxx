import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { SettingsFlow } from "../../components/functional/UserFlows";

export default function SettingsPage() {
  return <AppShell><PageHeader title="Settings" description="Functional settings page with editable mock state." /><SettingsFlow section="index" /></AppShell>;
}
