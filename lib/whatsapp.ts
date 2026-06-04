import { SITE_NAME } from "@/lib/site";

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

/** Normalize local Nepal mobile (98XXXXXXXX) to international (97798XXXXXXXX). */
export function resolveWhatsAppDigits(raw: string): string {
  const digits = onlyDigits(raw);
  if (digits.length < 10) return "";
  if (digits.length === 10 && digits.startsWith("98")) {
    return `977${digits}`;
  }
  return digits;
}

export function getConfiguredWhatsAppDigits(): string {
  const fromEnv = resolveWhatsAppDigits(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ""
  );
  if (fromEnv) return fromEnv;

  return resolveWhatsAppDigits(process.env.NEXT_PUBLIC_FONEPAY_NUMBER || "");
}

export function buildWhatsAppUrl(message: string, phoneDigits?: string): string {
  const encoded = encodeURIComponent(message);
  const digits = phoneDigits ? onlyDigits(phoneDigits) : "";
  if (digits.length >= 10) {
    return `https://wa.me/${digits}?text=${encoded}`;
  }
  return `https://wa.me/?text=${encoded}`;
}

export function buildGeneralWhatsAppMessage(): string {
  return `Hi, I have a question about a product on ${SITE_NAME}.\n\n`;
}

export function buildGeneralWhatsAppUrl(): string {
  return buildWhatsAppUrl(
    buildGeneralWhatsAppMessage(),
    getConfiguredWhatsAppDigits()
  );
}
