import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate size (1 MB max)
    if (file.size > 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file tidak boleh lebih dari 1 MB" }, { status: 400 });
    }

    // Validate extension
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format file tidak didukung" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${crypto.randomUUID()}${ext}`;

    // Get Settings
    const pengaturan = await prisma.pengaturan.findUnique({
      where: { id: 1 },
    });

    if (pengaturan?.uploadProvider === "s3") {
      if (
        !pengaturan.s3Endpoint ||
        !pengaturan.s3Region ||
        !pengaturan.s3AccessKey ||
        !pengaturan.s3SecretKey ||
        !pengaturan.s3BucketName
      ) {
        return NextResponse.json(
          { error: "Kredensial S3 belum lengkap di pengaturan" },
          { status: 500 }
        );
      }

      // Configure S3 Client
      const s3Client = new S3Client({
        region: pengaturan.s3Region,
        endpoint: pengaturan.s3Endpoint,
        credentials: {
          accessKeyId: pengaturan.s3AccessKey,
          secretAccessKey: pengaturan.s3SecretKey,
        },
        forcePathStyle: true, // Typically needed for MinIO
      });

      const params = {
        Bucket: pengaturan.s3BucketName,
        Key: `uploads/${filename}`,
        Body: buffer,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(params);
      await s3Client.send(command);

      const baseUrl = pengaturan.s3PublicUrl 
        ? pengaturan.s3PublicUrl.replace(/\/$/, "") 
        : `${pengaturan.s3Endpoint}/${pengaturan.s3BucketName}`;
      
      const fileUrl = `${baseUrl}/uploads/${filename}`;
      return NextResponse.json({ url: fileUrl });
    }

    // Local Storage Fallback
    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (e) {
      console.log("Uploads directory exists or cannot be created:", e);
    }

    const filePath = path.join(uploadsDir, filename);
    await writeFile(filePath, buffer);

    const fileUrl = `/api/files/${filename}`;
    
    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
