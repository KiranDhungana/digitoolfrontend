import { ROUTES } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";

export const PENDING_PRODUCT_INQUIRY_KEY = "digitoolera_pending_product_inquiry";

export interface PendingProductInquiry {
  id: string;
  name: string;
}

export function buildProductInquiryMessage(product: PendingProductInquiry): string {
  const path = ROUTES.product(product.id);
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : `${SITE_URL}${path}`;

  return `Hi, I have a question about this product:\n\n${product.name}\n${url}\n\n`;
}

export function savePendingProductInquiry(product: PendingProductInquiry) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(
    PENDING_PRODUCT_INQUIRY_KEY,
    JSON.stringify(product)
  );
}

export function consumePendingProductInquiry(): PendingProductInquiry | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_PRODUCT_INQUIRY_KEY);
  if (!raw) return null;
  sessionStorage.removeItem(PENDING_PRODUCT_INQUIRY_KEY);
  try {
    const data = JSON.parse(raw) as PendingProductInquiry;
    if (data?.id && data?.name) return data;
  } catch {
    /* ignore */
  }
  return null;
}
