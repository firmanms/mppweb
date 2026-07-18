"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getInstansiList() {
  return await prisma.instansi.findMany({
    include: { kategori: true },
    orderBy: { nama: "asc" },
  });
}

export async function getInstansiById(id: number) {
  return await prisma.instansi.findUnique({
    where: { id },
  });
}

export async function createInstansi(data: {
  nama: string;
  logo?: string;
  deskripsi?: string;
  kategoriId?: number;
  lokasiLoket?: string;
  jamPelayanan?: string;
  kontak?: string;
}) {
  const baseSlug = slugify(data.nama);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.instansi.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const instansi = await prisma.instansi.create({
    data: {
      nama: data.nama,
      slug,
      logo: data.logo || null,
      deskripsi: data.deskripsi || null,
      kategoriId: data.kategoriId || null,
      lokasiLoket: data.lokasiLoket || null,
      jamPelayanan: data.jamPelayanan || null,
      kontak: data.kontak || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/instansi");
  return instansi;
}

export async function updateInstansi(
  id: number,
  data: {
    nama: string;
    logo?: string;
    deskripsi?: string;
    kategoriId?: number;
    lokasiLoket?: string;
    jamPelayanan?: string;
    kontak?: string;
  }
) {
  const current = await prisma.instansi.findUnique({ where: { id } });
  if (!current) throw new Error("Instansi tidak ditemukan");

  let slug = current.slug;
  if (current.nama !== data.nama) {
    const baseSlug = slugify(data.nama);
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.instansi.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const instansi = await prisma.instansi.update({
    where: { id },
    data: {
      nama: data.nama,
      slug,
      logo: data.logo || null,
      deskripsi: data.deskripsi || null,
      kategoriId: data.kategoriId || null,
      lokasiLoket: data.lokasiLoket || null,
      jamPelayanan: data.jamPelayanan || null,
      kontak: data.kontak || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/instansi");
  revalidatePath(`/instansi/${slug}`);
  return instansi;
}

export async function deleteInstansi(id: number) {
  const current = await prisma.instansi.findUnique({ where: { id } });
  if (!current) throw new Error("Instansi tidak ditemukan");

  await prisma.instansi.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/instansi");
  revalidatePath(`/instansi/${current.slug}`);
  return { success: true };
}
