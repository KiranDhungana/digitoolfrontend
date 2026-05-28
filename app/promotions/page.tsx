import type { Metadata } from "next";
import { Gift } from "lucide-react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getPromoProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Promotions",
};

export default async function PromotionsPage() {
  const products = await getPromoProducts();

  return (
    <PageShell>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600">
        <Gift className="h-4 w-4" />
        Limited-time deals
      </div>
      <PageHeader
        title="Promotions"
        description="Save on selected gift cards."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Promotions" },
        ]}
      />
      <CatalogView products={products} />
    </PageShell>
  );
}
