import type { Metadata } from "next";
import { Store } from "lucide-react";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getOfficialProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Official Store",
};

export default async function OfficialStorePage() {
  const products = await getOfficialProducts();

  return (
    <PageShell>
      <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
        <Store className="h-4 w-4" />
        Verified official cards
      </div>
      <PageHeader
        title="Official Store"
        description="Gift cards from official partners."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Official Store" },
        ]}
      />
      <CatalogView products={products} />
    </PageShell>
  );
}
