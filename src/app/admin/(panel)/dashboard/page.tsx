import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Building,
  FileText,
  Newspaper,
  MessageSquare,
  Star,
  Image as ImageIcon,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [instansiCount, layananCount, beritaCount, pesanCount, fasilitasCount, galeriCount] =
    await Promise.all([
      prisma.instansi.count(),
      prisma.layanan.count(),
      prisma.berita.count(),
      prisma.pesanSaran.count(),
      prisma.fasilitas.count(),
      prisma.galeri.count(),
    ]);

  const pesanTerbaru = await prisma.pesanSaran.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  });

  const beritaTerbaru = await prisma.berita.findMany({
    take: 5,
    orderBy: { publishedAt: "desc" },
  });

  const pesanBelumDibaca = await prisma.pesanSaran.count({ where: { dibaca: false } });

  const stats = [
    { label: "Instansi", value: instansiCount, icon: Building, color: "bg-blue-50 text-blue-600", href: "/admin/instansi" },
    { label: "Layanan", value: layananCount, icon: FileText, color: "bg-emerald-50 text-emerald-600", href: "/admin/layanan" },
    { label: "Berita", value: beritaCount, icon: Newspaper, color: "bg-purple-50 text-purple-600", href: "/admin/berita" },
    { label: "Fasilitas", value: fasilitasCount, icon: Star, color: "bg-amber-50 text-amber-600", href: "/admin/fasilitas" },
    { label: "Galeri", value: galeriCount, icon: ImageIcon, color: "bg-pink-50 text-pink-600", href: "/admin/galeri" },
    { label: "Pesan", value: pesanCount, icon: MessageSquare, color: "bg-red-50 text-red-600", href: "/admin/pesan", badge: pesanBelumDibaca },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
          Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Selamat datang di panel admin MPP Kabupaten Bandung</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md transition-all group relative"
          >
            <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
            {stat.badge && stat.badge > 0 && (
              <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {stat.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pesan Terbaru */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary-500" />
              Pesan Terbaru
            </h2>
            <Link href="/admin/pesan" className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {pesanTerbaru.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada pesan</p>
          ) : (
            <div className="space-y-3">
              {pesanTerbaru.map((pesan) => (
                <div key={pesan.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-sm font-bold shrink-0">
                    {pesan.nama.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{pesan.nama}</p>
                      {!pesan.dibaca && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{pesan.pesan}</p>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(pesan.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Berita Terbaru */}
        <div className="bg-white rounded-xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Newspaper className="w-5 h-5 text-primary-500" />
              Berita Terbaru
            </h2>
            <Link href="/admin/berita" className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1">
              Lihat Semua <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {beritaTerbaru.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada berita</p>
          ) : (
            <div className="space-y-3">
              {beritaTerbaru.map((berita) => (
                <div key={berita.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    <Newspaper className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{berita.judul}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{berita.kategori}</span>
                      <span className="text-xs text-slate-400">{formatDate(berita.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
