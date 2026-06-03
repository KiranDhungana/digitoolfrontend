import type { Metadata } from "next";
import { BrandGrid } from "@/components/catalog/BrandGrid";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getBrands } from "@/lib/data";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.brands;

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <PageShell>
      <PageHeader
        title="Gift card brands in Nepal"
        description="Roblox, PUBG, Steam, PlayStation, Xbox, Apple, Google Play and more — buy online with Fonepay or Khalti."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Brands" },
        ]}
      />
      <BrandGrid brands={brands} />
    </PageShell>
  );
}
