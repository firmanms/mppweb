import Link from "next/link";
import {
  Zap,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Globe,
  Clock,
  Bell,
  HelpCircle,
  Phone,
  Mail,
  ExternalLink,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MPP Digital",
  description: "Aplikasi MPP Digital - Akses layanan publik secara digital di Mal Pelayanan Publik Kabupaten Bandung",
};

export default function MppDigitalPage() {
  const benefits = [
    { icon: Globe, title: "Akses Dimana Saja", desc: "Layanan dapat diakses 24/7 dari mana saja melalui perangkat Anda." },
    { icon: Clock, title: "Hemat Waktu", desc: "Tidak perlu datang dan mengantri, proses layanan lebih cepat." },
    { icon: Bell, title: "Notifikasi Real-time", desc: "Pantau status permohonan Anda dengan notifikasi otomatis." },
    { icon: Smartphone, title: "Mobile Friendly", desc: "Aplikasi responsif yang dapat digunakan di smartphone maupun desktop." },
  ];

  const faqs = [
    {
      q: "Apa itu MPP Digital?",
      a: "MPP Digital adalah aplikasi layanan publik terpadu yang memungkinkan masyarakat mengakses berbagai layanan administrasi secara online dari smartphone.",
    },
    {
      q: "Bagaimana cara mendapatkan MPP Digital?",
      a: "Anda dapat mengunduh aplikasi MPP Digital secara gratis melalui Google Play Store di perangkat Android Anda.",
    },
    {
      q: "Apakah layanan di MPP Digital gratis?",
      a: "Ya, pendaftaran dan penggunaan aplikasi MPP Digital tidak dikenakan biaya. Biaya hanya berlaku untuk layanan tertentu sesuai dengan ketentuan retribusi daerah.",
    },
    {
      q: "Layanan apa saja yang tersedia di MPP Digital?",
      a: "Aplikasi ini menyediakan berbagai layanan administrasi kependudukan, perizinan, kesehatan, dan informasi layanan publik lainnya di Kabupaten Bandung.",
    },
    {
      q: "Bagaimana jika mengalami kendala saat penggunaan aplikasi?",
      a: "Hubungi helpdesk kami melalui telepon atau email yang tersedia di bagian bawah halaman ini untuk bantuan lebih lanjut.",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="gradient-hero text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-2xl bg-accent-500 flex items-center justify-center mx-auto mb-8 shadow-xl">
            <Smartphone className="w-10 h-10 text-white" />
          </div>
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-accent-300 text-xs font-semibold mb-4 border border-white/15">
            Layanan Publik Digital Nasional
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold mb-6"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Aplikasi MPP Digital (Nasional)
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Aplikasi layanan publik terpadu skala nasional dari KemenPAN-RB untuk memudahkan akses layanan kependudukan dan perizinan langsung dari smartphone Anda.
          </p>
          <a
            href="https://play.google.com/store/apps/details?id=com.mppdigital.app&hl=id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-900 font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <ExternalLink className="w-5 h-5" />
            Unduh di Play Store
          </a>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2
              className="text-3xl font-extrabold text-slate-900"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Mengapa Menggunakan MPP Digital?
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 text-center hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 flex items-center justify-center">
                  <item.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bedas Digital Services Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Decorative BG elements */}
            <div className="absolute -bottom-10 -right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl" />

            <div className="relative grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/30 text-xs font-semibold">
                  <Smartphone className="w-4 h-4" />
                  Layanan Publik Online Pemkab Bandung
                </div>

                <h2
                  className="text-3xl sm:text-4xl font-extrabold text-white"
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  Bedas Digital Services
                </h2>

                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  Bedas Digital Services merupakan sistem layanan satu pintu yang terintegrasi dengan seluruh aplikasi yang ada di Kabupaten Bandung, dengan tujuan untuk memudahkan masyarakat Kabupaten Bandung mendapatkan akses layanan tanpa perlu banyak mengunduh aplikasi. Masyarakat dapat mengajukan permohonan layanan, serta dapat mengetahui status pengajuan kapanpun dan dimanapun.
                </p>

                {/* <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-sm text-slate-200">
                  <span className="font-bold text-accent-300">Layanan Utama:</span> Antara lain layanan Administrasi Kependudukan, Perizinan, dan layanan daerah terpadu lainnya.
                </div> */}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="https://play.google.com/store/apps/details?id=id.citigov.bandungkab&hl=id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-slate-900 font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5"
                  >
                    <Smartphone className="w-5 h-5" />
                    Unduh di Play Store
                  </a>

                  <a
                    href="https://bds.bandungkab.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                  >
                    <Globe className="w-5 h-5 text-accent-400" />
                    Akses via Web (bds.bandungkab.go.id)
                    <ExternalLink className="w-4 h-4 text-slate-300" />
                  </a>
                </div>
              </div>

              {/* Decorative Features Card */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="bg-white/10 backdrop-blur-xl border border-white/15 p-6 sm:p-8 rounded-3xl w-full max-w-md space-y-4 shadow-xl">
                  <div className="flex items-center gap-4 pb-4 border-b border-white/10">
                    <div className="w-12 h-12 rounded-2xl bg-accent-500 text-slate-900 flex items-center justify-center font-bold text-xl shrink-0">
                      BDS
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">Bedas Digital</h3>
                      <p className="text-xs text-slate-300">Satu Pintu Layanan Publik</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                      <span>Terintegrasi seluruh aplikasi Kabupaten Bandung</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                      <span>Permohonan & tracking status online 24/7</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                      <span>Administrasi Kependudukan & Perizinan</span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-accent-400 shrink-0 mt-0.5" />
                      <span>Praktis tanpa perlu unduh banyak aplikasi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <HelpCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h2
              className="text-3xl font-extrabold text-slate-900"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-slate-50 rounded-xl border border-slate-100 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-100 transition-colors">
                  <span className="font-semibold text-slate-800">{faq.q}</span>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Help */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl font-bold text-primary-900 mb-4"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Butuh Bantuan?
          </h2>
          <p className="text-primary-700 mb-8">
            Hubungi kami jika Anda mengalami kendala dalam mengunduh atau menggunakan MPP Digital
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:0225891234"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold border border-primary-200 hover:bg-primary-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
              (022) 589-1234
            </a>
            <a
              href="mailto:cs@mppdigital.bandungkab.go.id"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold border border-primary-200 hover:bg-primary-100 transition-colors"
            >
              <Mail className="w-5 h-5" />
              cs@mppdigital.bandungkab.go.id
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
