import {
  fetchBrand,
  fetchBrands,
  fetchCategories,
  fetchCategory,
  fetchProduct,
  fetchProducts,
} from "@/lib/api/public";
import {
  searchSuggestionsLocal,
  warmSearchCatalog,
} from "@/lib/search-catalog-cache";
import type { Brand, Category, Product } from "@/lib/types";
import {
  getAllBrands as mockBrands,
  getAllCategories as mockCategories,
  getAllProducts as mockProducts,
  getBrandBySlug as mockBrandBySlug,
  getCategoryBySlug as mockCategoryBySlug,
  getGamingProducts as mockGaming,
  getOfficialProducts as mockOfficial,
  getProductById as mockProductById,
  getProductsByBrandSlug as mockByBrand,
  getProductsByCategorySlug as mockByCategory,
  getPromoProducts as mockPromo,
  searchProducts as mockSearch,
} from "@/lib/mock-data";

function applyLimit(products: Product[], limit?: number): Product[] {
  if (limit == null || limit <= 0) return products;
  return products.slice(0, limit);
}

export async function getProducts(
  params?: Parameters<typeof fetchProducts>[0]
): Promise<Product[]> {
  const api = await fetchProducts({ limit: 48, ...params });
  if (api !== null) return api;
  let products: Product[];
  if (params?.category) products = mockByCategory(params.category);
  else if (params?.brand) products = mockByBrand(params.brand);
  else if (params?.official) products = mockOfficial();
  else if (params?.promo) products = mockPromo();
  else if (params?.q) products = mockSearch(params.q);
  else products = mockProducts();
  return applyLimit(products, params?.limit);
}

/** Homepage sample of real catalogue products (not the full list). */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  return getProducts({ limit });
}

export async function getProduct(id: string): Promise<Product | undefined> {
  const api = await fetchProduct(id);
  if (api) return api;
  return mockProductById(id);
}

export async function getCategories(): Promise<Category[]> {
  const api = await fetchCategories();
  if (api !== null) return api;
  return mockCategories();
}

export async function getCategory(slug: string) {
  const api = await fetchCategory(slug);
  if (api) return api;
  const cat = mockCategoryBySlug(slug);
  if (!cat) return null;
  return { category: cat, products: mockByCategory(slug) };
}

export async function getBrands(): Promise<Brand[]> {
  const api = await fetchBrands();
  if (api !== null) return api;
  return mockBrands();
}

export async function getBrand(slug: string) {
  const api = await fetchBrand(slug);
  if (api) return api;
  const brand = mockBrandBySlug(slug);
  if (!brand) return null;
  return { brand, products: mockByBrand(slug) };
}

export async function getGamingProducts() {
  const api = await fetchProducts({ category: "gaming" });
  if (api !== null) return api;
  return mockGaming();
}

export async function getOfficialProducts() {
  const api = await fetchProducts({ official: true });
  if (api !== null) return api;
  return mockOfficial();
}

export async function getPromoProducts() {
  const api = await fetchProducts({ promo: true });
  if (api !== null) return api;
  return mockPromo();
}

export async function searchProductsQuery(q: string) {
  const term = q.trim();
  if (!term) return [];

  let local = searchSuggestionsLocal(term, 50);
  if (!local) {
    await warmSearchCatalog();
    local = searchSuggestionsLocal(term, 50);
  }
  if (local) return local.products;

  const api = await fetchProducts({ q: term });
  if (api !== null) return api;
  return mockSearch(term);
}
