"use client";

import Link from "next/link";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";

const supportLinks = [
  { label: "Support chat", href: ROUTES.support, requiresAuth: true },
  { label: "Help center", href: ROUTES.contact, requiresAuth: false },
  { label: "How it works", href: ROUTES.howItWorks, requiresAuth: false },
  { label: "Contact us", href: ROUTES.contact, requiresAuth: false },
] as const;

export function FooterSupportLinks() {
  const { user, loading } = useUserAuth();

  const links = supportLinks.filter(
    (link) => !link.requiresAuth || (!loading && user)
  );

  return (
    <ul className="mt-4 space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            href={link.href}
            className="text-sm text-gray-600 transition hover:text-orange-600"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
