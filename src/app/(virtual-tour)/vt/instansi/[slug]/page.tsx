import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  Layers,
  Globe,
} from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const instansi = await prisma.instansi.findUnique({ where: { slug } });
  if (!instansi) return { title: "Instansi Tidak Ditemukan" };
  return {
    title: `${instansi.nama} — Virtual Tour MPP`,
    description:
      instansi.deskripsi ||
      `Informasi ${instansi.nama} di MPP Kabupaten Bandung`,
  };
}

export default async function VirtualTourInstansiPage({ params }: Props) {
  const { slug } = await params;
  const instansi = await prisma.instansi.findUnique({
    where: { slug },
    include: {
      kategori: true,
      layanan: {
        orderBy: { nama: "asc" },
        include: { kategori: true },
      },
    },
  });

  if (!instansi) notFound();

  const gratis = instansi.layanan.filter((l) => l.status === "gratis").length;
  const berbayar = instansi.layanan.length - gratis;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-500/15 via-primary-700/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-60 -right-32 w-72 h-72 bg-accent-500/5 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Top bar */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <Link
              href="/vt"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              Virtual Tour — MPP Kab. Bandung
            </span>
          </div>
        </div>

        {/* Hero header */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 lg:gap-12">
              {/* Logo */}
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-white/[0.05] border border-white/[0.08] p-4 flex items-center justify-center shrink-0 overflow-hidden">
                {instansi.logo ? (
                  <img
                    src={instansi.logo}
                    alt={`Logo ${instansi.nama}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-12 h-12 lg:w-16 lg:h-16 text-primary-400" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-500/10 text-primary-400 border border-primary-500/20">
                    {instansi.kategori?.nama || "Instansi"}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-400">
                    {instansi.layanan.length} Layanan
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  {instansi.nama}
                </h1>

                {instansi.deskripsi && (
                  <div
                    className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl [&_p]:mb-0"
                    dangerouslySetInnerHTML={{ __html: instansi.deskripsi }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info cards row */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {instansi.lokasiLoket && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Lokasi Loket
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {instansi.lokasiLoket}
                    </p>
                  </div>
                </div>
              )}
              {instansi.jamPelayanan && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Jam Pelayanan
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {instansi.jamPelayanan}
                    </p>
                  </div>
                </div>
              )}
              {instansi.kontak && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Kontak
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {instansi.kontak}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Daftar Layanan */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 text-xs font-bold uppercase tracking-wider text-accent-400 mb-3">
                  <Layers className="w-3.5 h-3.5" />
                  Layanan Tersedia
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-extrabold text-white"
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  Daftar Layanan
                </h2>
              </div>
              {/* Mini stats */}
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-500">
                  Total:{" "}
                  <span className="text-white font-bold">
                    {instansi.layanan.length}
                  </span>
                </span>
                {gratis > 0 && (
                  <span className="text-slate-500">
                    Gratis:{" "}
                    <span className="text-success-400 font-bold">{gratis}</span>
                  </span>
                )}
                {berbayar > 0 && (
                  <span className="text-slate-500">
                    Berbayar:{" "}
                    <span className="text-accent-400 font-bold">
                      {berbayar}
                    </span>
                  </span>
                )}
              </div>
            </div>

            {instansi.layanan.length === 0 ? (
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-16 text-center">
                <p className="text-slate-500">Belum ada layanan terdaftar.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {instansi.layanan.map((lay) => (
                  <Link
                    key={lay.id}
                    href={`/vt/layanan/${lay.slug}`}
                    className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.07] hover:border-primary-500/30 transition-all duration-300 flex flex-col"
                  >
                    {/* Badges */}
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
                      {lay.populer && (
                        <span className="text-[10px] text-accent-400 font-bold">
                          ⭐
                        </span>
                      )}
                      {lay.linkDaring && (
                        <span className="flex items-center gap-0.5 text-[10px] text-primary-400 font-medium">
                          <Globe className="w-3 h-3" />
                          Online
                        </span>
                      )}
                    </div>

                    {/* Nama */}
                    <h3 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors leading-snug mb-2 flex-1">
                      {lay.nama}
                    </h3>

                    {/* Kategori */}
                    {lay.kategori && (
                      <p className="text-[11px] text-slate-500 mb-3">
                        {lay.kategori.nama}
                      </p>
                    )}

                    {/* Footer info */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-white/[0.05]">
                      <div className="flex items-center gap-3">
                        {lay.waktuPenyelesaian && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {lay.waktuPenyelesaian}
                          </span>
                        )}
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-primary-400 transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5">
          <p className="text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Mal Pelayanan Publik Kabupaten Bandung
          </p>
        </footer>
      </div>
    </div>
  );
}
