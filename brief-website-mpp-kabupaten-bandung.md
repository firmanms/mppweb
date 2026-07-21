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
- Menghubungkan masyarakat dengan layanan MPP Digital (SAKTI & layanan daring lainnya).

## 3. Target Pengguna

- Masyarakat Kabupaten Bandung.
- Pemohon layanan publik.
- Pelaku usaha.
- Instansi pemerintah.
- Pengunjung Mal Pelayanan Publik.
- Masyarakat yang membutuhkan informasi layanan secara daring.

---

## 4. Stack Teknologi

| Layer | Teknologi | Versi/Keterangan |
|---|---|---|
| Framework | Next.js (App Router) | v16.2.10 |
| Bahasa | TypeScript | v5 |
| Runtime | React | v19.2.4 |
| ORM | Prisma (dengan adapter MariaDB) | v7.8.0 |
| Database | MySQL 8 | via `@prisma/adapter-mariadb` |
| Auth (admin) | NextAuth.js (Auth.js) | v5.0.0-beta.31 + `@auth/prisma-adapter` |
| Styling | Tailwind CSS | v4 (PostCSS plugin `@tailwindcss/postcss`) |
| Validasi form | Zod v4 + React Hook Form v7 | `@hookform/resolvers` |
| Rich text editor | react-quill-new | v3.8.3 |
| Upload & optimasi media | Sharp + storage lokal / S3-compatible | `@aws-sdk/client-s3` + Sharp v0.35 |
| Slug generator | slugify | v1.6.9 |
| Utilitas CSS | clsx + tailwind-merge | — |
| Date formatting | date-fns | v4.4.0 |
| Hashing password | bcryptjs | v3.0.3 |
| Icon | Lucide React | v1.25.0 |
| Animasi | Framer Motion | v12.42.2 |

### Arsitektur

```
Next.js 16 (App Router) — 1 Aplikasi, 1 Database
   ├── src/app/(public)/       → Halaman publik (Beranda, Profil, Instansi, dll.)
   ├── src/app/admin/          → Panel admin (login + panel CRUD)
   │   ├── login/              → Halaman login admin
   │   └── (panel)/            → Layout admin dengan sidebar
   │       ├── dashboard/
   │       ├── instansi/
   │       ├── layanan/
   │       ├── fasilitas/
   │       ├── berita/
   │       ├── galeri/
   │       ├── kategori/       → Manajemen kategori terpusat
   │       ├── pesan/
   │       └── pengaturan/     → Pengaturan situs (logo, kontak, S3, dll.)
   ├── src/app/actions/        → Server Actions (CRUD langsung via Prisma)
   ├── src/app/api/upload/     → Route Handler untuk upload media
   ├── src/components/         → Komponen reusable
   │   ├── layout/             → Header, Footer
   │   ├── ui/                 → ImageUploader, RichTextEditor, MathCaptcha, WhatsAppButton
   │   ├── berita/             → BeritaList (client component)
   │   ├── instansi/           → InstansiList (client component)
   │   └── layanan/            → LayananList (client component)
   ├── src/lib/                → Prisma client, utilitas
   ├── prisma/
   │   ├── schema.prisma       → Definisi model database
   │   └── seed.ts             → Data seed awal
   └── public/uploads/         → Direktori upload media lokal
```

Tidak ada sistem terpisah antara backend dan frontend — satu aplikasi, satu proses deployment, satu database, sehingga maintenance lebih sederhana dan biaya infrastruktur lebih efisien.

---

## 5. STRUKTUR MENU WEBSITE

### 5.1 Beranda ✅ Selesai

Halaman utama yang menampilkan informasi singkat dan akses cepat menuju layanan MPP.

**Konten utama:**
- Hero banner dengan foto Gedung Mal Pelayanan Publik Kabupaten Bandung (foto dari pengaturan admin).
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

**Route:** `src/app/(public)/page.tsx` — data diambil dari database (instansi, layanan populer, berita terbaru, fasilitas, pengaturan situs).

---

### 5.2 Profil ✅ Selesai

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

**Route:** `src/app/(public)/profil/page.tsx` — konten disimpan di model `HalamanStatis` agar bisa diedit tanpa deploy ulang.

---

### 5.3 Instansi ✅ Selesai

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
- Filter berdasarkan kategori (via model `Kategori` terpusat, tipe `instansi`).
- Pengelompokan instansi pemerintah, BUMN, BUMD, dan lembaga lainnya.

**Route:** `src/app/(public)/instansi/page.tsx` (daftar + filter/search) dan `src/app/(public)/instansi/[slug]/page.tsx` (detail).

**Client Component:** `src/components/instansi/InstansiList.tsx` — menangani search & filter di sisi klien.

---

### 5.4 Layanan ✅ Selesai

Halaman untuk mencari seluruh layanan yang tersedia.

**Informasi setiap layanan:**
- Nama layanan.
- Instansi penyelenggara.
- Deskripsi layanan.
- Dasar hukum.
- Persyaratan.
- Prosedur pelayanan.
- Waktu penyelesaian.
- Biaya atau tarif.
- Produk layanan.
- Pengaduan.
- Jam operasional.
- Tombol akses layanan daring apabila tersedia.

**Fitur:**
- Pencarian berdasarkan nama layanan.
- Filter berdasarkan instansi.
- Filter berdasarkan kategori layanan (via model `Kategori` terpusat, tipe `layanan`).
- Daftar layanan populer.
- Informasi layanan gratis atau berbayar.

**Route:** `src/app/(public)/layanan/page.tsx` dan `src/app/(public)/layanan/[slug]/page.tsx`.

**Client Component:** `src/components/layanan/LayananList.tsx` — menangani search & filter di sisi klien.

---

### 5.5 Fasilitas ✅ Selesai

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

Setiap fasilitas dilengkapi foto, deskripsi, lokasi, dan ikon.

**Route:** `src/app/(public)/fasilitas/page.tsx`.

---

### 5.6 Berita ✅ Selesai

Menampilkan informasi dan perkembangan terbaru mengenai MPP Kabupaten Bandung.

**Kategori berita (via model `Kategori` terpusat, tipe `berita`):**
- Berita pelayanan.
- Pengumuman.
- Agenda kegiatan.
- Inovasi pelayanan.
- Informasi perubahan jadwal.
- Informasi hari libur.
- Kegiatan instansi.

**Fitur:**
- Daftar berita terbaru.
- Berita unggulan (featured).
- Pencarian berita.
- Filter kategori.
- Detail berita dengan ringkasan.
- Tombol berbagi ke media sosial.

**Route:** `src/app/(public)/berita/page.tsx` dan `src/app/(public)/berita/[slug]/page.tsx`.

**Client Component:** `src/components/berita/BeritaList.tsx` — menangani search & filter di sisi klien.

---

### 5.7 Galeri ✅ Selesai

Menampilkan dokumentasi foto dan video kegiatan.

**Kategori galeri (via model `Kategori` terpusat, tipe `galeri`):**
- Kegiatan pelayanan.
- Kunjungan kerja.
- Sosialisasi.
- Peresmian.
- Fasilitas MPP.
- Kegiatan instansi.
- Video profil.

Galeri ditampilkan dalam bentuk grid modern, dapat dibuka dalam tampilan layar penuh (lightbox).

**Route:** `src/app/(public)/galeri/page.tsx`.

---

### 5.8 Tour ✅ Selesai

Halaman Virtual Tour yang mengalihkan masyarakat ke URL: https://mpp.bandungkab.go.id/tour

**Route:** `src/app/(public)/tour/page.tsx` — redirect ke URL eksternal.

---

### 5.9 MPP Digital ✅ Selesai (menggantikan "SAKTI" pada brief awal)

Halaman yang menghubungkan masyarakat dengan layanan MPP Digital, termasuk SAKTI dan layanan daring instansi lainnya.

**Konten:**
- Penjelasan mengenai MPP Digital.
- Daftar layanan daring dari seluruh instansi yang memiliki `linkDaring`.
- Akses cepat ke layanan SAKTI.
- Panduan penggunaan.
- Kontak bantuan.

**Route:** `src/app/(public)/mpp-digital/page.tsx`.

**Catatan:** Menu "SAKTI" pada brief awal telah diubah menjadi "MPP Digital" yang lebih luas cakupannya, mencakup seluruh layanan daring.

---

## 6. Panel Admin (`/admin`) ✅ Selesai

Panel admin dibangun manual di dalam Next.js, khusus digunakan oleh staf pengelola MPP untuk mengelola konten.

**Fitur admin:**
- Login (NextAuth.js v5 beta) dengan role: Super Admin, Editor.
- CRUD Instansi — `src/app/admin/(panel)/instansi/page.tsx`
- CRUD Layanan (termasuk dasar hukum, produk layanan, pengaduan, jam operasional) — `src/app/admin/(panel)/layanan/page.tsx`
- CRUD Fasilitas (termasuk ikon) — `src/app/admin/(panel)/fasilitas/page.tsx`
- CRUD Berita (termasuk ringkasan, featured) — `src/app/admin/(panel)/berita/page.tsx`
- CRUD Galeri — `src/app/admin/(panel)/galeri/page.tsx`
- Manajemen Kategori terpusat (instansi, layanan, berita, galeri) — `src/app/admin/(panel)/kategori/page.tsx`
- Manajemen pesan/saran masyarakat (status dibaca) — `src/app/admin/(panel)/pesan/page.tsx`
- Dashboard statistik — `src/app/admin/(panel)/dashboard/page.tsx`
- Pengaturan situs (logo, header, kontak, WA, maps, sosial media, foto dinamis, konfigurasi S3 storage) — `src/app/admin/(panel)/pengaturan/page.tsx`

**Server Actions (CRUD via Prisma):**
```
src/app/actions/
  ├── auth.ts           → Login/logout admin
  ├── instansi.ts       → CRUD instansi
  ├── layanan.ts        → CRUD layanan
  ├── fasilitas.ts      → CRUD fasilitas
  ├── berita.ts         → CRUD berita
  ├── galeri.ts         → CRUD galeri
  ├── kategori.ts       → CRUD kategori terpusat
  ├── pesan.ts          → Kirim & kelola pesan saran
  ├── halaman-statis.ts → Update halaman statis (profil, dll.)
  └── pengaturan.ts     → Update pengaturan situs
```

**API Route Handler:**
- `src/app/api/upload/route.ts` — Upload file media (lokal & S3-compatible).

---

## 7. Skema Database (Prisma + MySQL — Implementasi Aktual)

```prisma
model Instansi {
  id           Int       @id @default(autoincrement())
  nama         String
  slug         String    @unique
  logo         String?
  deskripsi    String?   @db.Text
  kategoriId   Int?
  kategori     Kategori? @relation(fields: [kategoriId], references: [id], onDelete: SetNull)
  lokasiLoket  String?
  jamPelayanan String?
  kontak       String?
  layanan      Layanan[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Layanan {
  id                Int       @id @default(autoincrement())
  nama              String
  slug              String    @unique
  instansiId        Int
  instansi          Instansi  @relation(fields: [instansiId], references: [id], onDelete: Cascade)
  deskripsi         String?   @db.Text
  dasarHukum        String?   @db.Text
  persyaratan       String?   @db.Text
  prosedur          String?   @db.Text
  waktuPenyelesaian String?
  biaya             String?
  produkLayanan     String?   @db.Text
  pengaduan         String?   @db.Text
  kategoriId        Int?
  kategori          Kategori? @relation(fields: [kategoriId], references: [id], onDelete: SetNull)
  status            String    @default("gratis") // gratis / berbayar
  linkDaring        String?
  jamOperasional    String?
  populer           Boolean   @default(false)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
}

model Fasilitas {
  id        Int      @id @default(autoincrement())
  nama      String
  slug      String   @unique
  foto      String?
  deskripsi String?  @db.Text
  lokasi    String?
  ikon      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Berita {
  id          Int       @id @default(autoincrement())
  judul       String
  slug        String    @unique
  kategoriId  Int?
  kategori    Kategori? @relation(fields: [kategoriId], references: [id], onDelete: SetNull)
  konten      String    @db.Text
  ringkasan   String?   @db.Text
  fotoUtama   String?
  featured    Boolean   @default(false)
  publishedAt DateTime  @default(now())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Galeri {
  id         Int       @id @default(autoincrement())
  judul      String
  kategoriId Int?
  kategori   Kategori? @relation(fields: [kategoriId], references: [id], onDelete: SetNull)
  mediaUrl   String
  tipeMedia  String    // foto / video
  deskripsi  String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

model HalamanStatis {
  id        Int      @id @default(autoincrement())
  slug      String   @unique // profil, sakti, dll
  judul     String
  konten    String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model PesanSaran {
  id        Int      @id @default(autoincrement())
  nama      String
  email     String?
  telepon   String?
  subjek    String?
  pesan     String   @db.Text
  dibaca    Boolean  @default(false)
  createdAt DateTime @default(now())
}

model AdminUser {
  id        Int      @id @default(autoincrement())
  nama      String
  email     String   @unique
  password  String
  role      String   @default("editor") // superadmin, editor
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Kategori {
  id        Int        @id @default(autoincrement())
  nama      String
  slug      String
  tipe      String     // instansi, layanan, berita, galeri
  instansi  Instansi[]
  layanan   Layanan[]
  berita    Berita[]
  galeri    Galeri[]
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  @@unique([tipe, slug])
}

model Pengaturan {
  id              Int      @id @default(1)
  headerTitle     String?
  headerSubtitle  String?  @db.Text
  ratingKepuasan  String?
  alamat          String?  @db.Text
  jamOperasional  String?  @db.Text
  nomorWa         String?
  mapsUrl         String?  @db.Text
  facebookUrl     String?
  instagramUrl    String?
  twitterUrl      String?
  youtubeUrl      String?

  // Teks Dinamis
  teksProfilJudul     String?
  teksProfilDeskripsi  String? @db.Text

  // Gambar-gambar dinamis
  logoWebsite     String?
  fotoHeader      String?
  fotoProfil      String?
  fotoVirtualTour String?

  // Penyimpanan (Storage)
  uploadProvider  String   @default("local") // "local" atau "s3"
  s3Endpoint      String?
  s3Region        String?
  s3AccessKey     String?
  s3SecretKey     String?
  s3BucketName    String?
  s3PublicUrl     String?

  updatedAt       DateTime @updatedAt
}
```

### Perbedaan dari Brief Awal

| Aspek | Brief Awal | Implementasi Aktual |
|---|---|---|
| Kategori | Field `kategori` (String) di setiap model | Model `Kategori` terpusat dengan relasi, tipe: instansi/layanan/berita/galeri |
| Layanan | 9 field | 14 field (tambah: dasarHukum, produkLayanan, pengaduan, kategoriId, jamOperasional) |
| Fasilitas | 4 field | 8 field (tambah: slug, ikon, createdAt, updatedAt) |
| Berita | 6 field | 9 field (tambah: kategoriId via relasi, ringkasan, createdAt, updatedAt) |
| Galeri | 5 field | 8 field (tambah: kategoriId via relasi, deskripsi, updatedAt) |
| PesanSaran | 4 field | 7 field (tambah: telepon, subjek, dibaca) |
| AdminUser | 4 field | 7 field (tambah: nama, createdAt, updatedAt) |
| Pengaturan | Tidak ada | Model baru — pengaturan situs dinamis (logo, kontak, sosmed, S3 config, foto header, dll.) |
| SAKTI | Halaman terpisah `/sakti` | Digabung ke `/mpp-digital` yang lebih komprehensif |
| Tour | Pannellum.js di dalam app | Redirect ke URL eksternal `mpp.bandungkab.go.id/tour` |
| Rich Text Editor | Tiptap / Lexical | react-quill-new |
| Auth | NextAuth.js / Lucia Auth | NextAuth.js v5 beta (Auth.js) |

---

## 8. KOMPONEN TAMBAHAN

### Header ✅ Selesai
- Logo MPP (dari pengaturan admin, fallback ke ikon default).
- Top bar: nomor WA, jam operasional, tombol "Akses MPP Digital".
- Menu navigasi: Beranda, Profil, Instansi, Layanan, Fasilitas, Berita, Galeri, MPP Digital.
- Tombol "Cari Layanan".
- Menu responsif untuk perangkat seluler (hamburger menu + animasi slide).
- Sticky header dengan efek glassmorphism saat scroll.

### Footer ✅ Selesai
- Logo dan nama MPP Kabupaten Bandung.
- Alamat lengkap.
- Nomor telepon/WhatsApp.
- Email.
- Jam operasional.
- Tautan media sosial (Facebook, Instagram, Twitter, YouTube — dari pengaturan).
- Tautan cepat.
- Peta lokasi (embed dari URL pengaturan).
- Hak cipta website.

### Komponen UI ✅ Selesai
- `ImageUploader.tsx` — Upload gambar dengan preview.
- `RichTextEditor.tsx` — Editor teks kaya (react-quill-new) untuk konten berita & deskripsi.
- `MathCaptcha.tsx` — Captcha matematika sederhana untuk formulir publik.
- `WhatsAppButton.tsx` — Tombol floating WhatsApp (nomor dari pengaturan).
- `KritikSaranForm.tsx` — Formulir kritik dan saran masyarakat.

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

Diimplementasikan melalui Tailwind CSS v4 dengan custom theme di `globals.css` — variabel warna `primary-*` dan `accent-*` konsisten di seluruh halaman. Efek glassmorphism, gradient, dan shadow utilities juga didefinisikan.

---

## 10. FITUR UTAMA

| Fitur | Status |
|---|---|
| Pencarian instansi dan layanan | ✅ Selesai |
| Filter kategori (instansi, layanan, berita, galeri) | ✅ Selesai |
| Informasi jadwal pelayanan | ✅ Selesai |
| Integrasi Google Maps (embed) | ✅ Selesai (via URL di pengaturan) |
| Virtual Tour 360° | ✅ Selesai (redirect ke URL eksternal) |
| Formulir kritik dan saran | ✅ Selesai (dengan MathCaptcha) |
| MPP Digital (menggantikan SAKTI) | ✅ Selesai |
| Manajemen berita dan galeri lewat panel admin | ✅ Selesai |
| Tampilan responsif (mobile-first) | ✅ Selesai |
| Tombol WhatsApp floating | ✅ Selesai |
| Upload media (lokal + S3-compatible) | ✅ Selesai |
| Pengaturan situs dinamis (tanpa deploy ulang) | ✅ Selesai |
| Manajemen kategori terpusat | ✅ Selesai |
| Dashboard admin (statistik) | ✅ Selesai |
| Halaman statis (profil, dll.) editable | ✅ Selesai |
| Informasi antrean | ❌ Belum tersedia |
| Dukungan aksesibilitas (kontras warna, alt text, navigasi keyboard) | 🔄 Sebagian |
| Log aktivitas admin (audit trail) | ❌ Belum tersedia |
| SEO meta tags per halaman | 🔄 Sebagian |

---

## 11. CALL TO ACTION

Tombol utama yang digunakan:

- Lihat Semua Layanan
- Cari Instansi
- Kunjungi Virtual Tour
- Akses MPP Digital
- Lihat Persyaratan
- Petunjuk Lokasi
- Hubungi Kami
- Cari Layanan (di Header)

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
| Media/upload | Storage lokal di VPS atau S3-compatible (dikonfigurasi via panel admin Pengaturan) |
| Domain & SSL | Domain resmi `.go.id`, HTTPS wajib |
| CDN & keamanan dasar | Cloudflare (proteksi DDoS dasar, caching aset statis) |

---

## 14. Status Progres Keseluruhan

### ✅ Sudah Selesai
1. Setup project Next.js 16, Prisma 7, database MySQL, autentikasi admin.
2. Skema database lengkap (10 model) dengan seed data.
3. Panel admin lengkap: Dashboard, CRUD Instansi, Layanan, Fasilitas, Berita, Galeri, Kategori, Pesan, Pengaturan.
4. Seluruh halaman publik: Beranda, Profil, Instansi (daftar + detail), Layanan (daftar + detail), Fasilitas, Berita (daftar + detail), Galeri, Tour (redirect), MPP Digital.
5. Komponen layout: Header (sticky + glassmorphism) dan Footer.
6. Komponen UI: ImageUploader, RichTextEditor, MathCaptcha, WhatsAppButton, KritikSaranForm.
7. Server Actions untuk seluruh operasi CRUD.
8. Upload media (lokal + S3-compatible).
9. Client-side search & filter untuk Instansi, Layanan, dan Berita.

### 🔄 Perlu Penyempurnaan
- SEO meta tags dan Open Graph per halaman.
- Aksesibilitas (ARIA labels, keyboard navigation).
- Optimasi performa (lazy loading, image optimization).

### ❌ Belum Dikerjakan
- Informasi antrean.
- Log aktivitas admin (audit trail).
- Training staf pengelola.

---

## refrensi CLI 
https://chatgpt.com/c/6a5ee40f-b008-83ec-a605-8b2734548bf2
