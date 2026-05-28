"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import {
  adminListReferralWithdrawals,
  adminUpdateReferralWithdrawal,
  type ReferralWithdrawalAdmin,
  type ReferralWithdrawalStatus,
} from "@/lib/api/admin";
import { formatPrice } from "@/lib/currency";

const statusStyles: Record<ReferralWithdrawalStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminReferralsPage() {
  const [items, setItems] = useState<ReferralWithdrawalAdmin[]>([]);
  const [filter, setFilter] = useState<string>("pending");
  const [selected, setSelected] = useState<ReferralWithdrawalAdmin | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);

  const load = useCallback(() => {
    adminListReferralWithdrawals({
      status: (filter || undefined) as ReferralWithdrawalStatus | undefined,
      limit: 50,
    })
      .then((res) => setItems(res.items))
      .catch((e) => setError(e.message));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const process = async (status: "completed" | "rejected") => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      await adminUpdateReferralWithdrawal(selected.id, {
        status,
        adminNote: adminNote.trim() || undefined,
      });
      setSelected(null);
      setAdminNote("");
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
          <h1 className="text-2xl font-bold text-gray-900">Referral withdrawals</h1>
          <p className="text-gray-600">
            Approve or reject payout requests from the referral program.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {items.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-gray-500">
            No withdrawal requests in this filter.
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {items.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(w);
                    setAdminNote("");
                    setError("");
                  }}
                  className="flex w-full flex-col gap-2 px-6 py-4 text-left hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{w.user.name}</p>
                    <p className="text-sm text-gray-600">{w.user.email}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(w.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[w.status]}`}
                    >
                      {w.status}
                    </span>
                    <span className="font-bold text-gray-900">
                      {formatPrice(w.amount)}
                    </span>
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
        title="Withdrawal request"
      >
        {selected && (
          <div className="space-y-4 text-sm">
            <p>
              <strong>User:</strong> {selected.user.name} ({selected.user.email})
            </p>
            {selected.user.phone && (
              <p>
                <strong>Phone:</strong> {selected.user.phone}
              </p>
            )}
            <p>
              <strong>Amount:</strong> {formatPrice(selected.amount)}
            </p>
            <p>
              <strong>Payout details:</strong> {selected.payoutNote || "—"}
            </p>
            {selected.status === "pending" && (
              <>
                <label className="block">
                  <span className="font-medium text-gray-900">Admin note (optional)</span>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2"
                    rows={2}
                  />
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    disabled={acting}
                    onClick={() => process("completed")}
                  >
                    Mark paid
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600"
                    disabled={acting}
                    onClick={() => process("rejected")}
                  >
                    Reject (refund balance)
                  </Button>
                </div>
              </>
            )}
            {selected.adminNote && (
              <p className="text-gray-600">
                <strong>Note:</strong> {selected.adminNote}
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
