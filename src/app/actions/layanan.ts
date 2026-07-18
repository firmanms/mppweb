"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getLayananList() {
  return await prisma.layanan.findMany({
    include: { instansi: true, kategori: true },
    orderBy: { nama: "asc" },
  });
}

export async function createLayanan(data: {
  nama: string;
  instansiId: number;
  deskripsi?: string;
  dasarHukum?: string;
  persyaratan?: string;
  prosedur?: string;
  waktuPenyelesaian?: string;
  biaya?: string;
  produkLayanan?: string;
  pengaduan?: string;
  kategoriId?: number;
  status: string;
  linkDaring?: string;
  populer?: boolean;
}) {
  const baseSlug = slugify(data.nama);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.layanan.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const instansi = await prisma.instansi.findUnique({ where: { id: data.instansiId } });
  if (!instansi) throw new Error("Instansi tidak ditemukan");

  const layanan = await prisma.layanan.create({
    data: {
      nama: data.nama,
      slug,
      instansiId: data.instansiId,
      deskripsi: data.deskripsi || null,
      dasarHukum: data.dasarHukum || null,
      persyaratan: data.persyaratan || null,
      prosedur: data.prosedur || null,
      waktuPenyelesaian: data.waktuPenyelesaian || null,
      biaya: data.biaya || null,
      produkLayanan: data.produkLayanan || null,
      pengaduan: data.pengaduan || null,
      kategoriId: data.kategoriId || null,
      status: data.status,
      linkDaring: data.linkDaring || null,
      populer: data.populer ?? false,
    },
  });

  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath(`/instansi/${instansi.slug}`);
  return layanan;
}

export async function updateLayanan(
  id: number,
  data: {
    nama: string;
    instansiId: number;
    deskripsi?: string;
    dasarHukum?: string;
    persyaratan?: string;
    prosedur?: string;
    waktuPenyelesaian?: string;
    biaya?: string;
    produkLayanan?: string;
    pengaduan?: string;
    kategoriId?: number;
    status: string;
    linkDaring?: string;
    populer?: boolean;
  }
) {
  const current = await prisma.layanan.findUnique({
    where: { id },
    include: { instansi: true },
  });
  if (!current) throw new Error("Layanan tidak ditemukan");

  let slug = current.slug;
  if (current.nama !== data.nama) {
    const baseSlug = slugify(data.nama);
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.layanan.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const instansi = await prisma.instansi.findUnique({ where: { id: data.instansiId } });
  if (!instansi) throw new Error("Instansi tidak ditemukan");

  const layanan = await prisma.layanan.update({
    where: { id },
    data: {
      nama: data.nama,
      slug,
      instansiId: data.instansiId,
      deskripsi: data.deskripsi || null,
      dasarHukum: data.dasarHukum || null,
      persyaratan: data.persyaratan || null,
      prosedur: data.prosedur || null,
      waktuPenyelesaian: data.waktuPenyelesaian || null,
      biaya: data.biaya || null,
      produkLayanan: data.produkLayanan || null,
      pengaduan: data.pengaduan || null,
      kategoriId: data.kategoriId || null,
      status: data.status,
      linkDaring: data.linkDaring || null,
      populer: data.populer ?? false,
    },
  });

  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath(`/layanan/${slug}`);
  revalidatePath(`/instansi/${current.instansi.slug}`);
  if (current.instansiId !== data.instansiId) {
    revalidatePath(`/instansi/${instansi.slug}`);
  }
  return layanan;
}

export async function deleteLayanan(id: number) {
  const current = await prisma.layanan.findUnique({
    where: { id },
    include: { instansi: true },
  });
  if (!current) throw new Error("Layanan tidak ditemukan");

  await prisma.layanan.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/layanan");
  revalidatePath(`/layanan/${current.slug}`);
  revalidatePath(`/instansi/${current.instansi.slug}`);
  return { success: true };
}
