"use client";

import { Archive, Eye, Mail, MailOpen } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import {
  adminListContactMessages,
  adminUpdateContactMessage,
  type ContactMessage,
  type ContactMessageStatus,
} from "@/lib/api/admin";

const statusStyles: Record<ContactMessageStatus, string> = {
  new: "bg-orange-100 text-orange-800",
  read: "bg-gray-100 text-gray-700",
  archived: "bg-slate-100 text-slate-600",
};

const statusLabels: Record<ContactMessageStatus, string> = {
  new: "New",
  read: "Read",
  archived: "Archived",
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filter, setFilter] = useState<string>("new");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);

  const load = useCallback(() => {
    adminListContactMessages({
      status: (filter || undefined) as ContactMessageStatus | undefined,
      limit: 50,
    })
      .then((res) => setMessages(res.items))
      .catch((e) => setError(e.message));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    setError("");
    if (msg.status === "new") {
      try {
        const updated = await adminUpdateContactMessage(msg.id, "read");
        setSelected(updated);
        load();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Update failed");
      }
    }
  };

  const setStatus = async (status: ContactMessageStatus) => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      const updated = await adminUpdateContactMessage(selected.id, status);
      setSelected(updated);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact messages</h1>
          <p className="text-gray-600">
            Messages submitted from the storefront contact form.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
        >
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="archived">Archived</option>
          <option value="">All</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {messages.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No messages in this filter.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <li key={msg.id}>
                <button
                  type="button"
                  onClick={() => openMessage(msg)}
                  className="cursor-pointer flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
                >
                  <Mail
                    className={`mt-0.5 h-5 w-5 shrink-0 ${
                      msg.status === "new" ? "text-orange-500" : "text-gray-400"
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {msg.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[msg.status]}`}
                      >
                        {statusLabels[msg.status]}
                      </span>
                    </div>
                    <p className="truncate text-sm text-gray-600">{msg.email}</p>
                    <p className="mt-1 truncate text-sm text-gray-800">
                      {msg.subject || "(No subject)"} — {msg.message.slice(0, 80)}
                      {msg.message.length > 80 ? "…" : ""}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {formatWhen(msg.createdAt)}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.subject || "Contact message"}
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-xl bg-gray-50 p-4 text-sm">
              <p>
                <span className="font-medium text-gray-700">From:</span>{" "}
                {selected.name}
              </p>
              <p className="mt-1">
                <span className="font-medium text-gray-700">Email:</span>{" "}
                <a
                  href={`mailto:${selected.email}`}
                  className="text-orange-600 hover:underline"
                >
                  {selected.email}
                </a>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Received {formatWhen(selected.createdAt)}
              </p>
            </div>
            <div className="whitespace-pre-wrap rounded-xl border border-gray-100 bg-white p-4 text-sm text-gray-800">
              {selected.message}
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.status !== "read" && (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={acting}
                  onClick={() => setStatus("read")}
                >
                  <MailOpen className="h-4 w-4" />
                  Mark read
                </Button>
              )}
              {selected.status !== "new" && (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={acting}
                  onClick={() => setStatus("new")}
                >
                  <Eye className="h-4 w-4" />
                  Mark new
                </Button>
              )}
              {selected.status !== "archived" && (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={acting}
                  onClick={() => setStatus("archived")}
                >
                  <Archive className="h-4 w-4" />
                  Archive
                </Button>
              )}
              <a href={`mailto:${selected.email}`} className="ml-auto">
                <Button type="button">Reply by email</Button>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
