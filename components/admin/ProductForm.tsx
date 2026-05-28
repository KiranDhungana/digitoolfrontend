"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductImagePicker } from "@/components/admin/ProductImagePicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import {
  adminCreateProduct,
  adminUpdateProduct,
  type AdminFormOption,
  type AdminProduct,
} from "@/lib/api/admin";

interface ProductFormProps {
  brands: AdminFormOption[];
  categories: AdminFormOption[];
  initial?: AdminProduct;
}

export function ProductForm({ brands, categories, initial }: ProductFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.id ?? "",
    description: initial?.description ?? "",
    price: String(initial?.price ?? ""),
    originalPrice: initial?.originalPrice ? String(initial.originalPrice) : "",
    currency: "NPR",
    gradient: initial?.gradient ?? "from-gray-600 to-gray-800",
    badge: initial?.badge ?? "",
    denominations: (initial?.denominations ?? [10, 25, 50]).join(", "),
    brandId: initial?.brandId ?? brands[0]?.id ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    isActive: initial?.isActive ?? true,
    imageUrl: initial?.imageUrl ?? "",
    mediaId: initial?.mediaId ?? "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const denominations = form.denominations
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n));

    const body = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      currency: form.currency,
      gradient: form.gradient,
      badge: form.badge || null,
      denominations,
      brandId: form.brandId,
      categoryId: form.categoryId,
      isActive: form.isActive,
      imageUrl: form.imageUrl || null,
      mediaId: form.mediaId || null,
    };

    try {
      if (initial) {
        await adminUpdateProduct(initial.dbId, body);
      } else {
        await adminCreateProduct(body);
      }
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
      <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      <Input label="Slug (URL id)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="e.g. roblox-25" />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Description
        </label>
        <p className="mb-2 text-xs text-gray-500">
          Select text, then use the toolbar for bold, size, line spacing, colors, fonts, lists, and links.
        </p>
        <RichTextEditor
          key={initial?.dbId ?? "new"}
          value={form.description}
          onChange={(description) => setForm({ ...form, description })}
          required
          minHeight="260px"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Price (NPR)" type="number" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <Input label="Original price NPR (optional)" type="number" step="1" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} />
      </div>
      <Input label="Denominations (comma-separated)" value={form.denominations} onChange={(e) => setForm({ ...form, denominations: e.target.value })} />
      <ProductImagePicker
        imageUrl={form.imageUrl}
        mediaId={form.mediaId}
        onChange={({ imageUrl, mediaId }) =>
          setForm({ ...form, imageUrl, mediaId })
        }
      />
      <Input
        label="Gradient Tailwind classes (fallback when no image)"
        value={form.gradient}
        onChange={(e) => setForm({ ...form, gradient: e.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Brand</label>
          <select
            value={form.brandId}
            onChange={(e) => setForm({ ...form, brandId: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
            required
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Badge</label>
        <select
          value={form.badge}
          onChange={(e) => setForm({ ...form, badge: e.target.value })}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
        >
          <option value="">None</option>
          <option value="official">Official</option>
          <option value="promo">Promo</option>
          <option value="bestseller">Bestseller</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
        Active on storefront
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Saving..." : "Save product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
