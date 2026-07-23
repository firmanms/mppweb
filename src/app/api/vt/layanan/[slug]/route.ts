import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const layanan = await prisma.layanan.findUnique({
      where: { slug },
      include: {
        instansi: true,
        kategori: true,
      },
    });

    if (!layanan) {
      return NextResponse.json(
        { status: "error", message: "Layanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      data: layanan,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
