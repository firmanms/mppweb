"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getGaleriList() {
  return await prisma.galeri.findMany({
    include: { kategori: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createGaleri(data: {
  judul: string;
  kategoriId?: number;
  mediaUrl: string;
  tipeMedia: string;
  deskripsi?: string;
}) {
  const galeri = await prisma.galeri.create({
    data: {
      judul: data.judul,
      kategoriId: data.kategoriId || null,
      mediaUrl: data.mediaUrl,
      tipeMedia: data.tipeMedia,
      deskripsi: data.deskripsi || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/galeri");
  return galeri;
}

export async function updateGaleri(
  id: number,
  data: {
    judul: string;
    kategoriId?: number;
    mediaUrl: string;
    tipeMedia: string;
    deskripsi?: string;
  }
) {
  const galeri = await prisma.galeri.update({
    where: { id },
    data: {
      judul: data.judul,
      kategoriId: data.kategoriId || null,
      mediaUrl: data.mediaUrl,
      tipeMedia: data.tipeMedia,
      deskripsi: data.deskripsi || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/galeri");
  return galeri;
}

export async function deleteGaleri(id: number) {
  await prisma.galeri.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/galeri");
  return { success: true };
}
