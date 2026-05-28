"use client";

import type { MonthBucket } from "@/lib/accountStats";
import { formatPrice } from "@/lib/currency";

interface AccountSpendingChartProps {
  monthly: MonthBucket[];
}

export function AccountSpendingChart({ monthly }: AccountSpendingChartProps) {
  const maxSpend = Math.max(...monthly.map((m) => m.spend), 1);
  const hasSpend = monthly.some((m) => m.spend > 0);

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Spending overview</h2>
          <p className="mt-1 text-sm text-gray-600">
            Confirmed orders over the last {monthly.length} months
          </p>
        </div>
      </div>

      {!hasSpend ? (
        <p className="mt-8 text-center text-sm text-gray-500">
          No confirmed spending yet. Your chart will appear after your first
          verified order.
        </p>
      ) : (
        <div className="mt-8">
          <div
            className="flex items-end justify-between gap-2 sm:gap-4"
            style={{ minHeight: 160 }}
            role="img"
            aria-label="Monthly spending bar chart"
          >
            {monthly.map((bucket) => {
              const heightPct = Math.round((bucket.spend / maxSpend) * 100);
              return (
                <div
                  key={bucket.key}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                    {bucket.spend > 0 ? formatPrice(bucket.spend) : "—"}
                  </span>
                  <div className="flex h-32 w-full items-end justify-center sm:h-36">
                    <div
                      className="w-full max-w-[3rem] rounded-t-lg bg-gradient-to-t from-orange-600 to-orange-400 transition-all"
                      style={{
                        height: `${Math.max(heightPct, bucket.spend > 0 ? 8 : 4)}%`,
                      }}
                      title={`${bucket.label}: ${formatPrice(bucket.spend)} (${bucket.count} order${bucket.count === 1 ? "" : "s"})`}
                    />
                  </div>
                  <span className="w-full truncate text-center text-[10px] font-medium text-gray-600 sm:text-xs">
                    {bucket.label.split(" ")[0]}
                  </span>
                  {bucket.count > 0 && (
                    <span className="text-[10px] text-gray-400">
                      {bucket.count} order{bucket.count === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
