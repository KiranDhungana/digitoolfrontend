import type { ReactNode } from "react";
import { CatalogImage } from "@/components/catalog/CatalogImage";

interface CatalogEntityBannerProps {
  name: string;
  gradient: string;
  imageUrl?: string;
  fallback?: ReactNode;
  subtitle?: string;
}

export function CatalogEntityBanner({
  name,
  gradient,
  imageUrl,
  fallback,
  subtitle,
}: CatalogEntityBannerProps) {
  return (
    <div className="relative mb-8 overflow-hidden rounded-2xl">
      <CatalogImage
        name={name}
        gradient={gradient}
        imageUrl={imageUrl}
        className="min-h-[160px] w-full sm:min-h-[200px]"
        sizes="100vw"
        fallback={fallback}
      />
      <div
        className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-8 ${
          imageUrl
            ? "bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            : "bg-black/20"
        }`}
      >
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{name}</h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
