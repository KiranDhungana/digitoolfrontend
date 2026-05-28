import { CheckCheck } from "lucide-react";
import type { ChatMessage } from "@/lib/api/chat";

interface ChatMessageStatusProps {
  message: ChatMessage;
  isMine: boolean;
  variant?: "light" | "dark";
}

/** Read receipt on sent messages when the other party has read them */
export function ChatMessageStatus({
  message,
  isMine,
  variant = "light",
}: ChatMessageStatusProps) {
  if (!isMine || !message.readAt) return null;

  const className =
    variant === "light"
      ? "text-orange-100"
      : "text-gray-500";

  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      title="Seen"
      aria-label="Seen"
    >
      <CheckCheck className="h-3.5 w-3.5 shrink-0" strokeWidth={2.25} />
      <span className="text-[10px] font-medium uppercase tracking-wide">Seen</span>
    </span>
  );
}
