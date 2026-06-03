"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  adminCreateBlogCategory,
  adminListBlogCategories,
} from "@/lib/api/blogs";
import type { BlogCategory } from "@/lib/types/blog";

export default function AdminBlogCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminListBlogCategories().then(setCategories).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await adminCreateBlogCategory({ name: name.trim() });
      setName("");
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Blog categories</h1>
      <p className="mt-1 text-gray-600">Organize posts by topic.</p>

      <form onSubmit={handleCreate} className="mt-6 flex max-w-md gap-3">
        <Input label="New category name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex items-end">
          <Button type="submit" variant="secondary">
            Add
          </Button>
        </div>
      </form>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <ul className="mt-8 space-y-2">
        {categories.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3"
          >
            <span className="font-medium text-gray-900">{c.name}</span>
            <span className="text-sm text-gray-500">
              {c.slug} · {c.postCount ?? 0} posts
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
