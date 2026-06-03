import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { BlogFaqSection } from "@/components/blog/BlogFaqSection";
import { BlogPostBody } from "@/components/blog/BlogPostBody";
import { PageHeader } from "@/components/catalog/PageHeader";
import { PageShell } from "@/components/layout/PageShell";
import { fetchBlogPost } from "@/lib/api/public-blogs";
import { buildArticleJsonLd, buildFaqJsonLd } from "@/lib/blog-seo";
import { ROUTES } from "@/lib/constants";
import { SITE_KEYWORDS } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);
  if (!post) return { title: "Post not found" };

  const description = post.metaDescription || post.excerpt || undefined;
  const canonical =
    post.canonicalUrl || `${SITE_URL}${ROUTES.blogPost(post.slug)}`;
  const keywords = post.focusKeyword
    ? [post.focusKeyword, ...SITE_KEYWORDS.slice(0, 12)]
    : [...SITE_KEYWORDS.slice(0, 15)];

  return {
    title: post.title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: canonical,
      locale: "en_NP",
      siteName: SITE_NAME,
      images: post.featuredImageUrl
        ? [{ url: post.featuredImageUrl, alt: post.featuredImageAlt || post.title }]
        : undefined,
      publishedTime: post.publishedAt || undefined,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPost(slug);

  if (!post?.content) notFound();

  const faqLd = buildFaqJsonLd(post.faq);
  const articleLd = buildArticleJsonLd(post);

  return (
    <PageShell>
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <PageHeader
        title={post.title}
        breadcrumbs={[
          { label: "Home", href: ROUTES.home },
          { label: "Blog", href: ROUTES.blog },
          { label: post.title },
        ]}
      />

      <article className="mx-auto max-w-3xl">
        <p className="mt-4 text-sm text-gray-500">
          {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
          {post.author ? ` · ${post.author.name}` : ""}
          {post.category ? ` · ${post.category.name}` : ""}
        </p>

        {post.featuredImageUrl && (
          <div className="relative mt-8 aspect-[2/1] w-full overflow-hidden rounded-2xl bg-gray-100">
            <Image
              src={post.featuredImageUrl}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 768px"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="mt-8 text-xl text-gray-600">{post.excerpt}</p>
        )}

        <div className="mt-8">
          <BlogPostBody html={post.content} />
        </div>

        {post.tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}

        <BlogFaqSection faq={post.faq} />
      </article>
    </PageShell>
  );
}
