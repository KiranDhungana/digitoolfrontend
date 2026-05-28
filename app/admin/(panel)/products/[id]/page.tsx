"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  adminGetProductForEdit,
  type AdminFormOption,
  type AdminProduct,
} from "@/lib/api/admin";

const ProductForm = dynamic(
  () =>
    import("@/components/admin/ProductForm").then((m) => ({
      default: m.ProductForm,
    })),
  {
    loading: () => (
      <p className="text-gray-500">Loading editor...</p>
    ),
    ssr: false,
  }
);

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [brands, setBrands] = useState<AdminFormOption[]>([]);
  const [categories, setCategories] = useState<AdminFormOption[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    adminGetProductForEdit(id)
      .then(({ product: p, brands: b, categories: c }) => {
        setProduct(p);
        setBrands(b);
        setCategories(c);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load product")
      );
  }, [id]);

  if (error) {
    return (
      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
        {error}
      </p>
    );
  }

  if (!product) {
    return <p className="text-gray-600">Loading product...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit product</h1>
      <ProductForm brands={brands} categories={categories} initial={product} />
    </div>
  );
}
