import type { Metadata } from "next";
import { BrandGrid } from "@/components/catalog/BrandGrid";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getBrands } from "@/lib/data";

export const metadata: Metadata = {
  title: "Brands",
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <PageShell>
      <PageHeader
        title="Brands"
        description="Shop from your favorite brands."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Brands" },
        ]}
      />
      <BrandGrid brands={brands} />
    </PageShell>
  );
}
