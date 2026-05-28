import Link from "next/link";
import { ProductImage } from "@/components/catalog/ProductImage";
import { ProductInquiryButton } from "@/components/product/ProductInquiryButton";
import type { Product } from "@/lib/types";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";
import { BuyNowButton } from "@/components/product/BuyNowButton";

const badgeLabels: Record<NonNullable<Product["badge"]>, string> = {
  official: "Official",
  promo: "Sale",
  bestseller: "Best seller",
};

const badgeStyles: Record<NonNullable<Product["badge"]>, string> = {
  official: "bg-orange-100 text-orange-700",
  promo: "bg-pink-100 text-pink-700",
  bestseller: "bg-amber-100 text-amber-800",
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount =
    product.originalPrice &&
    Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <article className="group flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition hover:border-orange-200 hover:shadow-md">
      <Link href={ROUTES.product(product.id)} className="relative block w-full shrink-0">
        <div className="absolute right-2 top-2 z-10">
          <ProductInquiryButton product={product} />
        </div>
        <ProductImage
          product={product}
          className="aspect-[4/3] w-full"
          badge={
            product.badge ? (
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeStyles[product.badge]}`}
              >
                {badgeLabels[product.badge]}
              </span>
            ) : undefined
          }
        />
      </Link>
      <div className="flex min-h-0 flex-1 flex-col p-4">
        <p className="line-clamp-1 text-xs font-medium uppercase tracking-wide text-gray-500">
          {product.brand}
        </p>
        <Link href={ROUTES.product(product.id)} className="mt-1 block">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-gray-900 transition group-hover:text-orange-600">
            {product.name}
          </h3>
        </Link>
        <div className="mt-3 flex min-h-[1.75rem] flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-lg font-bold leading-none text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice ? (
            <>
              <span className="text-sm leading-none text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              {discount ? (
                <span className="text-xs font-semibold leading-none text-pink-600">
                  -{discount}%
                </span>
              ) : null}
            </>
          ) : null}
        </div>
        <div className="mt-auto pt-4">
          <BuyNowButton product={product} className="w-full py-2 text-sm" />
        </div>
      </div>
    </article>
  );
}
