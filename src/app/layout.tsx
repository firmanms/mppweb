import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mal Pelayanan Publik Kabupaten Bandung",
    template: "%s | MPP Kabupaten Bandung",
  },
  description:
    "Mal Pelayanan Publik Kabupaten Bandung menghadirkan berbagai layanan pemerintahan dan pelayanan publik dalam satu lokasi yang nyaman dan mudah diakses.",
  keywords: [
    "MPP",
    "Mal Pelayanan Publik",
    "Kabupaten Bandung",
    "Pelayanan Publik",
    "Layanan Pemerintah",
  ],
  authors: [{ name: "Pemerintah Kabupaten Bandung" }],
  openGraph: {
    title: "Mal Pelayanan Publik Kabupaten Bandung",
    description:
      "Pelayanan Publik Semakin Mudah, Cepat, dan Terintegrasi",
    type: "website",
    locale: "id_ID",
    siteName: "MPP Kabupaten Bandung",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakarta.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
