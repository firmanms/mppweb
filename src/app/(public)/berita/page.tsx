import prisma from "@/lib/prisma";
import BeritaList from "@/components/berita/BeritaList";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Berita",
  description: "Berita dan informasi terbaru dari Mal Pelayanan Publik Kabupaten Bandung",
};

export default async function BeritaPage() {
  const beritaList = await prisma.berita.findMany({
    include: { kategori: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });

  const categories = [...new Set(beritaList.map((b) => b.kategori?.nama || "Lainnya"))].sort();

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Berita & Pengumuman
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Informasi dan perkembangan terbaru mengenai MPP Kabupaten Bandung
          </p>
        </div>

        <BeritaList
          beritaList={JSON.parse(JSON.stringify(beritaList))}
          categories={categories}
        />
      </div>
    </div>
  );
}
