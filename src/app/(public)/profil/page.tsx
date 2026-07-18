import prisma from "@/lib/prisma";
import { Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profil",
  description: "Profil Mal Pelayanan Publik Kabupaten Bandung - Visi, Misi, dan Informasi Umum",
};

export default async function ProfilPage() {
  const halaman = await prisma.halamanStatis.findUnique({
    where: { slug: "profil" },
  });

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            {halaman?.judul || "Profil MPP Kabupaten Bandung"}
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Mengenal lebih dekat Mal Pelayanan Publik Kabupaten Bandung
          </p>
        </div>

        {/* Content */}
        {halaman ? (
          <div
            className="prose-content bg-white rounded-2xl p-8 lg:p-12 shadow-soft border border-slate-100"
            dangerouslySetInnerHTML={{ __html: halaman.konten }}
          />
        ) : (
          <div className="text-center text-slate-500 py-20">
            Konten profil belum tersedia.
          </div>
        )}
      </div>
    </div>
  );
}
