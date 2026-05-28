"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Copy, Link2 } from "lucide-react";
import {
  fetchReferralSummary,
  requestReferralWithdrawal,
  type ReferralCommission,
  type ReferralSummary,
} from "@/lib/api/referrals";
import { ReferralShareButtons } from "@/components/account/ReferralShareButtons";
import { formatPrice } from "@/lib/currency";
import { buildReferralInvite } from "@/lib/referralShare";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

function formatEarningDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function EarningRow({ commission }: { commission: ReferralCommission }) {
  const items = commission.orderItems ?? [];
  return (
    <li className="flex gap-3 border-b border-gray-50 py-3 last:border-0 last:pb-0">
      <div className="min-w-0 flex-1">
        {items.length > 0 ? (
          <ul className="space-y-0.5 text-sm text-gray-900">
            {items.map((item, i) => (
              <li key={i}>
                {item.productName}
                <span className="text-gray-500">
                  {" "}
                  × {item.quantity} · {formatPrice(item.lineTotal)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-900">
            Order total {formatPrice(commission.orderSubtotal)}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {items.length > 0 && <>Order {formatPrice(commission.orderSubtotal)} · </>}
          {formatEarningDate(commission.createdAt)}
        </p>
      </div>
      <p className="shrink-0 text-sm font-semibold text-green-700">
        +{formatPrice(commission.amount)}
      </p>
    </li>
  );
}

export function ReferralProgram() {
  const [data, setData] = useState<ReferralSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await fetchReferralSummary());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load referral info");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCopyLink = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(buildReferralInvite(data.referralCode).link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      setError("Could not copy link");
    }
  };

  const handleCopyCode = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      setError("Could not copy code");
    }
  };

  const handleWithdraw = async (e: FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setWithdrawing(true);
    setError("");
    setMessage("");
    try {
      const result = await requestReferralWithdrawal({
        amount: Number(withdrawAmount),
        payoutNote: payoutNote.trim(),
      });
      setData((prev) =>
        prev
          ? {
              ...prev,
              ...result.summary,
              withdrawals: [result.withdrawal, ...prev.withdrawals],
            }
          : prev
      );
      setWithdrawAmount("");
      setPayoutNote("");
      setShowWithdraw(false);
      setMessage("Withdrawal request submitted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Withdrawal failed");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Loading referrals…</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="text-sm text-red-600">{error || "Referrals unavailable."}</p>
      </section>
    );
  }

  const itemsNeeded = Math.max(
    0,
    data.minPurchasedItemsToWithdraw - data.purchasedItemsCount
  );

  return (
    <section className="rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-lg font-bold text-gray-900">Referrals</h2>
        <p className="mt-1 text-sm text-gray-600">
          Earn {data.commissionRatePercent}% when friends complete orders. Withdraw after
          you have bought {data.minPurchasedItemsToWithdraw} items.
        </p>
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-gray-100 px-5 py-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Available balance
          </p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(data.balance)}</p>
          {data.pendingWithdrawal > 0 && (
            <p className="text-xs text-gray-500">
              {formatPrice(data.pendingWithdrawal)} processing
            </p>
          )}
        </div>
        <div className="text-right text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-900">{data.referralCount}</span> referred
          </p>
          <p>
            <span className="font-medium text-gray-900">{formatPrice(data.totalEarned)}</span>{" "}
            total earned
          </p>
        </div>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs font-medium text-gray-500">Your code</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="font-mono text-lg font-bold tracking-widest text-gray-900">
            {data.referralCode}
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50"
          >
            <Copy className="h-3.5 w-3.5" />
            {copiedCode ? "Copied" : "Code"}
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50"
          >
            <Link2 className="h-3.5 w-3.5" />
            {copiedLink ? "Copied" : "Link"}
          </button>
        </div>
        <div className="mt-3">
          <ReferralShareButtons referralCode={data.referralCode} compact />
        </div>
      </div>

      {data.commissions.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-900">Recent earnings</h3>
          <ul className="mt-1 divide-y divide-gray-50">
            {data.commissions.slice(0, 8).map((c) => (
              <EarningRow key={c.id} commission={c} />
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-gray-100 px-5 py-4">
        {!showWithdraw ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {itemsNeeded > 0 ? (
                <>
                  Purchases: {data.purchasedItemsCount}/{data.minPurchasedItemsToWithdraw}{" "}
                  items to unlock withdrawal
                </>
              ) : data.balance > 0 ? (
                <>You can withdraw your balance.</>
              ) : (
                <>No balance to withdraw yet.</>
              )}
            </p>
            {data.balance > 0 && itemsNeeded === 0 && (
              <Button
                type="button"
                variant="secondary"
                className="text-sm"
                onClick={() => setShowWithdraw(true)}
              >
                Withdraw
              </Button>
            )}
          </div>
        ) : (
          <form onSubmit={handleWithdraw} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Withdraw</h3>
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-800"
                onClick={() => setShowWithdraw(false)}
              >
                Cancel
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                label={`Amount (max ${formatPrice(data.availableBalance)})`}
                type="number"
                min="1"
                step="0.01"
                max={data.availableBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={withdrawing}
                required
              />
              <Input
                label="Khalti / Fonepay / bank details"
                value={payoutNote}
                onChange={(e) => setPayoutNote(e.target.value)}
                disabled={withdrawing}
                required
              />
            </div>
            {message && <p className="text-sm text-green-600">{message}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="secondary" disabled={withdrawing} className="text-sm">
              {withdrawing ? "Submitting…" : "Submit request"}
            </Button>
          </form>
        )}
        {!showWithdraw && data.withdrawals.length > 0 && (
          <ul className="mt-3 space-y-1 border-t border-gray-50 pt-3 text-sm">
            {data.withdrawals.slice(0, 3).map((w) => (
              <li key={w.id} className="flex justify-between text-gray-600">
                <span className="capitalize">{w.status}</span>
                <span>{formatPrice(w.amount)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
