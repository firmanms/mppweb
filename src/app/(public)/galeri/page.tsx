import prisma from "@/lib/prisma";
import { Image as ImageIcon, Film, Camera } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galeri",
  description: "Dokumentasi foto dan video kegiatan Mal Pelayanan Publik Kabupaten Bandung",
};

export default async function GaleriPage() {
  const galeriList = await prisma.galeri.findMany({
    include: { kategori: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(galeriList.map((g) => g.kategori?.nama || "Lainnya"))].sort();

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Galeri
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Dokumentasi foto dan video kegiatan di Mal Pelayanan Publik Kabupaten Bandung
          </p>
        </div>

        {/* Gallery Grid */}
        {galeriList.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg text-slate-500">Belum ada galeri tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {galeriList.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 border border-slate-100 hover:shadow-elevated transition-all duration-300 cursor-pointer"
              >
                {/* Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {item.tipeMedia === "video" ? (
                    <Film className="w-12 h-12 text-primary-300" />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-primary-300" />
                  )}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {item.judul}
                    </h3>
                    <span className="text-white/70 text-xs">{item.kategori?.nama || "-"}</span>
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    {item.tipeMedia === "video" ? "🎬 Video" : "📷 Foto"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
