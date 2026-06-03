"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogForm } from "@/components/admin/BlogForm";
import { adminGetBlog, adminListBlogCategories } from "@/lib/api/blogs";
import type { BlogCategory, BlogPost } from "@/lib/types/blog";

export default function AdminEditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([adminGetBlog(id), adminListBlogCategories()])
      .then(([p, cats]) => {
        setPost(p);
        setCategories(cats);
      })
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!post) {
    return <p className="text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Edit blog post</h1>
      <p className="mt-1 text-gray-600">{post.title}</p>
      <div className="mt-6">
        <BlogForm categories={categories} initial={post} />
      </div>
    </div>
  );
}
