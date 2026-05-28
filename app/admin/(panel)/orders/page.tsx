"use client";

import { Check, Eye, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  type Order,
} from "@/lib/api/admin";
import { formatPrice } from "@/lib/currency";
import { deliveryChannelLabel, type DeliveryChannel } from "@/lib/deliveryChannels";

const statusStyles: Record<Order["status"], string> = {
  pending_verification: "bg-amber-100 text-amber-800",
  verified: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-700",
};

const statusLabels: Record<Order["status"], string> = {
  pending_verification: "Pending verification",
  verified: "Verified",
  rejected: "Rejected",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<string>("pending_verification");
  const [selected, setSelected] = useState<Order | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [error, setError] = useState("");
  const [acting, setActing] = useState(false);

  const load = useCallback(() => {
    adminListOrders({
      status: filter || undefined,
      limit: 50,
    })
      .then((res) => setOrders(res.items))
      .catch((e) => setError(e.message));
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  const openOrder = (order: Order) => {
    setSelected(order);
    setAdminNote(order.adminNote ?? "");
    setError("");
  };

  const handleStatus = async (status: "verified" | "rejected") => {
    if (!selected) return;
    setActing(true);
    setError("");
    try {
      await adminUpdateOrderStatus(selected.id, {
        status,
        adminNote: adminNote.trim() || undefined,
      });
      setSelected(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">
            Verify Fonepay screenshots and approve or reject orders.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
        >
          <option value="pending_verification">Pending verification</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
          <option value="">All orders</option>
        </select>
      </div>

      {error && !selected && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No orders in this filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">
                    {order.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">
                      {order.user?.name ?? "—"}
                    </p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {formatPrice(order.subtotal)}
                  </td>
                  <td className="px-4 py-3 capitalize">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700"
                    >
                      <Eye className="h-4 w-4" />
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        title="Verify payment"
        open={!!selected}
        onClose={() => !acting && setSelected(null)}
      >
        {selected && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Customer:</strong> {selected.user?.name} ({selected.user?.email})
              </p>
              {selected.user?.phone && (
                <p>
                  <strong>Phone:</strong> {selected.user.phone}
                </p>
              )}
              <p>
                <strong>Total:</strong> {formatPrice(selected.subtotal)}
              </p>
              {selected.paymentReference && (
                <p>
                  <strong>Reference:</strong> {selected.paymentReference}
                </p>
              )}
              <p>
                <strong>Delivery:</strong>{" "}
                {deliveryChannelLabel(
                  (selected.deliveryChannel ?? "chat") as DeliveryChannel
                )}
                {selected.deliveryContact
                  ? ` — ${selected.deliveryContact}`
                  : selected.deliveryChannel === "chat"
                    ? " (in-app chat)"
                    : ""}
              </p>
            </div>

            <ul className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
              {selected.items.map((line, i) => (
                <li key={i} className="flex justify-between gap-2 py-1">
                  <span>
                    {line.productName} × {line.quantity}
                  </span>
                  <span>{formatPrice(line.lineTotal)}</span>
                </li>
              ))}
            </ul>

            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Payment screenshot
              </p>
              <a
                href={selected.paymentScreenshotUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block h-64 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
              >
                <Image
                  src={selected.paymentScreenshotUrl}
                  alt="Payment screenshot"
                  fill
                  className="object-contain"
                  sizes="400px"
                />
              </a>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Admin note (optional)
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
                placeholder="Note to customer or internal"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {selected.status === "pending_verification" ? (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  disabled={acting}
                  onClick={() => handleStatus("verified")}
                >
                  <Check className="h-4 w-4" />
                  Verify payment
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 text-red-600 hover:bg-red-50"
                  disabled={acting}
                  onClick={() => handleStatus("rejected")}
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                This order is already {statusLabels[selected.status].toLowerCase()}.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
