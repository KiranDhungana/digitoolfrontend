export type DeliveryChannel =
  | "email"
  | "chat"
  | "whatsapp"
  | "telegram"
  | "viber";

export const DELIVERY_CHANNELS: {
  id: DeliveryChannel;
  label: string;
  description: string;
  recommended?: boolean;
  contactLabel?: string;
  contactPlaceholder?: string;
  contactHint?: string;
  contactInputType?: "email" | "tel" | "text";
}[] = [
  {
    id: "chat",
    label: "Platform chat",
    description: "Receive your order and product details in Digitoolera support chat (recommended).",
    recommended: true,
  },
  {
    id: "email",
    label: "Email",
    description: "We will send order details to your email inbox.",
    contactLabel: "Email address",
    contactPlaceholder: "you@example.com",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Delivered to your WhatsApp number after payment is verified.",
    contactLabel: "WhatsApp phone number",
    contactPlaceholder: "+977 98XXXXXXXX",
    contactHint: "Include country code (e.g. +977 for Nepal).",
    contactInputType: "tel",
  },
  {
    id: "telegram",
    label: "Telegram",
    description: "Delivered to the phone number linked to your Telegram account.",
    contactLabel: "Telegram phone number",
    contactPlaceholder: "+977 98XXXXXXXX",
    contactHint: "Or enter your Telegram username (e.g. @yourname).",
    contactInputType: "text",
  },
  {
    id: "viber",
    label: "Viber",
    description: "Delivered to your Viber phone number.",
    contactLabel: "Viber phone number",
    contactPlaceholder: "+977 98XXXXXXXX",
    contactHint: "Include country code (e.g. +977 for Nepal).",
    contactInputType: "tel",
  },
];

export function deliveryChannelLabel(channel: DeliveryChannel): string {
  return DELIVERY_CHANNELS.find((c) => c.id === channel)?.label ?? channel;
}

export function defaultContactForChannel(
  channel: DeliveryChannel,
  user: {
    email: string;
    phone?: string;
    deliveryWhatsapp?: string;
    deliveryTelegram?: string;
    deliveryViber?: string;
  }
): string {
  switch (channel) {
    case "email":
      return user.email;
    case "whatsapp":
      return user.deliveryWhatsapp ?? user.phone ?? "";
    case "telegram":
      return user.deliveryTelegram ?? user.phone ?? "";
    case "viber":
      return user.deliveryViber ?? user.phone ?? "";
    default:
      return "";
  }
}
