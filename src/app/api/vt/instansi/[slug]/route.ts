import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const instansi = await prisma.instansi.findUnique({
      where: { slug },
      include: {
        kategori: true,
        layanan: {
          orderBy: { nama: "asc" },
          include: { kategori: true },
        },
      },
    });

    if (!instansi) {
      return NextResponse.json(
        { status: "error", message: "Instansi tidak ditemukan" },
        { status: 404 }
      );
    }

    const gratisCount = instansi.layanan.filter((l) => l.status === "gratis").length;
    const berbayarCount = instansi.layanan.length - gratisCount;

    return NextResponse.json({
      status: "success",
      data: {
        ...instansi,
        stats: {
          totalLayanan: instansi.layanan.length,
          gratisCount,
          berbayarCount,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
