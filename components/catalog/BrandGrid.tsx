import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Brand } from "@/lib/types";
import { ROUTES } from "@/lib/constants";

interface BrandGridProps {
  brands: Brand[];
}

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {brands.map((brand) => (
        <Link
          key={brand.slug}
          href={ROUTES.brand(brand.slug)}
          className={`group relative overflow-hidden rounded-2xl transition hover:scale-[1.01] hover:shadow-md ${
            brand.imageUrl
              ? "min-h-[140px] border border-gray-100"
              : `bg-gradient-to-br ${brand.gradient} p-6`
          }`}
        >
          {brand.imageUrl ? (
            <>
              <Image
                src={brand.imageUrl}
                alt={brand.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
            </>
          ) : null}
          <div
            className={`relative z-10 ${brand.imageUrl ? "flex min-h-[140px] flex-col justify-end p-6" : ""}`}
          >
            <h3 className="text-xl font-bold text-white">{brand.name}</h3>
            <p className="mt-1 text-sm text-white/80">
              {brand.productCount}+ items
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/90">
              Browse
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
