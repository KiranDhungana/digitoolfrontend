"use client";

import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChatSocketOptional } from "@/components/chat/ChatSocketProvider";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { ROUTES } from "@/lib/constants";
import { savePendingProductInquiry } from "@/lib/product-inquiry";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface ProductInquiryButtonProps {
  product: Pick<Product, "id" | "name">;
  variant?: "icon" | "button";
  className?: string;
}

export function ProductInquiryButton({
  product,
  variant = "icon",
  className = "",
}: ProductInquiryButtonProps) {
  const router = useRouter();
  const { user, loading } = useUserAuth();
  const chat = useChatSocketOptional();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    if (!user) {
      savePendingProductInquiry({ id: product.id, name: product.name });
      const returnTo = ROUTES.product(product.id);
      router.push(
        `${ROUTES.login}?redirect=${encodeURIComponent(returnTo)}`
      );
      return;
    }

    chat?.openProductInquiry({ id: product.id, name: product.name });
  };

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="secondary"
        className={`gap-2 py-3 ${className}`}
        onClick={handleClick}
        disabled={loading}
      >
        <MessageCircle className="h-4 w-4" />
        Inquire
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      title="Inquire about this product"
      aria-label={`Inquire about ${product.name}`}
      className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
    </button>
  );
}
