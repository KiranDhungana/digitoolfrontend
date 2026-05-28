import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getGamingProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Gaming Gift Cards",
};

export default async function GamingPage() {
  const products = await getGamingProducts();

  return (
    <PageShell>
      <PageHeader
        title="Gaming"
        description="Steam, PlayStation, Xbox, Roblox, and more."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Gaming" },
        ]}
      />
      <CatalogView products={products} />
    </PageShell>
  );
}
