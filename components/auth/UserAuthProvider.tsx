"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  clearUserToken,
  fetchCurrentUser,
  getUserToken,
  type User,
} from "@/lib/api/user";

interface UserAuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<User | null>;
  logout: () => void;
}

const UserAuthContext = createContext<UserAuthContextValue | null>(null);

export function UserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<User | null> => {
    if (!getUserToken()) {
      setUser(null);
      return null;
    }
    try {
      const current = await fetchCurrentUser();
      setUser(current);
      return current;
    } catch {
      setUser(null);
      clearUserToken();
      return null;
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const logout = () => {
    clearUserToken();
    setUser(null);
  };

  return (
    <UserAuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return ctx;
}
