"use client";

import { useEffect, useState } from "react";
import { BlogForm } from "@/components/admin/BlogForm";
import { adminListBlogCategories } from "@/lib/api/blogs";
import type { BlogCategory } from "@/lib/types/blog";

export default function AdminNewBlogPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  useEffect(() => {
    adminListBlogCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">New blog post</h1>
      <p className="mt-1 text-gray-600">Create an SEO-friendly article.</p>
      <div className="mt-6">
        <BlogForm categories={categories} />
      </div>
    </div>
  );
}
