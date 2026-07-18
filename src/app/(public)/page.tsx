import Link from "next/link";
import prisma from "@/lib/prisma";
import KritikSaranForm from "@/components/KritikSaranForm";
import * as Icons from "lucide-react";
import { formatDate, truncateText } from "@/lib/utils";

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function getHomeData() {
  const [
    instansiCount,
    layananCount,
    instansiList,
    layananPopuler,
    beritaTerbaru,
    fasilitasList,
    galeriList,
    dbPengaturan,
  ] = await Promise.all([
    prisma.instansi.count(),
    prisma.layanan.count(),
    prisma.instansi.findMany({
      take: 10,
      orderBy: { createdAt: "asc" },
      include: { kategori: true },
    }),
    prisma.layanan.findMany({
      where: { populer: true },
      take: 4,
      include: { instansi: true },
    }),
    prisma.berita.findMany({
      take: 3,
      orderBy: { publishedAt: "desc" },
      include: { kategori: true },
    }),
    prisma.fasilitas.findMany({
      take: 6,
    }),
    prisma.galeri.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.pengaturan.findUnique({
      where: { id: 1 },
    }),
  ]);

  // Fallback to default if settings are not found
  const defaultPengaturan = {
    headerTitle: "Pelayanan Terpadu, Mudah, Cepat, dan Nyaman",
    headerSubtitle: "Mal Pelayanan Publik Kabupaten Bandung menghadirkan berbagai layanan pemerintahan dalam satu tempat untuk Anda.",
    ratingKepuasan: "98%",
    alamat: "Jl. Raya Soreang KM. 17, Soreang, Kabupaten Bandung, Jawa Barat 40911",
    jamOperasional: "Senin - Jumat: 08.00 - 16.00 WIB\nSabtu - Minggu: Tutup",
    nomorWa: "081234567890",
    mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.5!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJTIDEwN8KwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1",
  };

  const finalPengaturan = dbPengaturan || (defaultPengaturan as any);

  return {
    instansiCount,
    layananCount,
    instansiList,
    layananPopuler,
    beritaTerbaru,
    fasilitasList,
    galeriList,
    pengaturan: finalPengaturan,
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  // Helper function to resolve Unsplash images if local media doesn't exist
  const getMediaUrl = (item: any, type: "news" | "gallery" | "building") => {
    if (item.mediaUrl && (item.mediaUrl.startsWith("http") || item.mediaUrl.startsWith("/") || item.mediaUrl.startsWith("data:"))) {
      return item.mediaUrl;
    }
    if (item.fotoUtama && (item.fotoUtama.startsWith("http") || item.fotoUtama.startsWith("/") || item.fotoUtama.startsWith("data:"))) {
      return item.fotoUtama;
    }
    const galleryFallbacks = [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=85",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=85",
    ];

    const newsFallbacks = [
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=500&q=80",
    ];

    if (type === "gallery") {
      return galleryFallbacks[item.id % galleryFallbacks.length] || galleryFallbacks[0];
    }
    if (type === "news") {
      return newsFallbacks[item.id % newsFallbacks.length] || newsFallbacks[0];
    }
    return "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=82";
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f5faff] to-white text-slate-800 pt-16 lg:pt-24 pb-28 lg:pb-36">
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up">
              {/* <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-sm font-semibold text-primary-600">
                <Icons.Landmark className="w-4 h-4 text-primary-500" />
                Pusat Pelayanan Terpadu Kabupaten Bandung
              </div> */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-slate-900 tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Pelayanan Terpadu, <br />
                <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Mudah, Cepat, dan Nyaman
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed max-w-xl">
                {data.pengaturan.headerSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/layanan"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Lihat Layanan
                  <Icons.ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/tour"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-primary-600 font-bold text-base transition-all duration-200 border border-primary-200 shadow-sm"
                >
                  <Icons.ScanLine className="w-5 h-5" />
                  Virtual Tour 360°
                </Link>
              </div>
            </div>

            {/* Right Building Image */}
            <div className="relative animate-slide-in-right hidden lg:block">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 max-h-[460px] aspect-[4/3]">
                <img
                  src={data.pengaturan.fotoHeader || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=82"}
                  alt="Gedung MPP Kabupaten Bandung"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-lg border border-slate-100 p-4 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                  <Icons.Shield className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Pelayanan Terintegrasi</p>
                  <p className="text-xs text-slate-400">Berbagai instansi dalam satu lokasi</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <div className="relative z-10 -mt-16 sm:-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-soft border border-slate-100 p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              <div className="flex items-center gap-4 md:pl-0 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <Icons.Building2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{data.instansiCount}</p>
                  <p className="text-slate-400 text-xs mt-1">Instansi Tergabung</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:pl-6 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icons.LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{data.layananCount}</p>
                  <p className="text-slate-400 text-xs mt-1">Layanan Tersedia</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:pl-6 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Icons.Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">1.250+</p>
                  <p className="text-slate-400 text-xs mt-1">Rata-rata Pengunjung / Hari</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:pl-6 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Icons.CircleCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900 leading-none">{data.pengaturan.ratingKepuasan}</p>
                  <p className="text-slate-400 text-xs mt-1">Kepuasan Masyarakat</p>
                </div>
              </div>

              <div className="flex items-center gap-4 md:pl-6 pt-4 md:pt-0">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Icons.Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">08.00 - 16.00</p>
                  <p className="text-slate-400 text-xs mt-0.5">Jam Operasional (Senin - Jumat)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Akses Cepat Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-3">
              <Icons.Zap className="w-4 h-4" /> Akses Cepat
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
              Temukan Informasi Lebih Mudah
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link href="/instansi" className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
                <Icons.Building className="w-6 h-6" />
              </div>
              <strong className="text-slate-800 text-sm font-bold">Cari Instansi</strong>
            </Link>

            <Link href="/layanan" className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
                <Icons.ClipboardList className="w-6 h-6" />
              </div>
              <strong className="text-slate-800 text-sm font-bold">Cari Layanan</strong>
            </Link>

            <Link href="/layanan" className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
                <Icons.FileText className="w-6 h-6" />
              </div>
              <strong className="text-slate-800 text-sm font-bold">Persyaratan Layanan</strong>
            </Link>

            <a href="#lokasi" className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
                <Icons.MapPinned className="w-6 h-6" />
              </div>
              <strong className="text-slate-800 text-sm font-bold">Lokasi & Peta</strong>
            </a>

            <Link href="/mpp-digital" className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
                <Icons.UserRoundCheck className="w-6 h-6" />
              </div>
              <strong className="text-slate-800 text-sm font-bold">Antrean Online</strong>
            </Link>

            <a href="#kritik-saran" className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3 hover:border-primary-200 hover:shadow-soft transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-primary-600 flex items-center justify-center">
                <Icons.MessagesSquare className="w-6 h-6" />
              </div>
              <strong className="text-slate-800 text-sm font-bold">Pengaduan & Saran</strong>
            </a>
          </div>
        </div>
      </section>

      {/* Main Info (Layanan, Berita, Fasilitas) */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-3">
              <Icons.PanelsTopLeft className="w-4 h-4" /> Informasi Utama
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
              Layanan, Berita, dan Fasilitas
            </h2>
            <p className="text-slate-500 mt-2 text-sm max-w-xl">
              Informasi yang paling sering dibutuhkan masyarakat tersedia dalam satu tampilan terpadu.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Column 1: Layanan Populer */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-extrabold text-slate-900 text-lg">Layanan Populer</h3>
                  <Link href="/layanan" className="text-xs font-bold text-primary-600 flex items-center gap-1">
                    Lihat Semua <Icons.ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {data.layananPopuler.map((layanan) => (
                    <Link
                      key={layanan.id}
                      href={`/layanan/${layanan.slug}`}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-primary-600 flex items-center justify-center shrink-0">
                          <Icons.BriefcaseBusiness className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-primary-600 transition-colors">
                            {layanan.nama}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{layanan.instansi.nama}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-primary-600 block">{layanan.biaya || "Gratis"}</span>
                        <span className="text-[10px] text-slate-400 block">{layanan.waktuPenyelesaian || "-"}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/layanan" className="mt-6 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl border border-primary-200 text-primary-600 font-bold hover:bg-slate-50 transition-colors">
                Lihat Semua Layanan
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Column 2: Berita Terbaru */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <h3 className="font-extrabold text-slate-900 text-lg">Berita Terbaru</h3>
                <Link href="/berita" className="text-xs font-bold text-primary-600 flex items-center gap-1">
                  Lihat Semua <Icons.ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {data.beritaTerbaru.length > 0 && (
                <div className="space-y-5">
                  {/* Featured Article */}
                  <Link href={`/berita/${data.beritaTerbaru[0].slug}`} className="block group">
                    <div className="relative rounded-2xl overflow-hidden aspect-[16/10] mb-3 bg-slate-100">
                      <img
                        src={getMediaUrl(data.beritaTerbaru[0], "news")}
                        alt={data.beritaTerbaru[0].judul}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-600 text-white text-xs font-semibold">
                        {data.beritaTerbaru[0].kategori?.nama || "Berita"}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mb-1">
                      {formatDate(data.beritaTerbaru[0].publishedAt)}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-primary-600 transition-colors line-clamp-2 leading-snug">
                      {data.beritaTerbaru[0].judul}
                    </h4>
                  </Link>

                  {/* Smaller news list */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    {data.beritaTerbaru.slice(1).map((berita) => (
                      <Link
                        key={berita.id}
                        href={`/berita/${berita.slug}`}
                        className="flex gap-3 items-center group"
                      >
                        <img
                          src={getMediaUrl(berita, "news")}
                          alt={berita.judul}
                          className="w-16 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <h5 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-primary-600 transition-colors line-clamp-2">
                            {berita.judul}
                          </h5>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {formatDate(berita.publishedAt)}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Column 3: Fasilitas Unggulan */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <h3 className="font-extrabold text-slate-900 text-lg">Fasilitas Unggulan</h3>
                  <Link href="/fasilitas" className="text-xs font-bold text-primary-600 flex items-center gap-1">
                    Lihat Semua <Icons.ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {data.fasilitasList.map((fas) => {
                    const IconComp = (Icons as any)[fas.ikon || "Star"] || Icons.Star;
                    return (
                      <div
                        key={fas.id}
                        className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 hover:bg-success-50/30 hover:border-success-100 transition-all min-h-[110px]"
                      >
                        <div className="w-9 h-9 rounded-lg bg-success-50 text-success-600 flex items-center justify-center">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <strong className="text-xs text-slate-800 font-bold leading-tight line-clamp-2">
                          {fas.nama}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </div>
              <Link href="/fasilitas" className="mt-6 inline-flex w-full items-center justify-center gap-2 px-5 py-3 rounded-xl border border-primary-200 text-primary-600 font-bold hover:bg-slate-50 transition-colors">
                Lihat Semua Fasilitas
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Section */}
      <section className="py-20 bg-white" id="profil">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Media Column */}
            <div className="relative">
              <div className="w-[92%] rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-100">
                <img
                  src={data.pengaturan.fotoProfil || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85"}
                  alt="Interior MPP"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <div className="absolute right-0 bottom-0 w-[58%] bg-primary-600 text-white p-6 rounded-2xl shadow-xl">
                <strong className="text-4xl font-extrabold block mb-1">236+</strong>
                <p className="text-xs text-primary-100">Jenis layanan publik terintegrasi dalam satu lokasi.</p>
              </div> */}
            </div>

            {/* Right Content Column */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold">
                <Icons.Info className="w-4 h-4" /> Profil MPP
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {data.pengaturan.teksProfilJudul || "Satu tempat untuk berbagai kebutuhan pelayanan publik"}
              </h2>
              <p className="text-slate-500 leading-relaxed whitespace-pre-line">
                {data.pengaturan.teksProfilDeskripsi || "Mal Pelayanan Publik Kabupaten Bandung hadir sebagai pusat pelayanan terpadu yang mengintegrasikan instansi pemerintah, BUMN, BUMD, dan lembaga pelayanan publik lainnya."}
              </p>

              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="text-success-600 shrink-0 mt-0.5">
                    <Icons.CircleCheckBig className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Pelayanan terintegrasi</h4>
                    <p className="text-xs text-slate-400">Semua loket layanan terkumpul di satu lokasi strategis.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="text-success-600 shrink-0 mt-0.5">
                    <Icons.CircleCheckBig className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Proses lebih transparan</h4>
                    <p className="text-xs text-slate-400">Informasi biaya, berkas persyaratan, dan alur tertera jelas.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="text-success-600 shrink-0 mt-0.5">
                    <Icons.CircleCheckBig className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Fasilitas modern & ramah difabel</h4>
                    <p className="text-xs text-slate-400">Dilengkapi jalur khusus disabilitas, ruang menyusui, dan area bermain anak.</p>
                  </div>
                </div>
              </div>

              <Link href="/profil" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-all">
                Selengkapnya
                <Icons.ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Galeri Section */}
      <section className="py-20 bg-slate-50" id="galeri">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-3">
                <Icons.Images className="w-4 h-4" /> Galeri
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                Aktivitas Pelayanan Masyarakat
              </h2>
            </div>
            <Link href="/galeri" className="text-sm font-bold text-primary-600 flex items-center gap-1">
              Lihat Semua <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {data.galeriList.map((gal) => (
              <Link
                key={gal.id}
                href="/galeri"
                className="relative rounded-2xl overflow-hidden aspect-[4/3] group bg-slate-200 shadow-sm block"
              >
                <img
                  src={getMediaUrl(gal, "gallery")}
                  alt={gal.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold line-clamp-2 leading-tight">
                  {gal.judul}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section className="py-20 bg-white" id="tour">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="relative rounded-[32px] overflow-hidden min-h-[440px] flex items-center bg-slate-950 text-white shadow-xl"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(5, 34, 65, 0.9) 0%, rgba(5, 34, 65, 0.3) 100%), url("${data.pengaturan.fotoVirtualTour || 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=85'}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-xl p-8 sm:p-12 md:p-16 space-y-6 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-md">
                <Icons.ScanLine className="w-4 h-4" /> Virtual Tour
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                Jelajahi MPP Kabupaten Bandung secara virtual
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Kenali lokasi loket, ruang pelayanan, fasilitas, serta jalur akses sebelum Anda berkunjung langsung ke Mal Pelayanan Publik.
              </p>
              <Link
                href="/tour"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-bold hover:bg-slate-50 transition-colors shadow-lg"
              >
                Mulai Virtual Tour
                <Icons.MoveUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Virtual Hotspots / Pins decoration */}
            <div className="absolute right-[23%] top-[28%] w-12 h-12 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-lg border-[6px] border-white/20 animate-pulse hidden md:flex">
              <Icons.MapPin className="w-5 h-5" />
            </div>
            <div className="absolute right-[11%] bottom-[24%] w-12 h-12 rounded-full bg-white text-primary-600 flex items-center justify-center shadow-lg border-[6px] border-white/20 animate-pulse hidden md:flex [animation-delay:0.6s]">
              <Icons.MapPin className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* MPP Digital CTA Banner */}
      <section className="py-12 bg-white" id="mpp-digital">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-primary-900 to-primary-700 text-white p-8 md:p-12 shadow-xl border border-primary-800">
            {/* Floating Background Circles */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-center gap-6">
                {/* Phone Mockup */}
                <div className="w-[74px] h-[120px] rounded-[16px] border-4 border-white bg-gradient-to-b from-blue-50 to-blue-200 -rotate-6 shadow-2xl relative flex-shrink-0 hidden sm:block">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-300 rounded-full" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-extrabold" style={{ fontFamily: "var(--font-heading)" }}>
                    Butuh pelayanan administrasi secara online?
                  </h3>
                  <p className="text-sm text-primary-200 mt-2 max-w-xl leading-relaxed">
                    Gunakan aplikasi MPP Digital untuk mengakses berbagai layanan administrasi kependudukan dan perizinan secara mudah, aman, dan langsung dari smartphone Anda.
                  </p>
                </div>
              </div>
              <a
                href="https://play.google.com/store/apps/details?id=com.mppdigital.app&hl=id"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-bold hover:bg-slate-50 transition-colors shadow-lg shrink-0"
              >
                Akses MPP Digital
                <Icons.ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-20 bg-slate-50" id="lokasi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-sm font-bold mb-3">
                <Icons.MapPin className="w-4 h-4" /> Lokasi & Jam Operasional
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                Kunjungi Kami
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Icons.MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Alamat</h3>
                    <p className="text-slate-500 whitespace-pre-line text-sm">
                      {data.pengaturan.alamat}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                    <Icons.Clock className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1">Jam Operasional</h3>
                    <div className="text-slate-500 whitespace-pre-line text-sm leading-relaxed">
                      {data.pengaturan.jamOperasional}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-elevated border border-slate-100 bg-white">
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
      <div id="kritik-saran">
        <KritikSaranForm />
      </div>
    </>
  );
}
