import { fetchProductsBySlugsClient } from "@/lib/api/public";
import type { CartItem } from "@/lib/cart";
import type { Product } from "@/lib/types";

export function cartLineHasSnapshot(item: CartItem): boolean {
  return Boolean(
    item.name && item.price != null && (item.imageUrl || item.gradient)
  );
}

function productFromSnapshot(item: CartItem): Product {
  return {
    id: item.productId,
    name: item.name!,
    brand: "",
    brandSlug: "",
    category: "",
    categorySlug: "",
    price: item.price!,
    currency: "NPR",
    gradient: item.gradient ?? "from-gray-600 to-gray-800",
    description: "",
    denominations: [],
    imageUrl: item.imageUrl,
  };
}

/** One batch request for cart/checkout; uses local snapshots when complete. */
export async function loadCartProducts(
  cartItems: CartItem[]
): Promise<Record<string, Product>> {
  const ids = [...new Set(cartItems.map((i) => i.productId))];
  if (ids.length === 0) return {};

  const result: Record<string, Product> = {};
  const needFetch: string[] = [];

  for (const id of ids) {
    const item = cartItems.find((i) => i.productId === id);
    if (item && cartLineHasSnapshot(item)) {
      result[id] = productFromSnapshot(item);
    } else {
      needFetch.push(id);
    }
  }

  if (needFetch.length > 0) {
    const fetched = await fetchProductsBySlugsClient(needFetch);
    for (const p of fetched) {
      result[p.id] = p;
    }
  }

  return result;
}
