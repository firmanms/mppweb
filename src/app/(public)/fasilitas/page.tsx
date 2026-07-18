import prisma from "@/lib/prisma";
import {
  Wifi,
  Car,
  Baby,
  Bath,
  Moon,
  Info,
  Accessibility,
  Star,
  Heart,
  Zap,
  Shield,
  Users,
  FileText,
  Building2,
  UtensilsCrossed,
  BatteryCharging,
  TicketCheck,
  ListOrdered,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fasilitas",
  description: "Fasilitas yang tersedia di Mal Pelayanan Publik Kabupaten Bandung",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Armchair: Users,
  TicketCheck: TicketCheck,
  ListOrdered: ListOrdered,
  Info: Info,
  Baby: Baby,
  Accessibility: Accessibility,
  Blocks: Star,
  Moon: Moon,
  Bath: Bath,
  Car: Car,
  Wifi: Wifi,
  BatteryCharging: BatteryCharging,
  UtensilsCrossed: UtensilsCrossed,
};

export default async function FasilitasPage() {
  const fasilitasList = await prisma.fasilitas.findMany({
    orderBy: { nama: "asc" },
  });

  return (
    <div className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="w-16 h-16 rounded-2xl gradient-accent flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Star className="w-8 h-8 text-white" />
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Fasilitas
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Berbagai fasilitas modern tersedia untuk kenyamanan pengunjung MPP Kabupaten Bandung
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {fasilitasList.map((fas) => {
            const IconComp = fas.ikon ? (iconMap[fas.ikon] || Star) : Star;
            return (
              <div
                key={fas.id}
                className="group bg-white rounded-2xl border border-slate-100 p-6 hover:border-accent-200 hover:shadow-elevated transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent-50 flex items-center justify-center mb-5 group-hover:bg-accent-100 transition-colors">
                  <IconComp className="w-7 h-7 text-accent-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{fas.nama}</h3>
                {fas.deskripsi && (
                  <p className="text-sm text-slate-500 mb-3 line-clamp-3">{fas.deskripsi}</p>
                )}
                {fas.lokasi && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    📍 {fas.lokasi}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
