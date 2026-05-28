"use client";

import { Clock, Lock, Smartphone, Upload } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AuthLink } from "@/components/auth/AuthCard";
import { UserAuthForm } from "@/components/auth/UserAuthForm";
import { useUserAuth } from "@/components/auth/UserAuthProvider";
import { loadCartProducts } from "@/lib/load-cart-products";
import { DeliveryChannelPicker } from "@/components/checkout/DeliveryChannelPicker";
import { placeOrder, type OrderLineItem } from "@/lib/api/orders";
import {
  defaultContactForChannel,
  deliveryChannelLabel,
  type DeliveryChannel,
} from "@/lib/deliveryChannels";
import { getCart, clearCart, type CartItem } from "@/lib/cart";
import { ROUTES } from "@/lib/constants";
import { formatPrice } from "@/lib/currency";
import type { Product } from "@/lib/types";
import { FONEPAY_NAME, FONEPAY_NUMBER } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type PaymentChoice = "fonepay" | "khalti";

export function CheckoutView() {
  const { user, loading } = useUserAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentChoice>("fonepay");
  const [paymentReference, setPaymentReference] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [deliveryChannel, setDeliveryChannel] =
    useState<DeliveryChannel>("chat");
  const [deliveryContact, setDeliveryContact] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCartItems(getCart());
  }, []);

  useEffect(() => {
    if (user) {
      const ch = user.defaultDeliveryChannel ?? "chat";
      setDeliveryChannel(ch);
      setDeliveryContact(defaultContactForChannel(ch, user));
    }
  }, [user]);

  useEffect(() => {
    if (!mounted || cartItems.length === 0) return;
    void loadCartProducts(cartItems).then(setProducts);
  }, [cartItems, mounted]);

  const lineItems = cartItems
    .map((item) => {
      const product = products[item.productId];
      const price = item.price ?? product?.price;
      const label = item.name ?? product?.name;
      const imageUrl = item.imageUrl ?? product?.imageUrl;
      const gradient =
        item.gradient ?? product?.gradient ?? "from-gray-600 to-gray-800";
      if (price == null || !label) return null;
      return {
        item,
        label,
        price,
        total: price * item.quantity,
        imageUrl,
        gradient,
      };
    })
    .filter(Boolean) as {
    item: CartItem;
    label: string;
    price: number;
    total: number;
    imageUrl?: string;
    gradient: string;
  }[];

  const subtotal = lineItems.reduce((sum, line) => sum + line.total, 0);

  const onScreenshotChange = (file: File | null) => {
    setScreenshot(file);
    if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    setScreenshotPreview(file ? URL.createObjectURL(file) : null);
  };

  const handlePlaceOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || paymentMethod !== "fonepay") return;

    if (!screenshot) {
      setError("Upload your Fonepay payment screenshot to continue.");
      return;
    }

    if (deliveryChannel !== "chat" && !deliveryContact.trim()) {
      setError("Enter where we should send your order details.");
      return;
    }

    setError("");
    setPlacing(true);
    try {
      const orderItems: OrderLineItem[] = lineItems.map(({ item, label, price, total }) => ({
        productId: item.productId,
        productName: label,
        denomination: item.denomination,
        quantity: item.quantity,
        unitPrice: price,
        lineTotal: total,
      }));

      const order = await placeOrder({
        items: orderItems,
        paymentMethod: "fonepay",
        paymentReference: paymentReference.trim() || undefined,
        deliveryChannel,
        deliveryContact:
          deliveryChannel === "chat"
            ? undefined
            : deliveryContact.trim(),
        screenshot,
      });

      clearCart();
      setOrderId(order.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (!mounted || loading) {
    return <p className="text-gray-500">Loading checkout...</p>;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4">
          <Lock className="h-6 w-6 shrink-0 text-orange-600" />
          <div>
            <h2 className="font-bold text-gray-900">Sign in to checkout</h2>
            <p className="mt-1 text-sm text-gray-600">
              Log in with your email and password to continue.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <UserAuthForm
            mode="login"
            submitLabel="Log in to checkout"
            redirectTo={ROUTES.checkout}
          />
          <p className="mt-4 text-center text-sm text-gray-600">
            New here?{" "}
            <AuthLink
              href={`${ROUTES.register}?redirect=${encodeURIComponent(ROUTES.checkout)}`}
            >
              Create an account
            </AuthLink>
          </p>
        </div>
      </div>
    );
  }

  if (orderId) {
    const deliveryHint =
      deliveryChannel === "chat"
        ? "Your order details will be sent in Support chat on this website once your payment is verified."
        : deliveryChannel === "email"
          ? `We will email ${deliveryContact || user.email} when your order is confirmed.`
          : `We will send your order details via ${deliveryChannelLabel(deliveryChannel)} (${deliveryContact}) after verification.`;

    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-100 bg-amber-50 p-8 text-center">
        <Clock className="mx-auto h-10 w-10 text-amber-600" />
        <h2 className="mt-4 text-xl font-bold text-gray-900">Order submitted</h2>
        <p className="mt-2 text-gray-600">
          Order <span className="font-mono text-sm font-medium">{orderId}</span> is
          awaiting payment verification.
        </p>
        <p className="mt-3 text-sm text-gray-700">{deliveryHint}</p>
        {deliveryChannel === "chat" && (
          <Link href={ROUTES.support} className="mt-4 inline-block text-sm font-medium text-orange-600 hover:underline">
            Open support chat
          </Link>
        )}
        <Link href={ROUTES.giftCards} className="mt-6 inline-block">
          <Button variant="secondary">Continue shopping</Button>
        </Link>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
        <p className="text-gray-600">Your cart is empty.</p>
        <Link href={ROUTES.giftCards} className="mt-4 inline-block">
          <Button variant="secondary">Browse gift cards</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form
        onSubmit={handlePlaceOrder}
        className="space-y-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
      >
        <DeliveryChannelPicker
          user={user}
          channel={deliveryChannel}
          contact={deliveryContact}
          onChannelChange={setDeliveryChannel}
          onContactChange={setDeliveryContact}
        />

        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-bold text-gray-900">Payment method</h2>
          <div className="mt-3 space-y-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                paymentMethod === "fonepay"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-orange-300"
              }`}
            >
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "fonepay"}
                onChange={() => setPaymentMethod("fonepay")}
              />
              <Smartphone className="h-5 w-5 text-orange-500" />
              <span className="flex-1 text-sm font-medium">Fonepay</span>
            </label>

            <label className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-70">
              <input type="radio" name="payment" disabled />
              <Smartphone className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-sm font-medium text-gray-600">Khalti</span>
              <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-semibold text-gray-700">
                Coming soon
              </span>
            </label>
          </div>
        </div>

        {paymentMethod === "fonepay" && (
          <div className="space-y-4 rounded-xl border border-orange-100 bg-orange-50/50 p-4">
            <h3 className="text-sm font-bold text-gray-900">Pay with Fonepay</h3>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-gray-700">
              <li>
                Send <strong>{formatPrice(subtotal)}</strong> to{" "}
                <strong>{FONEPAY_NUMBER}</strong> ({FONEPAY_NAME})
              </li>
              <li>Take a screenshot of the successful payment</li>
              <li>Upload the screenshot below and place your order</li>
            </ol>
            <Input
              label="Transaction ID / reference (optional)"
              value={paymentReference}
              onChange={(e) => setPaymentReference(e.target.value)}
              placeholder="e.g. FP123456789"
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment screenshot <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                required
                className="block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-orange-800"
                onChange={(e) => onScreenshotChange(e.target.files?.[0] ?? null)}
              />
              {screenshotPreview && (
                <div className="relative mt-3 h-40 w-full max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-white">
                  <Image
                    src={screenshotPreview}
                    alt="Payment screenshot preview"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
        )}

        <Button
          type="submit"
          variant="secondary"
          className="w-full py-3"
          disabled={
            placing ||
            !screenshot ||
            (deliveryChannel !== "chat" && !deliveryContact.trim())
          }
        >
          {placing ? (
            "Submitting order..."
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Submit order for verification
            </>
          )}
        </Button>
      </form>

      <div className="h-fit rounded-2xl border border-gray-100 bg-gray-50 p-6">
        <h2 className="font-bold text-gray-900">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {lineItems.map(({ item, label, total, imageUrl, gradient }) => (
            <li
              key={`${item.productId}-${item.denomination}`}
              className="flex items-center gap-3 text-sm"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={label}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} text-xs font-bold text-white/90`}
                    aria-hidden
                  >
                    {label.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 line-clamp-2">{label}</p>
                <p className="text-gray-500">Qty {item.quantity}</p>
              </div>
              <span className="shrink-0 font-semibold text-gray-900">
                {formatPrice(total)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-between border-t border-gray-200 pt-4">
          <span className="font-semibold text-gray-900">Total to pay</span>
          <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Payments are verified manually. Digital products are delivered after approval.
        </p>
        <Link href={ROUTES.cart} className="mt-4 block text-sm text-orange-600 hover:underline">
          ← Back to cart
        </Link>
      </div>
    </div>
  );
}
