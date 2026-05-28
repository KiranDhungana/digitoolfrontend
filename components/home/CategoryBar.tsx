"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { CATEGORY_PILLS, ROUTES } from "@/lib/constants";
import { CategoryIcon } from "@/components/home/CategoryIcon";

export function CategoryBar() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <section className="border-y border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 sm:px-6 lg:px-8">
        <div
          ref={scrollRef}
          className="flex flex-1 gap-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {CATEGORY_PILLS.map((pill) => (
            <Link
              key={pill.label}
              href={ROUTES.category(pill.slug)}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-orange-300 hover:text-orange-600"
            >
              <CategoryIcon name={pill.icon} className="h-4 w-4 text-gray-500" />
              {pill.label}
            </Link>
          ))}
        </div>
        <button
          type="button"
          onClick={scrollRight}
          aria-label="Scroll categories"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-orange-300 hover:text-orange-600"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
