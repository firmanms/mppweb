import Link from "next/link";
import { getPengaturan } from "@/app/actions/pengaturan";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
} from "lucide-react";

const FacebookIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const YoutubeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const quickLinks = [
  { href: "/layanan", label: "Layanan" },
  { href: "/instansi", label: "Instansi" },
  { href: "/fasilitas", label: "Fasilitas" },
  { href: "/berita", label: "Berita" },
  { href: "/galeri", label: "Galeri" },
  { href: "/profil", label: "Profil MPP" },
  { href: "/sakti", label: "Layanan SAKTI" },
];

export default async function Footer() {
  const pData = await getPengaturan();

  const socialLinks = [
    { icon: FacebookIcon, href: pData?.facebookUrl || "#", label: "Facebook" },
    { icon: InstagramIcon, href: pData?.instagramUrl || "#", label: "Instagram" },
    { icon: TwitterIcon, href: pData?.twitterUrl || "#", label: "Twitter" },
    { icon: YoutubeIcon, href: pData?.youtubeUrl || "#", label: "YouTube" },
  ].filter(link => link.href !== "#" && link.href !== "");

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5">
              {pData?.logoWebsite ? (
                <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center overflow-hidden shadow-sm border border-slate-700/50">
                  <img src={pData.logoWebsite} alt="Logo" className="w-full h-full object-contain p-1" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <p className="text-base font-bold text-white leading-tight">
                  Mal Pelayanan Publik
                </p>
                <p className="text-xs text-slate-400 leading-tight">
                  Kabupaten Bandung
                </p>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Pelayanan Publik Semakin Mudah, Cepat, dan Terintegrasi. Satu tempat untuk
              beragam layanan publik bagi masyarakat Kabupaten Bandung.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-primary-600 flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Tautan Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-accent-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Kontak</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <MapPin className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 whitespace-pre-line">
                  {pData?.alamat}
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="text-slate-400">
                  {pData?.nomorWa ? (
                    <a href={`https://wa.me/${pData.nomorWa.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                      {pData.nomorWa}
                    </a>
                  ) : "(022) 589-1234"}
                </span>
              </li>
              <li className="flex gap-3 text-sm">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="text-slate-400">mpp@bandungkab.go.id</span>
              </li>
              <li className="flex gap-3 text-sm">
                <Clock className="w-5 h-5 text-primary-400 shrink-0" />
                <div className="text-slate-400 whitespace-pre-line">
                  {pData?.jamOperasional}
                </div>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div>
            <h3 className="text-white font-semibold text-base mb-5">Lokasi</h3>
            <div className="rounded-xl overflow-hidden border border-slate-700">
              <iframe
                src={pData?.mapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.0!2d107.5!3d-7.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwMDAnMDAuMCJTIDEwN8KwMzAnMDAuMCJF!5e0!3m2!1sid!2sid!4v1"}
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi MPP Kabupaten Bandung"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500 text-center md:text-left">
              © {new Date().getFullYear()} Mal Pelayanan Publik Kabupaten Bandung. Hak Cipta Dilindungi.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link href="/kebijakan-privasi" className="hover:text-slate-300 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/syarat-ketentuan" className="hover:text-slate-300 transition-colors">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
