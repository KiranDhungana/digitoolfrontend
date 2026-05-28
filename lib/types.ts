export type ProductBadge = "official" | "promo" | "bestseller";

export interface Product {
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  gradient: string;
  imageUrl?: string;
  mediaId?: string;
  badge?: ProductBadge;
  description: string;
  denominations: number[];
}

export interface Brand {
  slug: string;
  name: string;
  gradient: string;
  imageUrl?: string;
  mediaId?: string;
  productCount: number;
}

export interface Category {
  slug: string;
  name: string;
  icon: string;
  gradient: string;
  imageUrl?: string;
  mediaId?: string;
  productCount: number;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
