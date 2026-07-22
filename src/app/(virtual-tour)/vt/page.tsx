import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Building2,
  FileText,
  MapPin,
  Clock,
  Phone,
  ChevronRight,
  ExternalLink,
  Globe,
  Search,
  Layers,
  Eye,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Tour — MPP Kabupaten Bandung",
  description:
    "Jelajahi Mal Pelayanan Publik Kabupaten Bandung secara virtual. Lihat informasi instansi dan layanan yang tersedia.",
};

export default async function VirtualTourIndexPage() {
  const [instansiList, layananPopuler, pengaturan, totalLayanan] =
    await Promise.all([
      prisma.instansi.findMany({
        orderBy: { nama: "asc" },
        include: {
          kategori: true,
          _count: { select: { layanan: true } },
        },
      }),
      prisma.layanan.findMany({
        where: { populer: true },
        orderBy: { nama: "asc" },
        include: { instansi: true },
        take: 8,
      }),
      prisma.pengaturan.findUnique({ where: { id: 1 } }),
      prisma.layanan.count(),
    ]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ====== HERO ====== */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-primary-500/20 via-primary-700/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 -left-20 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 -right-20 w-80 h-80 bg-primary-400/10 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16">
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 backdrop-blur-sm">
              <Eye className="w-4 h-4 text-primary-400" />
              Virtual Tour — Informasi Instansi & Layanan
            </span>
          </div>

          {/* Heading */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Mal Pelayanan Publik
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f59e0b 100%)",
                }}
              >
                Kabupaten Bandung
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
              {pengaturan?.headerSubtitle ||
                "Pelayanan publik semakin mudah, cepat, dan terintegrasi. Jelajahi informasi instansi dan layanan yang tersedia di MPP."}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mb-16">
            <div className="text-center">
              <p
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {instansiList.length}
              </p>
              <p className="text-sm text-slate-400 mt-1">Instansi</p>
            </div>
            <div className="w-px h-14 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <p
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {totalLayanan}
              </p>
              <p className="text-sm text-slate-400 mt-1">Layanan</p>
            </div>
            <div className="w-px h-14 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <p
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {layananPopuler.length}
              </p>
              <p className="text-sm text-slate-400 mt-1">Layanan Populer</p>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#instansi"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #1e56a0 0%, #163e75 100%)",
              }}
            >
              <Building2 className="w-4 h-4" />
              Lihat Instansi
            </a>
            <a
              href="#layanan-populer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              Layanan Populer
            </a>
          </div>
        </div>
      </section>

      {/* ====== INSTANSI ====== */}
      <section id="instansi" className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 text-xs font-bold uppercase tracking-wider text-primary-400 mb-4">
                <Layers className="w-3.5 h-3.5" />
                Instansi Tergabung
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Daftar Instansi
              </h2>
              <p className="text-slate-400 mt-2 max-w-lg">
                Seluruh instansi yang membuka layanan di MPP Kabupaten Bandung
              </p>
            </div>
          </div>

          {/* Instansi grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {instansiList.map((inst) => (
              <Link
                key={inst.id}
                href={`/vt/instansi/${inst.slug}`}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-primary-500/30 transition-all duration-300"
              >
                {/* Content */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0 overflow-hidden">
                    {inst.logo ? (
                      <img
                        src={inst.logo}
                        alt={inst.nama}
                        className="w-full h-full object-contain p-1.5"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-primary-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors leading-snug mb-1.5">
                      {inst.nama}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400">
                        {inst.kategori?.nama || "Instansi"}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {inst._count.layanan} layanan
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-primary-400 transition-colors shrink-0 mt-1" />
                </div>

                {/* Subtle info */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[11px] text-slate-500">
                  {inst.lokasiLoket && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {inst.lokasiLoket}
                    </span>
                  )}
                  {inst.jamPelayanan && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {inst.jamPelayanan}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== LAYANAN POPULER ====== */}
      <section id="layanan-populer" className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-[#0c1424] to-slate-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 text-xs font-bold uppercase tracking-wider text-accent-400 mb-4">
                <Search className="w-3.5 h-3.5" />
                Paling Dicari
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold text-white"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Layanan Populer
              </h2>
              <p className="text-slate-400 mt-2 max-w-lg">
                Layanan yang paling sering diakses oleh masyarakat
              </p>
            </div>
          </div>

          {/* Layanan grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {layananPopuler.map((lay) => (
              <Link
                key={lay.id}
                href={`/vt/layanan/${lay.slug}`}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.07] hover:border-accent-500/30 transition-all duration-300 flex flex-col"
              >
                {/* Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      lay.status === "gratis"
                        ? "bg-success-500/10 text-success-400"
                        : "bg-accent-500/10 text-accent-400"
                    }`}
                  >
                    {lay.status === "gratis" ? "Gratis" : "Berbayar"}
                  </span>
                  {lay.linkDaring && (
                    <span className="flex items-center gap-0.5 text-[10px] text-primary-400 font-medium">
                      <Globe className="w-3 h-3" />
                      Online
                    </span>
                  )}
                </div>

                {/* Nama layanan */}
                <h3 className="text-sm font-bold text-white group-hover:text-accent-300 transition-colors leading-snug mb-2 flex-1">
                  {lay.nama}
                </h3>

                {/* Instansi */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{lay.instansi.nama}</span>
                </div>

                {/* Info */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-3 border-t border-white/[0.05]">
                  {lay.waktuPenyelesaian && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lay.waktuPenyelesaian}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-accent-400 transition-colors ml-auto shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====== INFO BAR ====== */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 sm:p-10">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Alamat */}
              {pengaturan?.alamat && (
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Alamat
                    </p>
                    <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {pengaturan.alamat}
                    </p>
                  </div>
                </div>
              )}

              {/* Jam Operasional */}
              {pengaturan?.jamOperasional && (
                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Jam Operasional
                    </p>
                    <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                      {pengaturan.jamOperasional}
                    </p>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {pengaturan?.nomorWa && (
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                      WhatsApp
                    </p>
                    <p className="text-sm text-slate-300">{pengaturan.nomorWa}</p>
                  </div>
                </div>
              )}

              {/* Website */}
              <div className="flex gap-3">
                <Globe className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">
                    Website
                  </p>
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors inline-flex items-center gap-1"
                  >
                    mpp.bandungkab.go.id
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER MINI ====== */}
      <footer className="py-8 border-t border-white/5">
        <p className="text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Mal Pelayanan Publik Kabupaten Bandung.
          Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
}
