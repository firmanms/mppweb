import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  ChevronRight,
  ExternalLink,
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
    description: instansi.deskripsi || `Informasi ${instansi.nama} di MPP Kabupaten Bandung`,
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
      },
    },
  });

  if (!instansi) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 p-4 sm:p-6">
      {/* Card utama */}
      <div className="max-w-xl mx-auto">
        {/* Header instansi */}
        <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 gradient-primary" />

          <div className="p-6">
            {/* Logo + info */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-16 h-16 rounded-xl bg-primary-50 border border-primary-100 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                {instansi.logo ? (
                  <img
                    src={instansi.logo}
                    alt={`Logo ${instansi.nama}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-100 text-primary-700 mb-2">
                  {instansi.kategori?.nama || "Instansi"}
                </span>
                <h1
                  className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight"
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  {instansi.nama}
                </h1>
              </div>
            </div>

            {/* Deskripsi */}
            {instansi.deskripsi && (
              <div
                className="prose-content text-sm text-slate-600 mb-5 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: instansi.deskripsi }}
              />
            )}

            {/* Info grid */}
            <div className="space-y-2.5">
              {instansi.lokasiLoket && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Lokasi Loket</p>
                    <p className="text-sm text-slate-700 font-medium">{instansi.lokasiLoket}</p>
                  </div>
                </div>
              )}
              {instansi.jamPelayanan && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Jam Pelayanan</p>
                    <p className="text-sm text-slate-700 font-medium">{instansi.jamPelayanan}</p>
                  </div>
                </div>
              )}
              {instansi.kontak && (
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                  <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Kontak</p>
                    <p className="text-sm text-slate-700 font-medium">{instansi.kontak}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Daftar layanan */}
        {instansi.layanan.length > 0 && (
          <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 overflow-hidden mt-4">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2
                className="text-sm font-bold text-slate-900 flex items-center gap-2"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                Daftar Layanan
                <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 text-xs font-bold">
                  {instansi.layanan.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-slate-50">
              {instansi.layanan.map((lay) => (
                <a
                  key={lay.id}
                  href={`/vt/layanan/${lay.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-6 py-3.5 hover:bg-primary-50/50 transition-colors duration-150"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-primary-700 transition-colors truncate">
                      {lay.nama}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      {lay.waktuPenyelesaian && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3" />
                          {lay.waktuPenyelesaian}
                        </span>
                      )}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          lay.status === "gratis"
                            ? "bg-success-50 text-success-700"
                            : "bg-accent-50 text-accent-700"
                        }`}
                      >
                        {lay.status === "gratis" ? "Gratis" : "Berbayar"}
                      </span>
                      {lay.linkDaring && (
                        <span className="flex items-center gap-0.5 text-[11px] text-primary-500">
                          <ExternalLink className="w-3 h-3" />
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Branding footer kecil */}
        <p className="text-center text-[10px] text-slate-400 mt-4">
          Mal Pelayanan Publik Kabupaten Bandung
        </p>
      </div>
    </div>
  );
}
