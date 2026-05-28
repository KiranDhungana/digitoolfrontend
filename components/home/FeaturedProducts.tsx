import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { ROUTES } from "@/lib/constants";
import { getFeaturedProducts } from "@/lib/data";

const FEATURED_LIMIT = 8;

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(FEATURED_LIMIT);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Available products
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            A selection from our catalogue — browse all gift cards for more.
          </p>
        </div>
        <Link
          href={ROUTES.giftCards}
          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
        >
          View all products
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="mt-6">
        <ProductGrid
          products={products}
          emptyMessage="No products available right now."
        />
      </div>
    </section>
  );
}
