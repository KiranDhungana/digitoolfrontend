import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { fetchBlogPosts } from "@/lib/api/public-blogs";
import { ROUTES } from "@/lib/constants";
import { PAGE_SEO } from "@/lib/seo";

export const metadata: Metadata = PAGE_SEO.blog;

export default async function BlogIndexPage() {
  const posts = await fetchBlogPosts({ limit: 48 });

  return (
    <PageShell>
      <PageHeader
        title="Gift card & gaming guides for Nepal"
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Blog" },
        ]}
      />
      <p className="mt-2 max-w-2xl text-gray-600">
        How to buy PUBG UC, Roblox, Steam, and gift cards safely in Nepal — tips
        from Digitoolera.
      </p>

      {posts.length === 0 ? (
        <p className="mt-12 text-gray-500">No posts published yet. Check back soon.</p>
      ) : (
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={ROUTES.blogPost(post.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-orange-200 hover:shadow-md"
              >
                {post.featuredImageUrl ? (
                  <div className="relative aspect-[16/10] bg-gray-100">
                    <Image
                      src={post.featuredImageUrl}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover transition group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-gradient-to-br from-orange-100 to-orange-200" />
                )}
                <div className="flex flex-1 flex-col p-5">
                  {post.category && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                      {post.category.name}
                    </span>
                  )}
                  <h2 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-orange-700">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
                  )}
                  <p className="mt-auto pt-4 text-xs text-gray-500">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
