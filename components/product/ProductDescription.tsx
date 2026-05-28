"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { isHtmlDescription, sanitizeProductHtml } from "@/lib/sanitizeHtml";

/** Collapsed preview height on the product page */
const COLLAPSED_MAX_HEIGHT_PX = 180;

function parseBlocks(description: string): string[] {
  return description
    .split(/\n\s*\n/g)
    .map((s) => s.trimEnd())
    .filter((s) => s.trim().length > 0);
}

function renderPlainBlock(block: string, key: string): ReactElement | null {
  const lines = block
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  const bulletLines = lines.filter((l) => /^([-*])\s+/.test(l.trim()));
  const bulletOnly = lines.length > 0 && bulletLines.length === lines.length;

  if (bulletOnly) {
    return (
      <ul key={key}>
        {lines.map((l, idx) => {
          const text = l.trim().replace(/^([-*])\s+/, "");
          return (
            <li key={`${key}-li-${idx}`}>
              {text}
            </li>
          );
        })}
      </ul>
    );
  }

  const orderedLines = lines.filter((l) => /^\d+\.\s+/.test(l.trim()));
  const orderedOnly = lines.length > 0 && orderedLines.length === lines.length;

  if (orderedOnly) {
    return (
      <ol key={key}>
        {lines.map((l, idx) => {
          const text = l.trim().replace(/^\d+\.\s+/, "");
          return (
            <li key={`${key}-ol-${idx}`}>
              {text}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <p key={key}>
      {block}
    </p>
  );
}

function PlainDescription({ description }: { description: string }) {
  const blocks = parseBlocks(description);
  return (
    <>
      {blocks.map((block, idx) => renderPlainBlock(block, `desc-block-${idx}`))}
    </>
  );
}

function DescriptionBody({ description }: { description: string }) {
  const text = description.trim();

  if (isHtmlDescription(text)) {
    const safeHtml = sanitizeProductHtml(text);
    return (
      <div
        className="product-description-html"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    );
  }

  return (
    <div className="product-description-html">
      <PlainDescription description={text} />
    </div>
  );
}

export function ProductDescription({ description }: { description: string }) {
  const text = description?.trim() ?? "";
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncatable, setIsTruncatable] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [text]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      setIsTruncatable(el.scrollHeight > COLLAPSED_MAX_HEIGHT_PX + 2);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [text, expanded]);

  if (!text) return null;

  const showCollapsed = isTruncatable && !expanded;

  return (
    <div className="w-full max-w-full">
      <div
        ref={contentRef}
        className={`relative w-full max-w-full ${
          showCollapsed ? "overflow-hidden" : ""
        }`}
        style={
          showCollapsed
            ? { maxHeight: `${COLLAPSED_MAX_HEIGHT_PX}px` }
            : undefined
        }
      >
        <DescriptionBody description={text} />
        {showCollapsed ? (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/90 to-transparent"
            aria-hidden
          />
        ) : null}
      </div>

      {isTruncatable ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}
