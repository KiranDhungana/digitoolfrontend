"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { RichTextEditor, handleRichTextEditorFormKeyDown, richTextHasContent } from "@/components/admin/RichTextEditor";
import { ProductImagePicker } from "@/components/admin/ProductImagePicker";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  adminCreateBlog,
  adminGenerateBlogAi,
  adminUpdateBlog,
} from "@/lib/api/blogs";
import { slugify } from "@/lib/slugify";
import type { BlogCategory, BlogFaqItem, BlogPost } from "@/lib/types/blog";

interface BlogFormProps {
  categories: BlogCategory[];
  initial?: BlogPost;
}

export function BlogForm({ categories, initial }: BlogFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    focusKeyword: initial?.focusKeyword ?? "",
    metaDescription: initial?.metaDescription ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    status: initial?.status ?? "draft",
    scheduledAt: initial?.scheduledAt
      ? initial.scheduledAt.slice(0, 16)
      : "",
    categoryId: initial?.categoryId ?? "",
    tagNames: (initial?.tags ?? []).map((t) => t.name).join(", "),
    canonicalUrl: initial?.canonicalUrl ?? "",
    featuredImageUrl: initial?.featuredImageUrl ?? "",
    featuredMediaId: initial?.featuredMediaId ?? "",
    featuredImageAlt: initial?.featuredImageAlt ?? "",
    headings: (initial?.headings ?? []).join("\n"),
    faq: (initial?.faq?.length ? initial.faq : [{ question: "", answer: "" }]) as BlogFaqItem[],
  });

  const updateFaq = (index: number, field: keyof BlogFaqItem, value: string) => {
    setForm((prev) => {
      const faq = [...prev.faq];
      faq[index] = { ...faq[index], [field]: value };
      return { ...prev, faq };
    });
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      setError("Enter a prompt for AI generation");
      return;
    }
    setAiLoading(true);
    setError("");
    try {
      const result = await adminGenerateBlogAi(aiPrompt.trim());
      setForm((prev) => ({
        ...prev,
        title: result.title,
        slug: result.slug,
        focusKeyword: result.focus_keyword,
        metaDescription: result.meta_description,
        excerpt: result.excerpt,
        content: result.content,
        featuredImageAlt: result.featured_image_alt,
        headings: (result.headings ?? []).join("\n"),
        faq: result.faq?.length ? result.faq : prev.faq,
      }));
      setSlugTouched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  const buildBody = () => ({
    title: form.title,
    slug: form.slug || slugify(form.title),
    focusKeyword: form.focusKeyword || null,
    metaDescription: form.metaDescription || null,
    excerpt: form.excerpt || null,
    content: form.content,
    status: form.status,
    scheduledAt:
      form.status === "scheduled" && form.scheduledAt
        ? new Date(form.scheduledAt).toISOString()
        : null,
    categoryId: form.categoryId || null,
    tagNames: form.tagNames
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    canonicalUrl: form.canonicalUrl || undefined,
    featuredImageUrl: form.featuredImageUrl || null,
    featuredMediaId: form.featuredMediaId || null,
    featuredImageAlt: form.featuredImageAlt || null,
    headings: form.headings
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean),
    faq: form.faq.filter((f) => f.question.trim() && f.answer.trim()),
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!richTextHasContent(form.content)) {
      setError("Content is required");
      return;
    }
    setLoading(true);
    try {
      if (initial) {
        await adminUpdateBlog(initial.id, buildBody());
      } else {
        await adminCreateBlog(buildBody());
      }
      router.push("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={handleRichTextEditorFormKeyDown}
      className="max-w-4xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6"
    >
      <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
        <p className="text-sm font-medium text-gray-900">AI content assistant</p>
        <p className="mt-1 text-xs text-gray-600">
          Describe the topic; title, slug, meta, content, headings, and FAQ are filled in.
        </p>
        <textarea
          className="mt-3 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          rows={2}
          placeholder="e.g. How to buy PUBG UC safely in Nepal"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
        />
        <Button
          type="button"
          variant="secondary"
          className="mt-2"
          disabled={aiLoading}
          onClick={handleAiGenerate}
        >
          <Sparkles className="h-4 w-4" />
          {aiLoading ? "Generating..." : "Generate with AI"}
        </Button>
      </div>

      <Input
        label="Title"
        value={form.title}
        onChange={(e) => {
          const title = e.target.value;
          setForm((prev) => ({
            ...prev,
            title,
            slug: slugTouched ? prev.slug : slugify(title),
          }));
        }}
        required
      />
      <Input
        label="Slug"
        value={form.slug}
        onChange={(e) => {
          setSlugTouched(true);
          setForm({ ...form, slug: e.target.value });
        }}
        required
      />
      <Input
        label="Focus keyword"
        value={form.focusKeyword}
        onChange={(e) => setForm({ ...form, focusKeyword: e.target.value })}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Meta description (50–160 chars)
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          rows={2}
          maxLength={160}
          value={form.metaDescription}
          onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
        />
        <p className="mt-1 text-xs text-gray-500">{form.metaDescription.length}/160</p>
      </div>
      <Input
        label="Excerpt"
        value={form.excerpt}
        onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Status</label>
          <select
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as typeof form.status })
            }
          >
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
          </select>
          {form.status !== "published" && (
            <p className="mt-1.5 text-xs text-amber-700">
              Only <strong>Published</strong> posts appear on{" "}
              <a href="/blog" className="underline" target="_blank" rel="noreferrer">
                /blog
              </a>
              . Drafts are visible in admin preview only.
            </p>
          )}
        </div>
        {form.status === "scheduled" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Publish at
            </label>
            <input
              type="datetime-local"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              required
            />
          </div>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
        <select
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">None</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Tags (comma-separated)"
        value={form.tagNames}
        onChange={(e) => setForm({ ...form, tagNames: e.target.value })}
      />
      <ProductImagePicker
        imageUrl={form.featuredImageUrl}
        mediaId={form.featuredMediaId}
        onChange={({ imageUrl, mediaId }) =>
          setForm({ ...form, featuredImageUrl: imageUrl, featuredMediaId: mediaId })
        }
      />
      <Input
        label="Featured image alt text"
        value={form.featuredImageAlt}
        onChange={(e) => setForm({ ...form, featuredImageAlt: e.target.value })}
      />
      <Input
        label="Canonical URL (optional)"
        value={form.canonicalUrl}
        onChange={(e) => setForm({ ...form, canonicalUrl: e.target.value })}
        placeholder="https://digitoolera.com/blog/your-slug"
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Content</label>
        <RichTextEditor
          key={initial?.id ?? "new-blog"}
          value={form.content}
          onChange={(content) => setForm((prev) => ({ ...prev, content }))}
          required
          minHeight="320px"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Headings (one per line, for outline)
        </label>
        <textarea
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm font-mono"
          rows={4}
          value={form.headings}
          onChange={(e) => setForm({ ...form, headings: e.target.value })}
        />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">FAQ</label>
          <button
            type="button"
            className="text-sm text-orange-600 hover:underline"
            onClick={() =>
              setForm({
                ...form,
                faq: [...form.faq, { question: "", answer: "" }],
              })
            }
          >
            + Add question
          </button>
        </div>
        <div className="space-y-3">
          {form.faq.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-100 p-3 space-y-2">
              <Input
                label="Question"
                value={item.question}
                onChange={(e) => updateFaq(i, "question", e.target.value)}
              />
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">Answer</label>
                <textarea
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  rows={2}
                  value={item.answer}
                  onChange={(e) => updateFaq(i, "answer", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="secondary" disabled={loading}>
          {loading ? "Saving..." : initial ? "Update post" : "Create post"}
        </Button>
        {initial && (
          <Link href={`/admin/blogs/preview/${initial.id}`}>
            <Button type="button" variant="ghost">
              Preview
            </Button>
          </Link>
        )}
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/blogs")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
