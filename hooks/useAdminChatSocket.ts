"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatConversation, ChatMessage } from "@/lib/api/chat";
import { getAdminToken } from "@/lib/api/admin";
import {
  connectChatSocket,
  releaseChatSocket,
  socketFetchAdminThread,
  socketFetchConversations,
  socketMarkReadAdmin,
  socketSendAdminMessage,
} from "@/lib/socket/chatSocket";
import type { Socket } from "socket.io-client";

function tempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useAdminChatSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUser, setActiveUser] = useState<ChatConversation["user"] | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const selectedUserIdRef = useRef<string | null>(null);
  selectedUserIdRef.current = selectedUserId;

  const refreshConversations = useCallback(async (socket: Socket) => {
    const list = await socketFetchConversations(socket);
    setConversations(list);
    return list;
  }, []);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      setLoadingList(false);
      setError("Not authenticated");
      return;
    }

    const socket = connectChatSocket(token, "admin");
    socketRef.current = socket;

    const onConnect = async () => {
      setConnected(true);
      setError("");
      try {
        await refreshConversations(socket);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load conversations");
      } finally {
        setLoadingList(false);
      }
    };

    const onConversationsChanged = () => {
      refreshConversations(socket).catch(() => {});
    };

    const onMessage = (msg: ChatMessage & { userId?: string }) => {
      const uid = msg.userId;
      if (uid && selectedUserIdRef.current === uid) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          const filtered = prev.filter(
            (m) => !m.id.startsWith("temp-") || m.body !== msg.body
          );
          return [...filtered, msg];
        });
      }
      onConversationsChanged();
    };

    const onRead = (payload: { userId?: string; sender?: string }) => {
      if (payload?.sender !== "admin") return;
      if (payload.userId && payload.userId !== selectedUserIdRef.current) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === "admin"
            ? { ...m, readAt: m.readAt ?? new Date().toISOString() }
            : m
        )
      );
    };

    if (socket.connected) {
      void onConnect();
    } else {
      socket.on("connect", onConnect);
    }

    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err) => {
      setError(err.message);
      setLoadingList(false);
    });
    socket.on("chat:conversations_changed", onConversationsChanged);
    socket.on("chat:message", onMessage);
    socket.on("chat:read", onRead);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("chat:conversations_changed", onConversationsChanged);
      socket.off("chat:message", onMessage);
      socket.off("chat:read", onRead);
      releaseChatSocket("admin");
      socketRef.current = null;
    };
  }, [refreshConversations]);

  const selectUser = useCallback(
    async (userId: string) => {
      const socket = socketRef.current;
      if (!socket?.connected) return;

      setSelectedUserId(userId);
      setLoadingThread(true);
      setError("");
      try {
        const data = await socketFetchAdminThread(socket, userId);
        setMessages(data.messages);
        setActiveUser(data.user);
        setLoadingThread(false);
        void socketMarkReadAdmin(socket, userId).then(() =>
          refreshConversations(socket)
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load thread");
        setLoadingThread(false);
      }
    },
    [refreshConversations]
  );

  const sendReply = useCallback(
    async (body: string) => {
      if (!selectedUserId) return;
      const socket = socketRef.current;
      if (!socket?.connected) throw new Error("Not connected");

      const optimistic: ChatMessage = {
        id: tempId(),
        userId: selectedUserId,
        sender: "admin",
        body,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);
      setSending(true);
      try {
        const msg = await socketSendAdminMessage(socket, selectedUserId, body);
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== optimistic.id);
          if (filtered.some((m) => m.id === msg.id)) return filtered;
          return [...filtered, msg];
        });
        void refreshConversations(socket);
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        throw err;
      } finally {
        setSending(false);
      }
    },
    [selectedUserId, refreshConversations]
  );

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return {
    conversations,
    messages,
    activeUser,
    selectedUserId,
    connected,
    loadingList,
    loadingThread,
    error,
    totalUnread,
    sending,
    selectUser,
    sendReply,
  };
}
