import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getGamingProducts } from "@/lib/data";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.gaming;

export default async function GamingPage() {
  const products = await getGamingProducts();

  return (
    <PageShell>
      <PageHeader
        title="Gaming gift cards & game credits in Nepal"
        description="Steam, PlayStation, Xbox, Roblox, PUBG UC and more. Buy online with Fonepay or Khalti."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Gaming" },
        ]}
      />
      <CatalogView products={products} />
    </PageShell>
  );
}
