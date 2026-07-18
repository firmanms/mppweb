"use server";

import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function getBeritaList() {
  return await prisma.berita.findMany({
    include: { kategori: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function createBerita(data: {
  judul: string;
  kategoriId?: number;
  konten: string;
  ringkasan?: string;
  fotoUtama?: string;
  featured?: boolean;
}) {
  const baseSlug = slugify(data.judul);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.berita.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const berita = await prisma.berita.create({
    data: {
      judul: data.judul,
      slug,
      kategoriId: data.kategoriId || null,
      konten: data.konten,
      ringkasan: data.ringkasan || null,
      fotoUtama: data.fotoUtama || null,
      featured: data.featured ?? false,
      publishedAt: new Date(),
    },
  });

  revalidatePath("/");
  revalidatePath("/berita");
  return berita;
}

export async function updateBerita(
  id: number,
  data: {
    judul: string;
    kategoriId?: number;
    konten: string;
    ringkasan?: string;
    fotoUtama?: string;
    featured?: boolean;
  }
) {
  const current = await prisma.berita.findUnique({ where: { id } });
  if (!current) throw new Error("Berita tidak ditemukan");

  let slug = current.slug;
  if (current.judul !== data.judul) {
    const baseSlug = slugify(data.judul);
    slug = baseSlug;
    let counter = 1;
    while (
      await prisma.berita.findFirst({
        where: { slug, id: { not: id } },
      })
    ) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
  }

  const berita = await prisma.berita.update({
    where: { id },
    data: {
      judul: data.judul,
      slug,
      kategoriId: data.kategoriId || null,
      konten: data.konten,
      ringkasan: data.ringkasan || null,
      fotoUtama: data.fotoUtama || null,
      featured: data.featured ?? false,
    },
  });

  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath(`/berita/${slug}`);
  return berita;
}

export async function deleteBerita(id: number) {
  const current = await prisma.berita.findUnique({ where: { id } });
  if (!current) throw new Error("Berita tidak ditemukan");

  await prisma.berita.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/berita");
  revalidatePath(`/berita/${current.slug}`);
  return { success: true };
}
