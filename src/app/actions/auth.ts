"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email dan password harus diisi" };
  }

  const user = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!user) {
    return { success: false, error: "Email atau password salah" };
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return { success: false, error: "Email atau password salah" };
  }

  // Simple session using cookies
  const sessionData = JSON.stringify({
    id: user.id,
    nama: user.nama,
    email: user.email,
    role: user.role,
  });

  const cookieStore = await cookies();
  cookieStore.set("admin-session", Buffer.from(sessionData).toString("base64"), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  });

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-session");
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin-session");

  if (!session) return null;

  try {
    const data = JSON.parse(Buffer.from(session.value, "base64").toString());
    return data as {
      id: number;
      nama: string;
      email: string;
      role: string;
    };
  } catch {
    return null;
  }
}
