"use client";

import { useEffect, useState } from "react";
import { getAdminToken } from "@/lib/api/admin";
import type { ChatConversation } from "@/lib/api/chat";
import {
  connectChatSocket,
  releaseChatSocket,
} from "@/lib/socket/chatSocket";

/** Shares the admin chat socket (no extra connection) */
export function AdminChatNavBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;

    const socket = connectChatSocket(token, "admin");

    const refresh = () => {
      socket.emit("chat:conversations", (res: {
        ok: boolean;
        conversations?: ChatConversation[];
      }) => {
        if (res.ok && res.conversations) {
          setCount(
            res.conversations.reduce((sum, c) => sum + c.unreadCount, 0)
          );
        }
      });
    };

    socket.on("connect", refresh);
    socket.on("chat:conversations_changed", refresh);
    socket.on("chat:message", refresh);

    if (socket.connected) refresh();

    return () => {
      socket.off("connect", refresh);
      socket.off("chat:conversations_changed", refresh);
      socket.off("chat:message", refresh);
      releaseChatSocket("admin");
    };
  }, []);

  if (count <= 0) return null;

  return (
    <span className="ml-auto rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
