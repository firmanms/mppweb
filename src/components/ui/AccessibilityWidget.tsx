"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Accessibility,
  X,
  Plus,
  Minus,
  RotateCcw,
  Eye,
  Type,
  Link2,
  MousePointer2,
  AlignJustify,
} from "lucide-react";

type AccessibilityState = {
  fontSize: number; // 0 = normal, 1 = large, 2 = x-large, -1 = small
  highContrast: boolean;
  grayscale: boolean;
  highlightLinks: boolean;
  bigCursor: boolean;
  lineHeight: boolean;
};

const DEFAULT_STATE: AccessibilityState = {
  fontSize: 0,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  bigCursor: false,
  lineHeight: false,
};

const FONT_LABELS = ["Kecil", "Normal", "Besar", "Sangat Besar"];

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<AccessibilityState>(DEFAULT_STATE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("a11y-settings");
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(parsed);
      }
    } catch {}
  }, []);

  // Apply all effects & save to localStorage
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    const fontSizeMap: Record<number, string> = {
      "-1": "14px",
      0: "16px",
      1: "18px",
      2: "20px",
    };
    root.style.fontSize = fontSizeMap[state.fontSize] || "16px";

    // High Contrast
    if (state.highContrast) {
      root.classList.add("a11y-high-contrast");
    } else {
      root.classList.remove("a11y-high-contrast");
    }

    // Grayscale
    if (state.grayscale) {
      root.classList.add("a11y-grayscale");
    } else {
      root.classList.remove("a11y-grayscale");
    }

    // Highlight Links
    if (state.highlightLinks) {
      root.classList.add("a11y-highlight-links");
    } else {
      root.classList.remove("a11y-highlight-links");
    }

    // Big Cursor
    if (state.bigCursor) {
      root.classList.add("a11y-big-cursor");
    } else {
      root.classList.remove("a11y-big-cursor");
    }

    // Line Height
    if (state.lineHeight) {
      root.classList.add("a11y-line-height");
    } else {
      root.classList.remove("a11y-line-height");
    }

    try {
      localStorage.setItem("a11y-settings", JSON.stringify(state));
    } catch {}
  }, [state]);

  const handleReset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const increaseFontSize = useCallback(() => {
    setState((s) => ({ ...s, fontSize: Math.min(s.fontSize + 1, 2) }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setState((s) => ({ ...s, fontSize: Math.max(s.fontSize - 1, -1) }));
  }, []);

  const toggle = useCallback((key: keyof Omit<AccessibilityState, "fontSize">) => {
    setState((s) => ({ ...s, [key]: !s[key] }));
  }, []);

  const isModified =
    state.fontSize !== 0 ||
    state.highContrast ||
    state.grayscale ||
    state.highlightLinks ||
    state.bigCursor ||
    state.lineHeight;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-[60] w-12 h-12 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-xl flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary-300"
        aria-label="Buka menu aksesibilitas"
        title="Aksesibilitas"
      >
        <Accessibility className="w-6 h-6" />
        {isModified && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[61] bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed left-4 bottom-20 z-[62] w-[320px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 origin-bottom-left ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-primary-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Accessibility className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-sm">Menu Aksesibilitas</h3>
              <p className="text-primary-200 text-[10px]">Sesuaikan tampilan website</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Tutup menu aksesibilitas"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto max-h-[60vh]">
          {/* Font Size Control */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-bold text-slate-700">Ukuran Teks</span>
              <span className="ml-auto text-xs text-primary-600 font-semibold bg-primary-50 px-2 py-0.5 rounded-full">
                {FONT_LABELS[state.fontSize + 1]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={decreaseFontSize}
                disabled={state.fontSize <= -1}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Perkecil teks"
              >
                <Minus className="w-4 h-4" />
              </button>
              {/* Visual Indicator */}
              <div className="flex-1 h-2 bg-slate-200 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${((state.fontSize + 1) / 3) * 100}%` }}
                />
              </div>
              <button
                onClick={increaseFontSize}
                disabled={state.fontSize >= 2}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:border-primary-300 hover:text-primary-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Perbesar teks"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Toggle Options */}
          <ToggleOption
            icon={<Eye className="w-4 h-4" />}
            label="Kontras Tinggi"
            desc="Warna kontras lebih tajam"
            active={state.highContrast}
            onToggle={() => toggle("highContrast")}
          />

          <ToggleOption
            icon={<Eye className="w-4 h-4" />}
            label="Mode Skala Abu"
            desc="Tampilkan tanpa warna"
            active={state.grayscale}
            onToggle={() => toggle("grayscale")}
          />

          <ToggleOption
            icon={<Link2 className="w-4 h-4" />}
            label="Sorot Tautan"
            desc="Tandai semua link dengan warna"
            active={state.highlightLinks}
            onToggle={() => toggle("highlightLinks")}
          />

          <ToggleOption
            icon={<MousePointer2 className="w-4 h-4" />}
            label="Kursor Besar"
            desc="Perbesar ukuran kursor mouse"
            active={state.bigCursor}
            onToggle={() => toggle("bigCursor")}
          />

          <ToggleOption
            icon={<AlignJustify className="w-4 h-4" />}
            label="Spasi Baris Lebar"
            desc="Perbesar jarak antar baris teks"
            active={state.lineHeight}
            onToggle={() => toggle("lineHeight")}
          />

          {/* Reset Button */}
          {isModified && (
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset ke Pengaturan Awal
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            Aksesibilitas · MPP Kabupaten Bandung
          </p>
        </div>
      </div>
    </>
  );
}

function ToggleOption({
  icon,
  label,
  desc,
  active,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
        active
          ? "bg-primary-50 border-primary-200 shadow-sm"
          : "bg-white border-slate-100 hover:border-slate-200"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
          active
            ? "bg-primary-600 text-white"
            : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm font-bold transition-colors ${
            active ? "text-primary-700" : "text-slate-700"
          }`}
        >
          {label}
        </span>
        <span className="text-[11px] text-slate-400 block">{desc}</span>
      </div>
      {/* Toggle Switch */}
      <div
        className={`w-10 h-5.5 rounded-full relative shrink-0 transition-colors ${
          active ? "bg-primary-600" : "bg-slate-200"
        }`}
        style={{ width: 40, height: 22 }}
      >
        <div
          className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
            active ? "left-[21px]" : "left-[3px]"
          }`}
        />
      </div>
    </button>
  );
}
