"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Modal } from "@/components/admin/Modal";
import { ProductImagePicker } from "@/components/admin/ProductImagePicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  adminCreateBrand,
  adminDeleteBrand,
  adminListBrands,
  adminUpdateBrand,
  type AdminBrand,
} from "@/lib/api/admin";

const emptyForm = {
  name: "",
  slug: "",
  gradient: "from-gray-600 to-gray-800",
  imageUrl: "",
  mediaId: "",
  sortOrder: "0",
  isActive: true,
};

export default function AdminBrandsPage() {
  const [items, setItems] = useState<AdminBrand[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminListBrands().then(setItems).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (row: AdminBrand) => {
    setEditing(row);
    setForm({
      name: row.name,
      slug: row.slug,
      gradient: row.gradient,
      imageUrl: row.imageUrl ?? "",
      mediaId: row.mediaId ?? "",
      sortOrder: String(row.sortOrder),
      isActive: row.isActive,
    });
    setOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const body = {
        ...form,
        sortOrder: Number(form.sortOrder),
        imageUrl: form.imageUrl || undefined,
        mediaId: form.mediaId || undefined,
      };
      if (editing) {
        await adminUpdateBrand(editing.id, body);
      } else {
        await adminCreateBrand(body);
      }
      setOpen(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleDelete = async (row: AdminBrand) => {
    if (!confirm(`Delete brand "${row.name}"?`)) return;
    try {
      await adminDeleteBrand(row.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
          <p className="text-gray-600">Manage gift card brands.</p>
        </div>
        <Button variant="secondary" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add brand
        </Button>
      </div>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      <div className="mt-6">
        <DataTable
          data={items}
          keyFn={(r) => r.id}
          columns={[
            {
              key: "image",
              header: "",
              render: (r) =>
                r.imageUrl ? (
                  <img
                    src={r.imageUrl}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                ),
            },
            { key: "name", header: "Name", render: (r) => r.name },
            { key: "slug", header: "Slug", render: (r) => r.slug },
            {
              key: "products",
              header: "Products",
              render: (r) => r.productCount,
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
                  <button type="button" onClick={() => openEdit(r)} className="text-orange-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => handleDelete(r)} className="text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
      <Modal
        title={editing ? "Edit brand" : "New brand"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          <Input label="Gradient classes" value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} />
          <ProductImagePicker
            label="Brand image"
            imageUrl={form.imageUrl}
            mediaId={form.mediaId}
            onChange={({ imageUrl, mediaId }) =>
              setForm({ ...form, imageUrl, mediaId })
            }
          />
          <Input label="Sort order" type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
            Active on storefront
          </label>
          <Button type="submit" variant="secondary" className="w-full py-2.5">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
