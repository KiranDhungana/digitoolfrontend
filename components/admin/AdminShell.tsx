"use client";

import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main>
    </div>
  );
}
