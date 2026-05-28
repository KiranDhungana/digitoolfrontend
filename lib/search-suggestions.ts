import type { SearchSuggestions } from "@/lib/api/search";
import type { Brand, Category, Product } from "@/lib/types";
import {
  BRANDS,
  CATEGORIES,
  PRODUCTS,
} from "@/lib/mock-data";

export interface SearchCatalog {
  products: Product[];
  brands: Brand[];
  categories: Category[];
}

function matchesTerm(value: string, term: string) {
  return value.toLowerCase().includes(term);
}

export function filterSearchCatalog(
  catalog: SearchCatalog,
  q: string,
  limit = 8
): SearchSuggestions {
  const term = q.trim().toLowerCase();
  if (!term) {
    return { products: [], brands: [], categories: [] };
  }

  const products = catalog.products
    .filter(
      (p) =>
        matchesTerm(p.name, term) ||
        matchesTerm(p.brand, term) ||
        matchesTerm(p.category, term) ||
        matchesTerm(p.id, term) ||
        matchesTerm(p.brandSlug, term) ||
        matchesTerm(p.categorySlug, term)
    )
    .slice(0, limit);

  const brands = catalog.brands
    .filter((b) => matchesTerm(b.name, term) || matchesTerm(b.slug, term))
    .slice(0, 4);

  const categories = catalog.categories
    .filter((c) => matchesTerm(c.name, term) || matchesTerm(c.slug, term))
    .slice(0, 4);

  return { products, brands, categories };
}

export function mockSearchCatalog(): SearchCatalog {
  return {
    products: PRODUCTS,
    brands: BRANDS,
    categories: CATEGORIES,
  };
}

export function mockSearchSuggestions(
  q: string,
  limit = 8
): SearchSuggestions {
  return filterSearchCatalog(mockSearchCatalog(), q, limit);
}
