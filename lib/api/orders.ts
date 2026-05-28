import { API_URL, USER_TOKEN_KEY } from "@/lib/api/config";
import type { DeliveryChannel } from "@/lib/deliveryChannels";

export type PaymentMethod = "fonepay" | "khalti";
export type OrderStatus = "pending_verification" | "verified" | "rejected";

export interface OrderLineItem {
  productId: string;
  productName: string;
  denomination: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderLineItem[];
  subtotal: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentScreenshotUrl: string;
  paymentReference?: string;
  deliveryChannel?: DeliveryChannel;
  deliveryContact?: string;
  status: OrderStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  verifiedAt?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface OrderList {
  items: Order[];
  total: number;
  limit: number;
  offset: number;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TOKEN_KEY);
}

export async function placeOrder(body: {
  items: OrderLineItem[];
  paymentMethod: "fonepay";
  paymentReference?: string;
  deliveryChannel: DeliveryChannel;
  deliveryContact?: string;
  screenshot: File;
}): Promise<Order> {
  const token = getToken();
  const formData = new FormData();
  formData.append("items", JSON.stringify(body.items));
  formData.append("paymentMethod", body.paymentMethod);
  formData.append("deliveryChannel", body.deliveryChannel);
  if (body.deliveryContact) {
    formData.append("deliveryContact", body.deliveryContact);
  }
  formData.append("screenshot", body.screenshot);
  if (body.paymentReference) {
    formData.append("paymentReference", body.paymentReference);
  }

  const res = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Order failed (${res.status})`);
  }
  return data as Order;
}

export async function fetchMyOrders(): Promise<Order[]> {
  const token = getToken();
  const res = await fetch(`${API_URL}/api/orders/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Failed to load orders (${res.status})`);
  }
  return data as Order[];
}
