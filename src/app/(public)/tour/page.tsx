import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Virtual Tour",
  description: "Virtual Tour Mal Pelayanan Publik Kabupaten Bandung",
};

// Halaman Tour hanya redirect ke URL eksternal
// Ganti URL di bawah dengan URL Virtual Tour yang sebenarnya
const VIRTUAL_TOUR_URL = "https://www.google.com/maps/@-6.959189,107.5261105,3a,75y/data=!3m8!1e1!3m6!1s-!2e0!3e2!6s-!7i5376!8i2688";

export default function TourPage() {
  redirect(VIRTUAL_TOUR_URL);
}
