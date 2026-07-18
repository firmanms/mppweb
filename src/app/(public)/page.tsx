import Link from "next/link";
import prisma from "@/lib/prisma";
import KritikSaranForm from "@/components/KritikSaranForm";
import {
  ArrowRight,
  Building2,
  FileText,
  Users,
  Star,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  Heart,
} from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getHomeData() {
  const [instansiCount, layananCount, instansiList, layananPopuler, beritaTerbaru, fasilitasList] =
    await Promise.all([
      prisma.instansi.count(),
      prisma.layanan.count(),
      prisma.instansi.findMany({
        take: 10,
        orderBy: { createdAt: "asc" },
        include: { kategori: true },
      }),
      prisma.layanan.findMany({
        where: { populer: true },
        take: 6,
        include: { instansi: true },
      }),
      prisma.berita.findMany({
        take: 3,
        orderBy: { publishedAt: "desc" },
        include: { kategori: true },
      }),
      prisma.fasilitas.findMany({
        take: 8,
      }),
      prisma.pengaturan.findUnique({
        where: { id: 1 },
      }),
    ]);

  // Fallback to default if somehow not seeded
  const defaultPengaturan = {
    headerTitle: "Pelayanan Publik Semakin Mudah, Cepat, dan Terintegrasi",
    headerSubtitle: "Mal Pelayanan Publik Kabupaten Bandung menghadirkan berbagai layanan pemerintahan dan pelayanan publik dalam satu lokasi yang nyaman dan mudah diakses.",
    ratingKepuasan: "4.8",
    alamat: "Jl. Raya Soreang KM. 17, Soreang, Kabupaten Bandung, Jawa Barat 40911",
    jamOperasional: "Senin - Kamis: 08.00 - 15.00 WIB\nJumat: 08.00 - 14.30 WIB\nSabtu - Minggu: Tutup",
    nomorWa: "081234567890",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.5!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJTIDEwN8KwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1",
  };

  const pengaturan = (arguments[0] && arguments[0][6]) || defaultPengaturan;
  const dbPengaturan = await prisma.pengaturan.findUnique({ where: { id: 1 } });
  const finalPengaturan = dbPengaturan || defaultPengaturan;

  return {
    instansiCount,
    layananCount,
    instansiList,
    layananPopuler,
    beritaTerbaru,
    fasilitasList,
    pengaturan: finalPengaturan,
  };
}

// Lucide icon map for fasilitas
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Armchair: Users,
  TicketCheck: FileText,
  ListOrdered: FileText,
  Info: Sparkles,
  Baby: Heart,
  Accessibility: Shield,
  Blocks: Star,
  Moon: Star,
  Bath: Building2,
  Car: Zap,
  Wifi: Zap,
  BatteryCharging: Zap,
  UtensilsCrossed: Heart,
};

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-hero text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium border border-white/20">
                <Sparkles className="w-4 h-4 text-accent-300" />
                Pelayanan Terpadu Kabupaten Bandung
              </div> */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                {data.pengaturan.headerTitle}
              </h1>
              <p className="text-lg sm:text-xl text-primary-100 leading-relaxed max-w-xl whitespace-pre-line">
                {data.pengaturan.headerSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-900 font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Lihat Semua Layanan
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-base transition-all duration-200 border border-white/20"
                >
                  Tentang MPP
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <Building2 className="w-10 h-10 text-accent-300 mb-4" />
                <p className="text-4xl font-extrabold text-white">{data.instansiCount}</p>
                <p className="text-primary-200 text-sm mt-1">Instansi Tergabung</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <FileText className="w-10 h-10 text-accent-300 mb-4" />
                <p className="text-4xl font-extrabold text-white">{data.layananCount}</p>
                <p className="text-primary-200 text-sm mt-1">Jenis Layanan</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <Users className="w-10 h-10 text-accent-300 mb-4" />
                <p className="text-4xl font-extrabold text-white">10K+</p>
                <p className="text-primary-200 text-sm mt-1">Pengunjung/Bulan</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-colors">
                <Star className="w-10 h-10 text-accent-300 mb-4" />
                <p className="text-4xl font-extrabold text-white">{data.pengaturan.ratingKepuasan}</p>
                <p className="text-primary-200 text-sm mt-1">Rating Kepuasan</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full h-16 lg:h-24">
            <path d="M0,96L48,90.7C96,85,192,75,288,74.7C384,75,480,85,576,90.7C672,96,768,96,864,90.7C960,85,1056,75,1152,69.3C1248,64,1344,64,1392,64L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
              Layanan Populer
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Layanan yang Sering Digunakan
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-lg">
              Temukan layanan yang paling banyak diakses oleh masyarakat Kabupaten Bandung
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.layananPopuler.map((layanan) => (
              <Link
                key={layanan.id}
                href={`/layanan/${layanan.slug}`}
                className="group relative bg-white rounded-2xl border border-slate-100 p-6 hover:border-primary-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${layanan.status === "gratis"
                        ? "bg-success-50 text-success-700"
                        : "bg-accent-50 text-accent-700"
                      }`}
                  >
                    {layanan.status === "gratis" ? "Gratis" : "Berbayar"}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-2">
                  {layanan.nama}
                </h3>
                <p className="text-sm text-slate-500 mb-4">
                  {layanan.instansi.nama}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  {layanan.waktuPenyelesaian && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {layanan.waktuPenyelesaian}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              Lihat Semua Layanan
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Instansi Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
              Instansi Tergabung
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              {data.instansiCount} Instansi Siap Melayani
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-lg">
              Berbagai instansi pemerintah, BUMN, dan BUMD terintegrasi dalam satu lokasi
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {data.instansiList.map((inst) => (
              <Link
                key={inst.id}
                href={`/instansi/${inst.slug}`}
                className="group bg-white rounded-2xl p-5 text-center border border-slate-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                  <Building2 className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-700 group-hover:text-primary-700 transition-colors line-clamp-2">
                  {inst.nama}
                </h3>
                <span className="inline-block mt-2 text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  {inst.kategori?.nama || "-"}
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/instansi"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold transition-colors"
            >
              Lihat Semua Instansi
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Berita Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                Informasi Terbaru
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                Berita & Pengumuman
              </h2>
            </div>
            <Link
              href="/berita"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 hover:text-primary-800 font-semibold transition-colors"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.beritaTerbaru.map((berita) => (
              <Link
                key={berita.id}
                href={`/berita/${berita.slug}`}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Placeholder */}
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
                  <p className="text-xs text-slate-400 mb-2">
                    {formatDate(berita.publishedAt)}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-700 transition-colors mb-3 line-clamp-2">
                    {berita.judul}
                  </h3>
                  {berita.ringkasan && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {truncateText(berita.ringkasan, 120)}
                    </p>
                  )}
                  <div className="mt-4 flex items-center text-primary-600 text-sm font-semibold group-hover:gap-2 transition-all">
                    Baca selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/berita"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold"
            >
              Lihat Semua Berita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent-50 text-accent-700 text-sm font-semibold mb-4">
              Fasilitas
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Fasilitas Lengkap untuk Kenyamanan Anda
            </h2>
            <p className="text-slate-500 mt-3 max-w-2xl mx-auto text-lg">
              MPP Kabupaten Bandung dilengkapi berbagai fasilitas modern untuk kenyamanan pengunjung
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {data.fasilitasList.map((fas) => {
              const IconComp = fas.ikon ? (iconMap[fas.ikon] || Star) : Star;
              return (
                <div
                  key={fas.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-accent-200 hover:shadow-lg transition-all duration-300 text-center group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent-50 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                    <IconComp className="w-7 h-7 text-accent-600" />
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-1">{fas.nama}</h3>
                  <p className="text-xs text-slate-400">{fas.lokasi}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/fasilitas"
              className="inline-flex items-center gap-2 text-accent-600 hover:text-accent-700 font-semibold transition-colors"
            >
              Lihat Semua Fasilitas
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-400/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Butuh Layanan Publik?
          </h2>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Kunjungi Mal Pelayanan Publik Kabupaten Bandung atau cari informasi layanan yang Anda butuhkan secara online.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/layanan"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-900 font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Cari Layanan
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/instansi"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold text-lg border border-white/20 transition-all"
            >
              <Building2 className="w-5 h-5" />
              Cari Instansi
            </Link>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold mb-4">
                Lokasi & Jam Operasional
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
                Kunjungi Kami
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Alamat</h3>
                    <p className="text-slate-500 whitespace-pre-line">
                      {data.pengaturan.alamat}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Jam Operasional</h3>
                    <div className="text-slate-500 space-y-1 whitespace-pre-line leading-loose">
                      {data.pengaturan.jamOperasional}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-elevated border border-slate-100">
              <iframe
                src={data.pengaturan.mapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.5!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJTIDEwN8KwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"}
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi MPP Kabupaten Bandung"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Kritik & Saran */}
      <KritikSaranForm />
    </>
  );
}
