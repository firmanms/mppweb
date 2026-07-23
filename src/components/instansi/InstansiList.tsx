"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, Filter, ChevronRight, MapPin } from "lucide-react";

type Instansi = {
  id: number;
  nama: string;
  slug: string;
  kategoriId: number | null;
  kategori?: { id: number; nama: string } | null;
  lantai?: string | null;
  deskripsi: string | null;
  logo: string | null;
  lokasiLoket: string | null;
  jamPelayanan: string | null;
  _count: { layanan: number };
};

export default function InstansiList({ instansiList }: { instansiList: Instansi[] }) {
  const categories = ["Semua", ...new Set(instansiList.map((inst) => inst.kategori?.nama || "Lainnya"))].sort();

  // Dynamic floor options: only floors that actually exist in the data
  const floors = useMemo(() => {
    const existingFloors = new Set<string>();
    instansiList.forEach((inst) => {
      if (inst.lantai && inst.lantai.trim()) {
        existingFloors.add(inst.lantai.trim());
      }
    });
    const sorted = Array.from(existingFloors).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
    return ["Semua Lantai", ...sorted];
  }, [instansiList]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeFloor, setActiveFloor] = useState("Semua Lantai");

  const filtered = useMemo(() => {
    return instansiList.filter((inst) => {
      const matchSearch = inst.nama.toLowerCase().includes(search.toLowerCase());
      const matchCategory = activeCategory === "Semua" || (inst.kategori?.nama || "Lainnya") === activeCategory;
      const matchFloor = activeFloor === "Semua Lantai" || inst.lantai === activeFloor;
      return matchSearch && matchCategory && matchFloor;
    });
  }, [instansiList, search, activeCategory, activeFloor]);

  return (
    <>
      {/* Search & Filter */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari instansi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm text-base"
            />
          </div>

          {/* Floor Selection Dropdown */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={activeFloor}
              onChange={(e) => setActiveFloor(e.target.value)}
              className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm shadow-sm"
            >
              {floors.map((fl) => (
                <option key={fl} value={fl}>
                  {fl}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Pill List */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-primary-300 hover:text-primary-700"
              }`}
            >
              <Filter className="w-3.5 h-3.5 inline mr-1.5" />
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-lg text-slate-500">Instansi tidak ditemukan</p>
          <p className="text-sm text-slate-400 mt-1">Coba kata kunci atau filter lantai/kategori lain</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inst) => (
            <Link
              key={inst.id}
              href={`/instansi/${inst.slug}`}
              className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-primary-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0 group-hover:border-primary-200 transition-colors overflow-hidden">
                  {inst.logo ? (
                    <img src={inst.logo} alt={`Logo ${inst.nama}`} className="w-full h-full object-contain" />
                  ) : (
                    <Building2 className="w-7 h-7 text-primary-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {inst.nama}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-50 text-slate-500">
                      {inst.kategori?.nama || "-"}
                    </span>
                    {inst.lantai && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {inst.lantai}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {inst.deskripsi && (
                <div 
                  className="text-sm text-slate-500 mb-4 line-clamp-2 prose-content prose-sm flex-1"
                  dangerouslySetInnerHTML={{ __html: inst.deskripsi }}
                />
              )}

              {inst.lokasiLoket && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                  <span className="truncate">{inst.lokasiLoket}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                <span className="text-sm text-primary-600 font-semibold">
                  {inst._count.layanan} Layanan
                </span>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
