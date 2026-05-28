"use client";

import { useChatSocketOptional } from "@/components/chat/ChatSocketProvider";

/** Unread admin messages via shared Socket.IO connection */
export function useChatUnread() {
  const chat = useChatSocketOptional();
  return chat?.unreadCount ?? 0;
}
