"use client";

import type { Socket } from "socket.io-client";
import type { ChatConversation, ChatMessage } from "@/lib/api/chat";
import { acquireChatSocket } from "@/lib/socket/chatConnection";

type Ack<T> = (response: T) => void;

const ACK_TIMEOUT_MS = 12_000;

function emitAck<T>(
  socket: Socket,
  event: string,
  payload?: unknown
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Chat request timed out"));
    }, ACK_TIMEOUT_MS);

    const handler: Ack<T> = (res) => {
      window.clearTimeout(timer);
      if (
        res &&
        typeof res === "object" &&
        "ok" in res &&
        !(res as { ok: boolean }).ok
      ) {
        reject(
          new Error((res as { error?: string }).error || "Socket request failed")
        );
      } else {
        resolve(res);
      }
    };

    if (payload !== undefined) {
      socket.emit(event, payload, handler);
    } else {
      socket.emit(event, handler);
    }
  });
}

export function connectChatSocket(token: string, role: "user" | "admin" = "user"): Socket {
  return acquireChatSocket(role, token);
}

export { releaseChatSocket, getChatSocketIfOpen } from "@/lib/socket/chatConnection";

export async function socketFetchHistory(socket: Socket): Promise<ChatMessage[]> {
  const res = await emitAck<{ ok: boolean; messages: ChatMessage[] }>(
    socket,
    "chat:history"
  );
  return res.messages;
}

export async function socketSendUserMessage(
  socket: Socket,
  body: string
): Promise<ChatMessage> {
  const res = await emitAck<{ ok: boolean; message: ChatMessage }>(socket, "chat:send", {
    body,
  });
  return res.message;
}

export async function socketMarkReadUser(socket: Socket): Promise<void> {
  await emitAck(socket, "chat:read");
}

export async function socketFetchConversations(
  socket: Socket
): Promise<ChatConversation[]> {
  const res = await emitAck<{ ok: boolean; conversations: ChatConversation[] }>(
    socket,
    "chat:conversations"
  );
  return res.conversations;
}

export async function socketFetchAdminThread(
  socket: Socket,
  userId: string
): Promise<{ user: ChatConversation["user"]; messages: ChatMessage[] }> {
  const res = await emitAck<{
    ok: boolean;
    user: ChatConversation["user"];
    messages: ChatMessage[];
  }>(socket, "chat:history", { userId });
  return { user: res.user, messages: res.messages };
}

export async function socketSendAdminMessage(
  socket: Socket,
  userId: string,
  body: string
): Promise<ChatMessage> {
  const res = await emitAck<{ ok: boolean; message: ChatMessage }>(socket, "chat:send", {
    userId,
    body,
  });
  return res.message;
}

export async function socketMarkReadAdmin(
  socket: Socket,
  userId: string
): Promise<void> {
  await emitAck(socket, "chat:read", { userId });
}
