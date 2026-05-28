"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/types";

interface ProductImageProps {
  product: Pick<Product, "name" | "gradient" | "imageUrl">;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  badge?: React.ReactNode;
}

export function ProductImage({
  product,
  className = "",
  imageClassName = "object-cover",
  sizes = "(max-width: 768px) 50vw, 25vw",
  badge,
}: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const src = product.imageUrl;
  const showImage = Boolean(src) && !failed;

  const containerClass = className
    ? `relative w-full overflow-hidden ${className}`
    : "relative aspect-[4/3] w-full overflow-hidden";

  if (showImage && src) {
    return (
      <div className={`${containerClass} bg-gray-100`}>
        <Image
          src={src}
          alt={product.name}
          fill
          className={imageClassName}
          sizes={sizes}
          onError={() => setFailed(true)}
        />
        {badge && (
          <div className="absolute bottom-0 left-0 z-10 p-4">{badge}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`${containerClass} flex items-end bg-gradient-to-br p-4 ${product.gradient}`}
    >
      {badge}
    </div>
  );
}
