export interface CartItemSnapshot {
  imageUrl?: string;
  name?: string;
  gradient?: string;
  price?: number;
}

export interface CartItem {
  productId: string;
  denomination: number;
  quantity: number;
  imageUrl?: string;
  name?: string;
  gradient?: string;
  price?: number;
}

const CART_KEY = "digitoolera-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function addToCart(
  productId: string,
  denomination: number,
  quantity = 1,
  snapshot?: CartItemSnapshot
): void {
  const cart = getCart();
  const existing = cart.find(
    (i) => i.productId === productId && i.denomination === denomination
  );
  if (existing) {
    existing.quantity += quantity;
    if (snapshot?.imageUrl) existing.imageUrl = snapshot.imageUrl;
    if (snapshot?.name) existing.name = snapshot.name;
    if (snapshot?.gradient) existing.gradient = snapshot.gradient;
    if (snapshot?.price != null) existing.price = snapshot.price;
  } else {
    cart.push({
      productId,
      denomination,
      quantity,
      imageUrl: snapshot?.imageUrl,
      name: snapshot?.name,
      gradient: snapshot?.gradient,
      price: snapshot?.price,
    });
  }
  saveCart(cart);
}

export function updateCartQuantity(
  productId: string,
  denomination: number,
  quantity: number
): void {
  let cart = getCart();
  if (quantity <= 0) {
    cart = cart.filter(
      (i) => !(i.productId === productId && i.denomination === denomination)
    );
  } else {
    const item = cart.find(
      (i) => i.productId === productId && i.denomination === denomination
    );
    if (item) item.quantity = quantity;
  }
  saveCart(cart);
}

export function removeFromCart(productId: string, denomination: number): void {
  saveCart(
    getCart().filter(
      (i) => !(i.productId === productId && i.denomination === denomination)
    )
  );
}

export function clearCart(): void {
  saveCart([]);
}

/** Replace cart with a single item and go to checkout (direct buy). */
export function buyNow(
  productId: string,
  denomination: number,
  quantity = 1,
  snapshot?: CartItemSnapshot
): void {
  saveCart([
    {
      productId,
      denomination,
      quantity,
      imageUrl: snapshot?.imageUrl,
      name: snapshot?.name,
      gradient: snapshot?.gradient,
      price: snapshot?.price,
    },
  ]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}
