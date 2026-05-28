import { API_URL, USER_TOKEN_KEY } from "@/lib/api/config";

import type { DeliveryChannel } from "@/lib/deliveryChannels";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt?: string;
  defaultDeliveryChannel?: DeliveryChannel;
  deliveryWhatsapp?: string;
  deliveryTelegram?: string;
  deliveryViber?: string;
  referralCode?: string;
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TOKEN_KEY);
}

export function setUserToken(token: string) {
  localStorage.setItem(USER_TOKEN_KEY, token);
}

export function clearUserToken() {
  localStorage.removeItem(USER_TOKEN_KEY);
}

async function userFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getUserToken();
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
    if (res.status === 404) {
      throw new Error(
        "Account API not found. Restart the backend (npm run dev in ecommerce-backend) so /api/auth is loaded."
      );
    }
    throw new Error(
      (data as { error?: string }).error || `Request failed (${res.status})`
    );
  }
  return data as T;
}

export async function checkAuthApi(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ token: string; user: User }> {
  return userFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function requestSignupOtp(body: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
}): Promise<{ message: string; email: string; expiresInMinutes: number }> {
  return userFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function verifySignupOtp(
  email: string,
  code: string
): Promise<{ token: string; user: User }> {
  return userFetch("/api/auth/register/verify", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

export async function requestPasswordResetOtp(
  email: string
): Promise<{ message: string; email: string; expiresInMinutes: number }> {
  return userFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function verifyPasswordResetOtp(body: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<{ token: string; user: User }> {
  return userFetch("/api/auth/forgot-password/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchCurrentUser(): Promise<User> {
  return userFetch("/api/auth/me");
}

export async function updateCurrentUser(body: {
  name: string;
  phone?: string;
  defaultDeliveryChannel?: DeliveryChannel | null;
  deliveryWhatsapp?: string | null;
  deliveryTelegram?: string | null;
  deliveryViber?: string | null;
}): Promise<User> {
  return userFetch("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}
