import type { Brand, Category, Product } from "@/lib/types";

export const PRODUCTS: Product[] = [
  {
    id: "roblox-25",
    name: "Roblox Gift Card",
    brand: "Roblox",
    brandSlug: "roblox",
    category: "Gaming",
    categorySlug: "gaming",
    price: 24.5,
    currency: "NPR",
    gradient: "from-red-500 to-red-800",
    badge: "bestseller",
    description: "Redeem for Robux or premium membership on Roblox.",
    denominations: [10, 25, 50, 100],
  },
  {
    id: "pubg-50",
    name: "PUBG Mobile UC",
    brand: "PUBG",
    brandSlug: "pubg",
    category: "Gaming",
    categorySlug: "gaming",
    price: 48.99,
    originalPrice: 54.99,
    currency: "NPR",
    gradient: "from-amber-600 to-stone-900",
    badge: "promo",
    description: "Unknown Cash for PUBG Mobile purchases.",
    denominations: [25, 50, 100],
  },
  {
    id: "xbox-25",
    name: "Xbox Gift Card",
    brand: "Xbox",
    brandSlug: "xbox",
    category: "Gaming",
    categorySlug: "gaming",
    price: 24.99,
    currency: "NPR",
    gradient: "from-green-600 to-green-900",
    description: "Games and Game Pass on Xbox and Windows.",
    denominations: [15, 25, 50, 100],
  },
  {
    id: "apple-100",
    name: "Apple Gift Card",
    brand: "Apple",
    brandSlug: "apple",
    category: "Software",
    categorySlug: "software",
    price: 98.5,
    currency: "NPR",
    gradient: "from-sky-400 to-indigo-700",
    badge: "official",
    description: "Use on App Store, iTunes, Apple Music, and more.",
    denominations: [25, 50, 100, 200],
  },
  {
    id: "google-play-25",
    name: "Google Play Gift Card",
    brand: "Google Play",
    brandSlug: "google-play",
    category: "Software",
    categorySlug: "software",
    price: 24.5,
    currency: "NPR",
    gradient: "from-emerald-500 to-teal-700",
    description: "Apps, games, movies, and books on Google Play.",
    denominations: [10, 25, 50],
  },
];

export const BRANDS: Brand[] = [
  { slug: "pubg", name: "PUBG", gradient: "from-amber-600 to-stone-900", productCount: 1 },
  { slug: "apple", name: "Apple", gradient: "from-sky-400 to-indigo-700", productCount: 1 },
  { slug: "google-play", name: "Google Play", gradient: "from-emerald-500 to-teal-700", productCount: 1 },
  { slug: "xbox", name: "Xbox", gradient: "from-green-600 to-green-900", productCount: 1 },
  { slug: "roblox", name: "Roblox", gradient: "from-red-500 to-red-800", productCount: 1 },
];

export const CATEGORIES: Category[] = [
  { slug: "gaming", name: "Gaming", icon: "gamepad", gradient: "from-violet-500 to-purple-700", productCount: 3 },
  { slug: "software", name: "Software", icon: "monitor", gradient: "from-sky-500 to-indigo-700", productCount: 2 },
];

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategorySlug(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === slug);
}

export function getProductsByBrandSlug(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.brandSlug === slug);
}

export function getGamingProducts(): Product[] {
  return PRODUCTS.filter((p) => p.categorySlug === "gaming");
}

export function getOfficialProducts(): Product[] {
  return PRODUCTS.filter((p) => p.badge === "official");
}

export function getPromoProducts(): Product[] {
  return PRODUCTS.filter((p) => p.badge === "promo" || p.originalPrice);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export function getBrandBySlug(slug: string): Brand | undefined {
  return BRANDS.find((b) => b.slug === slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllBrands(): Brand[] {
  return BRANDS;
}

export function getAllCategories(): Category[] {
  return CATEGORIES;
}
