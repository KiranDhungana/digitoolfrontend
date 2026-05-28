import type { Metadata } from "next";
import { AccountView } from "@/components/account/AccountView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "My Account",
};

export default function AccountPage() {
  return (
    <PageShell>
      <PageHeader
        title="My account"
        description="Your orders, spending, and profile settings."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "My account" },
        ]}
      />
      <AccountView />
    </PageShell>
  );
}
