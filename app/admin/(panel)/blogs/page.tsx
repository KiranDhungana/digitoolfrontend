"use client";

import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import {
  adminBlogStats,
  adminDeleteBlog,
  adminListBlogCategories,
  adminListBlogs,
} from "@/lib/api/blogs";
import type { BlogCategory, BlogPost, BlogStats } from "@/lib/types/blog";

export default function AdminBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    adminListBlogs({
      status: statusFilter || undefined,
      categoryId: categoryFilter || undefined,
    })
      .then(setPosts)
      .catch((e) => setError(e.message));
    adminBlogStats().then(setStats).catch(() => {});
  }, [statusFilter, categoryFilter]);

  useEffect(() => {
    adminListBlogCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (row: BlogPost) => {
    if (!confirm(`Delete "${row.title}"?`)) return;
    try {
      await adminDeleteBlog(row.id);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">SEO posts for digitoolera.com</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button variant="secondary">
            <Plus className="h-4 w-4" />
            New post
          </Button>
        </Link>
      </div>

      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Drafts", value: stats.drafts },
            { label: "Published", value: stats.published },
            { label: "Scheduled", value: stats.scheduled },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="h-4 w-4 text-orange-500" />
                {s.label}
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{s.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <select
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
        <select
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-6">
        <DataTable
          data={posts}
          keyFn={(r) => r.id}
          columns={[
            { key: "title", header: "Title", render: (r) => r.title },
            { key: "slug", header: "Slug", render: (r) => r.slug },
            {
              key: "status",
              header: "Status",
              render: (r) => (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                    r.status === "published"
                      ? "bg-green-100 text-green-800"
                      : r.status === "scheduled"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {r.status}
                  {r.status === "draft" && (
                    <span className="sr-only"> — hidden from public blog</span>
                  )}
                </span>
              ),
            },
            {
              key: "category",
              header: "Category",
              render: (r) => r.category?.name ?? "—",
            },
            {
              key: "updated",
              header: "Updated",
              render: (r) => new Date(r.updatedAt).toLocaleDateString(),
            },
            {
              key: "actions",
              header: "",
              render: (r) => (
                <div className="flex gap-2">
                  <Link href={`/admin/blogs/${r.id}`} className="text-orange-600 hover:text-orange-700">
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/blogs/preview/${r.id}`}
                    className="text-gray-500 hover:text-gray-700 text-xs font-medium"
                  >
                    Preview
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(r)}
                    className="text-red-500 hover:text-red-700"
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
