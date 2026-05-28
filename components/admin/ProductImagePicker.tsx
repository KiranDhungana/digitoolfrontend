"use client";

import Image from "next/image";
import { ImageIcon, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { adminListMedia, type AdminMedia } from "@/lib/api/admin";

interface ProductImagePickerProps {
  imageUrl: string;
  mediaId: string;
  onChange: (value: { imageUrl: string; mediaId: string }) => void;
  label?: string;
}

export function ProductImagePicker({
  imageUrl,
  mediaId,
  onChange,
  label = "Product image",
}: ProductImagePickerProps) {
  const [library, setLibrary] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || library.length > 0) return;
    setLoading(true);
    adminListMedia({ limit: 48 })
      .then((res) => setLibrary(res.items))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load images"))
      .finally(() => setLoading(false));
  }, [open, library.length]);

  const select = (item: AdminMedia) => {
    onChange({ imageUrl: item.url, mediaId: item.id });
    setOpen(false);
  };

  const clear = () => onChange({ imageUrl: "", mediaId: "" });

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {label} <span className="font-normal text-gray-500">(optional)</span>
      </label>

      {imageUrl ? (
        <div className="relative mb-3 inline-block">
          <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <Image
              src={imageUrl}
              alt="Selected product image"
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <button
            type="button"
            onClick={clear}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
            aria-label="Remove image"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-gray-400">
          <ImageIcon className="h-8 w-8" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          {open ? "Hide library" : "Choose from image library"}
        </button>
        {imageUrl && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-2 text-sm text-gray-500 hover:text-red-600"
          >
            Use gradient only
          </button>
        )}
      </div>

      {open && (
        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          {error && (
            <p className="mb-2 text-sm text-red-600">{error}</p>
          )}
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : library.length === 0 ? (
            <p className="py-4 text-center text-sm text-gray-500">
              No images in library. Upload some under Images first.
            </p>
          ) : (
            <div className="grid max-h-64 grid-cols-4 gap-2 overflow-y-auto sm:grid-cols-6">
              {library.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                    mediaId === item.id
                      ? "border-orange-500 ring-2 ring-orange-200"
                      : "border-transparent hover:border-orange-300"
                  }`}
                >
                  <Image
                    src={item.url}
                    alt={item.alt || item.filename || "Library image"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
