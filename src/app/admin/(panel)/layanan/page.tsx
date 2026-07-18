"use client";

import { useState, useEffect } from "react";
import {
  getLayananList,
  createLayanan,
  updateLayanan,
  deleteLayanan,
} from "@/app/actions/layanan";
import { getInstansiList } from "@/app/actions/instansi";
import { getKategoriList } from "@/app/actions/kategori";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  FileText,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  Building,
} from "lucide-react";

type Instansi = {
  id: number;
  nama: string;
};

type Layanan = {
  id: number;
  nama: string;
  slug: string;
  instansiId: number;
  instansi: Instansi;
  deskripsi: string | null;
  dasarHukum: string | null;
  persyaratan: string | null;
  prosedur: string | null;
  waktuPenyelesaian: string | null;
  biaya: string | null;
  produkLayanan: string | null;
  pengaduan: string | null;
  kategoriId: number | null;
  kategori?: { id: number; nama: string } | null;
  status: string;
  linkDaring: string | null;
  populer: boolean;
};

export default function AdminLayananPage() {
  const [list, setList] = useState<Layanan[]>([]);
  const [instansiList, setInstansiList] = useState<Instansi[]>([]);
  const [kategoriList, setKategoriList] = useState<{id: number; nama: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Layanan | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [instansiId, setInstansiId] = useState<number>(0);
  const [deskripsi, setDeskripsi] = useState("");
  const [dasarHukum, setDasarHukum] = useState("");
  const [persyaratan, setPersyaratan] = useState("");
  const [prosedur, setProsedur] = useState("");
  const [waktuPenyelesaian, setWaktuPenyelesaian] = useState("");
  const [biaya, setBiaya] = useState("");
  const [produkLayanan, setProdukLayanan] = useState("");
  const [pengaduan, setPengaduan] = useState("");
  const [kategoriId, setKategoriId] = useState<number>(0);
  const [status, setStatus] = useState("gratis");
  const [linkDaring, setLinkDaring] = useState("");
  const [populer, setPopuler] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [layList, instList, kategories] = await Promise.all([
        getLayananList(),
        getInstansiList(),
        getKategoriList("layanan")
      ]);
      setList(layList as any);
      setInstansiList(instList);
      setKategoriList(kategories);
      if (instList.length > 0) {
        setInstansiId(instList[0].id);
      }
    } catch (err: any) {
      setError(err.message || "Gagal memuat data layanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setNama("");
    if (instansiList.length > 0) {
      setInstansiId(instansiList[0].id);
    }
    setDeskripsi("");
    setDasarHukum("");
    setPersyaratan("");
    setProsedur("");
    setWaktuPenyelesaian("");
    setBiaya("");
    setProdukLayanan("");
    setPengaduan("");
    if (kategoriList.length > 0) setKategoriId(kategoriList[0].id);
    setStatus("gratis");
    setLinkDaring("");
    setPopuler(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Layanan) => {
    setSelectedItem(item);
    setNama(item.nama);
    setInstansiId(item.instansiId);
    setDeskripsi(item.deskripsi || "");
    setDasarHukum(item.dasarHukum || "");
    setPersyaratan(item.persyaratan || "");
    setProsedur(item.prosedur || "");
    setWaktuPenyelesaian(item.waktuPenyelesaian || "");
    setBiaya(item.biaya || "");
    setProdukLayanan(item.produkLayanan || "");
    setPengaduan(item.pengaduan || "");
    setKategoriId(item.kategoriId || (kategoriList.length > 0 ? kategoriList[0].id : 0));
    setStatus(item.status);
    setLinkDaring(item.linkDaring || "");
    setPopuler(item.populer);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !instansiId) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        nama,
        instansiId,
        deskripsi: deskripsi || undefined,
        dasarHukum: dasarHukum || undefined,
        persyaratan: persyaratan || undefined,
        prosedur: prosedur || undefined,
        waktuPenyelesaian: waktuPenyelesaian || undefined,
        biaya: biaya || undefined,
        produkLayanan: produkLayanan || undefined,
        pengaduan: pengaduan || undefined,
        kategoriId: kategoriId || undefined,
        status,
        linkDaring: linkDaring || undefined,
        populer,
      };

      if (selectedItem) {
        await updateLayanan(selectedItem.id, payload);
        setSuccess("Layanan berhasil diperbarui!");
      } else {
        await createLayanan(payload);
        setSuccess("Layanan baru berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan data");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;

    try {
      setError(null);
      await deleteLayanan(id);
      setSuccess("Layanan berhasil dihapus!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus layanan");
    }
  };

  const filteredList = list.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase()) ||
    item.instansi.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Manajemen Layanan
          </h1>
          <p className="text-slate-500 mt-1">Kelola seluruh jenis layanan yang disediakan di MPP</p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={instansiList.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </button>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-success-50 border border-success-100 flex items-center gap-3 text-success-700">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Search & Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari layanan berdasarkan nama atau instansi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <p className="text-sm text-slate-500 shrink-0">
          Total: <span className="font-semibold text-slate-900">{filteredList.length}</span> Layanan
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Memuat data layanan...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center shadow-sm">
          <FileText className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Belum ada data layanan</p>
          <p className="text-slate-400 text-sm mt-1">Gunakan tombol tambah untuk menambahkan layanan baru</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Layanan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Instansi</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status / Biaya</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Populer</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-600 font-bold text-sm">
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-slate-800 text-sm line-clamp-1">{item.nama}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="line-clamp-1">{item.instansi.nama}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {item.kategori?.nama || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.status === "gratis" ? "bg-success-50 text-success-700" : "bg-accent-50 text-accent-700"
                        }`}>
                          {item.status === "gratis" ? "Gratis" : "Berbayar"}
                        </span>
                        {item.biaya && <span className="text-xs text-slate-400 mt-0.5">{item.biaya}</span>}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{item.waktuPenyelesaian || "-"}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.populer ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-slate-100 text-slate-500"
                      }`}>
                        {item.populer ? "Ya" : "Tidak"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">
                {selectedItem ? "Edit Layanan" : "Tambah Layanan"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Pembuatan Paspor Baru"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Instansi Penyelenggara <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={instansiId}
                    onChange={(e) => setInstansiId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    {instansiList.map((inst) => (
                      <option key={inst.id} value={inst.id}>
                        {inst.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori Layanan</label>
                  <select
                    value={kategoriId}
                    onChange={(e) => setKategoriId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    {kategoriList.length === 0 && <option value="0">Belum ada kategori</option>}
                    {kategoriList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    <option value="gratis">Gratis</option>
                    <option value="berbayar">Berbayar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Biaya / Tarif</label>
                  <input
                    type="text"
                    value={biaya}
                    onChange={(e) => setBiaya(e.target.value)}
                    placeholder="Contoh: Rp350.000"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Waktu Penyelesaian</label>
                  <input
                    type="text"
                    value={waktuPenyelesaian}
                    onChange={(e) => setWaktuPenyelesaian(e.target.value)}
                    placeholder="Contoh: 3 hari kerja"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Link Layanan Daring (Opsional)</label>
                  <input
                    type="text"
                    value={linkDaring}
                    onChange={(e) => setLinkDaring(e.target.value)}
                    placeholder="https://sakti.bandungkab.go.id/layanan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={populer}
                      onChange={(e) => setPopuler(e.target.checked)}
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-4.5 w-4.5"
                    />
                    Tandai sebagai Layanan Populer
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Layanan</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi singkat mengenai layanan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Dasar Hukum</label>
                <textarea
                  value={dasarHukum}
                  onChange={(e) => setDasarHukum(e.target.value)}
                  rows={3}
                  placeholder="Undang-undang, Peraturan Pemerintah, Peraturan Daerah yang mendasari layanan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Persyaratan Dokumen</label>
                <textarea
                  value={persyaratan}
                  onChange={(e) => setPersyaratan(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan persyaratan dokumen, per baris.&#10;1. KTP Asli&#10;2. Kartu Keluarga"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Prosedur / Alur Pelayanan</label>
                <textarea
                  value={prosedur}
                  onChange={(e) => setProsedur(e.target.value)}
                  rows={4}
                  placeholder="Tuliskan alur atau prosedur pengurusan secara detail..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Produk Pelayanan</label>
                <textarea
                  value={produkLayanan}
                  onChange={(e) => setProdukLayanan(e.target.value)}
                  rows={3}
                  placeholder="Hasil akhir layanan (Contoh: Fisik KTP-el, Sertifikat NIB, dll)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Penanganan Pengaduan, Saran, dan Masukan</label>
                <textarea
                  value={pengaduan}
                  onChange={(e) => setPengaduan(e.target.value)}
                  rows={3}
                  placeholder="Kontak, loket, atau prosedur untuk mengajukan pengaduan, kritik, dan saran..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
