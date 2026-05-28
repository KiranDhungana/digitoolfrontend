"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MessageCircle,
  Package,
  Phone,
  ShoppingBag,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { AccountSpendingChart } from "@/components/account/AccountSpendingChart";
import { ReferralProgram } from "@/components/account/ReferralProgram";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { fetchMyOrders, type Order } from "@/lib/api/orders";
import { updateCurrentUser } from "@/lib/api/user";
import {
  computeAccountOrderStats,
  orderStatusLabel,
  orderStatusStyle,
} from "@/lib/accountStats";
import { deliveryChannelLabel } from "@/lib/deliveryChannels";
import { formatPrice } from "@/lib/currency";
import { ROUTES } from "@/lib/constants";
import {
  DELIVERY_CHANNELS,
  type DeliveryChannel,
} from "@/lib/deliveryChannels";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent = "text-orange-500",
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold text-gray-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
        </div>
        <div className={`rounded-xl bg-orange-50 p-2.5 ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function formatMemberSince(iso?: string): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function orderItemSummary(order: Order): string {
  const names = order.items
    .slice(0, 2)
    .map((l) => l.productName)
    .join(", ");
  const extra = order.items.length > 2 ? ` +${order.items.length - 2} more` : "";
  return names + extra || "Order";
}

export function AccountView() {
  const router = useRouter();
  const { user, loading, logout, refresh } = useUserAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [deliveryWhatsapp, setDeliveryWhatsapp] = useState("");
  const [deliveryTelegram, setDeliveryTelegram] = useState("");
  const [deliveryViber, setDeliveryViber] = useState("");
  const [defaultDeliveryChannel, setDefaultDeliveryChannel] =
    useState<DeliveryChannel>("chat");

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `${ROUTES.login}?redirect=${encodeURIComponent(ROUTES.account)}`
      );
    }
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
      setDeliveryWhatsapp(user.deliveryWhatsapp ?? "");
      setDeliveryTelegram(user.deliveryTelegram ?? "");
      setDeliveryViber(user.deliveryViber ?? "");
      setDefaultDeliveryChannel(user.defaultDeliveryChannel ?? "chat");
      setOrdersLoading(true);
      fetchMyOrders()
        .then(setOrders)
        .catch(() => setOrders([]))
        .finally(() => setOrdersLoading(false));
    }
  }, [loading, user, router]);

  const stats = useMemo(() => computeAccountOrderStats(orders), [orders]);
  const memberSince = formatMemberSince(user?.createdAt);
  const initials = user?.name
    ?.split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await updateCurrentUser({
        name: name.trim(),
        phone: phone.trim() || undefined,
        defaultDeliveryChannel,
        deliveryWhatsapp: deliveryWhatsapp.trim() || null,
        deliveryTelegram: deliveryTelegram.trim() || null,
        deliveryViber: deliveryViber.trim() || null,
      });
      await refresh();
      setMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <p className="text-gray-500">Loading your account...</p>;
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-xl font-bold text-white shadow-lg shadow-orange-500/30"
            aria-hidden
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-orange-400" />
                {user.email}
              </span>
              {user.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-orange-400" />
                  {user.phone}
                </span>
              )}
              {memberSince && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-orange-400" />
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>
          <Link href={ROUTES.support} className="shrink-0">
            <Button
              variant="secondary"
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <MessageCircle className="h-4 w-4" />
              Get support
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total orders"
          value={ordersLoading ? "—" : String(stats.totalOrders)}
          sub="All time"
          icon={Package}
        />
        <StatCard
          label="Total spend"
          value={ordersLoading ? "—" : formatPrice(stats.totalSpend)}
          sub="Confirmed payments only"
          icon={TrendingUp}
        />
        <StatCard
          label="Confirmed"
          value={ordersLoading ? "—" : String(stats.verifiedCount)}
          sub={
            stats.verifiedCount > 0
              ? `Avg ${formatPrice(stats.averageOrder)} per order`
              : "No verified orders yet"
          }
          icon={CheckCircle2}
          accent="text-green-600"
        />
        <StatCard
          label="Pending"
          value={ordersLoading ? "—" : String(stats.pendingCount)}
          sub={
            stats.rejectedCount > 0
              ? `${stats.rejectedCount} rejected`
              : "Awaiting verification"
          }
          icon={stats.pendingCount > 0 ? Clock : XCircle}
          accent={
            stats.pendingCount > 0 ? "text-amber-600" : "text-gray-500"
          }
        />
      </section>

      <AccountSpendingChart monthly={stats.monthly} />

      <ReferralProgram />

      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order history</h2>
            <p className="text-sm text-gray-600">
              Track payment verification and delivery status
            </p>
          </div>
          <Link href={ROUTES.giftCards}>
            <Button variant="secondary" className="text-sm">
              <ShoppingBag className="h-4 w-4" />
              Shop gift cards
            </Button>
          </Link>
        </div>

        {ordersLoading ? (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            Loading orders...
          </p>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 font-medium text-gray-900">No orders yet</p>
            <p className="mt-1 text-sm text-gray-600">
              Your purchases will appear here after checkout.
            </p>
            <Link href={ROUTES.giftCards} className="mt-4 inline-block">
              <Button variant="secondary">Browse gift cards</Button>
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">
                    {orderItemSummary(order)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                    {" · "}
                    <span className="font-mono">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    {" · "}
                    <span className="capitalize">{order.paymentMethod}</span>
                    {" · "}
                    {deliveryChannelLabel(order.deliveryChannel ?? "chat")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${orderStatusStyle[order.status]}`}
                  >
                    {orderStatusLabel[order.status]}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Edit profile</h2>
            <p className="mt-1 text-sm text-gray-600">
              Email cannot be changed. Update your name or phone for orders.
            </p>
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <Input label="Email" value={user.email} disabled />
              <Input
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Phone number (optional)"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-900">
                  Default delivery at checkout
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Pre-fills your preferred channel for order delivery.
                </p>
                <select
                  value={defaultDeliveryChannel}
                  onChange={(e) =>
                    setDefaultDeliveryChannel(e.target.value as DeliveryChannel)
                  }
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm"
                >
                  {DELIVERY_CHANNELS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Input
                    label="WhatsApp"
                    type="tel"
                    value={deliveryWhatsapp}
                    onChange={(e) => setDeliveryWhatsapp(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                  />
                  <Input
                    label="Telegram phone"
                    type="tel"
                    value={deliveryTelegram}
                    onChange={(e) => setDeliveryTelegram(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                  />
                  <Input
                    label="Viber"
                    type="tel"
                    value={deliveryViber}
                    onChange={(e) => setDeliveryViber(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>
              </div>
              {message && (
                <p className="text-sm text-green-600">{message}</p>
              )}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" variant="secondary" disabled={saving}>
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">Quick links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.giftCards}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Browse gift cards
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.support}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Support chat
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.howItWorks}
                  className="text-orange-600 hover:text-orange-700"
                >
                  How it works
                </Link>
              </li>
            </ul>
          </div>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-gray-600"
            onClick={() => {
              logout();
              router.push(ROUTES.home);
            }}
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
