import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const lantai = searchParams.get("lantai") || "";
    const kategori = searchParams.get("kategori") || "";

    const instansiList = await prisma.instansi.findMany({
      where: {
        AND: [
          search
            ? {
                nama: {
                  contains: search,
                },
              }
            : {},
          lantai && lantai !== "Semua Lantai"
            ? {
                lantai: lantai,
              }
            : {},
          kategori && kategori !== "Semua"
            ? {
                kategori: {
                  nama: kategori,
                },
              }
            : {},
        ],
      },
      include: {
        kategori: true,
        _count: {
          select: { layanan: true },
        },
      },
      orderBy: {
        nama: "asc",
      },
    });

    const allInstansi = await prisma.instansi.findMany({
      select: { lantai: true },
    });

    const existingFloors = new Set<string>();
    allInstansi.forEach((inst) => {
      if (inst.lantai && inst.lantai.trim()) {
        existingFloors.add(inst.lantai.trim());
      }
    });

    const sortedFloors = Array.from(existingFloors).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );

    const totalLayanan = instansiList.reduce(
      (acc, item) => acc + item._count.layanan,
      0
    );

    return NextResponse.json({
      status: "success",
      data: {
        instansi: instansiList,
        floors: ["Semua Lantai", ...sortedFloors],
        meta: {
          totalInstansi: instansiList.length,
          totalLayanan,
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
