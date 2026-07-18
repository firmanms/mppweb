"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getHalamanStatisList() {
  return await prisma.halamanStatis.findMany({
    orderBy: { slug: "asc" },
  });
}

export async function updateHalamanStatis(slug: string, judul: string, konten: string) {
  const result = await prisma.halamanStatis.upsert({
    where: { slug },
    update: { judul, konten },
    create: { slug, judul, konten },
  });

  revalidatePath(`/profil`);
  revalidatePath(`/sakti`);
  revalidatePath(`/`);
  return result;
}
