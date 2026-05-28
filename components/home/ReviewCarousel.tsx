"use client";

import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { CustomerReview } from "@/lib/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden>
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

function ReviewCard({ review }: { review: CustomerReview }) {
  return (
    <article className="relative flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <Quote className="absolute right-5 top-5 h-8 w-8 text-orange-100" aria-hidden />
      <StarRating rating={review.rating} />
      <h3 className="mt-3 font-semibold text-gray-900">{review.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
        &ldquo;{review.body}&rdquo;
      </p>
      <div className="mt-5 border-t border-gray-100 pt-4">
        <p className="font-medium text-gray-900">{review.name}</p>
        <p className="text-xs text-gray-500">
          {review.location} · {review.date}
        </p>
        <p className="mt-2 inline-block rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-700">
          {review.productLabel}
        </p>
      </div>
    </article>
  );
}

function useSlidesPerView() {
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setPerView(3);
      else if (window.matchMedia("(min-width: 640px)").matches) setPerView(2);
      else setPerView(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return perView;
}

interface ReviewCarouselProps {
  reviews: CustomerReview[];
  autoPlayMs?: number;
}

export function ReviewCarousel({
  reviews,
  autoPlayMs = 5000,
}: ReviewCarouselProps) {
  const perView = useSlidesPerView();
  const maxIndex = Math.max(0, reviews.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  }, [maxIndex]);

  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1));
  }, [maxIndex]);

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (paused || maxIndex === 0) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, autoPlayMs);
    return () => window.clearInterval(timer);
  }, [paused, maxIndex, autoPlayMs]);

  const slidePercent = 100 / perView;

  return (
    <div
      className="relative mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${index * slidePercent}%)`,
          }}
          aria-live="polite"
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="min-w-0 shrink-0 px-2.5"
              style={{ width: `${slidePercent}%` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
          aria-label="Previous reviews"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(() => i)}
              className={`cursor-pointer h-2 rounded-full transition-all ${
                i === index
                  ? "w-6 bg-orange-500"
                  : "w-2 bg-gray-300 hover:bg-orange-300"
              }`}
              aria-label={`Go to review slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={next}
          className="cursor-pointer flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-orange-300 hover:text-orange-600"
          aria-label="Next reviews"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
