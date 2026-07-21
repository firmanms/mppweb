import { redirect } from "next/navigation";
import { getSession, logout } from "@/app/actions/auth";
import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Building,
  FileText,
  Star,
  Newspaper,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  FolderTree,
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";

const sidebarLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/instansi", label: "Instansi", icon: Building },
  { href: "/admin/layanan", label: "Layanan", icon: FileText },
  { href: "/admin/fasilitas", label: "Fasilitas", icon: Star },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/galeri", label: "Galeri", icon: ImageIcon },
  { href: "/admin/kategori", label: "Master Kategori", icon: FolderTree },
  { href: "/admin/pesan", label: "Pesan Saran", icon: MessageSquare },
  { href: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50">
      {/* Sidebar — AdminSidebar menangani toggle di mobile */}
      <AdminSidebar>
        {/* Brand */}
        <div className="p-5 border-b border-slate-700/50">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">Admin MPP</p>
              <p className="text-xs text-slate-400 leading-tight">Kab. Bandung</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-sm font-bold">
              {session.nama.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.nama}</p>
              <p className="text-xs text-slate-400 truncate">{session.role}</p>
            </div>
          </div>
          <form action={async () => {
            "use server";
            await logout();
            redirect("/admin/login");
          }}>
            <button
              type="submit"
              className="flex items-center gap-2 w-full px-4 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </form>
        </div>
      </AdminSidebar>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

