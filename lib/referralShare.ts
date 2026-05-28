import { ROUTES } from "@/lib/constants";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export interface ReferralInvite {
  code: string;
  link: string;
  message: string;
  shortMessage: string;
}

export function getReferralRegisterPath(code: string): string {
  return `${ROUTES.register}?ref=${encodeURIComponent(code)}`;
}

export function buildReferralInvite(
  code: string,
  origin?: string
): ReferralInvite {
  const base =
    origin ?? (typeof window !== "undefined" ? window.location.origin : SITE_URL);
  const link = `${base}${getReferralRegisterPath(code)}`;
  const shortMessage = `Join ${SITE_NAME} with my referral code: ${code}`;
  const message = `${shortMessage}\n\nSign up here: ${link}`;
  return { code, link, message, shortMessage };
}

export type ReferralShareChannel =
  | "whatsapp"
  | "telegram"
  | "viber"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "email"
  | "sms";

export interface ReferralShareOption {
  id: ReferralShareChannel;
  label: string;
  href: (invite: ReferralInvite) => string;
  /** Opens in a new tab (default true for http(s)) */
  external?: boolean;
}

export const REFERRAL_SHARE_OPTIONS: ReferralShareOption[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: ({ message }) =>
      `https://wa.me/?text=${encodeURIComponent(message)}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    href: ({ link, shortMessage }) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(shortMessage)}`,
  },
  {
    id: "viber",
    label: "Viber",
    href: ({ message }) =>
      `viber://forward?text=${encodeURIComponent(message)}`,
    external: false,
  },
  {
    id: "facebook",
    label: "Facebook",
    href: ({ link }) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
  },
  {
    id: "twitter",
    label: "X",
    href: ({ message, link }) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(link)}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: ({ link }) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`,
  },
  {
    id: "email",
    label: "Email",
    href: ({ message, link }) => {
      const subject = encodeURIComponent(`Join ${SITE_NAME}`);
      const body = encodeURIComponent(message);
      return `mailto:?subject=${subject}&body=${body}`;
    },
    external: false,
  },
  {
    id: "sms",
    label: "SMS",
    href: ({ message }) => `sms:?body=${encodeURIComponent(message)}`,
    external: false,
  },
];

export function openReferralShare(
  channel: ReferralShareOption,
  invite: ReferralInvite
): void {
  const url = channel.href(invite);
  const openInNewTab = channel.external !== false && url.startsWith("http");
  if (openInNewTab) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = url;
  }
}

export async function nativeShareReferral(
  invite: ReferralInvite
): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.share) {
    return false;
  }
  try {
    await navigator.share({
      title: `Join ${SITE_NAME}`,
      text: invite.shortMessage,
      url: invite.link,
    });
    return true;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return true;
    }
    return false;
  }
}
