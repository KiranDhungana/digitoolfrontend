"use client";

import { MessageCircle } from "lucide-react";
import { ChatThread } from "@/components/chat/ChatThread";
import { useAdminChatSocket } from "@/hooks/useAdminChatSocket";

export default function AdminChatPage() {
  const {
    conversations,
    messages,
    activeUser,
    selectedUserId,
    connected,
    loadingList,
    loadingThread,
    error,
    selectUser,
    sending,
    sendReply,
  } = useAdminChatSocket();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support chat</h1>
          <p className="mt-1 text-gray-600">
            Reply to customers in real time via Socket.IO.
            {connected ? (
              <span className="ml-2 text-green-600">● Live</span>
            ) : (
              <span className="ml-2 text-amber-600">Connecting…</span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
          {error.includes("Chat is not ready") || error.includes("migrate")
            ? ""
            : " — run `npx prisma migrate deploy` and `npx prisma generate` on the backend, then restart the API."}
        </p>
      )}

      <div className="mt-6 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="max-h-[min(560px,75vh)] overflow-y-auto rounded-2xl border border-gray-200 bg-white">
          {loadingList ? (
            <p className="p-4 text-sm text-gray-500">Loading...</p>
          ) : conversations.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-500">
              No conversations yet.
            </p>
          ) : (
            <ul>
              {conversations.map((conv) => (
                <li key={conv.userId}>
                  <button
                    type="button"
                    onClick={() => selectUser(conv.userId)}
                    className={`w-full border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${
                      selectedUserId === conv.userId ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-gray-900">
                        {conv.user.name}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="shrink-0 rounded-full bg-orange-500 px-2 py-0.5 text-xs font-bold text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500">
                      {conv.user.email}
                    </p>
                    {conv.lastMessage && (
                      <p className="mt-1 truncate text-xs text-gray-600">
                        {conv.lastMessage.sender === "user" ? "" : "You: "}
                        {conv.lastMessage.body}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {selectedUserId && activeUser ? (
            <>
              <div className="mb-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <p className="font-semibold text-gray-900">{activeUser.name}</p>
                <p className="text-sm text-gray-600">{activeUser.email}</p>
                {activeUser.phone && (
                  <p className="text-sm text-gray-500">{activeUser.phone}</p>
                )}
              </div>
              <ChatThread
                messages={messages}
                currentSide="admin"
                onSend={sendReply}
                loading={loadingThread}
                sending={sending}
                emptyHint="No messages yet. Send a reply below."
              />
            </>
          ) : (
            <div className="flex h-[min(520px,70vh)] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-gray-500">
              <MessageCircle className="mb-3 h-10 w-10 text-gray-400" />
              <p className="text-sm">Select a conversation to reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
