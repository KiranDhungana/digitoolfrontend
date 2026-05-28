"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { useChatUnread } from "@/components/layout/ChatUnreadPoller";
import { ROUTES } from "@/lib/constants";

export function HeaderChatLink() {
  const { user, loading } = useUserAuth();
  const unread = useChatUnread();

  if (loading || !user) return null;

  return (
    <Link
      href={ROUTES.support}
      className="relative inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-orange-600"
      title="Support chat"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Support</span>
      {unread > 0 && (
        <span
          className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white ring-2 ring-white"
          aria-label={`${unread} unread messages`}
        >
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </Link>
  );
}
