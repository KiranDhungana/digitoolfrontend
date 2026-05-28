import { API_URL } from "@/lib/api/config";
import { mapBrand, mapBrands, mapCategories, mapCategory } from "@/lib/map-catalog";
import { mapProduct, mapProducts } from "@/lib/map-product";
import type { Brand, Category, Product } from "@/lib/types";

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function fetchProducts(params?: {
  category?: string;
  brand?: string;
  badge?: string;
  q?: string;
  promo?: boolean;
  official?: boolean;
  limit?: number;
}): Promise<Product[] | null> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.brand) search.set("brand", params.brand);
  if (params?.badge) search.set("badge", params.badge);
  if (params?.q) search.set("q", params.q);
  if (params?.promo) search.set("promo", "true");
  if (params?.official) search.set("official", "true");
  if (params?.limit != null && params.limit > 0) {
    search.set("limit", String(params.limit));
  }
  if (!search.has("limit")) {
    search.set("limit", "48");
  }
  const qs = search.toString();
  const data = await fetchApi<Product[]>(`/api/products?${qs}`);
  return data ? mapProducts(data) : null;
}

/** Single request for multiple cart/checkout products */
export async function fetchProductsBySlugsClient(
  slugs: string[]
): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const unique = [...new Set(slugs)].slice(0, 24);
  try {
    const res = await fetch(
      `${API_URL}/api/products/batch?slugs=${encodeURIComponent(unique.join(","))}`
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Product[];
    return mapProducts(data);
  } catch {
    return [];
  }
}

export async function fetchProduct(slug: string): Promise<Product | null> {
  const data = await fetchApi<Product>(`/api/products/${slug}`);
  return data ? mapProduct(data) : null;
}

/** Client-side fetch (cart, etc.) */
export async function fetchProductClient(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/api/products/${slug}`);
    if (!res.ok) return null;
    const data = (await res.json()) as Product;
    return mapProduct(data);
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<Category[] | null> {
  const data = await fetchApi<Category[]>("/api/categories");
  return data ? mapCategories(data) : null;
}

export async function fetchCategory(slug: string): Promise<{
  category: Category;
  products: Product[];
} | null> {
  const data = await fetchApi<{ category: Category; products: Product[] }>(
    `/api/categories/${slug}`
  );
  if (!data) return null;
  return {
    category: mapCategory(data.category),
    products: mapProducts(data.products),
  };
}

export async function fetchBrands(): Promise<Brand[] | null> {
  const data = await fetchApi<Brand[]>("/api/brands");
  return data ? mapBrands(data) : null;
}

export async function fetchBrand(slug: string): Promise<{
  brand: Brand;
  products: Product[];
} | null> {
  const data = await fetchApi<{ brand: Brand; products: Product[] }>(
    `/api/brands/${slug}`
  );
  if (!data) return null;
  return {
    brand: mapBrand(data.brand),
    products: mapProducts(data.products),
  };
}
