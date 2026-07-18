"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";

const pesanSchema = z.object({
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  telepon: z.string().optional().or(z.literal("")),
  subjek: z.string().optional().or(z.literal("")),
  pesan: z.string().min(10, "Pesan minimal 10 karakter"),
});

export async function kirimPesan(formData: FormData) {
  const raw = {
    nama: formData.get("nama") as string,
    email: formData.get("email") as string,
    telepon: formData.get("telepon") as string,
    subjek: formData.get("subjek") as string,
    pesan: formData.get("pesan") as string,
  };

  const parsed = pesanSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.pesanSaran.create({
    data: {
      nama: parsed.data.nama,
      email: parsed.data.email || null,
      telepon: parsed.data.telepon || null,
      subjek: parsed.data.subjek || null,
      pesan: parsed.data.pesan,
    },
  });

  return { success: true };
}

export async function getPesanList() {
  return await prisma.pesanSaran.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function markAsRead(id: number) {
  await prisma.pesanSaran.update({
    where: { id },
    data: { dibaca: true },
  });
  return { success: true };
}

export async function deletePesan(id: number) {
  await prisma.pesanSaran.delete({
    where: { id },
  });
  return { success: true };
}
