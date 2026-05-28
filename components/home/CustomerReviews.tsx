import { Star } from "lucide-react";
import Link from "next/link";
import { ReviewCarousel } from "@/components/home/ReviewCarousel";
import { ROUTES } from "@/lib/constants";
import { CUSTOMER_REVIEWS, REVIEW_SUMMARY } from "@/lib/reviews";
import { Button } from "@/components/ui/Button";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export function CustomerReviews() {
  return (
    <section
      className="border-t border-gray-100 bg-gradient-to-b from-orange-50/60 to-white"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
              Customer reviews
            </p>
            <h2
              id="reviews-heading"
              className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl"
            >
              Trusted by thousands of buyers in Nepal
            </h2>
            <p className="mt-3 text-gray-600">
              Real feedback from customers who bought gaming and software gift
              cards on Digitoolera — fast delivery, fair NPR pricing, and
              helpful support.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-6 rounded-2xl border border-orange-100 bg-white px-6 py-5 shadow-sm">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {REVIEW_SUMMARY.average.toFixed(1)}
              </p>
              <StarRating rating={5} />
              <p className="mt-1 text-sm text-gray-500">
                {REVIEW_SUMMARY.total.toLocaleString()}+ reviews
              </p>
            </div>
            <div className="hidden h-12 w-px bg-gray-200 sm:block" />
            <div className="text-sm text-gray-600">
              <p className="font-semibold text-gray-900">
                {REVIEW_SUMMARY.fiveStarPercent}%
              </p>
              <p>5-star ratings</p>
            </div>
          </div>
        </div>

        <ReviewCarousel reviews={CUSTOMER_REVIEWS} />

        <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl bg-gray-900 px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-lg font-semibold text-white">
              Ready to shop gift cards?
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Join happy customers — browse gaming &amp; software cards today.
            </p>
          </div>
          <Link href={ROUTES.giftCards} className="shrink-0">
            <Button variant="secondary" className="rounded-xl px-6 py-3">
              Shop gift cards
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
