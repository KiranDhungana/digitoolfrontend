"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import {
  adminDeleteProduct,
  adminListProducts,
  type AdminProduct,
} from "@/lib/api/admin";
import { formatPrice } from "@/lib/currency";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminListProducts().then(setProducts).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (row: AdminProduct) => {
    if (!confirm(`Delete "${row.name}"?`)) return;
    try {
      await adminDeleteProduct(row.dbId);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage gift cards on the storefront.</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        </Link>
      </div>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-6">
        <DataTable
          data={products}
          keyFn={(r) => r.dbId}
          columns={[
            {
              key: "image",
              header: "Image",
              render: (r) =>
                r.imageUrl ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={r.imageUrl}
                      alt={r.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div
                    className={`h-10 w-10 rounded-lg bg-gradient-to-br ${r.gradient}`}
                  />
                ),
            },
            { key: "name", header: "Name", render: (r) => r.name },
            { key: "brand", header: "Brand", render: (r) => r.brand },
            { key: "category", header: "Category", render: (r) => r.category },
            {
              key: "price",
              header: "Price",
              render: (r) => formatPrice(r.price),
            },
            {
              key: "badge",
              header: "Badge",
              render: (r) => r.badge ?? "—",
            },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <span className={r.isActive ? "text-green-600" : "text-gray-400"}>
                  {r.isActive ? "Active" : "Hidden"}
                </span>
              ),
            },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${r.dbId}`}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(r)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
