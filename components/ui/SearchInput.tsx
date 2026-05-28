"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { warmSearchCatalog } from "@/lib/api/search";
import type { SearchSuggestions } from "@/lib/api/search";
import {
  isSearchCatalogReady,
  searchSuggestionsLocal,
} from "@/lib/search-catalog-cache";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";

interface SearchInputProps {
  placeholder?: string;
  /** Tighter padding for the header bar */
  compact?: boolean;
}

const EMPTY_SUGGESTIONS: SearchSuggestions = {
  products: [],
  brands: [],
  categories: [],
};

type FlatItem = {
  type: "product" | "brand" | "category" | "all";
  href: string;
  label: string;
};

function buildFlatItems(
  suggestions: SearchSuggestions,
  term: string
): FlatItem[] {
  const items: FlatItem[] = [];
  for (const p of suggestions.products) {
    items.push({
      type: "product",
      href: ROUTES.product(p.id),
      label: p.name,
    });
  }
  for (const b of suggestions.brands) {
    items.push({
      type: "brand",
      href: ROUTES.brand(b.slug),
      label: b.name,
    });
  }
  for (const c of suggestions.categories) {
    items.push({
      type: "category",
      href: ROUTES.category(c.slug),
      label: c.name,
    });
  }
  if (term) {
    items.push({
      type: "all",
      href: `${ROUTES.search}?q=${encodeURIComponent(term)}`,
      label: `View all results for "${term}"`,
    });
  }
  return items;
}

export function SearchInput({
  placeholder = "What are you looking for? Just type here",
  compact = false,
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [catalogReady, setCatalogReady] = useState(isSearchCatalogReady());
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    void warmSearchCatalog().then(() => setCatalogReady(true));
  }, []);

  useEffect(() => {
    if (pathname === ROUTES.search) {
      setQuery(searchParams.get("q") ?? "");
    }
  }, [pathname, searchParams]);

  const term = query.trim();

  const suggestions = useMemo((): SearchSuggestions => {
    if (term.length < 1) return EMPTY_SUGGESTIONS;
    return searchSuggestionsLocal(term) ?? EMPTY_SUGGESTIONS;
  }, [term, catalogReady]);

  const items = useMemo(
    () => buildFlatItems(suggestions, term),
    [suggestions, term]
  );

  const hasResults =
    suggestions.products.length > 0 ||
    suggestions.brands.length > 0 ||
    suggestions.categories.length > 0;

  const showPanel = open && term.length >= 1 && (hasResults || catalogReady);

  useEffect(() => {
    setActiveIndex(-1);
  }, [term]);

  useEffect(() => {
    const onPointerDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const goToSearch = (searchTerm?: string) => {
    const q = (searchTerm ?? query).trim();
    setOpen(false);
    router.push(q ? `${ROUTES.search}?q=${encodeURIComponent(q)}` : ROUTES.search);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && items[activeIndex]) {
      router.push(items[activeIndex].href);
      setOpen(false);
      return;
    }
    goToSearch();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < items.length - 1 ? i + 1 : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : items.length - 1));
    }
  };

  let rowIndex = -1;

  return (
    <div ref={rootRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit} className="relative flex w-full items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            if (!catalogReady) void warmSearchCatalog().then(() => setCatalogReady(true));
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showPanel}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          className={
            compact
              ? "w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-12 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
              : "w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-5 pr-14 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          }
        />
        <button
          type="submit"
          aria-label="Search"
          className={
            compact
              ? "absolute right-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
              : "absolute right-1.5 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
          }
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {showPanel && (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-[60] mt-2 max-h-[min(24rem,70vh)] overflow-y-auto rounded-2xl border border-gray-100 bg-white py-2 shadow-xl"
        >
          {!catalogReady && !hasResults && (
            <p className="px-4 py-2 text-sm text-gray-400">Loading catalog…</p>
          )}

          {suggestions.products.length > 0 && (
            <div className="px-2 pb-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Products
              </p>
              {suggestions.products.map((product) => {
                rowIndex += 1;
                const idx = rowIndex;
                const active = activeIndex === idx;
                return (
                  <Link
                    key={product.id}
                    id={`${listboxId}-option-${idx}`}
                    role="option"
                    aria-selected={active}
                    href={ROUTES.product(product.id)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                      active ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${product.gradient}`}
                    >
                      {product.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-xs font-bold text-white">
                          {product.brand.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {product.name}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {product.brand} · {product.category}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-orange-600">
                      {formatPrice(product.price)}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}

          {suggestions.brands.length > 0 && (
            <div className="border-t border-gray-100 px-2 py-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Brands
              </p>
              {suggestions.brands.map((brand) => {
                rowIndex += 1;
                const idx = rowIndex;
                const active = activeIndex === idx;
                return (
                  <Link
                    key={brand.slug}
                    id={`${listboxId}-option-${idx}`}
                    role="option"
                    aria-selected={active}
                    href={ROUTES.brand(brand.slug)}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      active ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {brand.name}
                  </Link>
                );
              })}
            </div>
          )}

          {suggestions.categories.length > 0 && (
            <div className="border-t border-gray-100 px-2 py-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Categories
              </p>
              {suggestions.categories.map((category) => {
                rowIndex += 1;
                const idx = rowIndex;
                const active = activeIndex === idx;
                return (
                  <Link
                    key={category.slug}
                    id={`${listboxId}-option-${idx}`}
                    role="option"
                    aria-selected={active}
                    href={ROUTES.category(category.slug)}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm transition ${
                      active ? "bg-orange-50 text-orange-700" : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </div>
          )}

          {catalogReady && !hasResults && term && (
            <p className="px-4 py-3 text-sm text-gray-500">
              No matches for &ldquo;{term}&rdquo;
            </p>
          )}

          {term && (
            <div className="border-t border-gray-100 px-2 pt-1">
              <button
                type="button"
                id={`${listboxId}-option-${items.length - 1}`}
                role="option"
                aria-selected={activeIndex === items.length - 1}
                onClick={() => goToSearch(term)}
                className={`w-full cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeIndex === items.length - 1
                    ? "bg-orange-50 text-orange-700"
                    : "text-orange-600 hover:bg-orange-50"
                }`}
              >
                View all results for &ldquo;{term}&rdquo;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
