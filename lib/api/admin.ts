import { API_URL, ADMIN_TOKEN_KEY } from "@/lib/api/config";
import type { ChatConversation, ChatMessage } from "@/lib/api/chat";
import type { Order, OrderList } from "@/lib/api/orders";
import { mapProduct } from "@/lib/map-product";
import type { Product } from "@/lib/types";

export type { Order, OrderList, OrderStatus } from "@/lib/api/orders";
export type { ChatConversation, ChatMessage } from "@/lib/api/chat";

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AdminCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  gradient: string;
  imageUrl?: string;
  mediaId?: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminBrand {
  id: string;
  slug: string;
  name: string;
  gradient: string;
  imageUrl?: string;
  mediaId?: string;
  productCount: number;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminProduct {
  dbId: string;
  id: string;
  name: string;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  currency: string;
  gradient: string;
  imageUrl?: string;
  mediaId?: string;
  badge?: string;
  description?: string;
  denominations?: number[];
  isActive: boolean;
  brandId: string;
  categoryId: string;
}

export interface AdminMedia {
  id: string;
  publicId: string;
  url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  bytes: number | null;
  folder: string;
  filename: string | null;
  alt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminMediaList {
  items: AdminMedia[];
  total: number;
  limit: number;
  offset: number;
}

export interface DashboardStats {
  products: number;
  activeProducts: number;
  categories: number;
  brands: number;
  admins: number;
  media: number;
  pendingOrders: number;
  unreadChats: number;
  newContactMessages: number;
}

export type ContactMessageStatus = "new" | "read" | "archived";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: ContactMessageStatus;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageList {
  items: ContactMessage[];
  total: number;
  limit: number;
  offset: number;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function getToken(): string | null {
  return getAdminToken();
}

export function setAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data as T;
}

export async function adminLogin(
  email: string,
  password: string
): Promise<{ token: string; admin: AdminUser }> {
  return adminFetch("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function adminMe(): Promise<AdminUser> {
  return adminFetch("/api/admin/auth/me");
}

export async function adminStats(): Promise<DashboardStats> {
  return adminFetch("/api/admin/dashboard/stats");
}

export async function adminListCategories(): Promise<AdminCategory[]> {
  return adminFetch("/api/admin/categories");
}

export async function adminCreateCategory(
  body: Partial<AdminCategory>
): Promise<AdminCategory> {
  return adminFetch("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateCategory(
  id: string,
  body: Partial<AdminCategory>
): Promise<AdminCategory> {
  return adminFetch(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteCategory(id: string): Promise<void> {
  return adminFetch(`/api/admin/categories/${id}`, { method: "DELETE" });
}

export async function adminListBrands(): Promise<AdminBrand[]> {
  return adminFetch("/api/admin/brands");
}

export async function adminCreateBrand(
  body: Partial<AdminBrand>
): Promise<AdminBrand> {
  return adminFetch("/api/admin/brands", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateBrand(
  id: string,
  body: Partial<AdminBrand>
): Promise<AdminBrand> {
  return adminFetch(`/api/admin/brands/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteBrand(id: string): Promise<void> {
  return adminFetch(`/api/admin/brands/${id}`, { method: "DELETE" });
}

function mapAdminProduct(raw: AdminProduct): AdminProduct {
  const mapped = mapProduct(raw as AdminProduct & Product);
  return { ...raw, imageUrl: mapped.imageUrl, mediaId: mapped.mediaId };
}

export async function adminListProducts(): Promise<AdminProduct[]> {
  const list = await adminFetch<AdminProduct[]>("/api/admin/products");
  return list.map(mapAdminProduct);
}

export async function adminGetProduct(id: string): Promise<AdminProduct> {
  const product = await adminFetch<AdminProduct>(`/api/admin/products/${id}`);
  return mapAdminProduct(product);
}

export interface AdminFormOption {
  id: string;
  name: string;
}

export interface AdminProductEditContext {
  product: AdminProduct;
  brands: AdminFormOption[];
  categories: AdminFormOption[];
}

/** One request: product + lean dropdown options (edit page) */
export async function adminGetProductForEdit(
  id: string
): Promise<AdminProductEditContext> {
  const data = await adminFetch<{
    product: AdminProduct;
    brands: AdminFormOption[];
    categories: AdminFormOption[];
  }>(`/api/admin/products/${id}?formOptions=1`);
  return {
    product: mapAdminProduct(data.product),
    brands: data.brands,
    categories: data.categories,
  };
}

/** Lean dropdown options only (new product page) */
export async function adminGetProductFormOptions(): Promise<{
  brands: AdminFormOption[];
  categories: AdminFormOption[];
}> {
  return adminFetch("/api/admin/products/form-options");
}

export async function adminCreateProduct(
  body: Record<string, unknown>
): Promise<AdminProduct> {
  return adminFetch("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function adminUpdateProduct(
  id: string,
  body: Record<string, unknown>
): Promise<AdminProduct> {
  return adminFetch(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function adminDeleteProduct(id: string): Promise<void> {
  return adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
}

export async function adminListMedia(params?: {
  folder?: string;
  limit?: number;
  offset?: number;
}): Promise<AdminMediaList> {
  const search = new URLSearchParams();
  if (params?.folder) search.set("folder", params.folder);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const qs = search.toString();
  return adminFetch(`/api/admin/media${qs ? `?${qs}` : ""}`);
}

export interface AdminMediaBulkUpload {
  items: AdminMedia[];
  failed: { filename: string; error: string }[];
  uploadedCount: number;
  failedCount: number;
}

export async function adminUploadMedia(
  file: File,
  options?: { folder?: string; alt?: string }
): Promise<AdminMedia> {
  const result = await adminUploadMediaBulk([file], options);
  if (!result.items.length) {
    const msg = result.failed[0]?.error || "Upload failed";
    throw new Error(msg);
  }
  return result.items[0];
}

export async function adminUploadMediaBulk(
  files: File[],
  options?: { folder?: string; alt?: string }
): Promise<AdminMediaBulkUpload> {
  if (!files.length) {
    throw new Error("Select at least one image");
  }
  if (files.length > 50) {
    throw new Error("Maximum 50 images per upload");
  }

  const token = getToken();
  const formData = new FormData();
  for (const file of files) {
    formData.append("files", file);
  }
  if (options?.folder) formData.append("folder", options.folder);
  if (options?.alt) formData.append("alt", options.alt);

  const res = await fetch(`${API_URL}/api/admin/media/upload/bulk`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.items) {
    throw new Error(data.error || `Upload failed (${res.status})`);
  }
  return data as AdminMediaBulkUpload;
}

export async function adminDeleteMedia(id: string): Promise<void> {
  return adminFetch(`/api/admin/media/${id}`, { method: "DELETE" });
}

export async function adminListOrders(params?: {
  status?: string;
  limit?: number;
  offset?: number;
}): Promise<OrderList> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const qs = search.toString();
  return adminFetch(`/api/admin/orders${qs ? `?${qs}` : ""}`);
}

export async function adminGetOrder(id: string): Promise<Order> {
  return adminFetch(`/api/admin/orders/${id}`);
}

export async function adminUpdateOrderStatus(
  id: string,
  body: { status: "verified" | "rejected"; adminNote?: string }
): Promise<Order> {
  return adminFetch(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function adminListChatConversations(): Promise<ChatConversation[]> {
  return adminFetch("/api/admin/chat/conversations");
}

export async function adminGetChatMessages(userId: string): Promise<{
  user: ChatConversation["user"];
  messages: ChatMessage[];
}> {
  return adminFetch(`/api/admin/chat/users/${userId}/messages`);
}

export async function adminSendChatReply(
  userId: string,
  body: string
): Promise<ChatMessage> {
  return adminFetch(`/api/admin/chat/users/${userId}/messages`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export async function adminMarkChatRead(userId: string): Promise<void> {
  return adminFetch(`/api/admin/chat/users/${userId}/read`, {
    method: "PATCH",
  });
}

export async function adminListContactMessages(params?: {
  status?: ContactMessageStatus;
  limit?: number;
  offset?: number;
}): Promise<ContactMessageList> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const qs = search.toString();
  return adminFetch(`/api/admin/contact${qs ? `?${qs}` : ""}`);
}

export async function adminGetContactMessage(id: string): Promise<ContactMessage> {
  return adminFetch(`/api/admin/contact/${id}`);
}

export async function adminUpdateContactMessage(
  id: string,
  status: ContactMessageStatus
): Promise<ContactMessage> {
  return adminFetch(`/api/admin/contact/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export type ReferralWithdrawalStatus = "pending" | "completed" | "rejected";

export interface ReferralWithdrawalAdmin {
  id: string;
  amount: number;
  status: ReferralWithdrawalStatus;
  payoutNote?: string;
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
  user: { id: string; name: string; email: string; phone?: string };
}

export interface ReferralWithdrawalList {
  items: ReferralWithdrawalAdmin[];
  total: number;
  limit: number;
  offset: number;
}

export async function adminListReferralWithdrawals(params?: {
  status?: ReferralWithdrawalStatus;
  limit?: number;
  offset?: number;
}): Promise<ReferralWithdrawalList> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit != null) search.set("limit", String(params.limit));
  if (params?.offset != null) search.set("offset", String(params.offset));
  const qs = search.toString();
  return adminFetch(`/api/admin/referrals/withdrawals${qs ? `?${qs}` : ""}`);
}

export async function adminUpdateReferralWithdrawal(
  id: string,
  body: { status: "completed" | "rejected"; adminNote?: string }
): Promise<ReferralWithdrawalAdmin> {
  return adminFetch(`/api/admin/referrals/withdrawals/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
