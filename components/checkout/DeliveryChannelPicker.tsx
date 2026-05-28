"use client";

import {
  DELIVERY_CHANNELS,
  defaultContactForChannel,
  type DeliveryChannel,
} from "@/lib/deliveryChannels";
import type { User } from "@/lib/api/user";

interface DeliveryChannelPickerProps {
  user: User;
  channel: DeliveryChannel;
  contact: string;
  onChannelChange: (channel: DeliveryChannel) => void;
  onContactChange: (contact: string) => void;
}

export function DeliveryChannelPicker({
  user,
  channel,
  contact,
  onChannelChange,
  onContactChange,
}: DeliveryChannelPickerProps) {
  const selected = DELIVERY_CHANNELS.find((c) => c.id === channel);
  const needsContact = channel !== "chat";

  const handleChannel = (id: DeliveryChannel) => {
    onChannelChange(id);
    onContactChange(defaultContactForChannel(id, user));
  };

  return (
    <div className="space-y-4 border-t border-gray-100 pt-6">
      <div>
        <h2 className="font-bold text-gray-900">Delivery method</h2>
        <p className="mt-1 text-sm text-gray-600">
          Choose where we send your order and product details after payment is verified.
        </p>
      </div>

      <div className="space-y-2">
        {DELIVERY_CHANNELS.map((opt) => (
          <label
            key={opt.id}
            className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
              channel === opt.id
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              name="deliveryChannel"
              className="mt-1"
              checked={channel === opt.id}
              onChange={() => handleChannel(opt.id)}
            />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {opt.label}
                </span>
                {opt.recommended && (
                  <span className="rounded-full bg-orange-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    Recommended
                  </span>
                )}
              </span>
              <span className="mt-1 block text-xs text-gray-600">
                {opt.description}
              </span>
            </span>
          </label>
        ))}
      </div>

      {needsContact && selected?.contactLabel && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {selected.contactLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type={
              selected.contactInputType ??
              (channel === "email" ? "email" : "tel")
            }
            inputMode={channel === "email" ? "email" : "tel"}
            autoComplete={channel === "email" ? "email" : "tel"}
            value={contact}
            onChange={(e) => onContactChange(e.target.value)}
            placeholder={selected.contactPlaceholder}
            required
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-orange-300 focus:bg-white focus:ring-2 focus:ring-orange-100"
          />
          {selected.contactHint && (
            <p className="mt-1.5 text-xs text-gray-500">{selected.contactHint}</p>
          )}
        </div>
      )}

      {channel === "chat" && (
        <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm text-gray-700">
          After verification, your order details and delivery information will
          appear in <strong>Support chat</strong> on this website. Open it anytime
          from the chat button on any page.
        </p>
      )}
    </div>
  );
}
