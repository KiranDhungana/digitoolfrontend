"use client";

import { Loader2, Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/api/chat";
import { ChatMessageStatus } from "@/components/chat/ChatMessageStatus";
import { Button } from "@/components/ui/Button";

interface ChatThreadProps {
  messages: ChatMessage[];
  currentSide: "user" | "admin";
  onSend: (body: string) => Promise<void>;
  loading?: boolean;
  sending?: boolean;
  emptyHint?: string;
  /** Pre-fill compose box (e.g. product inquiry with link) */
  draftMessage?: string;
  onDraftApplied?: () => void;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatThread({
  messages,
  currentSide,
  onSend,
  loading,
  sending,
  emptyHint = "Send a message to start the conversation.",
  draftMessage,
  onDraftApplied,
}: ChatThreadProps) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const lastAppliedDraft = useRef<string | null>(null);

  useEffect(() => {
    if (!draftMessage) {
      lastAppliedDraft.current = null;
      return;
    }
    if (draftMessage === lastAppliedDraft.current) return;
    lastAppliedDraft.current = draftMessage;
    setText(draftMessage);
    onDraftApplied?.();
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    });
  }, [draftMessage, onDraftApplied]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const body = text.trim();
    if (!body) return;
    setError("");
    try {
      await onSend(body);
      setText("");
      lastAppliedDraft.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    }
  };

  return (
    <div className="flex h-[min(400px,55vh)] flex-col rounded-2xl border border-gray-200 bg-white shadow-sm sm:h-[min(520px,70vh)]">
      <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">{emptyHint}</p>
        ) : (
          messages.map((msg) => {
            const isMine =
              (currentSide === "user" && msg.sender === "user") ||
              (currentSide === "admin" && msg.sender === "admin");
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "bg-orange-500 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.body}</p>
                  <div
                    className={`mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs ${
                      isMine ? "justify-end text-orange-100" : "text-gray-500"
                    }`}
                  >
                    <span>{formatTime(msg.createdAt)}</span>
                    {isMine && (
                      <ChatMessageStatus
                        message={msg}
                        isMine
                        variant="light"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-gray-100 p-3"
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          rows={text.includes("\n") ? 4 : 2}
          className="max-h-32 min-h-[2.75rem] flex-1 resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          disabled={sending}
        />
        <Button type="submit" variant="secondary" disabled={sending || !text.trim()}>
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
      {error && (
        <p className="px-4 pb-3 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
