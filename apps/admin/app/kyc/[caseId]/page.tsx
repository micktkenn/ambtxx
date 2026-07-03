import { AdminShell } from "../../../components/layout/AdminShell";
import { PageHeader } from "../../../components/PageHeader";
import { KycAdminFlow } from "../../../components/functional/AdminFlows";

export default function KycCasePage({ params }: { params: { caseId: string } }) {
  return <AdminShell><PageHeader title={`KYC ${params.caseId}`} description="Functional KYC decision page with provider notes and audit log." /><KycAdminFlow caseId={params.caseId} /></AdminShell>;
}
