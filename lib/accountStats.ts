import type { Order, OrderStatus } from "@/lib/api/orders";

export interface MonthBucket {
  key: string;
  label: string;
  spend: number;
  count: number;
}

export interface AccountOrderStats {
  totalOrders: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalSpend: number;
  averageOrder: number;
  monthly: MonthBucket[];
}

const MONTHS = 6;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function lastMonthKeys(count: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

export function computeAccountOrderStats(orders: Order[]): AccountOrderStats {
  const keys = lastMonthKeys(MONTHS);
  const monthlyMap = new Map(
    keys.map((key) => [key, { key, label: monthLabel(key), spend: 0, count: 0 }])
  );

  let verifiedCount = 0;
  let pendingCount = 0;
  let rejectedCount = 0;
  let totalSpend = 0;

  for (const order of orders) {
    if (order.status === "verified") {
      verifiedCount++;
      totalSpend += order.subtotal;
    } else if (order.status === "pending_verification") {
      pendingCount++;
    } else if (order.status === "rejected") {
      rejectedCount++;
    }

    const key = monthKey(new Date(order.createdAt));
    const bucket = monthlyMap.get(key);
    if (bucket && order.status === "verified") {
      bucket.spend += order.subtotal;
      bucket.count += 1;
    }
  }

  return {
    totalOrders: orders.length,
    verifiedCount,
    pendingCount,
    rejectedCount,
    totalSpend,
    averageOrder: verifiedCount > 0 ? totalSpend / verifiedCount : 0,
    monthly: keys.map((key) => monthlyMap.get(key)!),
  };
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  pending_verification: "Pending verification",
  verified: "Confirmed",
  rejected: "Rejected",
};

export const orderStatusStyle: Record<OrderStatus, string> = {
  pending_verification: "bg-amber-50 text-amber-800 ring-amber-200",
  verified: "bg-green-50 text-green-800 ring-green-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
};
