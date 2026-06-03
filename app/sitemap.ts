import type { MetadataRoute } from "next";
import { fetchBlogSitemapEntries } from "@/lib/api/public-blogs";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = [
  "",
  "/gift-cards",
  "/categories",
  "/brands",
  "/gaming",
  "/official-store",
  "/promotions",
  "/contact",
  "/how-it-works",
  "/blog",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const blogEntries = await fetchBlogSitemapEntries();
  const posts: MetadataRoute.Sitemap = blogEntries.map((entry) => ({
    url: `${SITE_URL}/blog/${entry.slug}`,
    lastModified: new Date(entry.lastmod),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...posts];
}
