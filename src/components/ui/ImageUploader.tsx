"use client";

import React, { useState } from "react";
import { UploadCloud, Link as LinkIcon, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export default function ImageUploader({ value, onChange, label = "Gambar/Logo", required = false }: ImageUploaderProps) {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("Ukuran file maksimal 1 MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError(null);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengunggah file");
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <LinkIcon className="w-4 h-4" />
          URL Gambar
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Upload (Maks 1MB)
        </button>
      </div>

      {mode === "url" ? (
        <input
          type="url"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          placeholder="https://example.com/image.jpg"
        />
      ) : (
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-500 hover:bg-primary-50 cursor-pointer transition-colors text-sm font-semibold text-slate-600 hover:text-primary-600">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
            Pilih File Gambar
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp, image/gif"
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
          <input
            type="hidden"
            required={required}
            value={value}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

      {/* Preview */}
      {value && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-xl w-fit">
          <p className="text-xs text-slate-400 font-medium mb-2 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" /> Preview
          </p>
          <img
            src={value}
            alt="Preview"
            className="w-24 h-24 object-cover rounded-lg border border-slate-200 bg-white"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjd2Q1ZTAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDgtMy4wOGExLjIgMS4yIDAgMCAwLTEuNzIgMGwtOC4xNSA4LjE1Ii8+PC9zdmc+';
            }}
          />
        </div>
      )}
    </div>
  );
}
