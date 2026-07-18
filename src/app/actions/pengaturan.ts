"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPengaturan() {
  let pengaturan = await prisma.pengaturan.findUnique({
    where: { id: 1 },
  });

  if (!pengaturan) {
    pengaturan = await prisma.pengaturan.create({
      data: {
        id: 1,
        headerTitle: "Pelayanan Publik Semakin Mudah, Cepat, dan Terintegrasi",
        headerSubtitle: "Mal Pelayanan Publik Kabupaten Bandung menghadirkan berbagai layanan pemerintahan dalam satu tempat untuk Anda.",
        ratingKepuasan: "98%",
        teksProfilJudul: "Satu tempat untuk berbagai kebutuhan pelayanan publik",
        teksProfilDeskripsi: "Mal Pelayanan Publik Kabupaten Bandung hadir sebagai pusat pelayanan terpadu yang mengintegrasikan instansi pemerintah, BUMN, BUMD, dan lembaga pelayanan publik lainnya.",
        alamat: "Jl. Raya Soreang KM. 17, Soreang, Kabupaten Bandung, Jawa Barat 40911",
        jamOperasional: "Senin - Kamis: 08.00 - 15.00 WIB\nJumat: 08.00 - 14.30 WIB\nSabtu - Minggu: Tutup",
        nomorWa: "081234567890",
        mapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.5!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJTIDEwN8KwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1",
        facebookUrl: "https://facebook.com/mppkabbandung",
        instagramUrl: "https://instagram.com/mppkabbandung",
        twitterUrl: "https://twitter.com/mppkabbandung",
        youtubeUrl: "https://youtube.com/mppkabbandung",
        logoWebsite: "/images/logo.png",
        fotoHeader: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
        fotoProfil: "https://images.unsplash.com/photo-1577495508048-b635879837f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        fotoVirtualTour: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        uploadProvider: "local",
        s3Endpoint: "",
        s3Region: "",
        s3AccessKey: "",
        s3SecretKey: "",
        s3BucketName: "",
        s3PublicUrl: "",
      },
    });
  }

  return pengaturan;
}

export async function updatePengaturan(data: any) {
  const updated = await prisma.pengaturan.upsert({
    where: { id: 1 },
    update: data,
    create: { id: 1, ...data },
  });

  revalidatePath("/");
  return updated;
}
