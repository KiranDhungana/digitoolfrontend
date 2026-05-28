import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/CheckoutView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <PageShell>
      <PageHeader
        title="Checkout"
        description="Sign in with your email and password to complete your purchase."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Cart", href: ROUTES.cart },
          { label: "Checkout" },
        ]}
      />
      <CheckoutView />
    </PageShell>
  );
}
