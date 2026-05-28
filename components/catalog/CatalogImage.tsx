import Image from "next/image";
import type { ReactNode } from "react";

interface CatalogImageProps {
  name: string;
  gradient: string;
  imageUrl?: string;
  fallback: ReactNode;
  className?: string;
  sizes?: string;
}

export function CatalogImage({
  name,
  gradient,
  imageUrl,
  fallback,
  className = "",
  sizes = "80px",
}: CatalogImageProps) {
  if (imageUrl) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
    >
      {fallback}
    </div>
  );
}
