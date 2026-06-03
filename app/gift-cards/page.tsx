import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getProducts } from "@/lib/data";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.giftCards;

export default async function GiftCardsPage() {
  const products = await getProducts();

  return (
    <PageShell>
      <PageHeader
        title="Buy gift cards online in Nepal"
        description="Browse digital gift cards for gaming, apps and software. Prices in NPR — pay with Fonepay or Khalti."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "All gift cards" },
        ]}
      />
      <CatalogView products={products} />
    </PageShell>
  );
}
