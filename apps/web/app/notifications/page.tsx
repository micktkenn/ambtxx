import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { NotificationsFlow } from "../../components/functional/UserFlows";

export default function NotificationsPage() {
  return <AppShell><PageHeader title="Notifications" description="Mark notifications read/unread and create test alerts." /><NotificationsFlow /></AppShell>;
}
