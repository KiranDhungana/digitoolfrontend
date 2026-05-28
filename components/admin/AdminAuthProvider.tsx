"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  adminMe,
  clearAdminToken,
  getAdminToken,
  type AdminUser,
} from "@/lib/api/admin";

interface AdminAuthContextValue {
  admin: AdminUser | null;
  loading: boolean;
  logout: () => void;
  refresh: () => Promise<AdminUser | null>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  const refresh = useCallback(async (): Promise<AdminUser | null> => {
    if (!getAdminToken()) {
      setAdmin(null);
      return null;
    }
    try {
      const user = await adminMe();
      setAdmin(user);
      return user;
    } catch {
      setAdmin(null);
      clearAdminToken();
      return null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (isLoginPage) {
        const token = getAdminToken();
        if (!token) {
          if (!cancelled) setLoading(false);
          return;
        }
        const user = await refresh();
        if (!cancelled) {
          setLoading(false);
          if (user) router.replace("/admin");
        }
        return;
      }

      await refresh();
      if (!cancelled) setLoading(false);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [isLoginPage, refresh, router]);

  useEffect(() => {
    if (!loading && !admin && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [loading, admin, isLoginPage, router]);

  const logout = () => {
    clearAdminToken();
    setAdmin(null);
    router.replace("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, logout, refresh }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
