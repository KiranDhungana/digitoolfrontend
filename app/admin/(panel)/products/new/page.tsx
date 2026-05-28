"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  adminGetProductFormOptions,
  type AdminFormOption,
} from "@/lib/api/admin";

const ProductForm = dynamic(
  () =>
    import("@/components/admin/ProductForm").then((m) => ({
      default: m.ProductForm,
    })),
  {
    loading: () => (
      <p className="text-gray-500">Loading form...</p>
    ),
    ssr: false,
  }
);

export default function NewProductPage() {
  const [brands, setBrands] = useState<AdminFormOption[]>([]);
  const [categories, setCategories] = useState<AdminFormOption[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetProductFormOptions()
      .then(({ brands: b, categories: c }) => {
        setBrands(b);
        setCategories(c);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load options")
      );
  }, []);

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!brands.length || !categories.length) {
    return (
      <p className="text-gray-600">
        {brands.length === 0 && categories.length === 0
          ? "Loading..."
          : "Create at least one brand and category before adding products."}
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">New product</h1>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
