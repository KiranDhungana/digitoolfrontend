import type { Metadata } from "next";
import { CatalogView } from "@/components/catalog/CatalogView";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { searchProductsQuery } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search",
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const products = await searchProductsQuery(q);

  return (
    <PageShell>
      <PageHeader
        title={q ? `Results for "${q}"` : "Search"}
        description={
          q
            ? `Found ${products.length} gift card${products.length === 1 ? "" : "s"}.`
            : "Use the search bar to find gift cards."
        }
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Search" },
        ]}
      />
      <CatalogView
        products={products}
        emptyMessage={
          q
            ? `No results for "${q}".`
            : "Enter a search term in the header."
        }
      />
    </PageShell>
  );
}
