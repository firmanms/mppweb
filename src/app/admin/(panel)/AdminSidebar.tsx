"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Tutup sidebar saat pindah halaman (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Kunci scroll body saat sidebar mobile terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Top Bar — hanya muncul di layar kecil */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-slate-900 text-white shrink-0">
        <span className="text-sm font-bold">Admin MPP</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay — hanya muncul di mobile saat sidebar terbuka */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar wrapper */}
      {/* Desktop: selalu tampil biasa (static, w-64) */}
      {/* Mobile: off-canvas dari kiri, bisa di-toggle */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shrink-0
          transform transition-transform duration-300 ease-in-out
          lg:static lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {children}
      </aside>
    </>
  );
}
