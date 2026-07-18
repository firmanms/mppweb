"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/auth";
import { Building2, LogIn, AlertCircle, RefreshCw } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, sum: 0 });
  const [captchaInput, setCaptchaInput] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    generateCaptcha();
    setMounted(true);
  }, []);

  function generateCaptcha() {
    const n1 = Math.floor(Math.random() * 9) + 1;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptcha({ num1: n1, num2: n2, sum: n1 + n2 });
    setCaptchaInput("");
  }

  async function handleSubmit(formData: FormData) {
    if (parseInt(captchaInput) !== captcha.sum) {
      setError("Jawaban CAPTCHA salah!");
      generateCaptcha();
      return;
    }

    setLoading(true);
    setError(null);

    const result = await login(formData);

    if (result.success) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      setError(result.error || "Login gagal");
      setLoading(false);
      generateCaptcha();
    }
  }

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Admin Panel
          </h1>
          <p className="text-primary-200 text-sm mt-1">
            Mal Pelayanan Publik Kabupaten Bandung
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Masuk</h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="admin@mpp.bandungkab.go.id"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            {mounted && (
              <div>
                <label htmlFor="captcha" className="block text-sm font-semibold text-slate-700 mb-2">
                  Verifikasi CAPTCHA <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-700 font-bold px-3 py-2 rounded-xl select-none tracking-wider text-base min-w-[90px] h-[46px]">
                    {captcha.num1} + {captcha.num2} = ?
                  </div>
                  <button
                    type="button"
                    onClick={generateCaptcha}
                    className="p-2 text-slate-500 hover:text-primary-600 rounded-xl hover:bg-slate-50 border border-slate-200 h-[46px] w-[46px] flex items-center justify-center shrink-0"
                    title="Ganti CAPTCHA"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    id="captcha"
                    name="captcha"
                    required
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-[46px]"
                    placeholder="Jawaban"
                  />
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl gradient-primary text-white font-semibold shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn className="w-5 h-5" />
              )}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-6">
            Default: admin@mpp.bandungkab.go.id / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
