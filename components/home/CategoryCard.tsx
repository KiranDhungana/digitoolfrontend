import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  name: string;
  href: string;
  gradient: string;
  imageUrl?: string;
  size?: "sm" | "lg";
}

export function CategoryCard({
  name,
  href,
  gradient,
  imageUrl,
  size = "sm",
}: CategoryCardProps) {
  const isLarge = size === "lg";

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-2xl transition hover:scale-[1.02] hover:shadow-lg ${
        imageUrl ? "border border-gray-100" : `bg-gradient-to-br ${gradient}`
      } ${isLarge ? "min-h-[140px]" : "min-h-[120px] sm:min-h-[140px]"}`}
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
        </>
      ) : null}
      <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 p-4">
        <span className="inline-flex items-center gap-1 text-lg font-bold text-white drop-shadow">
          {name}
          <ChevronRight className="h-5 w-5" />
        </span>
      </div>
      <div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-sm"
        aria-hidden
      />
    </Link>
  );
}
