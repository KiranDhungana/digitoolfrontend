"use client";

import { Package, FolderTree, Store, Users, ImageIcon, ClipboardList, Inbox, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminStats, type DashboardStats } from "@/lib/api/admin";

function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <Icon className="h-5 w-5 text-orange-500" />
      </div>
      <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminStats()
      .then(setStats)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-gray-600">
        Overview of your marketplace catalogue.
      </p>
      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}. Is the API running on port 4000?
        </p>
      )}
      {stats && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total products"
            value={stats.products}
            icon={Package}
            href="/admin/products"
          />
          <StatCard
            label="Active products"
            value={stats.activeProducts}
            icon={Package}
            href="/admin/products"
          />
          <StatCard
            label="Categories"
            value={stats.categories}
            icon={FolderTree}
            href="/admin/categories"
          />
          <StatCard
            label="Brands"
            value={stats.brands}
            icon={Store}
            href="/admin/brands"
          />
          <StatCard
            label="Images"
            value={stats.media}
            icon={ImageIcon}
            href="/admin/media"
          />
          <StatCard
            label="Pending payments"
            value={stats.pendingOrders ?? 0}
            icon={ClipboardList}
            href="/admin/orders"
          />
          <StatCard
            label="New contact messages"
            value={stats.newContactMessages ?? 0}
            icon={Inbox}
            href="/admin/contact"
          />
          <StatCard
            label="Unread chats"
            value={stats.unreadChats ?? 0}
            icon={MessageCircle}
            href="/admin/chat"
          />
        </div>
      )}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-gray-500" />
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{stats?.admins ?? 0}</span>{" "}
            superadmin account(s) configured.
          </p>
        </div>
      </div>
    </div>
  );
}
