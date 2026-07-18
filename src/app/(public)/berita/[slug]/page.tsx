import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, Share2, ChevronRight, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const berita = await prisma.berita.findUnique({ where: { slug }, include: { kategori: true } });
  if (!berita) return { title: "Berita Tidak Ditemukan" };
  return {
    title: berita.judul,
    description: berita.ringkasan || `Baca berita: ${berita.judul}`,
  };
}

export default async function BeritaDetailPage({ params }: Props) {
  const { slug } = await params;
  const berita = await prisma.berita.findUnique({ where: { slug }, include: { kategori: true } });

  if (!berita) notFound();

  const relatedNews = await prisma.berita.findMany({
    where: {
      kategoriId: berita.kategoriId,
      id: { not: berita.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/berita"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Berita
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          {/* Hero Image */}
          <div className="h-64 sm:h-80 bg-gradient-to-br from-primary-500 to-primary-800 flex items-center justify-center relative overflow-hidden">
            {berita.fotoUtama ? (
              <img src={berita.fotoUtama} alt={berita.judul} className="w-full h-full object-cover opacity-90" />
            ) : (
              <FileText className="w-20 h-20 text-white/20" />
            )}
            <div className="absolute bottom-6 left-6 flex gap-2">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold">
                {berita.kategori?.nama || "-"}
              </span>
            </div>
          </div>

          <div className="p-8 lg:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(berita.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {berita.kategori?.nama || "-"}
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-8 leading-tight"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              {berita.judul}
            </h1>

            {/* Content */}
            <div
              className="prose-content"
              dangerouslySetInnerHTML={{ __html: berita.konten }}
            />

            {/* Share */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <p className="text-sm text-slate-500 mb-3 flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Bagikan berita ini
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/berita/${berita.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(berita.judul)}&url=${encodeURIComponent(`/berita/${berita.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-medium hover:bg-sky-600 transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${berita.judul} - /berita/${berita.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-slate-900 mb-6" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
              Berita Terkait
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/berita/${news.slug}`}
                  className="group bg-white rounded-xl border border-slate-100 p-5 hover:border-primary-200 hover:shadow-lg transition-all"
                >
                  <p className="text-xs text-slate-400 mb-2">{formatDate(news.publishedAt)}</p>
                  <h3 className="font-semibold text-slate-800 group-hover:text-primary-700 line-clamp-2 transition-colors">
                    {news.judul}
                  </h3>
                  <div className="mt-3 text-primary-600 text-sm font-medium flex items-center">
                    Baca <ChevronRight className="w-3 h-3 ml-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
