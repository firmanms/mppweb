"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileText, Filter, ChevronRight, Clock, Building2 } from "lucide-react";

type Layanan = {
  id: number;
  nama: string;
  slug: string;
  kategoriId: number | null;
  kategori?: { id: number; nama: string } | null;
  status: string;
  waktuPenyelesaian: string | null;
  biaya: string | null;
  populer: boolean;
  instansi: { nama: string; slug: string };
};

export default function LayananList({
  layananList,
  instansiNames,
  categories,
}: {
  layananList: Layanan[];
  instansiNames: string[];
  categories: string[];
}) {
  const [search, setSearch] = useState("");
  const [filterInstansi, setFilterInstansi] = useState("Semua");
  const [filterKategori, setFilterKategori] = useState("Semua");
  const [filterStatus, setFilterStatus] = useState("Semua");

  const filtered = useMemo(() => {
    return layananList.filter((lay) => {
      const matchSearch = lay.nama.toLowerCase().includes(search.toLowerCase());
      const matchInstansi = filterInstansi === "Semua" || lay.instansi.nama === filterInstansi;
      const matchKategori = filterKategori === "Semua" || (lay.kategori?.nama || "Lainnya") === filterKategori;
      const matchStatus = filterStatus === "Semua" || lay.status === filterStatus;
      return matchSearch && matchInstansi && matchKategori && matchStatus;
    });
  }, [layananList, search, filterInstansi, filterKategori, filterStatus]);

  return (
    <>
      {/* Search */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm text-base"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-10 justify-center">
        <select
          value={filterInstansi}
          onChange={(e) => setFilterInstansi(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Semua">Semua Instansi</option>
          {instansiNames.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Semua">Semua Kategori</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="Semua">Semua Status</option>
          <option value="gratis">Gratis</option>
          <option value="berbayar">Berbayar</option>
        </select>
      </div>

      {/* Results */}
      <p className="text-sm text-slate-500 mb-6">{filtered.length} layanan ditemukan</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500">Layanan tidak ditemukan</p>
          <p className="text-sm text-slate-400 mt-1">Coba kata kunci atau filter lain</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((lay) => (
            <Link
              key={lay.id}
              href={`/layanan/${lay.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-primary-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 relative"
            >
              {lay.populer && (
                <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-bold">
                  ⭐ Populer
                </span>
              )}
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-2 line-clamp-2">
                {lay.nama}
              </h3>
              <p className="text-sm text-slate-500 mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                {lay.instansi.nama}
              </p>
              <div className="flex items-center gap-3 text-xs">
                <span
                  className={`px-2.5 py-1 rounded-full font-semibold ${
                    lay.status === "gratis"
                      ? "bg-success-50 text-success-700"
                      : "bg-accent-50 text-accent-700"
                  }`}
                >
                  {lay.status === "gratis" ? "Gratis" : lay.biaya || "Berbayar"}
                </span>
                {lay.waktuPenyelesaian && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {lay.waktuPenyelesaian}
                  </span>
                )}
              </div>
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-primary-500" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
