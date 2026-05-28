import { API_URL, USER_TOKEN_KEY } from "@/lib/api/config";

export type ChatSender = "user" | "admin";

export interface ChatMessage {
  id: string;
  userId: string;
  sender: ChatSender;
  body: string;
  adminId?: string;
  readAt?: string;
  createdAt: string;
}

export interface ChatConversation {
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  lastMessage?: ChatMessage;
  unreadCount: number;
}

function userToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_TOKEN_KEY);
}

export async function fetchChatMessages(): Promise<ChatMessage[]> {
  const token = userToken();
  const res = await fetch(`${API_URL}/api/chat/messages`, {
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to load messages");
  return data as ChatMessage[];
}

export async function sendChatMessage(body: string): Promise<ChatMessage> {
  const token = userToken();
  const res = await fetch(`${API_URL}/api/chat/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ body }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Failed to send message");
  return data as ChatMessage;
}

export async function markChatRead(): Promise<void> {
  const token = userToken();
  const res = await fetch(`${API_URL}/api/chat/messages/read`, {
    method: "PATCH",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Failed to mark read");
  }
}
