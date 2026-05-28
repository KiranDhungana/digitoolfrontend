"use client";

import { Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import { buyNow } from "@/lib/cart";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface BuyNowButtonProps {
  product: Product;
  className?: string;
  showIcon?: boolean;
  variant?: "primary" | "secondary" | "ghost";
}

export function BuyNowButton({
  product,
  className = "",
  showIcon = true,
  variant = "secondary",
}: BuyNowButtonProps) {
  const router = useRouter();

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    buyNow(product.id, product.price, 1, {
      imageUrl: product.imageUrl,
      name: product.name,
      gradient: product.gradient,
      price: product.price,
    });
    router.push(ROUTES.checkout);
  };

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={handleBuyNow}
    >
      {showIcon && <Tag className="h-4 w-4" />}
      Buy now
    </Button>
  );
}
