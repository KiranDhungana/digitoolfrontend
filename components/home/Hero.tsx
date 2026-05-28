import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { CategoryCard } from "@/components/home/CategoryCard";
import { Button } from "@/components/ui/Button";
import {
  HERO_CATEGORIES,
  HERO_FEATURES,
  HERO_HEADLINE,
  HERO_SUBTITLE,
  ROUTES,
} from "@/lib/constants";
import { getBrands } from "@/lib/data";
import { SITE_DOMAIN } from "@/lib/site";

function brandSlugFromHref(href: string): string {
  const parts = href.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

export async function Hero() {
  const brands = await getBrands();
  const imageBySlug = new Map(brands.map((b) => [b.slug, b.imageUrl]));

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <div className="relative overflow-hidden rounded-3xl bg-stone-900 bg-[url('/images/bg-decor.png')] bg-cover bg-center p-8 sm:p-10 lg:min-h-[320px]">
          <div
            className="pointer-events-none absolute inset-0 bg-stone-950/60"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rotate-45 rounded-3xl bg-amber-400/10 blur-xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute right-10 top-1/2 h-32 w-32 rounded-full border border-amber-500/30"
            aria-hidden
          />

          <div className="relative z-10 flex h-full flex-col justify-center">
            <h1 className="max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              {HERO_HEADLINE} {SITE_DOMAIN}
            </h1>
            <p className="mt-3 max-w-md text-sm text-amber-100/90 sm:text-base">
              {HERO_SUBTITLE}
            </p>
            <ul className="mt-6 space-y-3">
              {HERO_FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-amber-100 sm:text-base"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/30">
                    <Check className="h-3 w-3 text-amber-300" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href={ROUTES.giftCards}>
                <Button className="rounded-xl px-6 py-3">
                  Explore catalogue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {HERO_CATEGORIES.map((category) => {
            const slug = brandSlugFromHref(category.href);
            return (
              <CategoryCard
                key={category.name}
                name={category.name}
                href={category.href}
                gradient={category.gradient}
                imageUrl={imageBySlug.get(slug)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
