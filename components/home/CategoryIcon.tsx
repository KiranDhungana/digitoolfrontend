import {
  BookOpen,
  CreditCard,
  Gamepad2,
  Home,
  Monitor,
  Phone,
  Plane,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trophy,
  Tv,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  gamepad: Gamepad2,
  monitor: Monitor,
  tv: Tv,
  "shopping-bag": ShoppingBag,
  utensils: UtensilsCrossed,
  plane: Plane,
  "credit-card": CreditCard,
  trophy: Trophy,
  smartphone: Smartphone,
  home: Home,
  sparkles: Sparkles,
  "book-open": BookOpen,
  phone: Phone,
};

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className = "h-5 w-5" }: CategoryIconProps) {
  const Icon = iconMap[name] ?? ShoppingBag;
  return <Icon className={className} />;
}
