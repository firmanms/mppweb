import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  Clock,
  DollarSign,
  MapPin,
  ExternalLink,
  Scale,
  CheckCircle2,
  ListOrdered,
  Gift,
  AlertTriangle,
  ArrowLeft,
  Globe,
} from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const layanan = await prisma.layanan.findUnique({ where: { slug } });
  if (!layanan) return { title: "Layanan Tidak Ditemukan" };
  return {
    title: `${layanan.nama} — Virtual Tour MPP`,
    description:
      layanan.deskripsi ||
      `Informasi layanan ${layanan.nama} di MPP Kabupaten Bandung`,
  };
}

/* Collapsible detail section */
function DetailSection({
  icon,
  title,
  content,
  defaultOpen = false,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  defaultOpen?: boolean;
}) {
  return (
    <details
      className="group bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.1] transition-colors"
      open={defaultOpen}
    >
      <summary className="flex items-center gap-3 px-6 py-5 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <span className="shrink-0">{icon}</span>
        <span
          className="text-sm font-bold text-white flex-1"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          {title}
        </span>
        <svg
          className="w-4 h-4 text-slate-500 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="px-6 pb-6 pt-0">
        <div className="border-t border-white/[0.05] pt-4">
          <div
            className="text-sm text-slate-400 whitespace-pre-line leading-relaxed [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1.5"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </details>
  );
}

export default async function VirtualTourLayananPage({ params }: Props) {
  const { slug } = await params;
  const layanan = await prisma.layanan.findUnique({
    where: { slug },
    include: { instansi: true, kategori: true },
  });

  if (!layanan) notFound();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-500/15 via-primary-700/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-60 h-60 bg-accent-500/5 rounded-full blur-3xl" />
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
              href={`/vt/instansi/${layanan.instansi.slug}`}
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {layanan.instansi.nama}
            </Link>
            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold hidden sm:block">
              Virtual Tour — MPP Kab. Bandung
            </span>
          </div>
        </div>

        {/* Hero header */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                    layanan.status === "gratis"
                      ? "bg-success-500/10 text-success-400 border-success-500/20"
                      : "bg-accent-500/10 text-accent-400 border-accent-500/20"
                  }`}
                >
                  {layanan.status === "gratis" ? "Gratis" : "Berbayar"}
                </span>
                {layanan.populer && (
                  <span className="px-3 py-1 rounded-full bg-accent-500/10 text-accent-400 border border-accent-500/20 text-[10px] font-bold uppercase tracking-wider">
                    ⭐ Layanan Populer
                  </span>
                )}
                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  {layanan.kategori?.nama || "-"}
                </span>
              </div>

              {/* Judul */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {layanan.nama}
              </h1>

              {/* Instansi */}
              <Link
                href={`/vt/instansi/${layanan.instansi.slug}`}
                className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors mb-6"
              >
                <Building2 className="w-4 h-4" />
                {layanan.instansi.nama}
              </Link>

              {/* Deskripsi */}
              {layanan.deskripsi && (
                <div
                  className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl [&_p]:mb-0"
                  dangerouslySetInnerHTML={{ __html: layanan.deskripsi }}
                />
              )}
            </div>
          </div>
        </section>

        {/* Quick info row */}
        <section className="pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {layanan.waktuPenyelesaian && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Waktu Penyelesaian
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {layanan.waktuPenyelesaian}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                    Biaya / Tarif
                  </p>
                  <p className="text-sm text-slate-300 font-medium">
                    {layanan.biaya || "Gratis"}
                  </p>
                </div>
              </div>

              {layanan.jamOperasional && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Jam Operasional
                    </p>
                    <p className="text-sm text-slate-300 font-medium whitespace-pre-line">
                      {layanan.jamOperasional}
                    </p>
                  </div>
                </div>
              )}

              {layanan.instansi.lokasiLoket && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mb-1">
                      Lokasi
                    </p>
                    <p className="text-sm text-slate-300 font-medium">
                      {layanan.instansi.lokasiLoket}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol layanan daring */}
            {layanan.linkDaring && (
              <div className="mt-6">
                <a
                  href={layanan.linkDaring}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #1e56a0 0%, #163e75 100%)",
                  }}
                >
                  <ExternalLink className="w-4 h-4" />
                  Akses Layanan Daring
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Detail sections (accordion) */}
        <section className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-4">
              {layanan.dasarHukum && (
                <DetailSection
                  icon={<Scale className="w-5 h-5 text-primary-400" />}
                  title="Dasar Hukum"
                  content={layanan.dasarHukum}
                />
              )}

              {layanan.persyaratan && (
                <DetailSection
                  icon={
                    <CheckCircle2 className="w-5 h-5 text-success-400" />
                  }
                  title="Persyaratan Pelayanan"
                  content={layanan.persyaratan}
                  defaultOpen
                />
              )}

              {layanan.prosedur && (
                <DetailSection
                  icon={<ListOrdered className="w-5 h-5 text-primary-400" />}
                  title="Prosedur Pelayanan"
                  content={layanan.prosedur}
                  defaultOpen
                />
              )}

              {layanan.produkLayanan && (
                <DetailSection
                  icon={<Gift className="w-5 h-5 text-accent-400" />}
                  title="Produk Pelayanan"
                  content={layanan.produkLayanan}
                />
              )}

              {layanan.pengaduan && (
                <DetailSection
                  icon={
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  }
                  title="Pengaduan, Saran & Masukan"
                  content={layanan.pengaduan}
                />
              )}
            </div>
          </div>
        </section>

        {/* CTA bar */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 sm:p-10 text-center">
              <h3
                className="text-xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Butuh layanan ini?
              </h3>
              <p className="text-sm text-slate-400 mb-6 max-w-lg mx-auto">
                Kunjungi Mal Pelayanan Publik Kabupaten Bandung atau akses
                layanan daring jika tersedia.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {layanan.linkDaring && (
                  <a
                    href={layanan.linkDaring}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:opacity-90"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #1e56a0 0%, #163e75 100%)",
                    }}
                  >
                    <Globe className="w-4 h-4" />
                    Layanan Daring
                  </a>
                )}
                <Link
                  href={`/vt/instansi/${layanan.instansi.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  Info Instansi
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-white/5">
          <p className="text-center text-xs text-slate-600">
            © {new Date().getFullYear()} Mal Pelayanan Publik Kabupaten
            Bandung
          </p>
        </footer>
      </div>
    </div>
  );
}
