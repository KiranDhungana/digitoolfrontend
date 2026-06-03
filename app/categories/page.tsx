import type { Metadata } from "next";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getCategories } from "@/lib/data";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.categories;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <PageShell>
      <PageHeader
        title="Gift card categories in Nepal"
        description="Gaming gift cards, game credits, software and app store codes — browse by category."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Categories" },
        ]}
      />
      <CategoryGrid categories={categories} />
    </PageShell>
  );
}
