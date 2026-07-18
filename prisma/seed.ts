import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcryptjs";

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "MPP",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await prisma.adminUser.upsert({
    where: { email: "admin@mpp.bandungkab.go.id" },
    update: {},
    create: {
      nama: "Super Admin",
      email: "admin@mpp.bandungkab.go.id",
      password: hashedPassword,
      role: "superadmin",
    },
  });

  // Create instansi
  const instansiData = [
    {
      nama: "Dinas Kependudukan dan Pencatatan Sipil",
      slug: "disdukcapil",
      kategori: "Pemerintah",
      deskripsi: "Dinas Kependudukan dan Pencatatan Sipil Kabupaten Bandung melayani berbagai kebutuhan administrasi kependudukan masyarakat.",
      lokasiLoket: "Lantai 1, Loket A1-A5",
      jamPelayanan: "Senin - Jumat: 08.00 - 15.00 WIB",
      kontak: "(022) 5891234",
    },
    {
      nama: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu",
      slug: "dpmptsp",
      kategori: "Pemerintah",
      deskripsi: "DPMPTSP Kabupaten Bandung memberikan layanan perizinan dan penanaman modal secara terpadu dan efisien.",
      lokasiLoket: "Lantai 1, Loket B1-B3",
      jamPelayanan: "Senin - Jumat: 08.00 - 15.00 WIB",
      kontak: "(022) 5895678",
    },
    {
      nama: "Badan Pendapatan Daerah",
      slug: "bapenda",
      kategori: "Pemerintah",
      deskripsi: "Bapenda Kabupaten Bandung melayani pembayaran pajak daerah dan retribusi serta informasi perpajakan.",
      lokasiLoket: "Lantai 1, Loket C1-C3",
      jamPelayanan: "Senin - Jumat: 08.00 - 15.00 WIB",
      kontak: "(022) 5891111",
    },
    {
      nama: "BPJS Kesehatan",
      slug: "bpjs-kesehatan",
      kategori: "BUMN",
      deskripsi: "BPJS Kesehatan menyediakan layanan pendaftaran, perubahan data peserta, dan informasi jaminan kesehatan nasional.",
      lokasiLoket: "Lantai 2, Loket D1-D2",
      jamPelayanan: "Senin - Jumat: 08.00 - 14.30 WIB",
      kontak: "1500400",
    },
    {
      nama: "BPJS Ketenagakerjaan",
      slug: "bpjs-ketenagakerjaan",
      kategori: "BUMN",
      deskripsi: "BPJS Ketenagakerjaan melayani pendaftaran peserta, klaim jaminan, dan informasi program ketenagakerjaan.",
      lokasiLoket: "Lantai 2, Loket E1-E2",
      jamPelayanan: "Senin - Jumat: 08.00 - 14.30 WIB",
      kontak: "175",
    },
    {
      nama: "PT PLN (Persero)",
      slug: "pln",
      kategori: "BUMN",
      deskripsi: "PT PLN melayani permohonan sambungan baru, perubahan daya, dan pengaduan gangguan kelistrikan.",
      lokasiLoket: "Lantai 2, Loket F1",
      jamPelayanan: "Senin - Jumat: 08.00 - 14.00 WIB",
      kontak: "123",
    },
    {
      nama: "Kantor Pertanahan (BPN)",
      slug: "bpn",
      kategori: "Pemerintah",
      deskripsi: "Kantor Pertanahan Kabupaten Bandung melayani pengurusan sertifikat tanah, peralihan hak, dan informasi pertanahan.",
      lokasiLoket: "Lantai 2, Loket G1-G3",
      jamPelayanan: "Senin - Jumat: 08.00 - 15.00 WIB",
      kontak: "(022) 5892222",
    },
    {
      nama: "Kepolisian Resor Bandung",
      slug: "polres-bandung",
      kategori: "Pemerintah",
      deskripsi: "Polres Bandung menyediakan layanan pembuatan SKCK, laporan kehilangan, dan pelayanan kepolisian lainnya.",
      lokasiLoket: "Lantai 1, Loket H1",
      jamPelayanan: "Senin - Jumat: 08.00 - 14.00 WIB",
      kontak: "(022) 5893333",
    },
    {
      nama: "Kantor Imigrasi",
      slug: "imigrasi",
      kategori: "Pemerintah",
      deskripsi: "Kantor Imigrasi menyediakan layanan pembuatan dan perpanjangan paspor serta dokumen keimigrasian lainnya.",
      lokasiLoket: "Lantai 2, Loket I1-I2",
      jamPelayanan: "Senin - Jumat: 08.00 - 15.00 WIB",
      kontak: "(022) 5894444",
    },
    {
      nama: "Bank BJB",
      slug: "bank-bjb",
      kategori: "BUMD",
      deskripsi: "Bank BJB menyediakan layanan perbankan untuk pembayaran pajak, retribusi, dan layanan keuangan lainnya.",
      lokasiLoket: "Lantai 1, Loket J1",
      jamPelayanan: "Senin - Jumat: 08.00 - 14.00 WIB",
      kontak: "14049",
    },
  ];

  // Create Categories first
  const kategoriInstansi = ["Pemerintah", "BUMN", "BUMD"];
  const kategoriLayanan = ["Kependudukan", "Perizinan", "Perpajakan", "Kesehatan", "Pertanahan", "Kepolisian", "Keimigrasian"];
  const kategoriBerita = ["Berita Pelayanan", "Pengumuman", "Inovasi Pelayanan", "Kegiatan Instansi"];
  const kategoriGaleri = ["Peresmian", "Kegiatan Pelayanan", "Fasilitas MPP", "Kunjungan Kerja", "Sosialisasi"];

  const katMap: Record<string, number> = {};

  const createCategories = async (list: string[], tipe: string) => {
    for (const name of list) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const res = await prisma.kategori.upsert({
        where: { tipe_slug: { tipe, slug } },
        update: {},
        create: { nama: name, slug, tipe },
      });
      katMap[`${tipe}_${name}`] = res.id;
    }
  };

  await createCategories(kategoriInstansi, "instansi");
  await createCategories(kategoriLayanan, "layanan");
  await createCategories(kategoriBerita, "berita");
  await createCategories(kategoriGaleri, "galeri");

  for (const inst of instansiData) {
    const kategoriId = katMap[`instansi_${inst.kategori}`];
    const { kategori, ...data } = inst;
    await prisma.instansi.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, kategoriId },
    });
  }

  // Create layanan
  const disdukcapil = await prisma.instansi.findUnique({ where: { slug: "disdukcapil" } });
  const dpmptsp = await prisma.instansi.findUnique({ where: { slug: "dpmptsp" } });
  const bapenda = await prisma.instansi.findUnique({ where: { slug: "bapenda" } });
  const bpjsKes = await prisma.instansi.findUnique({ where: { slug: "bpjs-kesehatan" } });
  const bpn = await prisma.instansi.findUnique({ where: { slug: "bpn" } });
  const polres = await prisma.instansi.findUnique({ where: { slug: "polres-bandung" } });
  const imigrasi = await prisma.instansi.findUnique({ where: { slug: "imigrasi" } });

  const layananData = [
    {
      nama: "Pembuatan KTP Elektronik",
      slug: "pembuatan-ktp-elektronik",
      instansiId: disdukcapil!.id,
      deskripsi: "Layanan pembuatan Kartu Tanda Penduduk Elektronik (KTP-el) bagi warga Kabupaten Bandung yang telah berusia 17 tahun atau sudah menikah.",
      dasarHukum: "Undang-Undang Nomor 24 Tahun 2013 tentang Perubahan atas Undang-Undang Nomor 23 Tahun 2006 tentang Administrasi Kependudukan.",
      persyaratan: "1. Surat pengantar RT/RW\n2. Kartu Keluarga asli\n3. Akta kelahiran/ijazah/surat nikah\n4. Pas foto jika diperlukan",
      prosedur: "1. Ambil nomor antrean\n2. Serahkan berkas ke loket\n3. Perekaman data biometrik\n4. Tunggu proses pencetakan",
      waktuPenyelesaian: "14 hari kerja",
      biaya: "Gratis",
      produkLayanan: "Kartu Tanda Penduduk Elektronik (KTP-el) fisik.",
      pengaduan: "Kritik, saran, dan pengaduan dapat disampaikan melalui loket pengaduan Disdukcapil di MPP, atau via WhatsApp di 0812-3456-7890.",
      kategori: "Kependudukan",
      status: "gratis",
      populer: true,
    },
    {
      nama: "Pembuatan Kartu Keluarga",
      slug: "pembuatan-kartu-keluarga",
      instansiId: disdukcapil!.id,
      deskripsi: "Layanan pembuatan dan pembaruan Kartu Keluarga bagi warga Kabupaten Bandung.",
      dasarHukum: "Peraturan Presiden Nomor 96 Tahun 2018 tentang Persyaratan dan Tata Cara Pendaftaran Penduduk dan Pencatatan Sipil.",
      persyaratan: "1. Surat pengantar RT/RW\n2. KTP-el asli\n3. Akta kelahiran/nikah/cerai/kematian\n4. Surat keterangan pindah (jika pindah alamat)",
      prosedur: "1. Ambil nomor antrean\n2. Serahkan berkas persyaratan\n3. Verifikasi data\n4. Penerbitan KK baru",
      waktuPenyelesaian: "7 hari kerja",
      biaya: "Gratis",
      produkLayanan: "Lembar Kartu Keluarga (KK) bertanda tangan elektronik.",
      pengaduan: "Pengaduan dan saran dapat diajukan lewat loket pengaduan Disdukcapil di MPP atau email ke disdukcapil@bandungkab.go.id.",
      kategori: "Kependudukan",
      status: "gratis",
      populer: true,
    },
    {
      nama: "Pembuatan Akta Kelahiran",
      slug: "pembuatan-akta-kelahiran",
      instansiId: disdukcapil!.id,
      deskripsi: "Layanan pembuatan Akta Kelahiran bagi warga Kabupaten Bandung.",
      dasarHukum: "Peraturan Menteri Dalam Negeri Nomor 108 Tahun 2019 tentang Peraturan Pelaksanaan Peraturan Presiden Nomor 96 Tahun 2018.",
      persyaratan: "1. Surat keterangan lahir dari rumah sakit/bidan\n2. KTP-el orang tua\n3. Kartu Keluarga\n4. Akta nikah orang tua\n5. Dua orang saksi dengan KTP",
      prosedur: "1. Ambil nomor antrean\n2. Serahkan berkas\n3. Verifikasi data\n4. Penerbitan akta",
      waktuPenyelesaian: "5 hari kerja",
      biaya: "Gratis",
      produkLayanan: "Kutipan Akta Kelahiran asli bertanda tangan elektronik.",
      pengaduan: "Pengaduan melalui loket pengaduan Disdukcapil atau website resmi disdukcapil.bandungkab.go.id.",
      kategori: "Kependudukan",
      status: "gratis",
      populer: true,
    },
    {
      nama: "Izin Usaha Mikro dan Kecil (IUMK)",
      slug: "izin-usaha-mikro-kecil",
      instansiId: dpmptsp!.id,
      deskripsi: "Layanan penerbitan Izin Usaha Mikro dan Kecil untuk pelaku UMKM di Kabupaten Bandung.",
      dasarHukum: "Peraturan Pemerintah Nomor 7 Tahun 2021 tentang Kemudahan, Pelindungan, dan Pemberdayaan Koperasi dan Usaha Mikro, Kecil, dan Menengah.",
      persyaratan: "1. KTP-el asli\n2. Kartu Keluarga\n3. Pas foto 4x6 (2 lembar)\n4. Surat keterangan domisili usaha\n5. Surat pernyataan pengelolaan lingkungan",
      prosedur: "1. Daftar online atau datang langsung\n2. Serahkan berkas\n3. Verifikasi lapangan\n4. Penerbitan IUMK",
      waktuPenyelesaian: "3 hari kerja",
      biaya: "Gratis",
      produkLayanan: "Nomor Induk Berusaha (NIB) dan sertifikat Izin Usaha Mikro Kecil.",
      pengaduan: "Pengaduan dapat disampaikan ke DPMPTSP melalui SIPID atau langsung ke meja pengaduan di MPP.",
      kategori: "Perizinan",
      status: "gratis",
      populer: true,
    },
    {
      nama: "Izin Mendirikan Bangunan (IMB/PBG)",
      slug: "izin-mendirikan-bangunan",
      instansiId: dpmptsp!.id,
      deskripsi: "Layanan penerbitan Persetujuan Bangunan Gedung (PBG) sebagai pengganti IMB.",
      dasarHukum: "Undang-Undang Nomor 11 Tahun 2020 tentang Cipta Kerja dan Peraturan Pemerintah Nomor 16 Tahun 2021 tentang Peraturan Pelaksanaan UU Bangunan Gedung.",
      persyaratan: "1. KTP-el dan KK\n2. Sertifikat tanah\n3. Gambar rencana bangunan\n4. Surat pernyataan pemohon\n5. Rekomendasi teknis",
      prosedur: "1. Pendaftaran online via SIMBG\n2. Pemeriksaan administrasi\n3. Konsultasi teknis\n4. Persetujuan\n5. Penerbitan PBG",
      waktuPenyelesaian: "14-30 hari kerja",
      biaya: "Sesuai retribusi",
      produkLayanan: "Persetujuan Bangunan Gedung (PBG) dan Bukti Kepemilikan Bangunan Gedung (BKBG).",
      pengaduan: "Aduan dapat diajukan via aplikasi SIMBG atau email dpmptsp@bandungkab.go.id.",
      kategori: "Perizinan",
      status: "berbayar",
      populer: false,
    },
    {
      nama: "Pembayaran PBB",
      slug: "pembayaran-pbb",
      instansiId: bapenda!.id,
      deskripsi: "Layanan pembayaran Pajak Bumi dan Bangunan Perdesaan dan Perkotaan (PBB-P2).",
      dasarHukum: "Peraturan Daerah Kabupaten Bandung Nomor 1 Tahun 2024 tentang Pajak Daerah dan Retribusi Daerah.",
      persyaratan: "1. SPPT PBB tahun berjalan\n2. KTP-el wajib pajak",
      prosedur: "1. Ambil nomor antrean\n2. Serahkan SPPT dan KTP\n3. Verifikasi data pajak\n4. Lakukan pembayaran\n5. Terima bukti bayar",
      waktuPenyelesaian: "Langsung",
      biaya: "Sesuai SPPT",
      produkLayanan: "Surat Tanda Terima Setoran (STTS) PBB-P2 asli.",
      pengaduan: "Aduan dan saran melalui loket Bapenda di MPP atau Call Center Bapenda Kabupaten Bandung.",
      kategori: "Perpajakan",
      status: "berbayar",
      populer: true,
    },
    {
      nama: "Pendaftaran Peserta BPJS Kesehatan",
      slug: "pendaftaran-bpjs-kesehatan",
      instansiId: bpjsKes!.id,
      deskripsi: "Layanan pendaftaran peserta baru BPJS Kesehatan baik mandiri maupun pekerja.",
      dasarHukum: "Undang-Undang Nomor 24 Tahun 2011 tentang Badan Penyelenggara Jaminan Sosial.",
      persyaratan: "1. KTP-el asli\n2. Kartu Keluarga\n3. Pas foto 3x4 (1 lembar)\n4. Buku tabungan untuk autodebet",
      prosedur: "1. Ambil nomor antrean\n2. Isi formulir pendaftaran\n3. Serahkan berkas\n4. Pilih faskes tingkat 1\n5. Aktivasi kartu",
      waktuPenyelesaian: "Langsung",
      biaya: "Sesuai kelas",
      produkLayanan: "Kartu Indonesia Sehat (KIS) digital atau fisik.",
      pengaduan: "Pengaduan lewat BPJS Kesehatan Care Center 165 atau loket BPJS di MPP.",
      kategori: "Kesehatan",
      status: "berbayar",
      populer: true,
    },
    {
      nama: "Pengurusan Sertifikat Tanah",
      slug: "pengurusan-sertifikat-tanah",
      instansiId: bpn!.id,
      deskripsi: "Layanan penerbitan sertifikat hak atas tanah untuk pertama kali.",
      dasarHukum: "Peraturan Pemerintah Nomor 24 Tahun 1997 tentang Pendaftaran Tanah.",
      persyaratan: "1. KTP-el dan KK\n2. Surat tanah/girik/letter C\n3. Surat ukur/gambar situasi\n4. SPPT PBB tahun terakhir\n5. Surat pernyataan penguasaan fisik",
      prosedur: "1. Pendaftaran berkas\n2. Pengukuran bidang tanah\n3. Pemeriksaan tanah\n4. Pengumuman\n5. Penerbitan sertifikat",
      waktuPenyelesaian: "98 hari kerja",
      biaya: "Sesuai ketentuan BPN",
      produkLayanan: "Sertifikat Hak Milik (SHM) / Hak Guna Bangunan (HGB) asli.",
      pengaduan: "Pengaduan resmi melalui aplikasi Sentuh Tanahku atau loket BPN di MPP.",
      kategori: "Pertanahan",
      status: "berbayar",
      populer: false,
    },
    {
      nama: "Pembuatan SKCK",
      slug: "pembuatan-skck",
      instansiId: polres!.id,
      deskripsi: "Layanan pembuatan Surat Keterangan Catatan Kepolisian (SKCK).",
      dasarHukum: "Peraturan Kepala Kepolisian Negara Republik Indonesia Nomor 18 Tahun 2014 tentang Tata Cara Penerbitan Surat Keterangan Catatan Kepolisian.",
      persyaratan: "1. KTP-el asli\n2. Kartu Keluarga\n3. Pas foto 4x6 background merah (6 lembar)\n4. Sidik jari\n5. Surat pengantar dari kelurahan",
      prosedur: "1. Daftar di loket SKCK\n2. Pengambilan sidik jari\n3. Verifikasi data\n4. Pembayaran PNBP\n5. Penerbitan SKCK",
      waktuPenyelesaian: "1 hari kerja",
      biaya: "Rp30.000",
      produkLayanan: "Lembar SKCK asli bertanda tangan Kapolres.",
      pengaduan: "Aduan via Seksi Pengawasan Polres Bandung atau loket Polres di MPP.",
      kategori: "Kepolisian",
      status: "berbayar",
      populer: true,
    },
    {
      nama: "Pembuatan Paspor",
      slug: "pembuatan-paspor",
      instansiId: imigrasi!.id,
      deskripsi: "Layanan pembuatan paspor biasa 48 halaman.",
      dasarHukum: "Peraturan Pemerintah Nomor 31 Tahun 2013 tentang Peraturan Pelaksanaan Undang-Undang Nomor 6 Tahun 2011 tentang Keimigrasian.",
      persyaratan: "1. KTP-el asli\n2. Kartu Keluarga\n3. Akta kelahiran/ijazah\n4. Akta nikah (jika sudah menikah)\n5. Paspor lama (jika perpanjangan)",
      prosedur: "1. Daftar online via M-Paspor\n2. Datang sesuai jadwal\n3. Pembayaran PNBP\n4. Pengambilan foto dan biometrik\n5. Wawancara\n6. Pengambilan paspor",
      waktuPenyelesaian: "3-4 hari kerja",
      biaya: "Rp350.000",
      produkLayanan: "Buku Paspor Biasa 48 Halaman.",
      pengaduan: "Aduan dapat dikirim melalui aplikasi M-Paspor atau loket Imigrasi di MPP.",
      kategori: "Keimigrasian",
      status: "berbayar",
      populer: true,
    },
  ];

  for (const lay of layananData) {
    const kategoriId = katMap[`layanan_${lay.kategori}`];
    const { kategori, ...data } = lay;
    await prisma.layanan.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, kategoriId },
    });
  }

  // Create fasilitas
  const fasilitasData = [
    { nama: "Ruang Tunggu", slug: "ruang-tunggu", deskripsi: "Ruang tunggu yang nyaman dengan kapasitas besar dilengkapi pendingin udara dan tempat duduk ergonomis.", lokasi: "Lantai 1 & 2", ikon: "Armchair" },
    { nama: "Loket Pelayanan", slug: "loket-pelayanan", deskripsi: "Lebih dari 30 loket pelayanan dari berbagai instansi pemerintah dan BUMN.", lokasi: "Lantai 1 & 2", ikon: "TicketCheck" },
    { nama: "Mesin Antrean", slug: "mesin-antrean", deskripsi: "Sistem antrean digital untuk memudahkan pengunjung mendapatkan nomor antrean.", lokasi: "Pintu Masuk Utama", ikon: "ListOrdered" },
    { nama: "Pojok Informasi", slug: "pojok-informasi", deskripsi: "Layanan informasi dan bantuan bagi pengunjung yang membutuhkan panduan pelayanan.", lokasi: "Lobby Utama", ikon: "Info" },
    { nama: "Ruang Laktasi", slug: "ruang-laktasi", deskripsi: "Ruang laktasi yang bersih dan privat untuk ibu menyusui.", lokasi: "Lantai 1", ikon: "Baby" },
    { nama: "Fasilitas Disabilitas", slug: "fasilitas-disabilitas", deskripsi: "Akses ramp, lift, dan jalur khusus untuk pengunjung berkebutuhan khusus.", lokasi: "Seluruh Area", ikon: "Accessibility" },
    { nama: "Area Bermain Anak", slug: "area-bermain-anak", deskripsi: "Area bermain anak yang aman dan menyenangkan agar orang tua bisa mengurus pelayanan dengan tenang.", lokasi: "Lantai 1", ikon: "Blocks" },
    { nama: "Musala", slug: "musala", deskripsi: "Musala yang bersih dan nyaman dilengkapi perlengkapan ibadah.", lokasi: "Lantai 1", ikon: "Moon" },
    { nama: "Toilet", slug: "toilet", deskripsi: "Toilet bersih dan terawat tersedia di setiap lantai.", lokasi: "Lantai 1 & 2", ikon: "Bath" },
    { nama: "Area Parkir", slug: "area-parkir", deskripsi: "Area parkir luas untuk kendaraan roda dua dan roda empat.", lokasi: "Halaman Depan & Belakang", ikon: "Car" },
    { nama: "Wi-Fi Publik", slug: "wifi-publik", deskripsi: "Akses Wi-Fi gratis untuk seluruh pengunjung MPP.", lokasi: "Seluruh Area", ikon: "Wifi" },
    { nama: "Charging Station", slug: "charging-station", deskripsi: "Stasiun pengisian daya ponsel dan perangkat elektronik.", lokasi: "Ruang Tunggu", ikon: "BatteryCharging" },
    { nama: "Kantin", slug: "kantin", deskripsi: "Area kuliner dengan berbagai pilihan makanan dan minuman.", lokasi: "Lantai 1, Sayap Kiri", ikon: "UtensilsCrossed" },
  ];

  for (const fas of fasilitasData) {
    await prisma.fasilitas.upsert({
      where: { slug: fas.slug },
      update: {},
      create: fas,
    });
  }

  // Create berita
  const beritaData = [
    {
      judul: "MPP Kabupaten Bandung Resmi Beroperasi Melayani Masyarakat",
      slug: "mpp-kabupaten-bandung-resmi-beroperasi",
      kategori: "Berita Pelayanan",
      konten: "<p>Mal Pelayanan Publik (MPP) Kabupaten Bandung resmi dibuka dan mulai beroperasi melayani masyarakat. MPP ini menghadirkan berbagai layanan pemerintahan dan pelayanan publik dalam satu lokasi yang nyaman dan mudah diakses.</p><p>Bupati Bandung dalam sambutannya menyampaikan bahwa kehadiran MPP ini merupakan wujud komitmen pemerintah daerah dalam meningkatkan kualitas pelayanan publik.</p><p>\"Kami berharap dengan adanya MPP ini, masyarakat Kabupaten Bandung dapat memperoleh pelayanan yang lebih cepat, mudah, dan terintegrasi,\" ujar Bupati.</p>",
      ringkasan: "Mal Pelayanan Publik Kabupaten Bandung resmi dibuka dan mulai beroperasi melayani masyarakat dengan berbagai layanan terintegrasi.",
      kategoriLabel: "Berita Pelayanan",
      featured: true,
    },
    {
      judul: "10 Instansi Siap Melayani di MPP Kabupaten Bandung",
      slug: "10-instansi-siap-melayani-mpp",
      kategori: "Berita Pelayanan",
      konten: "<p>Sebanyak 10 instansi pemerintah dan BUMN telah resmi bergabung dan siap melayani masyarakat di Mal Pelayanan Publik Kabupaten Bandung.</p><p>Instansi-instansi tersebut meliputi Disdukcapil, DPMPTSP, Bapenda, BPJS Kesehatan, BPJS Ketenagakerjaan, PLN, BPN, Polres Bandung, Kantor Imigrasi, dan Bank BJB.</p>",
      ringkasan: "Sebanyak 10 instansi pemerintah dan BUMN telah bergabung dan siap melayani masyarakat di MPP Kabupaten Bandung.",
      featured: true,
    },
    {
      judul: "Jadwal Pelayanan MPP Selama Bulan Ramadhan",
      slug: "jadwal-pelayanan-ramadhan",
      kategori: "Pengumuman",
      konten: "<p>Sehubungan dengan bulan suci Ramadhan, MPP Kabupaten Bandung menginformasikan perubahan jadwal pelayanan sebagai berikut:</p><ul><li>Senin - Kamis: 08.00 - 14.00 WIB</li><li>Jumat: 08.00 - 11.30 WIB</li></ul><p>Perubahan jadwal ini berlaku selama bulan Ramadhan. Mohon maaf atas ketidaknyamanannya.</p>",
      ringkasan: "Informasi perubahan jadwal pelayanan MPP Kabupaten Bandung selama bulan Ramadhan.",
      featured: false,
    },
    {
      judul: "Inovasi Layanan Digital di MPP Kabupaten Bandung",
      slug: "inovasi-layanan-digital-mpp",
      kategori: "Inovasi Pelayanan",
      konten: "<p>MPP Kabupaten Bandung terus berinovasi dengan menghadirkan layanan digital untuk memudahkan masyarakat. Beberapa inovasi yang telah diterapkan antara lain sistem antrean online, layanan mandiri melalui kiosk digital, dan tracking status permohonan secara real-time.</p>",
      ringkasan: "MPP Kabupaten Bandung menghadirkan inovasi layanan digital termasuk sistem antrean online dan kiosk digital.",
      featured: false,
    },
    {
      judul: "Kunjungan Kerja Gubernur Jawa Barat ke MPP Kabupaten Bandung",
      slug: "kunjungan-gubernur-jabar-mpp",
      kategori: "Kegiatan Instansi",
      konten: "<p>Gubernur Jawa Barat melakukan kunjungan kerja ke Mal Pelayanan Publik Kabupaten Bandung. Dalam kunjungannya, Gubernur memberikan apresiasi atas penyelenggaraan MPP yang modern dan terintegrasi.</p>",
      ringkasan: "Gubernur Jawa Barat melakukan kunjungan kerja dan memberikan apresiasi atas penyelenggaraan MPP Kabupaten Bandung.",
      featured: false,
    },
  ];

  for (const ber of beritaData) {
    const kategoriId = katMap[`berita_${ber.kategori}`];
    const { kategoriLabel, kategori, ...data } = ber as typeof ber & { kategoriLabel?: string };
    await prisma.berita.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, kategoriId },
    });
  }

  // Create halaman statis
  await prisma.halamanStatis.upsert({
    where: { slug: "profil" },
    update: {},
    create: {
      slug: "profil",
      judul: "Profil MPP Kabupaten Bandung",
      konten: `<h2>Tentang Mal Pelayanan Publik</h2>
<p>Mal Pelayanan Publik (MPP) Kabupaten Bandung merupakan tempat berlangsungnya kegiatan atau aktivitas penyelenggaraan pelayanan publik atas barang, jasa, dan/atau pelayanan administrasi yang merupakan perluasan fungsi pelayanan terpadu, baik pusat maupun daerah, serta pelayanan BUMN/BUMD/swasta dalam rangka menyediakan pelayanan yang cepat, mudah, terjangkau, aman, dan nyaman.</p>

<h2>Visi</h2>
<p>Mewujudkan pelayanan publik yang prima, terpadu, dan mudah diakses oleh seluruh masyarakat Kabupaten Bandung.</p>

<h2>Misi</h2>
<ul>
<li>Mengintegrasikan berbagai layanan publik dalam satu lokasi yang mudah dijangkau.</li>
<li>Meningkatkan kualitas dan kecepatan pelayanan publik.</li>
<li>Menciptakan lingkungan pelayanan yang nyaman dan ramah bagi semua kalangan.</li>
<li>Mendorong inovasi dan digitalisasi dalam penyelenggaraan pelayanan publik.</li>
<li>Meningkatkan kepuasan masyarakat terhadap pelayanan publik.</li>
</ul>

<h2>Dasar Hukum</h2>
<ul>
<li>Peraturan Presiden Nomor 89 Tahun 2021 tentang Penyelenggaraan Mal Pelayanan Publik</li>
<li>Peraturan Menteri PANRB tentang Pedoman Penyelenggaraan MPP</li>
<li>Peraturan Bupati Bandung tentang Penyelenggaraan MPP Kabupaten Bandung</li>
</ul>

<h2>Tujuan</h2>
<ul>
<li>Memberikan kemudahan, kecepatan, keterjangkauan, keamanan, dan kenyamanan kepada masyarakat.</li>
<li>Meningkatkan daya saing global dalam memberikan pelayanan publik.</li>
<li>Mengintegrasikan pelayanan publik dari berbagai instansi.</li>
</ul>`,
    },
  });

  await prisma.halamanStatis.upsert({
    where: { slug: "sakti" },
    update: {},
    create: {
      slug: "sakti",
      judul: "Layanan SAKTI",
      konten: `<h2>Tentang SAKTI</h2>
<p>SAKTI (Sistem Aplikasi Keuangan Tingkat Instansi) adalah layanan digital yang menghubungkan masyarakat dengan berbagai layanan administrasi secara daring. Melalui SAKTI, masyarakat dapat mengakses layanan tanpa harus datang langsung ke kantor pelayanan.</p>

<h2>Manfaat SAKTI</h2>
<ul>
<li>Akses layanan kapan saja dan di mana saja</li>
<li>Mengurangi waktu tunggu pelayanan</li>
<li>Tracking status permohonan secara real-time</li>
<li>Notifikasi otomatis untuk setiap tahapan proses</li>
</ul>

<h2>Cara Menggunakan</h2>
<ol>
<li>Kunjungi portal SAKTI atau unduh aplikasi mobile</li>
<li>Daftar atau login dengan akun Anda</li>
<li>Pilih jenis layanan yang dibutuhkan</li>
<li>Lengkapi formulir dan unggah dokumen persyaratan</li>
<li>Pantau status permohonan Anda</li>
</ol>`,
    },
  });

  // Create galeri
  const galeriData = [
    { judul: "Peresmian MPP Kabupaten Bandung", kategori: "Peresmian", mediaUrl: "/images/galeri/placeholder.jpg", tipeMedia: "foto" },
    { judul: "Suasana Pelayanan di MPP", kategori: "Kegiatan Pelayanan", mediaUrl: "/images/galeri/placeholder.jpg", tipeMedia: "foto" },
    { judul: "Ruang Tunggu MPP yang Nyaman", kategori: "Fasilitas MPP", mediaUrl: "/images/galeri/placeholder.jpg", tipeMedia: "foto" },
    { judul: "Kunjungan Kerja Gubernur", kategori: "Kunjungan Kerja", mediaUrl: "/images/galeri/placeholder.jpg", tipeMedia: "foto" },
    { judul: "Sosialisasi Layanan MPP", kategori: "Sosialisasi", mediaUrl: "/images/galeri/placeholder.jpg", tipeMedia: "foto" },
    { judul: "Area Bermain Anak di MPP", kategori: "Fasilitas MPP", mediaUrl: "/images/galeri/placeholder.jpg", tipeMedia: "foto" },
  ];

  for (const gal of galeriData) {
    const kategoriId = katMap[`galeri_${gal.kategori}`];
    const { kategori, ...data } = gal;
    await prisma.galeri.create({ data: { ...data, kategoriId } });
  }

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
