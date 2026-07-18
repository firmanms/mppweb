"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useMemo } from "react";

// Import react-quill-new dynamically with SSR disabled
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 bg-slate-50 animate-pulse rounded-xl border border-slate-200"></div>,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // Custom toolbar modules per user request:
  // bold, italic, underline
  // paragraph alignment (right, left, justify)
  // numbered and bullet lists
  const modules = useMemo(
    () => ({
      toolbar: [
        ["bold", "italic", "underline"],
        [{ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" }],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
    }),
    []
  );

  return (
    <div className="rich-text-editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "Tulis konten di sini..."}
        className="bg-white rounded-xl"
      />
      <style jsx global>{`
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 0.75rem;
          border-top-right-radius: 0.75rem;
          border-color: #e2e8f0;
          background-color: #f8fafc;
        }
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 0.75rem;
          border-bottom-right-radius: 0.75rem;
          border-color: #e2e8f0;
          min-height: 200px;
          font-family: inherit;
        }
        .rich-text-editor-container .ql-editor {
          min-height: 200px;
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}
