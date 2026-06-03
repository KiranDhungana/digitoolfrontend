import { API_URL } from "@/lib/api/config";
import type { BlogCategory, BlogPost } from "@/lib/types/blog";

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function fetchBlogPosts(params?: {
  category?: string;
  tag?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.tag) search.set("tag", params.tag);
  if (params?.limit) search.set("limit", String(params.limit));
  const qs = search.toString();
  return (await fetchApi<BlogPost[]>(`/api/blogs${qs ? `?${qs}` : ""}`)) ?? [];
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  return fetchApi<BlogPost>(`/api/blogs/${encodeURIComponent(slug)}`);
}

export async function fetchBlogCategories(): Promise<BlogCategory[]> {
  return (await fetchApi<BlogCategory[]>("/api/blogs/categories")) ?? [];
}

export async function fetchBlogSitemapEntries(): Promise<
  { slug: string; lastmod: string }[]
> {
  return (await fetchApi<{ slug: string; lastmod: string }[]>("/api/blogs/sitemap")) ?? [];
}
