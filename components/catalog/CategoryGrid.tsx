import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/lib/types";
import { ROUTES } from "@/lib/constants";
import { CatalogImage } from "@/components/catalog/CatalogImage";
import { CategoryIcon } from "@/components/home/CategoryIcon";

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={ROUTES.category(category.slug)}
          className="group flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-orange-200 hover:shadow-md"
        >
          <CatalogImage
            name={category.name}
            gradient={category.gradient}
            imageUrl={category.imageUrl}
            className="h-14 w-14 shrink-0 rounded-2xl"
            sizes="56px"
            fallback={<CategoryIcon name={category.icon} className="h-6 w-6 text-white" />}
          />
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500">
              {category.productCount}+ items
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-gray-400 transition group-hover:text-orange-600" />
        </Link>
      ))}
    </div>
  );
}
