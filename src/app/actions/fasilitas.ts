"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getFasilitasList() {
  return await prisma.fasilitas.findMany({
    orderBy: { nama: "asc" },
  });
}

export async function createFasilitas(data: {
  nama: string;
  foto?: string;
  deskripsi?: string;
  lokasi?: string;
  ikon?: string;
}) {
  const baseSlug = slugify(data.nama);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.fasilitas.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const fasilitas = await prisma.fasilitas.create({
    data: {
      nama: data.nama,
      slug,
      foto: data.foto || null,
      deskripsi: data.deskripsi || null,
      lokasi: data.lokasi || null,
      ikon: data.ikon || "Star",
    },
  });

  revalidatePath("/");
  revalidatePath("/fasilitas");
  return fasilitas;
}

export async function updateFasilitas(
  id: number,
  data: {
    nama: string;
    foto?: string;
    deskripsi?: string;
    lokasi?: string;
    ikon?: string;
  }
) {
  const current = await prisma.fasilitas.findUnique({ where: { id } });
  if (!current) throw new Error("Fasilitas tidak ditemukan");

  let slug = current.slug;
  if (current.nama !== data.nama) {
    const baseSlug = slugify(data.nama);
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.fasilitas.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const fasilitas = await prisma.fasilitas.update({
    where: { id },
    data: {
      nama: data.nama,
      slug,
      foto: data.foto || null,
      deskripsi: data.deskripsi || null,
      lokasi: data.lokasi || null,
      ikon: data.ikon || "Star",
    },
  });

  revalidatePath("/");
  revalidatePath("/fasilitas");
  return fasilitas;
}

export async function deleteFasilitas(id: number) {
  await prisma.fasilitas.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/fasilitas");
  return { success: true };
}
