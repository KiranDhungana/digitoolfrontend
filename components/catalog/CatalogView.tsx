"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/types";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { ProductGrid } from "@/components/catalog/ProductGrid";

interface CatalogViewProps {
  products: Product[];
  emptyMessage?: string;
}

export function CatalogView({ products, emptyMessage }: CatalogViewProps) {
  const [filtered, setFiltered] = useState(products);

  useEffect(() => {
    setFiltered(products);
  }, [products]);

  return (
    <>
      <CatalogFilters products={products} onFilteredChange={setFiltered} />
      <ProductGrid products={filtered} emptyMessage={emptyMessage} />
    </>
  );
}
