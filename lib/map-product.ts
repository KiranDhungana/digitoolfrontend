import type { Product, ProductBadge } from "@/lib/types";

type RawProduct = Partial<Product> & {
  image_url?: string | null;
  media_id?: string | null;
  brandImageUrl?: string | null;
  categoryImageUrl?: string | null;
  media?: { url?: string | null } | null;
};

function pickImageUrl(raw: RawProduct): string | undefined {
  const candidates = [
    raw.imageUrl,
    raw.image_url,
    raw.media?.url,
    raw.brandImageUrl,
    raw.categoryImageUrl,
  ];

  for (const value of candidates) {
    if (value && typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) return trimmed;
    }
  }
  return undefined;
}

export function mapProduct(raw: RawProduct): Product {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    brand: String(raw.brand ?? ""),
    brandSlug: String(raw.brandSlug ?? ""),
    category: String(raw.category ?? ""),
    categorySlug: String(raw.categorySlug ?? ""),
    price: Number(raw.price ?? 0),
    originalPrice:
      raw.originalPrice != null ? Number(raw.originalPrice) : undefined,
    currency: String(raw.currency ?? "NPR"),
    gradient: String(raw.gradient ?? "from-gray-600 to-gray-800"),
    imageUrl: pickImageUrl(raw),
    mediaId: raw.mediaId ?? raw.media_id ?? undefined,
    badge: raw.badge as ProductBadge | undefined,
    description: String(raw.description ?? ""),
    denominations: Array.isArray(raw.denominations)
      ? raw.denominations.map(Number)
      : [],
  };
}

export function mapProducts(items: RawProduct[]): Product[] {
  return items.map(mapProduct);
}
