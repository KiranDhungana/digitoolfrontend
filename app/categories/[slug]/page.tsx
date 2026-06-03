import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogEntityBanner } from "@/components/catalog/CatalogEntityBanner";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CategoryIcon } from "@/components/home/CategoryIcon";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getCategory } from "@/lib/data";
import { buildCategoryMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategory(slug);
  if (!data) return { title: "Category" };
  return buildCategoryMetadata(
    data.category.name,
    slug,
    data.category.productCount
  );
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCategory(slug);

  if (!data) notFound();

  const breadcrumbs = [
    { label: "Home", href: ROUTES.home },
    { label: "Categories", href: ROUTES.categories },
    { label: data.category.name },
  ];

  return (
    <PageShell>
      <div className="mb-3">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <CatalogEntityBanner
        name={data.category.name}
        gradient={data.category.gradient}
        imageUrl={data.category.imageUrl}
        fallback={<CategoryIcon name={data.category.icon} className="h-16 w-16 text-white/80" />}
        subtitle={`Buy ${data.category.name.toLowerCase()} gift cards in Nepal — ${data.category.productCount}+ products. Pay with Fonepay or Khalti.`}
      />
      <CatalogView
        products={data.products}
        emptyMessage={`No items in ${data.category.name} yet.`}
      />
    </PageShell>
  );
}
