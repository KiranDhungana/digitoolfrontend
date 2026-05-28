"use client";

import { useState } from "react";
import type { Product } from "@/lib/types";

type SortOption = "popular" | "price-asc" | "price-desc" | "name";

interface CatalogFiltersProps {
  products: Product[];
  onFilteredChange: (filtered: Product[]) => void;
}

export function CatalogFilters({
  products,
  onFilteredChange,
}: CatalogFiltersProps) {
  const [sort, setSort] = useState<SortOption>("popular");

  const handleSort = (value: SortOption) => {
    setSort(value);
    const sorted = [...products];
    switch (value) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    onFilteredChange(sorted);
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">
      <p className="text-sm text-gray-600">
        <span className="font-semibold text-gray-900">{products.length}</span>{" "}
        results
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="sort" className="text-sm font-medium text-gray-700">
          Sort by
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortOption)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
        >
          <option value="popular">Most popular</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
  );
}
