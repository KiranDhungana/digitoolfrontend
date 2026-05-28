import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/components/home/CategoryIcon";
import { ROUTES } from "@/lib/constants";
import { getCategories } from "@/lib/data";

export async function PopularCategories() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
        Popular categories
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={ROUTES.category(category.slug)}
            className={`group relative overflow-hidden rounded-2xl p-6 transition hover:scale-[1.01] hover:shadow-md ${
              category.imageUrl
                ? "min-h-[140px] border border-gray-100"
                : `bg-gradient-to-br ${category.gradient}`
            }`}
          >
            {category.imageUrl ? (
              <>
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
              </>
            ) : (
              <CategoryIcon
                name={category.icon}
                className="absolute right-4 top-4 h-10 w-10 text-white/30"
              />
            )}
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white">{category.name}</h3>
              <p className="mt-1 text-sm text-white/80">
                {category.productCount}+ items
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white/90 opacity-0 transition group-hover:opacity-100">
                Browse
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
