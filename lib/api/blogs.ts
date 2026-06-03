import { API_URL, ADMIN_TOKEN_KEY } from "@/lib/api/config";
import type {
  BlogAiResult,
  BlogCategory,
  BlogPost,
  BlogStats,
  BlogTag,
} from "@/lib/types/blog";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function adminBlogStats(): Promise<BlogStats> {
  return adminFetch("/api/admin/blogs/stats");
}

export async function adminListBlogs(params?: {
  status?: string;
  categoryId?: string;
  tag?: string;
}): Promise<BlogPost[]> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.categoryId) search.set("categoryId", params.categoryId);
  if (params?.tag) search.set("tag", params.tag);
  const qs = search.toString();
  return adminFetch(`/api/admin/blogs${qs ? `?${qs}` : ""}`);
}

export async function adminGetBlog(id: string): Promise<BlogPost> {
  return adminFetch(`/api/admin/blogs/${id}`);
}

export async function adminCreateBlog(
  body: Record<string, unknown>
): Promise<BlogPost> {
  return adminFetch("/api/admin/blogs", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateBlog(
  id: string,
  body: Record<string, unknown>
): Promise<BlogPost> {
  return adminFetch(`/api/admin/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteBlog(id: string): Promise<void> {
  return adminFetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
}

export async function adminListBlogCategories(): Promise<BlogCategory[]> {
  return adminFetch("/api/admin/blog-categories");
}

export async function adminCreateBlogCategory(
  body: Partial<BlogCategory>
): Promise<BlogCategory> {
  return adminFetch("/api/admin/blog-categories", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminListBlogTags(): Promise<BlogTag[]> {
  return adminFetch("/api/admin/blog-tags");
}

export async function adminGenerateBlogAi(prompt: string): Promise<BlogAiResult> {
  return adminFetch("/api/admin/blog-ai/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}
