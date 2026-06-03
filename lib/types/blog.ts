export type BlogPostStatus = "draft" | "scheduled" | "published";

export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface BlogTag {
  id: string;
  slug: string;
  name: string;
  postCount?: number;
}

export interface BlogCategory {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  sortOrder: number;
  postCount?: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  email: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  content?: string;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  status: BlogPostStatus;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  canonicalUrl: string;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  featuredMediaId?: string | null;
  headings: string[];
  faq: BlogFaqItem[];
  categoryId?: string | null;
  category?: BlogCategory | null;
  tags: BlogTag[];
  author?: BlogAuthor | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  drafts: number;
  published: number;
  scheduled: number;
  total: number;
}

export interface BlogAiResult {
  title: string;
  slug: string;
  meta_description: string;
  focus_keyword: string;
  excerpt: string;
  content: string;
  headings: string[];
  faq: BlogFaqItem[];
  featured_image_alt: string;
}
