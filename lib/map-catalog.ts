import type { Brand, Category } from "@/lib/types";

type RawImageFields = {
  imageUrl?: string | null;
  image_url?: string | null;
  mediaId?: string | null;
  media_id?: string | null;
};

function pickImageUrl(raw: RawImageFields): string | undefined {
  const url = raw.imageUrl ?? raw.image_url;
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  return trimmed || undefined;
}

type RawCategory = Partial<Category> &
  RawImageFields & {
    slug?: string;
    name?: string;
    icon?: string;
    gradient?: string;
    productCount?: number;
    product_count?: number;
  };

type RawBrand = Partial<Brand> &
  RawImageFields & {
    slug?: string;
    name?: string;
    gradient?: string;
    productCount?: number;
    product_count?: number;
  };

export function mapCategory(raw: RawCategory): Category {
  return {
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    icon: String(raw.icon ?? "shopping-bag"),
    gradient: String(raw.gradient ?? "from-gray-500 to-gray-700"),
    imageUrl: pickImageUrl(raw),
    mediaId: raw.mediaId ?? raw.media_id ?? undefined,
    productCount: Number(raw.productCount ?? raw.product_count ?? 0),
  };
}

export function mapCategories(items: RawCategory[]): Category[] {
  return items.map(mapCategory);
}

export function mapBrand(raw: RawBrand): Brand {
  return {
    slug: String(raw.slug ?? ""),
    name: String(raw.name ?? ""),
    gradient: String(raw.gradient ?? "from-gray-500 to-gray-700"),
    imageUrl: pickImageUrl(raw),
    mediaId: raw.mediaId ?? raw.media_id ?? undefined,
    productCount: Number(raw.productCount ?? raw.product_count ?? 0),
  };
}

export function mapBrands(items: RawBrand[]): Brand[] {
  return items.map(mapBrand);
}
