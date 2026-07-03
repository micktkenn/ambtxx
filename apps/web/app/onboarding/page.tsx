import { AppShell } from "../../components/layout/AppShell";
import { PageHeader } from "../../components/PageHeader";
import { OnboardingFlow } from "../../components/functional/UserFlows";

export default function OnboardingPage() {
  return <AppShell><PageHeader title="Onboarding" description="Complete progressive account setup with wallet, 2FA, KYC, payment methods, and Telegram." /><OnboardingFlow /></AppShell>;
}
