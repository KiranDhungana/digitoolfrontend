import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "All Gift Cards",
};

export default async function GiftCardsPage() {
  const products = await getProducts();

  return (
    <PageShell>
      <PageHeader
        title="All gift cards"
        description="Browse our full catalogue of digital gift cards. Pay securely online."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "All gift cards" },
        ]}
      />
      <CatalogView products={products} />
    </PageShell>
  );
}
