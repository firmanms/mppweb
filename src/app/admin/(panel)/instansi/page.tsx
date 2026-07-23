"use client";

import { useState, useEffect } from "react";
import {
  getInstansiList,
  createInstansi,
  updateInstansi,
  deleteInstansi,
} from "@/app/actions/instansi";
import { getKategoriList } from "@/app/actions/kategori";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Building,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import RichTextEditor from "@/components/ui/RichTextEditor";

type Instansi = {
  id: number;
  nama: string;
  slug: string;
  logo: string | null;
  deskripsi: string | null;
  kategoriId: number | null;
  kategori?: { id: number; nama: string } | null;
  lantai: string | null;
  lokasiLoket: string | null;
  jamPelayanan: string | null;
  kontak: string | null;
};

export default function AdminInstansiPage() {
  const [list, setList] = useState<Instansi[]>([]);
  const [kategoriList, setKategoriList] = useState<{ id: number; nama: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Instansi | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [logo, setLogo] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [kategoriId, setKategoriId] = useState<number>(0);
  const [lantai, setLantai] = useState("");
  const [lokasiLoket, setLokasiLoket] = useState("");
  const [jamPelayanan, setJamPelayanan] = useState("");
  const [kontak, setKontak] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [data, kategories] = await Promise.all([
        getInstansiList(),
        getKategoriList("instansi"),
      ]);
      setList(data);
      setKategoriList(kategories);
      if (kategories.length > 0) setKategoriId(kategories[0].id);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data instansi");
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
    setLogo("");
    setDeskripsi("");
    if (kategoriList.length > 0) setKategoriId(kategoriList[0].id);
    setLantai("");
    setLokasiLoket("");
    setJamPelayanan("");
    setKontak("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Instansi) => {
    setSelectedItem(item);
    setNama(item.nama);
    setLogo(item.logo || "");
    setDeskripsi(item.deskripsi || "");
    setKategoriId(item.kategoriId || (kategoriList.length > 0 ? kategoriList[0].id : 0));
    setLantai(item.lantai || "");
    setLokasiLoket(item.lokasiLoket || "");
    setJamPelayanan(item.jamPelayanan || "");
    setKontak(item.kontak || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        nama,
        logo: logo || undefined,
        deskripsi: deskripsi || undefined,
        kategoriId: kategoriId || undefined,
        lantai: lantai || undefined,
        lokasiLoket: lokasiLoket || undefined,
        jamPelayanan: jamPelayanan || undefined,
        kontak: kontak || undefined,
      };

      if (selectedItem) {
        await updateInstansi(selectedItem.id, payload);
        setSuccess("Instansi berhasil diperbarui!");
      } else {
        await createInstansi(payload);
        setSuccess("Instansi baru berhasil ditambahkan!");
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
    if (!confirm("Apakah Anda yakin ingin menghapus instansi ini? Semua layanan terkait akan ikut terhapus.")) return;

    try {
      setError(null);
      await deleteInstansi(id);
      setSuccess("Instansi berhasil dihapus!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus instansi");
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
            Manajemen Instansi
          </h1>
          <p className="text-slate-500 mt-1">Kelola seluruh instansi mitra MPP Kabupaten Bandung</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Instansi
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
            placeholder="Cari instansi berdasarkan nama..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <p className="text-sm text-slate-500 shrink-0">
          Total: <span className="font-semibold text-slate-900">{filteredList.length}</span> Instansi
        </p>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Memuat data instansi...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center shadow-sm">
          <Building className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Belum ada data instansi</p>
          <p className="text-slate-400 text-sm mt-1">Gunakan tombol tambah untuk menambahkan instansi baru</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Instansi</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lantai</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Loket</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Jam Layanan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 p-0.5 flex items-center justify-center shrink-0 text-primary-600 font-bold text-sm overflow-hidden">
                          {item.logo ? (
                            <img src={item.logo} alt={`Logo ${item.nama}`} className="w-full h-full object-contain" />
                          ) : (
                            item.nama.charAt(0)
                          )}
                        </div>
                        <span className="font-semibold text-slate-800 text-sm line-clamp-1">{item.nama}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {item.kategori?.nama || "-"}
                      </span>
                    </td>
                    <td className="p-4">
                      {item.lantai ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {item.lantai}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-slate-600">{item.lokasiLoket || "-"}</td>
                    <td className="p-4 text-sm text-slate-600">{item.jamPelayanan || "-"}</td>
                    <td className="p-4 text-sm text-slate-600">{item.kontak || "-"}</td>
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
                {selectedItem ? "Edit Instansi" : "Tambah Instansi"}
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
                  Nama Instansi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Disdukcapil Kabupaten Bandung"
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
                    {kategoriList.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Kontak</label>
                  <input
                    type="text"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="Contoh: (022) 589-XXXX"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Lantai Dropdown (Dropbox)
                  </label>
                  <select
                    value={lantai}
                    onChange={(e) => setLantai(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    <option value="">-- Pilih Lantai --</option>
                    <option value="Lantai 1">Lantai 1</option>
                    <option value="Lantai 2">Lantai 2</option>
                    <option value="Lantai 3">Lantai 3</option>
                    <option value="Lantai 4">Lantai 4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Detail Lokasi / Loket</label>
                  <input
                    type="text"
                    value={lokasiLoket}
                    onChange={(e) => setLokasiLoket(e.target.value)}
                    placeholder="Contoh: Loket A, Sayap Kanan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Jam Pelayanan</label>
                <input
                  type="text"
                  value={jamPelayanan}
                  onChange={(e) => setJamPelayanan(e.target.value)}
                  placeholder="Contoh: Senin-Jumat: 08.00-15.00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <ImageUploader 
                label="Logo Instansi (Opsional)" 
                value={logo} 
                onChange={setLogo} 
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi</label>
                <div className="mt-1">
                  <RichTextEditor value={deskripsi} onChange={setDeskripsi} />
                </div>
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
