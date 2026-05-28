import { type ReactNode } from "react";

type BadgeVariant = "official" | "promotions";

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  official: "bg-orange-50 text-orange-600",
  promotions: "bg-pink-50 text-pink-600",
};

export function Badge({ variant, children, icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${variantStyles[variant]}`}
    >
      {icon}
      {children}
    </span>
  );
}
