"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileText, ChevronRight, Filter } from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";

type Berita = {
  id: number;
  judul: string;
  slug: string;
  kategoriId: number | null;
  kategori?: { id: number; nama: string } | null;
  ringkasan: string | null;
  fotoUtama: string | null;
  featured: boolean;
  publishedAt: string;
};

export default function BeritaList({
  beritaList,
  categories,
}: {
  beritaList: Berita[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [filterKategori, setFilterKategori] = useState("Semua");

  const filtered = useMemo(() => {
    return beritaList.filter((b) => {
      const matchSearch = b.judul.toLowerCase().includes(search.toLowerCase());
      const matchKategori = filterKategori === "Semua" || (b.kategori?.nama || "Lainnya") === filterKategori;
      return matchSearch && matchKategori;
    });
  }, [beritaList, search, filterKategori]);

  const featuredNews = filtered.filter((b) => b.featured);
  const regularNews = filtered.filter((b) => !b.featured);

  return (
    <>
      {/* Search & Filter */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm text-base"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setFilterKategori("Semua")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterKategori === "Semua"
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300"
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterKategori(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterKategori === cat
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Berita Unggulan</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredNews.map((berita) => (
              <Link
                key={berita.id}
                href={`/berita/${berita.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-56 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-white/20" />
                  </div>
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-accent-500 text-slate-900 text-xs font-bold">
                      Unggulan
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold">
                      {berita.kategori?.nama || "-"}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs text-slate-400 mb-2">{formatDate(berita.publishedAt)}</p>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-3">
                    {berita.judul}
                  </h3>
                  {berita.ringkasan && (
                    <p className="text-sm text-slate-500 line-clamp-2">{truncateText(berita.ringkasan, 150)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500">Berita tidak ditemukan</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(regularNews.length > 0 ? regularNews : filtered).map((berita) => (
            <Link
              key={berita.id}
              href={`/berita/${berita.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-12 h-12 text-primary-300" />
                </div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                    {berita.kategori?.nama || "-"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-400 mb-2">{formatDate(berita.publishedAt)}</p>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-3 line-clamp-2">
                  {berita.judul}
                </h3>
                {berita.ringkasan && (
                  <p className="text-sm text-slate-500 line-clamp-2">{truncateText(berita.ringkasan, 100)}</p>
                )}
                <div className="mt-4 flex items-center text-primary-600 text-sm font-semibold">
                  Baca selengkapnya
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
