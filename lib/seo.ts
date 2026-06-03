import type { Metadata } from "next";
import type { Product } from "@/lib/types";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const SEO_REGION = "Nepal";
export const SEO_LOCALE = "en_NP";

/** Core terms aligned with typical Google Ads campaigns for this store. */
export const SITE_KEYWORDS = [
  "gift cards Nepal",
  "buy gift cards online Nepal",
  "digital gift cards Nepal",
  "gaming gift cards Nepal",
  "game credits Nepal",
  "PUBG UC Nepal",
  "Roblox gift card Nepal",
  "Steam gift card Nepal",
  "PlayStation gift card Nepal",
  "Xbox gift card Nepal",
  "Apple gift card Nepal",
  "Google Play gift card Nepal",
  "Microsoft 365 Nepal",
  "software subscription Nepal",
  "buy digital products Nepal",
  "online gift card store Nepal",
  "Fonepay gift card",
  "Khalti digital purchase",
  "instant gift card delivery Nepal",
  "Digitoolera",
] as const;

const BRAND_KEYWORDS: Record<string, string[]> = {
  roblox: [
    "Roblox gift card Nepal",
    "buy Robux Nepal",
    "Roblox credit Nepal",
  ],
  pubg: ["PUBG UC Nepal", "buy PUBG UC online", "PUBG mobile UC Nepal"],
  steam: ["Steam gift card Nepal", "Steam wallet Nepal", "buy Steam games Nepal"],
  xbox: ["Xbox gift card Nepal", "Xbox Game Pass Nepal", "Microsoft Xbox Nepal"],
  playstation: [
    "PlayStation gift card Nepal",
    "PSN card Nepal",
    "PS Store Nepal",
  ],
  apple: [
    "Apple gift card Nepal",
    "App Store gift card Nepal",
    "iTunes card Nepal",
  ],
  "google-play": [
    "Google Play gift card Nepal",
    "Google Play credit Nepal",
  ],
  microsoft: [
    "Microsoft 365 Nepal",
    "Office 365 Nepal",
    "Microsoft subscription Nepal",
  ],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  gaming: [
    "gaming gift cards Nepal",
    "game top up Nepal",
    "gaming credits Nepal",
  ],
  software: [
    "software gift cards Nepal",
    "app store credit Nepal",
    "digital software Nepal",
  ],
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function uniqueKeywords(
  ...groups: (readonly string[] | string[] | undefined)[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const group of groups) {
    if (!group) continue;
    for (const kw of group) {
      const key = kw.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(kw);
      }
    }
  }
  return out;
}

export function buildPageMetadata(options: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const { title, description, path, keywords, noIndex } = options;
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: keywords ?? [...SITE_KEYWORDS],
    alternates: { canonical },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: SEO_LOCALE,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildProductMetadata(product: Product): Metadata {
  const plainDesc = stripHtml(product.description);
  const shortDesc =
    plainDesc.length > 140 ? `${plainDesc.slice(0, 137)}…` : plainDesc;

  const title = `Buy ${product.name} in ${SEO_REGION}`;
  const description =
    `Buy ${product.name} online in ${SEO_REGION} at ${SITE_NAME}. ` +
    `Price from NPR ${product.price.toLocaleString("en-NP")}. ` +
    `Pay with Fonepay or Khalti — ${shortDesc || "Fast delivery after payment verification."}`;

  const keywords = uniqueKeywords(
    SITE_KEYWORDS,
    [
      `buy ${product.name} Nepal`,
      `${product.name} Nepal`,
      `${product.brand} gift card Nepal`,
      `${product.brand} ${product.category} Nepal`,
      `${product.category} digital products Nepal`,
    ],
    BRAND_KEYWORDS[product.brandSlug]
  );

  return buildPageMetadata({
    title,
    description,
    path: `/product/${product.id}`,
    keywords,
  });
}

export function buildBrandMetadata(
  brandName: string,
  brandSlug: string,
  productCount: number
): Metadata {
  const title = `${brandName} Gift Cards in ${SEO_REGION}`;
  const description =
    `Shop ${brandName} gift cards and digital products in ${SEO_REGION}. ` +
    `${productCount}+ options at ${SITE_NAME}. Pay with Fonepay or Khalti. Instant delivery after verification.`;

  return buildPageMetadata({
    title,
    description,
    path: `/brands/${brandSlug}`,
    keywords: uniqueKeywords(
      SITE_KEYWORDS,
      [`${brandName} gift card Nepal`, `buy ${brandName} Nepal`],
      BRAND_KEYWORDS[brandSlug]
    ),
  });
}

export function buildCategoryMetadata(
  categoryName: string,
  categorySlug: string,
  productCount: number
): Metadata {
  const title = `${categoryName} Gift Cards & Digital Products — ${SEO_REGION}`;
  const description =
    `Browse ${productCount}+ ${categoryName.toLowerCase()} gift cards and digital products in ${SEO_REGION}. ` +
    `Secure checkout with Fonepay & Khalti at ${SITE_NAME}.`;

  return buildPageMetadata({
    title,
    description,
    path: `/categories/${categorySlug}`,
    keywords: uniqueKeywords(
      SITE_KEYWORDS,
      [`${categoryName} gift cards Nepal`],
      CATEGORY_KEYWORDS[categorySlug]
    ),
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    areaServed: {
      "@type": "Country",
      name: SEO_REGION,
    },
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en-NP",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: stripHtml(product.description) || product.name,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "NPR",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/product/${product.id}`,
      areaServed: SEO_REGION,
    },
  };
}

export const PAGE_SEO = {
  home: buildPageMetadata({
    title: `Buy Gift Cards & Digital Products in ${SEO_REGION}`,
    description:
      `Shop gaming gift cards, PUBG UC, Roblox, Steam, PlayStation, Xbox, Apple & Microsoft 365 in ${SEO_REGION}. ` +
      `Pay with Fonepay or Khalti at ${SITE_NAME} — trusted digital products with verified delivery.`,
    path: "/",
    keywords: [...SITE_KEYWORDS],
  }),
  giftCards: buildPageMetadata({
    title: `All Gift Cards Online in ${SEO_REGION}`,
    description:
      `Browse digital gift cards for gaming, apps & software in ${SEO_REGION}. ` +
      `Compare prices in NPR, pay with Fonepay or Khalti, and get fast delivery after verification.`,
    path: "/gift-cards",
    keywords: uniqueKeywords(SITE_KEYWORDS, [
      "all gift cards Nepal",
      "digital gift card shop Nepal",
    ]),
  }),
  gaming: buildPageMetadata({
    title: `Gaming Gift Cards & Game Credits in ${SEO_REGION}`,
    description:
      `Buy gaming gift cards — Steam, PlayStation, Xbox, Roblox, PUBG UC & more in ${SEO_REGION}. ` +
      `Top up game credits online with Fonepay or Khalti at ${SITE_NAME}.`,
    path: "/gaming",
    keywords: uniqueKeywords(SITE_KEYWORDS, CATEGORY_KEYWORDS.gaming),
  }),
  blog: buildPageMetadata({
    title: `Gift Card & Gaming Guides for ${SEO_REGION}`,
    description:
      `Expert guides on buying gift cards, PUBG UC, Roblox, Steam, and digital products safely in ${SEO_REGION}. Tips from ${SITE_NAME}.`,
    path: "/blog",
    keywords: uniqueKeywords(SITE_KEYWORDS, [
      "how to buy gift cards Nepal",
      "PUBG UC guide Nepal",
      "gaming gift card tips",
    ]),
  }),
  contact: buildPageMetadata({
    title: `Contact ${SITE_NAME} — Gift Card Support in ${SEO_REGION}`,
    description:
      `Contact ${SITE_NAME} for help with gift card orders, payments (Fonepay/Khalti), and digital product delivery in ${SEO_REGION}.`,
    path: "/contact",
  }),
  howItWorks: buildPageMetadata({
    title: `How to Buy Gift Cards Online in ${SEO_REGION}`,
    description:
      `Learn how to buy gift cards and digital products at ${SITE_NAME}: browse, pay with Fonepay or Khalti, get verified delivery in ${SEO_REGION}.`,
    path: "/how-it-works",
    keywords: uniqueKeywords(SITE_KEYWORDS, [
      "how to buy gift cards Nepal",
      "Fonepay gift card payment",
      "Khalti digital purchase Nepal",
    ]),
  }),
  brands: buildPageMetadata({
    title: `Gift Card Brands in ${SEO_REGION}`,
    description:
      `Shop Roblox, PUBG, Steam, PlayStation, Xbox, Apple, Google Play & more in ${SEO_REGION}. Compare brand gift cards at ${SITE_NAME}.`,
    path: "/brands",
  }),
  categories: buildPageMetadata({
    title: `Gift Card Categories — Gaming & Software in ${SEO_REGION}`,
    description:
      `Browse gaming and software gift card categories in ${SEO_REGION}. Digital products with Fonepay & Khalti checkout.`,
    path: "/categories",
  }),
} as const;
