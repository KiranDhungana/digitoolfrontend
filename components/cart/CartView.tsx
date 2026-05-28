"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  getCart,
  removeFromCart,
  updateCartQuantity,
  type CartItem,
} from "@/lib/cart";
import { loadCartProducts } from "@/lib/load-cart-products";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";

export function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [mounted, setMounted] = useState(false);

  const refresh = () => setItems(getCart());

  const loadProducts = useCallback(async (cartItems: CartItem[]) => {
    setProducts(await loadCartProducts(cartItems));
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || items.length === 0) {
      setProducts({});
      return;
    }
    loadProducts(items);
  }, [items, mounted, loadProducts]);

  if (!mounted) {
    return <p className="text-gray-500">Loading cart...</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-16 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href={ROUTES.giftCards} className="mt-4 inline-block">
          <Button variant="secondary" className="mt-4">
            Browse gift cards
          </Button>
        </Link>
      </div>
    );
  }

  let total = 0;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => {
          const product = products[item.productId];
          const name = item.name ?? product?.name;
          const price = item.price ?? product?.price;
          const imageUrl = item.imageUrl ?? product?.imageUrl;
          const gradient =
            item.gradient ?? product?.gradient ?? "from-gray-600 to-gray-800";

          if (!name || price == null) return null;

          const lineTotal = price * item.quantity;
          total += lineTotal;

          return (
            <div
              key={`${item.productId}-${item.denomination}`}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:w-24">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div
                    className={`h-full w-full bg-gradient-to-br ${gradient}`}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={ROUTES.product(item.productId)}
                  className="font-semibold text-gray-900 hover:text-orange-600"
                >
                  {name}
                </Link>
                <p className="mt-1 font-bold text-gray-900">
                  {formatPrice(lineTotal)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-gray-200">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => {
                      updateCartQuantity(
                        item.productId,
                        item.denomination,
                        item.quantity - 1
                      );
                      refresh();
                    }}
                    className="cursor-pointer p-2 text-gray-600 hover:text-orange-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => {
                      updateCartQuantity(
                        item.productId,
                        item.denomination,
                        item.quantity + 1
                      );
                      refresh();
                    }}
                    className="cursor-pointer p-2 text-gray-600 hover:text-orange-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label="Remove item"
                  onClick={() => {
                    removeFromCart(item.productId, item.denomination);
                    refresh();
                  }}
                  className="cursor-pointer p-2 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-fit rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <h2 className="text-lg font-bold text-gray-900">Order summary</h2>
        <div className="mt-4 flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">{formatPrice(total)}</span>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Fees calculated at checkout.
        </p>
        <Link href={ROUTES.checkout} className="mt-6 block">
          <Button variant="secondary" className="w-full py-3">
            Proceed to checkout
          </Button>
        </Link>
      </div>
    </div>
  );
}
