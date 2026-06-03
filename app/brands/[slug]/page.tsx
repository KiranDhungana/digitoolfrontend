import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogEntityBanner } from "@/components/catalog/CatalogEntityBanner";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getBrand } from "@/lib/data";
import { buildBrandMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBrand(slug);
  if (!data) return { title: "Brand" };
  return buildBrandMetadata(data.brand.name, slug, data.brand.productCount);
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getBrand(slug);

  if (!data) notFound();

  const breadcrumbs = [
    { label: "Home", href: ROUTES.home },
    { label: "Brands", href: ROUTES.brands },
    { label: data.brand.name },
  ];

  return (
    <PageShell>
      <div className="mb-3">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CatalogEntityBanner
        name={`${data.brand.name} gift cards`}
        gradient={data.brand.gradient}
        imageUrl={data.brand.imageUrl}
        subtitle={`Buy ${data.brand.name} gift cards in Nepal — ${data.brand.productCount}+ products. Fonepay & Khalti accepted.`}
      />
      <CatalogView
        products={data.products}
        emptyMessage={`No ${data.brand.name} items available.`}
      />
    </PageShell>
  );
}
