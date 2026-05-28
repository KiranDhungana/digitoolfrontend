import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ROUTES } from "@/lib/constants";
import { getProduct } from "@/lib/data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "All gift cards", href: ROUTES.giftCards },
          {
            label: product.category,
            href: ROUTES.category(product.categorySlug),
          },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
    </PageShell>
  );
}
