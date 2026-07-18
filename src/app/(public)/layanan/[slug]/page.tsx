import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Clock,
  FileText,
  CheckCircle2,
  ListOrdered,
  DollarSign,
  MapPin,
  ExternalLink,
  Scale,
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
    title: layanan.nama,
    description: layanan.deskripsi || `Informasi layanan ${layanan.nama} di MPP Kabupaten Bandung`,
  };
}

export default async function LayananDetailPage({ params }: Props) {
  const { slug } = await params;
  const layanan = await prisma.layanan.findUnique({
    where: { slug },
    include: { instansi: true, kategori: true },
  });

  if (!layanan) notFound();

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Link
          href="/layanan"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Layanan
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                layanan.status === "gratis"
                  ? "bg-success-50 text-success-700"
                  : "bg-accent-50 text-accent-700"
              }`}
            >
              {layanan.status === "gratis" ? "Gratis" : "Berbayar"}
            </span>
            {layanan.populer && (
              <span className="px-3 py-1 rounded-full bg-accent-100 text-accent-700 text-xs font-bold">
                ⭐ Layanan Populer
              </span>
            )}
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                {layanan.kategori?.nama || "-"}
              </span>
          </div>

          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            {layanan.nama}
          </h1>

          <Link
            href={`/instansi/${layanan.instansi.slug}`}
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-medium transition-colors"
          >
            <Building2 className="w-4 h-4" />
            {layanan.instansi.nama}
          </Link>

          {layanan.deskripsi && (
            <p className="text-slate-600 mt-6 text-lg leading-relaxed">{layanan.deskripsi}</p>
          )}

          {/* Quick Info */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            {layanan.waktuPenyelesaian && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                <Clock className="w-5 h-5 text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Waktu Penyelesaian</p>
                  <p className="text-sm text-slate-700 font-medium">{layanan.waktuPenyelesaian}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
              <DollarSign className="w-5 h-5 text-primary-500 shrink-0" />
              <div>
                <p className="text-xs text-slate-400 font-semibold">Biaya / Tarif</p>
                <p className="text-sm text-slate-700 font-medium">{layanan.biaya || "Gratis"}</p>
              </div>
            </div>
            {layanan.instansi.lokasiLoket && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 font-semibold">Lokasi</p>
                  <p className="text-sm text-slate-700 font-medium">{layanan.instansi.lokasiLoket}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dasar Hukum */}
        {layanan.dasarHukum && (
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-6">
            <h2
              className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              <Scale className="w-6 h-6 text-primary-500" />
              Dasar Hukum
            </h2>
            <div className="prose-content whitespace-pre-line text-slate-600">
              {layanan.dasarHukum}
            </div>
          </div>
        )}

        {/* Persyaratan */}
        {layanan.persyaratan && (
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-6">
            <h2
              className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              <CheckCircle2 className="w-6 h-6 text-success-500" />
              Persyaratan Pelayanan
            </h2>
            <div className="prose-content whitespace-pre-line text-slate-600">
              {layanan.persyaratan}
            </div>
          </div>
        )}

        {/* Prosedur */}
        {layanan.prosedur && (
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-6">
            <h2
              className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              <ListOrdered className="w-6 h-6 text-primary-500" />
              Sistem, Mekanisme, dan Prosedur
            </h2>
            <div className="prose-content whitespace-pre-line text-slate-600">
              {layanan.prosedur}
            </div>
          </div>
        )}

        {/* Produk Pelayanan */}
        {layanan.produkLayanan && (
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-6">
            <h2
              className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              <Gift className="w-6 h-6 text-amber-500" />
              Produk Pelayanan
            </h2>
            <div className="prose-content whitespace-pre-line text-slate-600">
              {layanan.produkLayanan}
            </div>
          </div>
        )}

        {/* Penanganan Pengaduan, Saran, dan Masukan */}
        {layanan.pengaduan && (
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10 mb-6">
            <h2
              className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Penanganan Pengaduan, Saran, dan Masukan
            </h2>
            <div className="prose-content whitespace-pre-line text-slate-600">
              {layanan.pengaduan}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-primary-50 rounded-2xl p-8 text-center border border-primary-100">
          <h3 className="text-lg font-bold text-primary-900 mb-3">
            Butuh layanan ini?
          </h3>
          <p className="text-sm text-primary-700 mb-6">
            Kunjungi MPP Kabupaten Bandung atau akses layanan daring jika tersedia.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {layanan.linkDaring && (
              <a
                href={layanan.linkDaring}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                Akses Layanan Daring
              </a>
            )}
            <Link
              href={`/instansi/${layanan.instansi.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold border border-primary-200 hover:bg-primary-100 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              Info Instansi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
