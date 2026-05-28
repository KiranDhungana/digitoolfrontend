import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { BrandGrid } from "@/components/catalog/BrandGrid";
import { ROUTES } from "@/lib/constants";
import { getBrands } from "@/lib/data";

export async function PopularBrands() {
  const brands = await getBrands();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Popular brands
        </h2>
        <Link
          href={ROUTES.brands}
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
        >
          View all brands
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6">
        <BrandGrid brands={brands} />
      </div>
    </section>
  );
}
