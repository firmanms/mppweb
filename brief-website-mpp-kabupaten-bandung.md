# BRIEF WEBSITE
## Mal Pelayanan Publik Kabupaten Bandung

**Stack Teknologi: Full Next.js + MySQL**

---

## 1. Gambaran Umum

Website Mal Pelayanan Publik Kabupaten Bandung merupakan portal informasi terpadu yang memberikan kemudahan kepada masyarakat untuk memperoleh informasi mengenai instansi, jenis layanan, fasilitas, berita, dan kegiatan yang tersedia di Mal Pelayanan Publik Kabupaten Bandung.

Website dirancang dengan tampilan modern, responsif, informatif, ramah pengguna, serta dapat diakses dengan baik melalui perangkat komputer maupun telepon seluler. Website dibangun menggunakan **Next.js sebagai satu kesatuan aplikasi (full-stack)** — menangani halaman publik sekaligus panel admin — dengan **MySQL** sebagai basis data melalui **Prisma ORM**.

## 2. Tujuan Website

- Memperkenalkan Mal Pelayanan Publik Kabupaten Bandung.
- Menyediakan informasi instansi dan layanan secara terpusat.
- Memudahkan masyarakat mencari persyaratan dan prosedur layanan.
- Menampilkan fasilitas yang tersedia di lokasi MPP.
- Menyampaikan berita dan informasi terbaru.
- Memberikan pengalaman kunjungan melalui fitur Virtual Tour.
- Menghubungkan masyarakat dengan layanan SAKTI.

## 3. Target Pengguna

- Masyarakat Kabupaten Bandung.
- Pemohon layanan publik.
- Pelaku usaha.
- Instansi pemerintah.
- Pengunjung Mal Pelayanan Publik.
- Masyarakat yang membutuhkan informasi layanan secara daring.

---

## 4. Stack Teknologi

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14/15 (App Router) |
| Bahasa | TypeScript |
| ORM | Prisma |
| Database | MySQL 8 |
| Auth (admin) | NextAuth.js (Auth.js) / Lucia Auth |
| Styling | Tailwind CSS |
| Komponen UI | shadcn/ui |
| Validasi form | Zod + React Hook Form |
| Rich text editor | Tiptap / Lexical (untuk konten Berita & deskripsi Layanan) |
| Upload & optimasi media | Sharp + storage lokal, atau S3-compatible (MinIO) |
| Virtual Tour 360° | Pannellum.js |
| Peta lokasi | Leaflet.js atau Google Maps Embed API |
| Icon | Lucide React |
| Animasi (opsional) | Framer Motion |

### Arsitektur

```
Next.js (App Router) — 1 Aplikasi, 1 Database
   ├── (public)/        → Halaman publik, render SSG/ISR untuk performa & SEO
   ├── admin/           → Panel admin untuk staf pengelola MPP
   ├── Server Actions   → Operasi CRUD (tambah/edit/hapus data)
   ├── Prisma ORM
   └── MySQL Database
```

Tidak ada sistem terpisah antara backend dan frontend — satu aplikasi, satu proses deployment, satu database, sehingga maintenance lebih sederhana dan biaya infrastruktur lebih efisien.

---

## 5. STRUKTUR MENU WEBSITE

### 5.1 Beranda

Halaman utama yang menampilkan informasi singkat dan akses cepat menuju layanan MPP.

**Konten utama:**
- Hero banner dengan foto Gedung Mal Pelayanan Publik Kabupaten Bandung.
- Sambutan singkat atau slogan pelayanan.
- Tombol *Lihat Layanan* dan *Virtual Tour*.
- Statistik jumlah instansi dan layanan.
- Daftar layanan populer.
- Daftar instansi yang tergabung.
- Informasi atau pengumuman terbaru.
- Fasilitas unggulan.
- Galeri kegiatan.
- Lokasi dan jam operasional.

**Contoh headline:**
> Pelayanan Publik Semakin Mudah, Cepat, dan Terintegrasi

**Contoh subheadline:**
> Mal Pelayanan Publik Kabupaten Bandung menghadirkan berbagai layanan pemerintahan dan pelayanan publik dalam satu lokasi yang nyaman dan mudah diakses.

**Route:** `app/(public)/page.tsx` — rendering ISR (revalidate berkala agar data instansi/berita terbaru tetap tampil cepat).

---

### 5.2 Profil

Halaman yang menjelaskan informasi umum mengenai Mal Pelayanan Publik Kabupaten Bandung.

**Konten:**
- Profil MPP Kabupaten Bandung.
- Latar belakang pembentukan.
- Visi dan misi.
- Tujuan penyelenggaraan.
- Dasar hukum.
- Struktur pengelola.
- Sambutan pimpinan.
- Alamat, kontak, dan jam pelayanan.

**Route:** `app/(public)/profil/page.tsx` — konten disimpan di model `HalamanStatis` agar bisa diedit tanpa deploy ulang.

---

### 5.3 Instansi

Menampilkan seluruh instansi yang membuka layanan di Mal Pelayanan Publik Kabupaten Bandung.

**Informasi setiap instansi:**
- Logo instansi.
- Nama instansi.
- Deskripsi singkat.
- Daftar layanan.
- Lokasi loket.
- Hari dan jam pelayanan.
- Kontak atau kanal informasi.
- Tombol lihat detail.

**Fitur pendukung:**
- Pencarian instansi.
- Filter berdasarkan kategori.
- Pengelompokan instansi pemerintah, BUMN, BUMD, dan lembaga lainnya.

**Route:** `app/(public)/instansi/page.tsx` (daftar + filter/search) dan `app/(public)/instansi/[slug]/page.tsx` (detail).

---

### 5.4 Layanan

Halaman untuk mencari seluruh layanan yang tersedia.

**Informasi setiap layanan:**
- Nama layanan.
- Instansi penyelenggara.
- Deskripsi layanan.
- Persyaratan.
- Prosedur pelayanan.
- Waktu penyelesaian.
- Biaya atau tarif.
- Produk layanan.
- Lokasi loket.
- Jadwal pelayanan.
- Tombol akses layanan daring apabila tersedia.

**Fitur:**
- Pencarian berdasarkan nama layanan.
- Filter berdasarkan instansi.
- Filter berdasarkan kategori layanan.
- Daftar layanan populer.
- Informasi layanan gratis atau berbayar.

**Route:** `app/(public)/layanan/page.tsx` dan `app/(public)/layanan/[slug]/page.tsx`.

---

### 5.5 Fasilitas

Menampilkan fasilitas yang tersedia untuk mendukung kenyamanan pengunjung.

**Contoh fasilitas:**
- Ruang tunggu.
- Loket pelayanan.
- Mesin antrean.
- Pojok informasi.
- Ruang laktasi.
- Fasilitas ramah disabilitas.
- Area bermain anak.
- Musala.
- Toilet.
- Area parkir.
- Wi-Fi publik.
- Charging station.
- Ruang konsultasi.
- Kantin atau area kuliner.

Setiap fasilitas dilengkapi foto, deskripsi, dan lokasi.

**Route:** `app/(public)/fasilitas/page.tsx`.

---

### 5.6 Berita

Menampilkan informasi dan perkembangan terbaru mengenai MPP Kabupaten Bandung.

**Kategori berita:**
- Berita pelayanan.
- Pengumuman.
- Agenda kegiatan.
- Inovasi pelayanan.
- Informasi perubahan jadwal.
- Informasi hari libur.
- Kegiatan instansi.

**Fitur:**
- Daftar berita terbaru.
- Berita unggulan.
- Pencarian berita.
- Filter kategori.
- Detail berita.
- Tombol berbagi ke media sosial.

**Route:** `app/(public)/berita/page.tsx` dan `app/(public)/berita/[slug]/page.tsx`.

---

### 5.7 Galeri

Menampilkan dokumentasi foto dan video kegiatan.

**Kategori galeri:**
- Kegiatan pelayanan.
- Kunjungan kerja.
- Sosialisasi.
- Peresmian.
- Fasilitas MPP.
- Kegiatan instansi.
- Video profil.

Galeri ditampilkan dalam bentuk grid modern, dapat dibuka dalam tampilan layar penuh (lightbox).

**Route:** `app/(public)/galeri/page.tsx`.

---

### 5.8 Tour

Halaman Virtual Tour yang memungkinkan masyarakat melihat kondisi dan fasilitas MPP secara daring. 
akan dialihkan ke url berikut: https://mpp.bandungkab.go.id/tour

### 5.9 SAKTI

Halaman khusus yang menghubungkan masyarakat dengan layanan SAKTI.

**Konten:**
- Penjelasan singkat mengenai SAKTI.
- Manfaat layanan.
- Jenis layanan yang tersedia.
- Panduan penggunaan.
- Persyaratan layanan.
- Pertanyaan yang sering diajukan.
- Tombol Akses SAKTI.
- Kontak bantuan apabila masyarakat mengalami kendala.

**Route:** `app/(public)/sakti/page.tsx`.

---

## 6. Panel Admin (`/admin`)

Karena tidak menggunakan CMS siap pakai (Strapi/Filament), panel admin dibangun manual di dalam Next.js, khusus digunakan oleh staf pengelola MPP untuk mengelola konten.

**Fitur admin:**
- Login (NextAuth.js) dengan role: Super Admin, Editor.
- CRUD Instansi, Layanan, Fasilitas, Berita, Galeri.
- Manajemen upload media (foto/video).
- Manajemen halaman statis (Profil, SAKTI).
- Manajemen pesan formulir kritik & saran.
- Log aktivitas pengguna admin (audit trail sederhana).

**Route:**
```
app/admin/
  (auth)/login/page.tsx
  dashboard/page.tsx
  instansi/page.tsx
  layanan/page.tsx
  fasilitas/page.tsx
  berita/page.tsx
  galeri/page.tsx
  pesan/page.tsx
  pengaturan/page.tsx
```

CRUD dijalankan melalui **Server Actions** (`"use server"`) yang memanggil Prisma langsung, tanpa perlu membuat REST API terpisah — kecuali di kemudian hari dibutuhkan integrasi dengan aplikasi mobile, yang dapat ditangani lewat Route Handlers (`app/api/.../route.ts`).

---

## 7. Skema Database (Prisma + MySQL — gambaran)

```prisma
model Instansi {
  id            Int       @id @default(autoincrement())
  nama          String
  slug          String    @unique
  logo          String?
  deskripsi     String?   @db.Text
  kategori      String    // Pemerintah, BUMN, BUMD, Lainnya
  lokasiLoket   String?
  jamPelayanan  String?
  kontak        String?
  layanan       Layanan[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Layanan {
  id                Int       @id @default(autoincrement())
  nama              String
  slug              String    @unique
  instansiId        Int
  instansi          Instansi  @relation(fields: [instansiId], references: [id])
  deskripsi         String?   @db.Text
  persyaratan       String?   @db.Text
  prosedur          String?   @db.Text
  waktuPenyelesaian String?
  biaya             String?
  kategori          String?
  status            String    // gratis / berbayar
  linkDaring        String?
  populer           Boolean   @default(false)
  createdAt         DateTime  @default(now())
}

model Fasilitas {
  id          Int     @id @default(autoincrement())
  nama        String
  foto        String?
  deskripsi   String? @db.Text
  lokasi      String?
}

model Berita {
  id           Int      @id @default(autoincrement())
  judul        String
  slug         String   @unique
  kategori     String
  konten       String   @db.Text
  fotoUtama    String?
  featured     Boolean  @default(false)
  publishedAt  DateTime @default(now())
}

model Galeri {
  id        Int      @id @default(autoincrement())
  judul     String
  kategori  String
  mediaUrl  String
  tipeMedia String   // foto / video
  createdAt DateTime @default(now())
}

model HalamanStatis {
  id       Int    @id @default(autoincrement())
  slug     String @unique // profil, sakti
  judul    String
  konten   String @db.Text
}

model PesanSaran {
  id        Int      @id @default(autoincrement())
  nama      String
  email     String?
  pesan     String   @db.Text
  createdAt DateTime @default(now())
}

model AdminUser {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  role     String @default("editor") // superadmin, editor
}
```

---

## 8. KOMPONEN TAMBAHAN

### Header
- Logo Kabupaten Bandung.
- Logo Mal Pelayanan Publik.
- Menu navigasi.
- Tombol pencarian.
- Tombol akses layanan.
- Menu responsif untuk perangkat seluler.

### Footer
- Logo dan nama MPP Kabupaten Bandung.
- Alamat lengkap.
- Nomor telepon.
- Email.
- Jam operasional.
- Tautan media sosial.
- Tautan cepat.
- Peta lokasi.
- Kebijakan privasi.
- Hak cipta website.

---

## 9. ARAHAN DESAIN

**Konsep desain:**
- Modern dan profesional.
- Bersih serta mudah digunakan.
- Menggunakan identitas visual Kabupaten Bandung.
- Mengutamakan aksesibilitas.
- Menampilkan foto pelayanan masyarakat.
- Menggunakan ikon sederhana dan informatif.
- Navigasi tidak terlalu padat.

**Rekomendasi warna:**
- Biru sebagai warna utama untuk memberikan kesan terpercaya.
- Hijau atau kuning sebagai warna aksen.
- Putih dan abu-abu terang sebagai warna latar.
- Warna kontras untuk tombol utama.

Diimplementasikan melalui konfigurasi tema Tailwind CSS (`tailwind.config.ts`) agar konsisten di seluruh halaman.

---

## 10. FITUR UTAMA

- Pencarian instansi dan layanan.
- Filter kategori layanan.
- Informasi jadwal pelayanan.
- Integrasi Google Maps / Leaflet.
- Virtual Tour 360 derajat.
- Formulir kritik dan saran.
- Informasi antrean apabila tersedia.
- Integrasi layanan SAKTI.
- Manajemen berita dan galeri lewat panel admin.
- Tampilan responsif (mobile-first).
- Dukungan aksesibilitas (kontras warna, alt text, navigasi keyboard).
- Tombol WhatsApp atau pusat bantuan.

---

## 11. CALL TO ACTION

Tombol utama yang digunakan:

- Lihat Semua Layanan
- Cari Instansi
- Kunjungi Virtual Tour
- Akses SAKTI
- Lihat Persyaratan
- Petunjuk Lokasi
- Hubungi Kami

---

## 12. SLOGAN

> Pelayanan Terpadu, Mudah, Cepat, dan Nyaman

**Alternatif:**
> Satu Tempat, Beragam Layanan untuk Masyarakat Kabupaten Bandung

---

## 13. Hosting & Infrastruktur

| Komponen | Rekomendasi |
|---|---|
| Aplikasi Next.js | VPS/self-host (Diskominfo/PDN) dengan PM2 + Nginx, atau Vercel untuk tahap awal |
| Database MySQL | Server terpisah atau managed MySQL, dengan backup rutin terjadwal |
| Media/upload | Storage lokal di VPS atau S3-compatible (MinIO) |
| Domain & SSL | Domain resmi `.go.id`, HTTPS wajib |
| CDN & keamanan dasar | Cloudflare (proteksi DDoS dasar, caching aset statis) |

---

## 14. Timeline Kasar (Estimasi)

1. **Minggu 1–2:** Setup project Next.js, Prisma schema, database MySQL, autentikasi admin.
2. **Minggu 2–4:** Bangun panel admin (CRUD Instansi, Layanan, Fasilitas, Berita, Galeri).
3. **Minggu 4–7:** Bangun halaman publik satu per satu (Beranda → Instansi → Layanan → dst) dengan Tailwind CSS.
4. **Minggu 7–8:** Integrasi Virtual Tour, Peta Lokasi, SAKTI, formulir kritik & saran.
5. **Minggu 8–9:** Testing (fungsional, performa, aksesibilitas), optimasi SEO, deployment.
6. **Minggu 9:** Training staf pengelola untuk penggunaan panel admin.
