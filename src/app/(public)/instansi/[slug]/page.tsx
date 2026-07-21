import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  FileText,
  ArrowLeft,
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
    title: instansi.nama,
    description: instansi.deskripsi || `Informasi layanan ${instansi.nama} di MPP Kabupaten Bandung`,
  };
}

export default async function InstansiDetailPage({ params }: Props) {
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
    <div className="py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/instansi"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Instansi
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 p-2 flex items-center justify-center shrink-0 overflow-hidden">
              {instansi.logo ? (
                <img src={instansi.logo} alt={`Logo ${instansi.nama}`} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-primary-600" />
              )}
            </div>
            <div className="flex-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 mb-3">
                {instansi.kategori?.nama || "-"}
              </span>
              <h1
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-plus-jakarta)" }}
              >
                {instansi.nama}
              </h1>
              {instansi.deskripsi && (
                <div 
                  className="prose-content text-slate-600 mt-6" 
                  dangerouslySetInnerHTML={{ __html: instansi.deskripsi }} 
                />
              )}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid sm:grid-cols-3 gap-6 mt-8 pt-8 border-t border-slate-100">
            {instansi.lokasiLoket && (
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Lokasi Loket</p>
                  <p className="text-sm text-slate-700 font-medium">{instansi.lokasiLoket}</p>
                </div>
              </div>
            )}
            {instansi.jamPelayanan && (
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Jam Pelayanan</p>
                  <p className="text-sm text-slate-700 font-medium">{instansi.jamPelayanan}</p>
                </div>
              </div>
            )}
            {instansi.kontak && (
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-1">Kontak</p>
                  <p className="text-sm text-slate-700 font-medium">{instansi.kontak}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Daftar Layanan */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10">
          <h2
            className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            <FileText className="w-6 h-6 text-primary-500" />
            Daftar Layanan ({instansi.layanan.length})
          </h2>

          {instansi.layanan.length === 0 ? (
            <p className="text-slate-500 text-center py-10">Belum ada layanan terdaftar.</p>
          ) : (
            <div className="space-y-3">
              {instansi.layanan.map((lay) => (
                <Link
                  key={lay.id}
                  href={`/layanan/${lay.slug}`}
                  className="group flex items-center justify-between p-5 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all duration-200"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-primary-700 transition-colors">
                      {lay.nama}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      {lay.waktuPenyelesaian && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lay.waktuPenyelesaian}
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full font-medium ${
                          lay.status === "gratis"
                            ? "bg-success-50 text-success-700"
                            : "bg-accent-50 text-accent-700"
                        }`}
                      >
                        {lay.status === "gratis" ? "Gratis" : "Berbayar"}
                      </span>
                      {lay.linkDaring && (
                        <span className="flex items-center gap-1 text-primary-500">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary-500 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
