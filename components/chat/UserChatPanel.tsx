"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ChatThread } from "@/components/chat/ChatThread";
import { useChatSocketOptional } from "@/components/chat/ChatSocketProvider";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface UserChatPanelProps {
  allowGuest?: boolean;
  compact?: boolean;
  onUnreadChange?: (count: number) => void;
}

export function UserChatPanel({
  allowGuest = false,
  compact = false,
  onUnreadChange,
}: UserChatPanelProps) {
  const { user, loading: authLoading } = useUserAuth();
  const chat = useChatSocketOptional();

  useEffect(() => {
    onUnreadChange?.(chat?.unreadCount ?? 0);
  }, [chat?.unreadCount, onUnreadChange]);

  if (authLoading) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">Loading chat...</p>
    );
  }

  if (!user) {
    if (!allowGuest) {
      return (
        <p className="py-8 text-center text-sm text-gray-500">Loading chat...</p>
      );
    }
    return (
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
        <p className="text-sm text-gray-600">
          Sign in to message our support team.
        </p>
        <Link
          href={`${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.support)}`}
          className="mt-4 inline-block"
        >
          <Button variant="secondary">Log in to chat</Button>
        </Link>
      </div>
    );
  }

  const displayError =
    chat?.error ||
    (!chat?.loading && chat && !chat.connected
      ? "Could not connect to chat. Run `npx prisma migrate deploy` and `npx prisma generate` on the backend, then restart the API."
      : "");

  return (
    <div className={compact ? "" : "mx-auto max-w-2xl"}>
      {!compact && (
        <p className="mb-4 text-sm text-gray-600">
          Message our support team in real time.
          {chat?.connected && (
            <span className="ml-2 inline-flex items-center text-green-600">
              ● Live
            </span>
          )}
        </p>
      )}
      {displayError && (
        <p className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {displayError}
        </p>
      )}
      <ChatThread
        messages={chat?.messages ?? []}
        currentSide="user"
        onSend={chat?.sendMessage ?? (async () => {})}
        loading={chat?.loading ?? true}
        sending={chat?.sending ?? false}
        emptyHint="Ask about orders, payments, or gift cards — we're here to help."
        draftMessage={chat?.messageDraft}
        onDraftApplied={chat?.clearMessageDraft}
      />
      {!compact && (
        <p className="mt-4 text-center text-sm text-gray-500">
          Prefer email?{" "}
          <Link href={ROUTES.contact} className="text-orange-600 hover:underline">
            Contact us
          </Link>
        </p>
      )}
    </div>
  );
}
