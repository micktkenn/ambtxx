import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { MarketFlow } from "../../components/functional/UserFlows";

export default function MarketPage() {
  return <AppShell><PageHeader title="P2P marketplace" description="Filter offers, inspect traders, and create a mock escrow order from any offer." /><MarketFlow /></AppShell>;
}
