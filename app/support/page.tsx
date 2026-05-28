import type { Metadata } from "next";
import { SupportChat } from "@/components/chat/SupportChat";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Support Chat",
};

export default function SupportPage() {
  return (
    <PageShell>
      <PageHeader
        title="Support chat"
        description="Chat with Digitoolera support. Available when you are signed in."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Support" },
        ]}
      />
      <SupportChat />
    </PageShell>
  );
}
