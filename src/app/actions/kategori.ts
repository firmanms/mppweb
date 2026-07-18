"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getKategoriList(tipe?: string) {
  return await prisma.kategori.findMany({
    where: tipe ? { tipe } : undefined,
    orderBy: { nama: "asc" },
  });
}

export async function getKategoriById(id: number) {
  return await prisma.kategori.findUnique({
    where: { id },
  });
}

export async function createKategori(data: { nama: string; tipe: string }) {
  const slug = slugify(data.nama);

  // Check unique constraint for [tipe, slug]
  const existing = await prisma.kategori.findUnique({
    where: {
      tipe_slug: {
        tipe: data.tipe,
        slug,
      },
    },
  });

  if (existing) {
    throw new Error("Kategori dengan nama ini sudah ada untuk tipe tersebut.");
  }

  const result = await prisma.kategori.create({
    data: {
      nama: data.nama,
      slug,
      tipe: data.tipe,
    },
  });

  revalidatePath("/admin/kategori");
  revalidatePath(`/admin/${data.tipe}`);
  
  return result;
}

export async function updateKategori(
  id: number,
  data: { nama: string; tipe: string }
) {
  const slug = slugify(data.nama);

  const existing = await prisma.kategori.findFirst({
    where: {
      tipe: data.tipe,
      slug,
      NOT: {
        id: id,
      },
    },
  });

  if (existing) {
    throw new Error("Kategori dengan nama ini sudah ada untuk tipe tersebut.");
  }

  const result = await prisma.kategori.update({
    where: { id },
    data: {
      nama: data.nama,
      slug,
      tipe: data.tipe,
    },
  });

  revalidatePath("/admin/kategori");
  revalidatePath(`/admin/${data.tipe}`);
  
  return result;
}

export async function deleteKategori(id: number) {
  const category = await getKategoriById(id);
  if (!category) throw new Error("Kategori tidak ditemukan");

  await prisma.kategori.delete({
    where: { id },
  });

  revalidatePath("/admin/kategori");
  revalidatePath(`/admin/${category.tipe}`);
  
  return true;
}
