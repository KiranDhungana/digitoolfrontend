import { API_URL, USER_TOKEN_KEY } from "@/lib/api/config";

export type ReferralWithdrawalStatus = "pending" | "completed" | "rejected";

export interface ReferralCommissionItem {
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ReferralCommission {
  id: string;
  amount: number;
  rate: number;
  createdAt: string;
  orderId: string;
  orderSubtotal: number;
  currency: string;
  orderItems: ReferralCommissionItem[];
}

export interface ReferralWithdrawal {
  id: string;
  amount: number;
  status: ReferralWithdrawalStatus;
  payoutNote?: string;
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
}

export interface ReferralSummary {
  referralCode: string;
  balance: number;
  availableBalance: number;
  pendingWithdrawal: number;
  referralCount: number;
  totalEarned: number;
  commissionCount: number;
  purchasedItemsCount: number;
  minPurchasedItemsToWithdraw: number;
  canWithdraw: boolean;
  withdrawBlockedReason?: string;
  commissionRatePercent: number;
  commissions: ReferralCommission[];
  withdrawals: ReferralWithdrawal[];
}

async function referralFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(USER_TOKEN_KEY) : null;
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return data as T;
}

export async function fetchReferralSummary(): Promise<ReferralSummary> {
  return referralFetch("/api/referrals/me");
}

export async function requestReferralWithdrawal(body: {
  amount: number;
  payoutNote: string;
}): Promise<{
  withdrawal: ReferralWithdrawal;
  summary: Omit<ReferralSummary, "commissions" | "withdrawals">;
}> {
  return referralFetch("/api/referrals/withdraw", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function validateReferralCode(
  code: string
): Promise<{ valid: boolean; code?: string; referrerName?: string; error?: string }> {
  const res = await fetch(
    `${API_URL}/api/referrals/validate?code=${encodeURIComponent(code)}`
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      valid: false,
      error: (data as { error?: string }).error || "Invalid referral code",
    };
  }
  return data as { valid: boolean; code: string; referrerName: string };
}
