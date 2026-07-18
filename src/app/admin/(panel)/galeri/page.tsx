"use client";

import { useState, useEffect } from "react";
import {
  getGaleriList,
  createGaleri,
  updateGaleri,
  deleteGaleri,
} from "@/app/actions/galeri";
import { getKategoriList } from "@/app/actions/kategori";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Image as ImageIcon,
  Film,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";

type Galeri = {
  id: number;
  judul: string;
  kategoriId: number | null;
  kategori?: { id: number; nama: string } | null;
  mediaUrl: string;
  tipeMedia: string;
  deskripsi: string | null;
};


export default function AdminGaleriPage() {
  const [list, setList] = useState<Galeri[]>([]);
  const [kategoriList, setKategoriList] = useState<{id: number; nama: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Galeri | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [judul, setJudul] = useState("");
  const [kategoriId, setKategoriId] = useState<number>(0);
  const [mediaUrl, setMediaUrl] = useState("");
  const [tipeMedia, setTipeMedia] = useState("foto");
  const [deskripsi, setDeskripsi] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [data, kategories] = await Promise.all([
        getGaleriList(),
        getKategoriList("galeri")
      ]);
      setList(data as any);
      setKategoriList(kategories);
      if (kategories.length > 0) setKategoriId(kategories[0].id);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data galeri");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setJudul("");
    if (kategoriList.length > 0) setKategoriId(kategoriList[0].id);
    setMediaUrl("");
    setTipeMedia("foto");
    setDeskripsi("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Galeri) => {
    setSelectedItem(item);
    setJudul(item.judul);
    setKategoriId(item.kategoriId || (kategoriList.length > 0 ? kategoriList[0].id : 0));
    setMediaUrl(item.mediaUrl);
    setTipeMedia(item.tipeMedia);
    setDeskripsi(item.deskripsi || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul.trim() || !mediaUrl.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        judul,
        kategoriId: kategoriId || undefined,
        mediaUrl,
        tipeMedia,
        deskripsi: deskripsi || undefined,
      };

      if (selectedItem) {
        await updateGaleri(selectedItem.id, payload);
        setSuccess("Galeri berhasil diperbarui!");
      } else {
        await createGaleri(payload);
        setSuccess("Dokumentasi galeri berhasil ditambahkan!");
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
    if (!confirm("Apakah Anda yakin ingin menghapus dokumentasi galeri ini?")) return;

    try {
      setError(null);
      await deleteGaleri(id);
      setSuccess("Galeri berhasil dihapus!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus galeri");
    }
  };

  const filteredList = list.filter((item) =>
    item.judul.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
            Manajemen Galeri
          </h1>
          <p className="text-slate-500 mt-1">Kelola dokumentasi foto dan video kegiatan MPP</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Media
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
            placeholder="Cari media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <p className="text-sm text-slate-500 shrink-0">
          Total: <span className="font-semibold text-slate-900">{filteredList.length}</span> Media
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Memuat data galeri...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center shadow-sm">
          <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Belum ada dokumentasi media</p>
          <p className="text-slate-400 text-sm mt-1">Gunakan tombol tambah media untuk mengunggah dokumentasi</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center relative mb-4 overflow-hidden">
                  {item.tipeMedia === "video" ? (
                    <Film className="w-10 h-10 text-slate-400" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-slate-400" />
                  )}
                  <span className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/80 text-slate-800">
                    {item.tipeMedia === "video" ? "Video" : "Foto"}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">{item.judul}</h3>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 mb-3">
                  {item.kategori?.nama || "-"}
                </span>
                {item.deskripsi && (
                  <p className="text-xs text-slate-400 line-clamp-2">{item.deskripsi}</p>
                )}
              </div>

              <div className="flex justify-end gap-1 mt-4 pt-3 border-t border-slate-50">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">
                {selectedItem ? "Edit Media" : "Tambah Media"}
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
                  Judul Media <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Kunjungan Kerja Deputi Pelayanan Publik"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={kategoriId}
                    onChange={(e) => setKategoriId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    {kategoriList.length === 0 && <option value="0">Belum ada kategori</option>}
                    {kategoriList.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nama}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tipe Media</label>
                  <select
                    value={tipeMedia}
                    onChange={(e) => setTipeMedia(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    <option value="foto">Foto</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              {tipeMedia === "foto" ? (
                <ImageUploader 
                  label="Foto Galeri" 
                  value={mediaUrl} 
                  onChange={setMediaUrl} 
                  required 
                />
              ) : (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Video URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Contoh: https://youtube.com/watch?v=..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Singkat</label>
                <textarea
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  rows={3}
                  placeholder="Penjelasan ringkas mengenai isi dokumentasi..."
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
