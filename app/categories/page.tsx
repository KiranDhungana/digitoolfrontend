import type { Metadata } from "next";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { ROUTES } from "@/lib/constants";
import { getCategories } from "@/lib/data";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <PageShell>
      <PageHeader
        title="Categories"
        description="Browse gaming and software by category."
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Categories" },
        ]}
      />
      <CategoryGrid categories={categories} />
    </PageShell>
  );
}
