"use client";

import { useState } from "react";
import { kirimPesan } from "@/app/actions/pesan";
import { Send, CheckCircle2 } from "lucide-react";
import MathCaptcha from "@/components/ui/MathCaptcha";

export default function KritikSaranForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [key, setKey] = useState(0); // For forcing MathCaptcha reset


  async function handleSubmit(formData: FormData) {
    if (!isCaptchaValid) {
      setErrors({ captcha: ["Jawaban CAPTCHA salah! Silakan periksa kembali."] });
      return;
    }

    setStatus("loading");
    setErrors({});

    const result = await kirimPesan(formData);

    if (result.success) {
      setStatus("success");
      setKey((prev) => prev + 1); // Reset captcha
      // Reset form
      const form = document.getElementById("kritik-saran-form") as HTMLFormElement;
      form?.reset();
    } else {
      setStatus("error");
      setErrors(result.errors || {});
      setKey((prev) => prev + 1); // Reset captcha
    }
  }

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-3xl font-extrabold text-slate-900 mb-3"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
          >
            Kritik & Saran
          </h2>
          <p className="text-slate-500 text-lg">
            Sampaikan kritik dan saran Anda untuk peningkatan kualitas pelayanan
          </p>
        </div>

        {status === "success" && (
          <div className="mb-8 p-5 rounded-xl bg-success-50 border border-success-100 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-success-600 shrink-0" />
            <div>
              <p className="font-semibold text-success-700">Terima kasih!</p>
              <p className="text-sm text-success-600">Pesan Anda telah berhasil dikirim.</p>
            </div>
          </div>
        )}

        <form
          id="kritik-saran-form"
          action={handleSubmit}
          className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 lg:p-10"
        >
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="nama" className="block text-sm font-semibold text-slate-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
              />
              {errors.nama && <p className="text-red-500 text-xs mt-1">{errors.nama[0]}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="email@contoh.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email[0]}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="telepon" className="block text-sm font-semibold text-slate-700 mb-2">
                No. Telepon
              </label>
              <input
                type="text"
                id="telepon"
                name="telepon"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            <div>
              <label htmlFor="subjek" className="block text-sm font-semibold text-slate-700 mb-2">
                Subjek
              </label>
              <input
                type="text"
                id="subjek"
                name="subjek"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Subjek pesan"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="pesan" className="block text-sm font-semibold text-slate-700 mb-2">
              Pesan <span className="text-red-500">*</span>
            </label>
            <textarea
              id="pesan"
              name="pesan"
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Tuliskan kritik, saran, atau pesan Anda..."
            />
            {errors.pesan && <p className="text-red-500 text-xs mt-1">{errors.pesan[0]}</p>}
          </div>

          <MathCaptcha key={key} onValidate={(valid) => setIsCaptchaValid(valid)} />
          {errors.captcha && <p className="text-red-500 text-xs mt-1 mb-4">{errors.captcha[0]}</p>}

          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Kirim Pesan
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
