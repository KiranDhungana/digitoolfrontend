import type { Metadata } from "next";
import { PageHeader } from "@/components/catalog/PageHeader";
import { CartView } from "@/components/cart/CartView";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <PageShell>
      <PageHeader
        title="Shopping cart"
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Cart" },
        ]}
      />
      <CartView />
    </PageShell>
  );
}
