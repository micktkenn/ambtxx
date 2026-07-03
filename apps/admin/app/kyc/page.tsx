import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { KycAdminFlow } from "../../components/functional/AdminFlows";

export default function KycPage() {
  return <AdminShell><PageHeader title="KYC management" description="Review, approve, reject, and request more information." /><KycAdminFlow /></AdminShell>;
}
