import { AdminShell } from "../../components/layout/AdminShell";
import { PageHeader } from "../../components/PageHeader";
import { UsersAdminFlow } from "../../components/functional/AdminFlows";

export default function UsersPage() {
  return <AdminShell><PageHeader title="User management" description="Search, restrict, freeze, require 2FA, and open user details." /><UsersAdminFlow /></AdminShell>;
}
