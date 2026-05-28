import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogEntityBanner } from "@/components/catalog/CatalogEntityBanner";
import { CatalogView } from "@/components/catalog/CatalogView";
import { Breadcrumbs } from "@/components/catalog/Breadcrumbs";
import { CategoryIcon } from "@/components/home/CategoryIcon";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getCategory } from "@/lib/data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategory(slug);
  return { title: data?.category.name ?? "Category" };
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
        subtitle={`Browse ${data.category.productCount}+ items in ${data.category.name.toLowerCase()}.`}
      />
      <CatalogView
        products={data.products}
        emptyMessage={`No items in ${data.category.name} yet.`}
      />
    </PageShell>
  );
}
