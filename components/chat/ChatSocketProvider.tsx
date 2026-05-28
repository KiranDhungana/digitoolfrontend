"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { useUserChatSocket } from "@/hooks/useUserChatSocket";
import type { ChatMessage } from "@/lib/api/chat";
import {
  buildProductInquiryMessage,
  consumePendingProductInquiry,
  type PendingProductInquiry,
} from "@/lib/product-inquiry";

type ChatSocketValue = ReturnType<typeof useUserChatSocket> & {
  setChatActive: (active: boolean) => void;
  widgetOpen: boolean;
  setWidgetOpen: (open: boolean) => void;
  messageDraft: string;
  clearMessageDraft: () => void;
  openProductInquiry: (product: PendingProductInquiry) => void;
};

const ChatSocketContext = createContext<ChatSocketValue | null>(null);

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useUserAuth();
  const [chatActive, setChatActive] = useState(false);
  const [widgetOpen, setWidgetOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const socket = useUserChatSocket(Boolean(user) && !loading, chatActive);

  const clearMessageDraft = useCallback(() => {
    setMessageDraft("");
  }, []);

  const openProductInquiry = useCallback((product: PendingProductInquiry) => {
    setMessageDraft(buildProductInquiryMessage(product));
    setWidgetOpen(true);
    setChatActive(true);
  }, []);

  const setChatActiveStable = useCallback((active: boolean) => {
    setChatActive(active);
  }, []);

  useEffect(() => {
    if (!user || loading) return;
    const pending = consumePendingProductInquiry();
    if (pending) {
      openProductInquiry(pending);
    }
  }, [user, loading, openProductInquiry]);

  const value: ChatSocketValue = {
    ...socket,
    setChatActive: setChatActiveStable,
    widgetOpen,
    setWidgetOpen,
    messageDraft,
    clearMessageDraft,
    openProductInquiry,
  };

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocket() {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) {
    throw new Error("useChatSocket must be used within ChatSocketProvider");
  }
  return ctx;
}

export function useChatSocketOptional(): ChatSocketValue | null {
  return useContext(ChatSocketContext);
}

export type { ChatMessage };
