"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import { FontSize, LineHeight, TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { FontFamily } from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Strikethrough,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { compactDescriptionHtml, plainTextToEditorHtml } from "@/lib/sanitizeHtml";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Times New Roman", value: "'Times New Roman', serif" },
  { label: "Courier New", value: "'Courier New', monospace" },
  { label: "Verdana", value: "Verdana, sans-serif" },
];

const LINE_HEIGHTS = [
  { label: "Default", value: "" },
  { label: "0.75", value: "0.75" },
  { label: "0.8", value: "0.8" },
  { label: "0.85", value: "0.85" },
  { label: "0.9", value: "0.9" },
  { label: "0.95", value: "0.95" },
  { label: "1", value: "1" },
  { label: "1.15", value: "1.15" },
  { label: "1.25", value: "1.25" },
  { label: "1.5", value: "1.5" },
  { label: "1.75", value: "1.75" },
  { label: "2", value: "2" },
  { label: "2.5", value: "2.5" },
  { label: "3", value: "3" },
];

const FONT_SIZES = [
  { label: "Default", value: "" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
];

const TEXT_COLORS = [
  "#111827",
  "#dc2626",
  "#ea580c",
  "#ca8a04",
  "#16a34a",
  "#2563eb",
  "#7c3aed",
  "#db2777",
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  required?: boolean;
  minHeight?: string;
}

function LineHeightSelect({ editor }: { editor: Editor }) {
  const lineHeight = useEditorState({
    editor,
    selector: ({ editor: ed }) => ed?.getAttributes("textStyle").lineHeight ?? "",
  });

  return (
    <select
      title="Line spacing"
      value={lineHeight}
      onChange={(e) => {
        const height = e.target.value;
        if (!height) {
          editor.chain().focus().unsetLineHeight().run();
        } else {
          editor.chain().focus().setLineHeight(height).run();
        }
      }}
      className="rounded-lg border-0 bg-transparent py-1.5 pl-2 pr-6 text-xs font-medium text-gray-700 outline-none hover:bg-gray-100"
    >
      {LINE_HEIGHTS.map((h) => (
        <option key={h.label} value={h.value}>
          {h.value ? h.label : "Spacing"}
        </option>
      ))}
    </select>
  );
}

function FontSizeSelect({ editor }: { editor: Editor }) {
  const fontSize = useEditorState({
    editor,
    selector: ({ editor: ed }) => ed?.getAttributes("textStyle").fontSize ?? "",
  });

  return (
    <select
      title="Font size"
      value={fontSize}
      onChange={(e) => {
        const size = e.target.value;
        if (!size) {
          editor.chain().focus().unsetFontSize().run();
        } else {
          editor.chain().focus().setFontSize(size).run();
        }
      }}
      className="rounded-lg border-0 bg-transparent py-1.5 pl-2 pr-6 text-xs font-medium text-gray-700 outline-none hover:bg-gray-100"
    >
      {FONT_SIZES.map((s) => (
        <option key={s.label} value={s.value}>
          {s.value ? s.label : "Size"}
        </option>
      ))}
    </select>
  );
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition-colors ${
        active
          ? "bg-orange-100 text-orange-700"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

function EditorToolbar({ editor }: { editor: Editor }) {
  // Re-render toolbar when selection or formatting changes
  useEditorState({
    editor,
    selector: ({ editor: ed }) => ({
      tick: ed?.state.selection.from ?? 0,
    }),
  });

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-gray-100 bg-gray-50/80 px-2 py-1.5">
      <ToolbarButton
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-6 w-px bg-gray-200" />

      <FontSizeSelect editor={editor} />
      <LineHeightSelect editor={editor} />

      <select
        title="Font"
        value={editor.getAttributes("textStyle").fontFamily ?? ""}
        onChange={(e) => {
          const font = e.target.value;
          if (!font) {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(font).run();
          }
        }}
        className="max-w-[120px] rounded-lg border-0 bg-transparent py-1.5 pl-2 pr-6 text-xs font-medium text-gray-700 outline-none hover:bg-gray-100"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.label} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <span className="mx-1 h-6 w-px bg-gray-200" />

      <div className="flex items-center gap-0.5" title="Text color">
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() => editor.chain().focus().setColor(color).run()}
            className="h-5 w-5 rounded-full border border-gray-200 transition-transform hover:scale-110"
            style={{ backgroundColor: color }}
          />
        ))}
        <input
          type="color"
          title="Custom text color"
          className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />
      </div>

      <ToolbarButton
        title="Highlight"
        active={editor.isActive("highlight")}
        onClick={() =>
          editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()
        }
      >
        <Highlighter className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        title="Align left"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align center"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Align right"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>

      <span className="mx-1 h-6 w-px bg-gray-200" />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        title="Link"
        active={editor.isActive("link")}
        onClick={setLink}
      >
        <Link2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  required,
  minHeight = "220px",
}: RichTextEditorProps) {
  const lastEmittedRef = useRef(value);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      TextStyle,
      FontSize,
      LineHeight,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: plainTextToEditorHtml(value),
    editorProps: {
      attributes: {
        class:
          "prose-product-editor min-h-[180px] px-4 py-3 text-base text-gray-900 outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      const html = compactDescriptionHtml(ed.getHTML());
      const next = html === "<p></p>" || !html.trim() ? "" : html;
      lastEmittedRef.current = next;
      onChange(next);
    },
  });

  // Only reset editor when value changes from outside (e.g. loading another product)
  useEffect(() => {
    if (!editor) return;
    if (lastEmittedRef.current === value) return;

    lastEmittedRef.current = value;
    editor.commands.setContent(plainTextToEditorHtml(value), { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className="animate-pulse rounded-xl border border-gray-200 bg-gray-50"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
      <EditorToolbar editor={editor} />

      <div style={{ minHeight }} className="bg-gray-50/30 product-description-editor">
        <EditorContent editor={editor} />
      </div>

      {required && (
        <input
          type="text"
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          value={value.replace(/<[^>]+>/g, "").trim()}
          required
          onChange={() => {}}
        />
      )}
    </div>
  );
}
