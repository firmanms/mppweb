"use client";

import { useState, useEffect } from "react";
import {
  getFasilitasList,
  createFasilitas,
  updateFasilitas,
  deleteFasilitas,
} from "@/app/actions/fasilitas";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Star,
  X,
  Loader2,
  AlertCircle,
  CheckCircle,
  MapPin,
  Armchair,
  TicketCheck,
  ListOrdered,
  Info,
  Baby,
  Accessibility,
  Blocks,
  Moon,
  Bath,
  Car,
  Wifi,
  BatteryCharging,
  UtensilsCrossed
} from "lucide-react";
import ImageUploader from "@/components/ui/ImageUploader";
import RichTextEditor from "@/components/ui/RichTextEditor";

type Fasilitas = {
  id: number;
  nama: string;
  slug: string;
  foto: string | null;
  deskripsi: string | null;
  lokasi: string | null;
  ikon: string | null;
};

const availableIcons = [
  "Armchair",
  "TicketCheck",
  "ListOrdered",
  "Info",
  "Baby",
  "Accessibility",
  "Blocks",
  "Moon",
  "Bath",
  "Car",
  "Wifi",
  "BatteryCharging",
  "UtensilsCrossed",
];

export default function AdminFasilitasPage() {
  const [list, setList] = useState<Fasilitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Fasilitas | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [nama, setNama] = useState("");
  const [foto, setFoto] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [ikon, setIkon] = useState("Star");

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getFasilitasList();
      setList(data);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data fasilitas");
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
    setFoto("");
    setDeskripsi("");
    setLokasi("");
    setIkon("Star");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Fasilitas) => {
    setSelectedItem(item);
    setNama(item.nama);
    setFoto(item.foto || "");
    setDeskripsi(item.deskripsi || "");
    setLokasi(item.lokasi || "");
    setIkon(item.ikon || "Star");
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
        foto: foto || undefined,
        deskripsi: deskripsi || undefined,
        lokasi: lokasi || undefined,
        ikon,
      };

      if (selectedItem) {
        await updateFasilitas(selectedItem.id, payload);
        setSuccess("Fasilitas berhasil diperbarui!");
      } else {
        await createFasilitas(payload);
        setSuccess("Fasilitas baru berhasil ditambahkan!");
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
    if (!confirm("Apakah Anda yakin ingin menghapus fasilitas ini?")) return;

    try {
      setError(null);
      await deleteFasilitas(id);
      setSuccess("Fasilitas berhasil dihapus!");
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus fasilitas");
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
            Manajemen Fasilitas
          </h1>
          <p className="text-slate-500 mt-1">Kelola seluruh fasilitas kenyamanan pengunjung MPP</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-md hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Tambah Fasilitas
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
            placeholder="Cari fasilitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
        </div>
        <p className="text-sm text-slate-500 shrink-0">
          Total: <span className="font-semibold text-slate-900">{filteredList.length}</span> Fasilitas
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Memuat data fasilitas...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center shadow-sm">
          <Star className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Belum ada data fasilitas</p>
          <p className="text-slate-400 text-sm mt-1">Gunakan tombol tambah untuk menambahkan fasilitas baru</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                {item.foto && (
                  <div className="w-full aspect-[16/9] mb-4 rounded-xl overflow-hidden bg-slate-100">
                    <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-semibold shrink-0">
                    {(() => {
                      const icons: any = { Star, Armchair, TicketCheck, ListOrdered, Info, Baby, Accessibility, Blocks, Moon, Bath, Car, Wifi, BatteryCharging, UtensilsCrossed };
                      const Icon = icons[item.ikon || "Star"] || Star;
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div className="flex items-center gap-1">
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
                <h3 className="font-bold text-slate-900 text-base mb-1">{item.nama}</h3>
                {item.lokasi && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3" />
                    {item.lokasi}
                  </p>
                )}
                {item.deskripsi && (
                  <div 
                    className="prose-content text-sm text-slate-500 line-clamp-3" 
                    dangerouslySetInnerHTML={{ __html: item.deskripsi }} 
                  />
                )}
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
                {selectedItem ? "Edit Fasilitas" : "Tambah Fasilitas"}
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
                  Nama Fasilitas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Pojok Laktasi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ikon Representasi</label>
                  <select
                    value={ikon}
                    onChange={(e) => setIkon(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm bg-white"
                  >
                    {availableIcons.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Lokasi Gedung</label>
                  <input
                    type="text"
                    value={lokasi}
                    onChange={(e) => setLokasi(e.target.value)}
                    placeholder="Contoh: Lantai 1, Sayap Kanan"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  />
                </div>
              </div>

              <ImageUploader
                label="Foto Aset (Opsional)"
                value={foto}
                onChange={setFoto}
              />

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Deskripsi Fasilitas</label>
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
