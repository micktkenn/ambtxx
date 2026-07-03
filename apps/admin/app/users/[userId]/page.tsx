import { AdminShell } from "../../../components/layout/AdminShell";
import { PageHeader } from "../../../components/PageHeader";
import { UsersAdminFlow } from "../../../components/functional/AdminFlows";

export default function UserDetailPage({ params }: { params: { userId: string } }) {
  return <AdminShell><PageHeader title={`User ${params.userId}`} description="Functional user detail with account controls and audit logging." /><UsersAdminFlow userId={params.userId} /></AdminShell>;
}
