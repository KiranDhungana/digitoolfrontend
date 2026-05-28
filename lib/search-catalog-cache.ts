import { API_URL } from "@/lib/api/config";
import { mapBrands, mapCategories } from "@/lib/map-catalog";
import { mapProducts } from "@/lib/map-product";
import {
  filterSearchCatalog,
  mockSearchCatalog,
  type SearchCatalog,
} from "@/lib/search-suggestions";
import type { SearchSuggestions } from "@/lib/api/search";

const CACHE_TTL_MS = 5 * 60 * 1000;

let catalog: SearchCatalog | null = null;
let loadedAt = 0;
let inflight: Promise<SearchCatalog> | null = null;

type RawCatalog = {
  products?: Parameters<typeof mapProducts>[0];
  brands?: Parameters<typeof mapBrands>[0];
  categories?: Parameters<typeof mapCategories>[0];
};

async function fetchCatalogFromApi(signal?: AbortSignal): Promise<SearchCatalog> {
  const res = await fetch(`${API_URL}/api/search/catalog`, {
    signal,
    cache: "default",
  });
  if (!res.ok) throw new Error("Catalog fetch failed");
  const data = (await res.json()) as RawCatalog;
  return {
    products: mapProducts(data.products ?? []),
    brands: mapBrands(data.brands ?? []),
    categories: mapCategories(data.categories ?? []),
  };
}

/** Load catalog once; reused for instant local filtering */
export function warmSearchCatalog(): Promise<SearchCatalog> {
  const now = Date.now();
  if (catalog && now - loadedAt < CACHE_TTL_MS) {
    return Promise.resolve(catalog);
  }
  if (inflight) return inflight;

  inflight = fetchCatalogFromApi()
    .then((data) => {
      catalog = data;
      loadedAt = Date.now();
      return data;
    })
    .catch(() => {
      catalog = mockSearchCatalog();
      loadedAt = Date.now();
      return catalog;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function isSearchCatalogReady(): boolean {
  return catalog !== null && Date.now() - loadedAt < CACHE_TTL_MS;
}

/** Synchronous filter when catalog is already warm */
export function searchSuggestionsLocal(
  q: string,
  limit = 8
): SearchSuggestions | null {
  if (!catalog) return null;
  return filterSearchCatalog(catalog, q, limit);
}

/** Local first, then await catalog if needed */
export async function getSearchSuggestions(
  q: string,
  limit = 8
): Promise<SearchSuggestions> {
  const term = q.trim();
  if (!term) {
    return { products: [], brands: [], categories: [] };
  }

  const instant = searchSuggestionsLocal(term, limit);
  if (instant) return instant;

  const data = await warmSearchCatalog();
  return filterSearchCatalog(data, term, limit);
}
