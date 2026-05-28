"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";

export function ContactLiveSupport() {
  const { user, loading } = useUserAuth();

  if (loading || !user) return null;

  return (
    <Link
      href={ROUTES.support}
      className="block rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-6 transition hover:border-orange-300 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
          <MessageCircle className="h-6 w-6" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Live support chat</h2>
          <p className="mt-1 text-sm text-gray-600">
            Chat with our team in real time — best for order and payment questions.
          </p>
          <span className="mt-3 inline-block text-sm font-semibold text-orange-600">
            Open support chat →
          </span>
        </div>
      </div>
    </Link>
  );
}
