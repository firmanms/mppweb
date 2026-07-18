import prisma from "@/lib/prisma";
import InstansiList from "@/components/instansi/InstansiList";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instansi",
  description: "Daftar instansi yang membuka layanan di Mal Pelayanan Publik Kabupaten Bandung",
};

export default async function InstansiPage() {
  const instansiList = await prisma.instansi.findMany({
    orderBy: { nama: "asc" },
    include: {
      _count: { select: { layanan: true } },
      kategori: true,
    },
  });

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Instansi
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Temukan instansi yang membuka layanan di Mal Pelayanan Publik Kabupaten Bandung
          </p>
        </div>

        <InstansiList instansiList={JSON.parse(JSON.stringify(instansiList))} />
      </div>
    </div>
  );
}
