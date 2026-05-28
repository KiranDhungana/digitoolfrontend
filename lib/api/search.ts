import { getSearchSuggestions, warmSearchCatalog } from "@/lib/search-catalog-cache";
import type { Brand, Category, Product } from "@/lib/types";

export interface SearchSuggestions {
  products: Product[];
  brands: Brand[];
  categories: Category[];
}

export { warmSearchCatalog };

export async function fetchSearchSuggestions(
  q: string,
  limit = 8
): Promise<SearchSuggestions> {
  return getSearchSuggestions(q, limit);
}
