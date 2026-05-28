"use client";

import { MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { UserChatPanel } from "@/components/chat/UserChatPanel";
import { useChatSocketOptional } from "@/components/chat/ChatSocketProvider";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";

export function ChatWidget() {
  const pathname = usePathname();
  const { user, loading } = useUserAuth();
  const chat = useChatSocketOptional();
  const unread = chat?.unreadCount ?? 0;
  const open = chat?.widgetOpen ?? false;
  const setOpen = chat?.setWidgetOpen;

  const setChatActive = chat?.setChatActive;

  useEffect(() => {
    if (pathname === ROUTES.support) return;
    setChatActive?.(open);
    return () => setChatActive?.(false);
  }, [open, pathname, setChatActive]);

  if (
    loading ||
    !user ||
    pathname.startsWith("/admin") ||
    pathname === ROUTES.support
  ) {
    return null;
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 cursor-pointer bg-black/30"
            aria-label="Close chat"
            onClick={() => setOpen?.(false)}
          />
          <div className="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 bg-orange-500 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h2 className="font-semibold">Support chat</h2>
                {chat?.connected && (
                  <span className="text-xs text-orange-100">● Live</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={ROUTES.support}
                  className="text-xs text-orange-100 hover:text-white hover:underline"
                  onClick={() => setOpen?.(false)}
                >
                  Open full page
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen?.(false)}
                  className="cursor-pointer rounded-lg p-1 hover:bg-orange-600"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <UserChatPanel compact />
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen?.(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-600 hover:shadow-xl"
        aria-label={open ? "Close support chat" : "Open support chat"}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircle className="h-6 w-6" />
            {unread > 0 && (
              <span
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold leading-none text-white ring-2 ring-orange-500"
                aria-label={`${unread} unread messages`}
              >
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
