"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { Button } from "@/components/ui/Button";
import { adminGetBlog } from "@/lib/api/blogs";
import type { BlogPost } from "@/lib/types/blog";

export default function AdminBlogPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    adminGetBlog(id)
      .then(setPost)
      .catch((e) => setError(e.message));
  }, [id]);

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!post?.content) {
    return <p className="text-gray-500">Loading preview...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
            Preview — {post.status}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/blogs/${post.id}`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Link href="/admin/blogs">
            <Button variant="ghost">Back to list</Button>
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-10">
        {post.featuredImageUrl && (
          <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        {post.excerpt && (
          <p className="text-lg text-gray-600">{post.excerpt}</p>
        )}
        <BlogPostBody html={post.content} />
        <BlogFaqSection faq={post.faq} />
      </div>
    </div>
  );
}
