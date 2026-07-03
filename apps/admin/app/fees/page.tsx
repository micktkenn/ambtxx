import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { FeesAdminFlow } from "../../components/functional/AdminFlows";

export default function FeesPage() {
  return <AdminShell><PageHeader title="Fee management" description="Edit fee rules, toggle rule status, and audit changes." /><FeesAdminFlow /></AdminShell>;
}
