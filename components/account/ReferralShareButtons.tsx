"use client";

import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import {
  REFERRAL_SHARE_OPTIONS,
  buildReferralInvite,
  nativeShareReferral,
  openReferralShare,
  type ReferralInvite,
} from "@/lib/referralShare";

const channelStyles: Record<string, string> = {
  whatsapp: "bg-[#25D366] text-white hover:opacity-90",
  telegram: "bg-[#229ED9] text-white hover:opacity-90",
  viber: "bg-[#7360F2] text-white hover:opacity-90",
  facebook: "bg-[#1877F2] text-white hover:opacity-90",
  twitter: "bg-gray-900 text-white hover:opacity-90",
  linkedin: "bg-[#0A66C2] text-white hover:opacity-90",
  email: "bg-gray-500 text-white hover:opacity-90",
  sms: "bg-orange-500 text-white hover:opacity-90",
};

interface ReferralShareButtonsProps {
  referralCode: string;
  compact?: boolean;
}

export function ReferralShareButtons({
  referralCode,
  compact = false,
}: ReferralShareButtonsProps) {
  const [supportsNativeShare, setSupportsNativeShare] = useState(false);
  const invite = buildReferralInvite(referralCode);

  useEffect(() => {
    setSupportsNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const handleNativeShare = async () => {
    const shared = await nativeShareReferral(invite);
    if (!shared && typeof navigator !== "undefined" && !navigator.share) {
      openReferralShare(REFERRAL_SHARE_OPTIONS[0], invite);
    }
  };

  return (
    <div className={compact ? "" : "space-y-2"}>
      {!compact && (
        <p className="text-sm font-medium text-gray-900">Share with friends</p>
      )}
      <div className="flex flex-wrap gap-1.5">
        {supportsNativeShare && (
          <SharePill
            label="Share"
            className="border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
            onClick={() => void handleNativeShare()}
            icon={<Share2 className="h-3 w-3" />}
          />
        )}
        {REFERRAL_SHARE_OPTIONS.map((channel) => (
          <SharePill
            key={channel.id}
            label={channel.label}
            className={channelStyles[channel.id] ?? "bg-gray-100 text-gray-800"}
            onClick={() => openReferralShare(channel, invite)}
          />
        ))}
      </div>
    </div>
  );
}

function SharePill({
  label,
  className,
  onClick,
  icon,
}: {
  label: string;
  className: string;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition ${className}`}
    >
      {icon}
      {label}
    </button>
  );
}
