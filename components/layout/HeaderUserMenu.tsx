"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";

export function HeaderUserMenu() {
  const { user, loading, logout } = useUserAuth();

  if (loading) {
    return (
      <span className="text-xs font-medium text-gray-400">...</span>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.account}
          className="inline-flex max-w-[140px] items-center gap-2 truncate text-xs font-bold tracking-wide text-gray-800 transition hover:text-orange-600 sm:max-w-[180px]"
          title={user.email}
        >
          <User className="h-4 w-4 shrink-0" />
          <span className="truncate">{user.name}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="cursor-pointer text-gray-500 transition hover:text-orange-600"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <Link
      href={ROUTES.login}
      className="inline-flex items-center gap-2 text-xs font-bold tracking-wide text-gray-800 transition hover:text-orange-600"
    >
      <User className="h-4 w-4" />
      LOG IN / REGISTER
    </Link>
  );
}
