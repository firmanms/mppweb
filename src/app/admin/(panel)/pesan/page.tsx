"use client";

import { useState, useEffect } from "react";
import { getPesanList, markAsRead, deletePesan } from "@/app/actions/pesan";
import {
  MessageSquare,
  Trash2,
  Check,
  X,
  Mail,
  Phone,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

type Pesan = {
  id: number;
  nama: string;
  email: string | null;
  telepon: string | null;
  subjek: string | null;
  pesan: string;
  dibaca: boolean;
  createdAt: Date;
};

export default function AdminPesanPage() {
  const [list, setList] = useState<Pesan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Pesan | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPesanList();
      setList(data as any);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data pesan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDetail = async (item: Pesan) => {
    setSelectedItem(item);
    setIsModalOpen(true);

    if (!item.dibaca) {
      try {
        await markAsRead(item.id);
        // Update local state
        setList((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, dibaca: true } : p))
        );
      } catch (err) {
        console.error("Gagal menandai dibaca", err);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pesan ini?")) return;

    try {
      setError(null);
      await deletePesan(id);
      setSuccess("Pesan berhasil dihapus!");
      if (selectedItem?.id === id) {
        setIsModalOpen(false);
      }
      fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Gagal menghapus pesan");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: "var(--font-plus-jakarta)" }}>
          Kritik, Saran & Pesan Masuk
        </h1>
        <p className="text-slate-500 mt-1">Daftar aspirasi, masukan, dan keluhan dari masyarakat pengunjung MPP</p>
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

      {/* Table / List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-slate-500 text-sm">Memuat data pesan...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center shadow-sm">
          <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Kotak masuk kosong</p>
          <p className="text-slate-400 text-sm mt-1">Belum ada kritik atau saran yang dikirimkan oleh pengunjung</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Pengirim</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subjek</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pesan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Masuk</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${
                      !item.dibaca ? "bg-primary-50/10 font-medium" : ""
                    }`}
                    onClick={() => handleOpenDetail(item)}
                  >
                    <td className="p-4 text-sm text-slate-800 font-semibold">{item.nama}</td>
                    <td className="p-4 text-sm text-slate-700">{item.subjek || "-"}</td>
                    <td className="p-4 text-sm text-slate-500 line-clamp-1 max-w-[200px]">
                      {item.pesan}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.dibaca ? "bg-slate-100 text-slate-600" : "bg-primary-100 text-primary-700"
                      }`}>
                        {item.dibaca ? "Dibaca" : "Baru"}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-lg">Detail Kritik & Saran</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">{selectedItem.nama}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(selectedItem.createdAt)}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {selectedItem.email && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedItem.email}</span>
                    </div>
                  )}
                  {selectedItem.telepon && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedItem.telepon}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">
                  Subjek: {selectedItem.subjek || "(Tidak ada subjek)"}
                </p>
                <div className="p-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm leading-relaxed whitespace-pre-wrap min-h-[150px]">
                  {selectedItem.pesan}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <button
                  onClick={() => handleDelete(selectedItem.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Hapus Pesan
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-slate-900 hover:opacity-90 text-white transition-opacity"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
