"use client";

import {
  Check,
  Copy,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@/components/admin/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  adminDeleteMedia,
  adminListMedia,
  adminUploadMediaBulk,
  type AdminMedia,
} from "@/lib/api/admin";

const PAGE_SIZE = 48;
const MAX_BULK = 50;

function formatBytes(bytes: number | null) {
  if (bytes == null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<AdminMedia[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [folder, setFolder] = useState("ecommerce");
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await adminListMedia({ limit: PAGE_SIZE, offset: 0 });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const images = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    if (!images.length) {
      setError("Only image files are allowed");
      return;
    }
    setError("");
    setPendingFiles((prev) => {
      const merged = [...prev, ...images];
      if (merged.length > MAX_BULK) {
        setError(`Maximum ${MAX_BULK} images per upload. Extra files were ignored.`);
        return merged.slice(0, MAX_BULK);
      }
      return merged;
    });
    setOpen(true);
  };

  const removePending = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearPending = () => {
    setPendingFiles([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!pendingFiles.length) return;
    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const result = await adminUploadMediaBulk(pendingFiles, {
        folder: folder.trim() || "ecommerce",
        alt: alt.trim() || undefined,
      });

      if (result.uploadedCount > 0) {
        setSuccess(
          `Uploaded ${result.uploadedCount} image${result.uploadedCount === 1 ? "" : "s"}.`
        );
        setOpen(false);
        setAlt("");
        clearPending();
        await load();
      }

      if (result.failedCount > 0) {
        const detail = result.failed
          .slice(0, 3)
          .map((f) => `${f.filename}: ${f.error}`)
          .join("; ");
        const more =
          result.failedCount > 3 ? ` (+${result.failedCount - 3} more)` : "";
        setError(
          `${result.failedCount} failed${result.uploadedCount > 0 ? " (others uploaded)" : ""}: ${detail}${more}`
        );
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onUploadSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUpload();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const handleDelete = async (item: AdminMedia) => {
    if (!confirm(`Delete "${item.filename || item.publicId}"? This removes it from Cloudinary.`)) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      await adminDeleteMedia(item.id);
      setItems((prev) => prev.filter((m) => m.id !== item.id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const copyUrl = async (item: AdminMedia) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Could not copy URL to clipboard");
    }
  };

  const openUploadModal = () => {
    setError("");
    setSuccess("");
    setOpen(true);
  };

  const dropZone = (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
        dragOver
          ? "border-orange-400 bg-orange-50"
          : "border-gray-300 bg-gray-50 hover:border-orange-300"
      }`}
    >
      <Upload className="mx-auto h-8 w-8 text-gray-400" />
      <p className="mt-2 text-sm font-medium text-gray-700">
        Drag and drop images here
      </p>
      <p className="mt-1 text-xs text-gray-500">
        or click to browse · up to {MAX_BULK} files · 10MB each
      </p>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="mt-4 block w-full cursor-pointer text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-orange-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-orange-700 hover:file:bg-orange-100"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Images</h1>
          <p className="text-gray-600">
            Bulk upload to Cloudinary and reuse URLs across your catalogue.
          </p>
        </div>
        <Button variant="secondary" onClick={openUploadModal}>
          <Upload className="h-4 w-4" />
          Bulk upload
        </Button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}

      <p className="mt-4 text-sm text-gray-500">
        {total} image{total === 1 ? "" : "s"} in library
      </p>

      {loading ? (
        <div className="mt-12 flex justify-center text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
          <p className="mb-4 text-center text-gray-600">No images yet. Drop files to upload.</p>
          {dropZone}
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={item.url}
                  alt={item.alt || item.filename || "Uploaded image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="space-y-2 p-3">
                <p className="truncate text-sm font-medium text-gray-900">
                  {item.filename || item.publicId.split("/").pop()}
                </p>
                <p className="text-xs text-gray-500">
                  {item.width && item.height
                    ? `${item.width}×${item.height}`
                    : "—"}{" "}
                  · {formatBytes(item.bytes)} · {item.format || "—"}
                </p>
                {item.alt && (
                  <p className="truncate text-xs text-gray-600">{item.alt}</p>
                )}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => copyUrl(item)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy URL
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-lg border border-red-100 px-2 py-1.5 text-red-600 hover:bg-red-50"
                    aria-label="Delete image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        title="Bulk upload images"
        open={open}
        onClose={() => {
          if (!uploading) {
            setOpen(false);
            clearPending();
          }
        }}
      >
        <form onSubmit={onUploadSubmit} className="space-y-4">
          {dropZone}

          {pendingFiles.length > 0 && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700">
                  {pendingFiles.length} file{pendingFiles.length === 1 ? "" : "s"} selected
                </p>
                <button
                  type="button"
                  onClick={clearPending}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
              <ul className="max-h-40 space-y-1 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-2">
                {pendingFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between gap-2 rounded-md bg-white px-2 py-1.5 text-sm"
                  >
                    <span className="truncate text-gray-800">{file.name}</span>
                    <span className="shrink-0 text-xs text-gray-500">
                      {formatBytes(file.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removePending(index)}
                      className="shrink-0 text-gray-400 hover:text-red-600"
                      aria-label={`Remove ${file.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Input
            label="Folder"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="ecommerce"
          />
          <Input
            label="Alt text (optional, applies to all in this batch)"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Describe the images for accessibility"
          />
          <Button
            type="submit"
            variant="secondary"
            className="w-full py-2.5"
            disabled={uploading || pendingFiles.length === 0}
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading {pendingFiles.length} image
                {pendingFiles.length === 1 ? "" : "s"}…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload {pendingFiles.length || ""} image
                {pendingFiles.length === 1 ? "" : "s"}
              </>
            )}
          </Button>
        </form>
      </Modal>
    </div>
  );
}
