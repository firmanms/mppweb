# Website Mal Pelayanan Publik (MPP) Kabupaten Bandung

Website portal informasi terpadu untuk Mal Pelayanan Publik (MPP) Kabupaten Bandung. Dibangun menggunakan arsitektur full-stack dengan Next.js dan MySQL, website ini menangani halaman publik sekaligus panel admin dalam satu aplikasi.

## Stack Teknologi

- **Framework:** Next.js (App Router)
- **Bahasa:** TypeScript
- **Database:** MySQL 8
- **ORM:** Prisma
- **Styling:** Tailwind CSS v4
- **Auth:** NextAuth.js (Auth.js)

## Prasyarat (Prerequisites)

Sebelum memulai instalasi, pastikan Anda telah memasang:
- Node.js (v18 atau lebih baru)
- npm, yarn, atau pnpm
- MySQL server (bisa menggunakan XAMPP, Laragon, dll.)

## Tata Cara Instalasi

Ikuti langkah-langkah berikut untuk menjalankan website di komputer lokal Anda:

### 1. Clone Repository (jika belum)
```bash
git clone <url-repository>
cd mppweb
```

### 2. Install Dependensi
Jalankan perintah berikut untuk menginstal semua library yang dibutuhkan:
```bash
npm install
```

### 3. Konfigurasi Database
1. Salin atau buat file `.env` di dalam folder utama proyek (sejajar dengan `package.json`).
2. Masukkan konfigurasi koneksi database MySQL Anda ke dalam variabel `DATABASE_URL`.
   *Contoh:*
   ```env
   DATABASE_URL="mysql://root:@localhost:3306/mpp"
   ```
   *(Silakan sesuaikan username `root`, password yang kosong, dan nama database `mpp` sesuai konfigurasi MySQL di komputer Anda)*

### 4. Buat Database
Pastikan Anda sudah membuat database kosong bernama `mpp` di server MySQL Anda (contoh menggunakan command line atau phpMyAdmin).
```sql
CREATE DATABASE IF NOT EXISTS mpp;
```

### 5. Jalankan Migrasi & Seeding
Langkah ini akan membuat tabel-tabel yang dibutuhkan dan mengisi data awal (seperti data instansi, layanan, fasilitas, berita, serta akun admin) ke dalam database Anda:
```bash
npx prisma migrate dev --name init
```
*Catatan: Perintah di atas akan secara otomatis menjalankan proses seeding (pengisian data awal). Jika karena suatu alasan seeding tidak berjalan, Anda bisa menjalankannya secara manual dengan perintah:*
```bash
npx prisma db seed
```

### 6. Jalankan Server Development
Setelah database siap, Anda bisa menjalankan aplikasi di mode development:
```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat hasilnya.

---

## Akses Panel Admin

Setelah proses instalasi dan seeding selesai, Anda dapat mengakses panel admin melalui URL:
**[http://localhost:3000/admin](http://localhost:3000/admin)**

Gunakan kredensial default berikut untuk login:
- **Email:** `admin@mpp.bandungkab.go.id`
- **Password:** `admin123`

*(Disarankan untuk segera mengubah password atau menyesuaikan kredensial di panel admin setelah login pertama kali).*
