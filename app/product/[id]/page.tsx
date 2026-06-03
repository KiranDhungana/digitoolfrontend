import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ProductDetail } from "@/components/product/ProductDetail";
import { JsonLd } from "@/components/seo/JsonLd";
import { ROUTES } from "@/lib/constants";
import { getProduct } from "@/lib/data";
import { buildProductMetadata, productJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) return { title: "Product" };
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <PageShell>
      <JsonLd data={productJsonLd(product)} />
      <PageHeader
        title={`Buy ${product.name} in Nepal`}
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
