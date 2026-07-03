import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { WalletFlow } from "../../components/functional/UserFlows";

export default function WalletPage() {
  return <AppShell><PageHeader title="Wallet" description="Connect, disconnect, copy address, switch network, and inspect balances." /><WalletFlow /></AppShell>;
}
