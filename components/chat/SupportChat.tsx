"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserChatPanel } from "@/components/chat/UserChatPanel";
import { useChatSocketOptional } from "@/components/chat/ChatSocketProvider";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";

export function SupportChat() {
  const router = useRouter();
  const { user, loading } = useUserAuth();
  const chat = useChatSocketOptional();

  const setChatActive = chat?.setChatActive;

  useEffect(() => {
    setChatActive?.(true);
    return () => setChatActive?.(false);
  }, [setChatActive]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.support)}`
      );
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        {loading ? "Loading…" : "Redirecting to sign in…"}
      </p>
    );
  }

  return <UserChatPanel />;
}
