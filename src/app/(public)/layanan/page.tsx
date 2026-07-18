import prisma from "@/lib/prisma";
import LayananList from "@/components/layanan/LayananList";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan",
  description: "Daftar layanan publik yang tersedia di Mal Pelayanan Publik Kabupaten Bandung",
};

export default async function LayananPage() {
  const layananList = await prisma.layanan.findMany({
    orderBy: [{ populer: "desc" }, { nama: "asc" }],
    include: { instansi: { select: { nama: true, slug: true } }, kategori: true },
  });

  const instansiNames = [...new Set(layananList.map((l) => l.instansi.nama))].sort();
  const categories = [...new Set(layananList.map((l) => l.kategori?.nama).filter(Boolean) as string[])].sort();

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
            Layanan
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Temukan informasi lengkap mengenai layanan yang tersedia di MPP Kabupaten Bandung
          </p>
        </div>

        <LayananList
          layananList={JSON.parse(JSON.stringify(layananList))}
          instansiNames={instansiNames}
          categories={categories}
        />
      </div>
    </div>
  );
}
