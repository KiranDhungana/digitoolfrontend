"use client";

import {
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  LogOut,
  Package,
  ClipboardList,
  Inbox,
  MessageCircle,
  Store,
  ExternalLink,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminChatNavBadge } from "@/components/admin/AdminChatNavBadge";
import { AdminContactNavBadge } from "@/components/admin/AdminContactNavBadge";
import { useAdminAuth } from "@/components/admin/AdminAuthProvider";
import { SiteLogo } from "@/components/layout/SiteLogo";
import { ROUTES } from "@/lib/constants";
import { SITE_DOMAIN } from "@/lib/site";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/referrals", label: "Referrals", icon: Wallet },
  { href: "/admin/contact", label: "Contact", icon: Inbox },
  { href: "/admin/chat", label: "Support chat", icon: MessageCircle },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/brands", label: "Brands", icon: Store },
  { href: "/admin/media", label: "Images", icon: ImageIcon },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAdminAuth();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-gray-800 bg-gray-950 text-white">
      <div className="border-b border-gray-800 p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-orange-400">
          Superadmin
        </p>
        <div className="mt-3">
          <SiteLogo
            href={ROUTES.home}
            imageClassName="h-8 w-auto max-w-full object-contain"
          />
        </div>
        <p className="mt-2 text-xs text-gray-500">{SITE_DOMAIN}</p>
        {admin && (
          <p className="mt-2 truncate text-sm text-gray-400">{admin.email}</p>
        )}
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{label}</span>
              {href === "/admin/contact" && <AdminContactNavBadge />}
              {href === "/admin/chat" && <AdminChatNavBadge />}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-gray-800 p-3">
        <Link
          href={ROUTES.home}
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" />
          View storefront
        </Link>
        <button
          type="button"
          onClick={logout}
          className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
