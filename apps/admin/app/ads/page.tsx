import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { AdsAdminFlow } from "../../components/functional/AdminFlows";

export default function AdsPage() {
  return <AdminShell><PageHeader title="Ads management" description="Suspend, restore, and flag suspicious ads." /><AdsAdminFlow /></AdminShell>;
}
