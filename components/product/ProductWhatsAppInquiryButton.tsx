"use client";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { Button } from "@/components/ui/Button";
import { buildProductWhatsAppUrl } from "@/lib/product-inquiry";
import type { Product } from "@/lib/types";

interface ProductWhatsAppInquiryButtonProps {
  product: Pick<Product, "id" | "name">;
  variant?: "icon" | "button";
  className?: string;
}

export function ProductWhatsAppInquiryButton({
  product,
  variant = "icon",
  className = "",
}: ProductWhatsAppInquiryButtonProps) {
  const url = buildProductWhatsAppUrl(product);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  };

  if (variant === "button") {
    return (
      <Button
        type="button"
        className={`gap-2 border-[#25D366] bg-[#25D366] py-3 text-white hover:bg-[#20bd5a] ${className}`}
        onClick={handleClick}
      >
        <WhatsAppIcon className="h-4 w-4" />
        WhatsApp
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Inquire on WhatsApp"
      aria-label={`Inquire about ${product.name} on WhatsApp`}
      className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#25D366]/30 bg-[#25D366] text-white shadow-md transition hover:border-[#25D366] hover:bg-[#20bd5a] ${className}`}
    >
      <WhatsAppIcon className="h-4 w-4" />
    </button>
  );
}
