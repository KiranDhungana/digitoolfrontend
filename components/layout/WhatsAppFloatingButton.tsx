"use client";

import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppFloatingButton() {
  const url = buildGeneralWhatsAppUrl();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat on WhatsApp"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#20bd5a] hover:shadow-xl sm:bottom-8 sm:left-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
