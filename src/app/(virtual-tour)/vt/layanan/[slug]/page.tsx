import prisma from "@/lib/prisma";
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
    description: layanan.deskripsi || `Informasi layanan ${layanan.nama} di MPP Kabupaten Bandung`,
  };
}

/* Komponen section yang bisa dilipat (collapsed) */
function InfoSection({
  icon,
  title,
  content,
  iconColor = "text-primary-500",
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  iconColor?: string;
}) {
  return (
    <details className="group bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden">
      <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer select-none hover:bg-slate-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
        <span className={`shrink-0 ${iconColor}`}>{icon}</span>
        <span
          className="text-sm font-bold text-slate-900 flex-1"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
        >
          {title}
        </span>
        <svg
          className="w-4 h-4 text-slate-400 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-5 pt-0">
        <div
          className="prose-content text-sm text-slate-600 whitespace-pre-line leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 p-4 sm:p-6">
      <div className="max-w-xl mx-auto">
        {/* Header card */}
        <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 gradient-primary" />

          <div className="p-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  layanan.status === "gratis"
                    ? "bg-success-50 text-success-700"
                    : "bg-accent-50 text-accent-700"
                }`}
              >
                {layanan.status === "gratis" ? "Gratis" : "Berbayar"}
              </span>
              {layanan.populer && (
                <span className="px-2.5 py-0.5 rounded-full bg-accent-100 text-accent-700 text-[10px] font-bold uppercase tracking-wider">
                  ⭐ Populer
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                {layanan.kategori?.nama || "-"}
              </span>
            </div>

            {/* Judul layanan */}
            <h1
              className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mb-2"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              {layanan.nama}
            </h1>

            {/* Instansi */}
            <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-4">
              <Building2 className="w-4 h-4" />
              <span>{layanan.instansi.nama}</span>
            </div>

            {/* Deskripsi */}
            {layanan.deskripsi && (
              <div
                className="prose-content text-sm text-slate-600 leading-relaxed mb-5"
                dangerouslySetInnerHTML={{ __html: layanan.deskripsi }}
              />
            )}

            {/* Quick info grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {layanan.waktuPenyelesaian && (
                <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3">
                  <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Waktu</p>
                    <p className="text-xs text-slate-700 font-medium">{layanan.waktuPenyelesaian}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3">
                <DollarSign className="w-4 h-4 text-primary-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Biaya</p>
                  <p className="text-xs text-slate-700 font-medium">{layanan.biaya || "Gratis"}</p>
                </div>
              </div>
              {layanan.jamOperasional && (
                <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3">
                  <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Jam</p>
                    <p className="text-xs text-slate-700 font-medium whitespace-pre-line">{layanan.jamOperasional}</p>
                  </div>
                </div>
              )}
              {layanan.instansi.lokasiLoket && (
                <div className="flex items-center gap-2.5 bg-slate-50 rounded-xl px-3.5 py-3">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Lokasi</p>
                    <p className="text-xs text-slate-700 font-medium">{layanan.instansi.lokasiLoket}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Tombol layanan daring */}
            {layanan.linkDaring && (
              <a
                href={layanan.linkDaring}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl gradient-primary text-white text-sm font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Akses Layanan Daring
              </a>
            )}
          </div>
        </div>

        {/* Accordion sections */}
        <div className="mt-4 space-y-3">
          {layanan.dasarHukum && (
            <InfoSection
              icon={<Scale className="w-5 h-5" />}
              title="Dasar Hukum"
              content={layanan.dasarHukum}
            />
          )}

          {layanan.persyaratan && (
            <InfoSection
              icon={<CheckCircle2 className="w-5 h-5" />}
              title="Persyaratan Pelayanan"
              content={layanan.persyaratan}
              iconColor="text-success-500"
            />
          )}

          {layanan.prosedur && (
            <InfoSection
              icon={<ListOrdered className="w-5 h-5" />}
              title="Prosedur Pelayanan"
              content={layanan.prosedur}
            />
          )}

          {layanan.produkLayanan && (
            <InfoSection
              icon={<Gift className="w-5 h-5" />}
              title="Produk Pelayanan"
              content={layanan.produkLayanan}
              iconColor="text-accent-500"
            />
          )}

          {layanan.pengaduan && (
            <InfoSection
              icon={<AlertTriangle className="w-5 h-5" />}
              title="Pengaduan, Saran & Masukan"
              content={layanan.pengaduan}
              iconColor="text-red-500"
            />
          )}
        </div>

        {/* Branding footer kecil */}
        <p className="text-center text-[10px] text-slate-400 mt-4">
          Mal Pelayanan Publik Kabupaten Bandung
        </p>
      </div>
    </div>
  );
}
