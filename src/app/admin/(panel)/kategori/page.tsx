"use client";

import { useState, useEffect } from "react";
import {
  getKategoriList,
  createKategori,
  updateKategori,
  deleteKategori,
} from "@/app/actions/kategori";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  FolderTree,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

type Kategori = {
  id: number;
  nama: string;
  slug: string;
  tipe: string;
};

const tipeKategoriList = [
  { value: "instansi", label: "Instansi" },
  { value: "layanan", label: "Layanan" },
  { value: "berita", label: "Berita" },
  { value: "galeri", label: "Galeri / Album" },
];

export default function AdminKategoriPage() {
  const [list, setList] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTipe, setActiveTipe] = useState("instansi");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Kategori | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [tipe, setTipe] = useState("instansi");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getKategoriList(activeTipe);
      setList(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data kategori");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTipe]);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setNama("");
    setTipe(activeTipe);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Kategori) => {
    setSelectedItem(item);
    setNama(item.nama);
    setTipe(item.tipe);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = { nama, tipe };

      if (selectedItem) {
        await updateKategori(selectedItem.id, payload);
        setSuccess("Kategori berhasil diperbarui!");
      } else {
        await createKategori(payload);
        setSuccess("Kategori baru berhasil ditambahkan!");
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
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      setError(null);
      await deleteKategori(id);
      setSuccess("Kategori berhasil dihapus!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus kategori");
    }
  };

  const filteredList = list.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Master Kategori
          </h1>
          <p className="text-slate-500 mt-1">Kelola referensi kategori untuk seluruh modul aplikasi</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Kategori
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

      {/* Tabs for Types */}
      <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
        {tipeKategoriList.map((t) => (
          <button
            key={t.value}
            onClick={() => {
              setActiveTipe(t.value);
              setSearch("");
            }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
              activeTipe === t.value
                ? "bg-primary-600 text-white shadow-md"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Search & Stats */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-8 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Cari kategori ${tipeKategoriList.find((t) => t.value === activeTipe)?.label}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <p className="text-sm text-slate-500 shrink-0">
          Total: <span className="font-semibold text-slate-900">{filteredList.length}</span> Kategori
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Memuat data kategori...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center shadow-sm">
          <FolderTree className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Belum ada data kategori</p>
          <p className="text-slate-400 text-sm mt-1">Gunakan tombol tambah untuk membuat kategori</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between group hover:border-primary-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <FolderTree className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{item.nama}</h3>
                  <p className="text-xs text-slate-400 font-mono">{item.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">
                {selectedItem ? "Edit Kategori" : "Tambah Kategori"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Nama Kategori <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama kategori"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Tipe Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  value={tipe}
                  onChange={(e) => setTipe(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                >
                  {tipeKategoriList.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-2">
                  Tipe menentukan di mana kategori ini akan ditampilkan.
                </p>
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
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
