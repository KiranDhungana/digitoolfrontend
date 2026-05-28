"use client";

import { Check, Info, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "@/components/catalog/ProductImage";
import { ProductInquiryButton } from "@/components/product/ProductInquiryButton";
import { ProductDescription } from "@/components/product/ProductDescription";
import type { Product } from "@/lib/types";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";
import { addToCart } from "@/lib/cart";
import { BuyNowButton } from "@/components/product/BuyNowButton";
import { Button } from "@/components/ui/Button";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product.id, product.price, 1, {
      imageUrl: product.imageUrl,
      name: product.name,
      gradient: product.gradient,
      price: product.price,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="relative min-h-[320px] overflow-hidden rounded-3xl">
        <ProductImage
          product={product}
          className="relative min-h-[320px]"
          imageClassName="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div
          className={`absolute inset-0 flex flex-col justify-end p-8 ${
            product.imageUrl
              ? "bg-gradient-to-t from-black/70 via-black/20 to-transparent"
              : ""
          }`}
        >
          <p
            className={`text-sm font-medium uppercase tracking-wide ${
              product.imageUrl ? "text-white/80" : "text-white/80"
            }`}
          >
            {product.brand}
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
            {product.name}
          </h1>
        </div>
      </div>

      <div>
        {product.description?.trim() ? (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Description
            </h2>
            <div className="mt-2">
              <ProductDescription description={product.description} />
            </div>
          </section>
        ) : null}

        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <div
          className="mt-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950"
          role="note"
        >
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
          <p>
            <span className="font-semibold">Before you purchase:</span>{" "}
            {product.description?.trim()
              ? "Please read the product description above carefully. By continuing, you confirm you understand what is included with this product."
              : "Please review all product details carefully before completing your purchase."}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button
            variant="secondary"
            className="flex-1 py-3 sm:min-w-[140px]"
            onClick={handleAddToCart}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" />
                Added to cart
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </>
            )}
          </Button>
          <BuyNowButton
            product={product}
            variant="primary"
            className="w-full flex-1 py-3 sm:min-w-[140px]"
            showIcon={false}
          />
          <ProductInquiryButton
            product={product}
            variant="button"
            className="w-full sm:w-auto sm:flex-1"
          />
        </div>

        {added && (
          <p className="mt-3 text-sm text-gray-600">
            <Link href={ROUTES.cart} className="font-medium text-orange-600 hover:underline">
              View cart
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
