"use client";

import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/lib/api/config";

type ChatRole = "user" | "admin";

interface ManagedSocket {
  socket: Socket;
  token: string;
  refs: number;
}

const pool = new Map<ChatRole, ManagedSocket>();

function createSocket(token: string): Socket {
  return io(API_URL, {
    auth: { token },
    transports: ["websocket"],
    upgrade: false,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
    timeout: 10000,
  });
}

/** One persistent Socket.IO connection per role (user / admin) */
export function acquireChatSocket(role: ChatRole, token: string): Socket {
  const existing = pool.get(role);
  if (existing && existing.token === token) {
    existing.refs += 1;
    return existing.socket;
  }

  if (existing) {
    existing.socket.removeAllListeners();
    existing.socket.disconnect();
  }

  const socket = createSocket(token);
  const managed = { socket, token, refs: 1 };
  pool.set(role, managed);
  return socket;
}

export function releaseChatSocket(role: ChatRole): void {
  const existing = pool.get(role);
  if (!existing) return;
  existing.refs -= 1;
  if (existing.refs <= 0) {
    existing.socket.removeAllListeners();
    existing.socket.disconnect();
    pool.delete(role);
  }
}

export function getChatSocketIfOpen(role: ChatRole): Socket | null {
  const existing = pool.get(role);
  if (existing?.socket.connected) return existing.socket;
  return null;
}
