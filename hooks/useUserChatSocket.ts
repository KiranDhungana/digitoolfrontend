"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/api/chat";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { getUserToken } from "@/lib/api/user";
import {
  connectChatSocket,
  releaseChatSocket,
  socketFetchHistory,
  socketMarkReadUser,
  socketSendUserMessage,
} from "@/lib/socket/chatSocket";
import type { Socket } from "socket.io-client";

function tempId() {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useUserChatSocket(enabled: boolean, chatActive: boolean) {
  const { user } = useUserAuth();
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const chatActiveRef = useRef(chatActive);
  chatActiveRef.current = chatActive;

  const markReadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyLoadedRef = useRef(false);

  const markRead = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    if (markReadTimer.current) clearTimeout(markReadTimer.current);
    markReadTimer.current = setTimeout(() => {
      void socketMarkReadUser(socket)
        .then(() => {
          setMessages((prev) =>
            prev.map((m) =>
              m.sender === "admin"
                ? { ...m, readAt: m.readAt ?? new Date().toISOString() }
                : m
            )
          );
        })
        .catch(() => {});
    }, 200);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      setMessages([]);
      setConnected(false);
      historyLoadedRef.current = false;
      return;
    }

    const token = getUserToken();
    if (!token) {
      setLoading(false);
      return;
    }

    historyLoadedRef.current = false;
    setLoading(true);
    setError("");

    const socket = connectChatSocket(token, "user");
    socketRef.current = socket;

    const onConnect = async () => {
      setConnected(true);
      setError("");
      try {
        const history = await socketFetchHistory(socket);
        historyLoadedRef.current = true;
        setMessages(history);
        if (chatActiveRef.current) markRead();
      } catch (err) {
        if (!historyLoadedRef.current) {
          setError(err instanceof Error ? err.message : "Failed to load chat");
        }
      } finally {
        setLoading(false);
      }
    };

    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        const withoutTemp = prev.filter(
          (m) => !m.id.startsWith("temp-") || m.body !== msg.body
        );
        return [...withoutTemp, msg];
      });
      if (msg.sender === "admin" && chatActiveRef.current) {
        markRead();
      }
    };

    const onRead = (payload: { sender?: string }) => {
      if (payload?.sender !== "user") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.sender === "user"
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
      setError(err.message || "Could not connect to chat");
      setLoading(false);
    });
    socket.on("chat:message", onMessage);
    socket.on("chat:read", onRead);

    return () => {
      if (markReadTimer.current) clearTimeout(markReadTimer.current);
      socket.off("connect", onConnect);
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("chat:message", onMessage);
      socket.off("chat:read", onRead);
      releaseChatSocket("user");
      socketRef.current = null;
    };
  }, [enabled, markRead]);

  useEffect(() => {
    if (chatActive && connected) {
      markRead();
    }
  }, [chatActive, connected, markRead]);

  const sendMessage = useCallback(async (body: string) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      throw new Error("Not connected to chat");
    }

    const optimistic: ChatMessage = {
      id: tempId(),
      userId: user?.id ?? "",
      sender: "user",
      body,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setSending(true);

    try {
      const msg = await socketSendUserMessage(socket, body);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== optimistic.id);
        if (filtered.some((m) => m.id === msg.id)) return filtered;
        return [...filtered, msg];
      });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      throw err;
    } finally {
      setSending(false);
    }
  }, []);

  const unreadCount = messages.filter((m) => m.sender === "admin" && !m.readAt).length;

  return {
    messages,
    connected,
    loading,
    error,
    unreadCount,
    sending,
    sendMessage,
    markRead,
  };
}
