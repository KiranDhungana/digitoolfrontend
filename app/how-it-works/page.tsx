import type { Metadata } from "next";
import {
  CheckCircle2,
  CreditCard,
  MessageCircle,
  Search,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "How It Works",
  description: `Learn how to shop gaming, software, and digital products on ${SITE_NAME}.`,
};

const steps = [
  {
    icon: Search,
    title: "Browse the catalogue",
    description:
      "Explore gift cards, gaming credits, and software by category or brand. Use search to find Apple, Xbox, Roblox, PUBG, Google Play, and more.",
  },
  {
    icon: ShoppingCart,
    title: "Add items to your cart",
    description:
      "Open a product, check the price in NPR, and add what you need. Review quantities on the cart page before checkout.",
  },
  {
    icon: UserPlus,
    title: "Sign in or register",
    description:
      "Create a free account or log in so we can link your order to you. You will need an account to check out and track purchases.",
  },
  {
    icon: CreditCard,
    title: "Pay with Fonepay or Khalti",
    description:
      "At checkout, send payment to our Fonepay or Khalti details, enter your payment reference, and upload a screenshot of the successful transfer.",
  },
  {
    icon: CheckCircle2,
    title: "We verify your payment",
    description:
      "Our team reviews your order manually. This usually takes a short time during business hours. You will see order status in your account.",
  },
  {
    icon: MessageCircle,
    title: "Receive your digital product",
    description:
      "After approval, your order and digital product details are shared with you on the channel you chose. Signed-in customers can use support chat for order help.",
  },
] as const;

export default function HowItWorksPage() {
  return (
    <PageShell>
      <PageHeader
        title="How it works"
        description={`Shopping on ${SITE_NAME} is simple: pick a product, pay securely, and get your digital purchase after verification.`}
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "How it works" },
        ]}
      />

      <div className="mx-auto max-w-3xl">
        <ol className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="flex gap-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="flex shrink-0 flex-col items-center gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                    {index + 1}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="min-w-0 pt-1">
                  <h2 className="text-lg font-bold text-gray-900">{step.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Ready to get started?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Browse the store, or create an account to check out faster next time.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href={ROUTES.giftCards}>
              <Button>Browse catalogue</Button>
            </Link>
            <Link href={ROUTES.register}>
              <Button variant="secondary">Create account</Button>
            </Link>
            <Link href={ROUTES.contact}>
              <Button variant="secondary">Contact us</Button>
            </Link>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Prices are shown in NPR. Payment verification is required before digital
          codes or access details are delivered.
        </p>
      </div>
    </PageShell>
  );
}
