# AutoMall Indonesia — Marketplace Mobil Baru
## Tugas Praktikum Pemrograman Aplikasi Web (PPAW) Week 6
### JavaScript DOM, Event Handling, dan Fetch API

Aplikasi web interaktif modern yang memadukan katalog 41 unit mobil baru di Indonesia dengan fitur filter interaktif, formulir pemesanan test drive berbasis Event Handling, serta integrasi pemanggilan data asinkronus (asynchronous) dari DummyJSON menggunakan Fetch API murni (Pure Vanilla JavaScript).

---

## 1. Identitas Mahasiswa

| Keterangan | Data Mahasiswa |
| :--- | :--- |
| **Nama Lengkap** | Rangga Fadhilah Akbar |
| **Nomor Induk Mahasiswa (NIM)** | 20240140211 |
| **Mata Kuliah** | Praktikum Pemrograman Aplikasi Web (PPAW) |
| **Tugas** | Week 6 — JavaScript DOM, Event Handling, dan Fetch API |
| **Kelas** | [KELAS] |
| **Format Repository** | `Week6-Kelas[KELAS]-20240140211` |

---

## 2. Tujuan Praktikum

1. **Implementasi Fetch API:** Mengambil data eksternal secara asinkronus dari endpoint DummyJSON menggunakan `fetch()`, `async/await`, pemeriksaan status HTTP `response.ok`, serta blok `try...catch...finally`.
2. **Manipulasi DOM Murni & Aman:** Merender elemen antarmuka secara dinamis menggunakan `document.createElement()`, `textContent`, dan `DocumentFragment` tanpa menggunakan `innerHTML` untuk mencegah kerentanan XSS (*Cross-Site Scripting*).
3. **Event Handling Real-Time:** Menangani event `submit`, `input`, `blur`, `change`, dan `click` dengan `addEventListener()` serta mencegah reload halaman secara default menggunakan `event.preventDefault()`.
4. **Penerapan Clean Code & No Magic Numbers:** Seluruh angka konfigurasi, opsi filter, batasan validasi, URL endpoint, dan basis data 41 mobil disimpan terpusat di **bagian paling atas file `script.js`**, bukan di tengah atau bawah kode.
5. **UI/UX Modern & Responsif:** Desain antarmuka berbasis CSS Variables, CSS Grid, Flexbox, Skeleton Shimmer Loader, dan penanganan status lengkap (*Loading*, *Error*, *Empty State*).

---

## 3. Fitur-Fitur Utama Aplikasi

### A. Fitur 1 — Fetch API Mobil Import DummyJSON (Tugas Wajib PPAW)
- **Endpoint API:** `https://dummyjson.com/products/category/vehicle`
- **Asynchronous Execution:** Menggunakan sintaks modern `async/await` di dalam fungsi `fetchProducts()`.
- **Data Mobil Relevan:** Menampilkan mobil import internasional resmi dari DummyJSON (Dodge Charger, Dodge Hornet, Dodge Durango, Chrysler Pacifica) sehingga 100% selaras dengan tema marketplace mobil.
- **Pemeriksaan Status HTTP:** Memeriksa `response.ok` sebelum memproses data JSON guna mendeteksi HTTP error status (404, 500, dsb).
- **Indikator Loading Dinamis (Skeleton Shimmer):** Menampilkan kartu animasi kerangka abu-abu selama permintaan data berlangsung.
- **Pencegahan Request Ganda (Concurrency Guard):** Tombol *"Muat Ulang Mobil"* dinonaktifkan (`disabled = true`) dan menampilkan ikon berputar saat request aktif.
- **Format Mata Uang USD:** Seluruh harga produk diformat rapi menggunakan `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.
- **Penanganan Error Terstruktur:** Menampilkan pesan error ramah pengguna dengan tombol *"Coba Muat Ulang"* apabila koneksi terputus.

### B. Fitur 2 — Formulir Pemesanan Test Drive (DOM & Event Handling Wajib)
- **Pencegahan Page Reload:** Menggunakan `event.preventDefault()` pada penanganan event submit.
- **Validasi 4 Field Input:**
  1. *Nama Lengkap:* Wajib diisi, minimal 3 karakter (setelah `.trim()`).
  2. *Alamat Email:* Wajib diisi, validasi pola standar alamat email (Regex).
  3. *Nomor WhatsApp:* Wajib diisi, format Indonesia (`08xx` atau `+628xx`, 10–14 digit).
  4. *Model Mobil Pilihan:* Wajib memilih salah satu dari 41 mobil yang tersedia.
- **Umpan Balik Real-Time:** Menangani event `input`, `blur`, dan `change` sehingga tanda merah dan pesan error langsung hilang seketika saat input diperbaiki.
- **Status Visual Interaktif:** Kotak input berubah warna menjadi hijau dengan ikon centang (`✓`) jika valid, atau merah dengan tanda seru (`!`) jika invalid.
- **Banner Notifikasi Keberhasilan Dinamis:** Menampilkan ucapan selamat dipersonalisasi berisi nama pemesan dan mobil yang dipilih, dilengkapi timer *auto-dismiss* 6 detik dan tombol tutup manual (`×`).
- **Form Reset Otomatis:** Mengosongkan form dan membersihkan seluruh status visual setelah submit berhasil.

### C. Fitur Spesial — Katalog 41 Mobil Baru & Sistem Filter Interaktif
Katalog mobil terlengkap yang memuat **41 model mobil populer di Indonesia** dari berbagai negara pabrikan:
- **Jepang (18 Unit):** Toyota (Avanza, Kijang Innova), Daihatsu (Sigra, Gran Max), Honda (Brio, HR-V), Mitsubishi (Xpander, Pajero Sport), Suzuki (Carry Pick-Up, XL7), Mazda (CX-5, Mazda 2), Subaru (Forester), Lexus (RX), Nissan (Serena, Livina), Isuzu (Traga, MU-X).
- **Tiongkok (10 Unit):** BYD (M6, Atto 3), Wuling (Air EV, Almaz), Chery (Omoda 5, Tiggo 7 Pro), GAC Aion (Y Plus), GWM (Haval H6, Tank 500), Neta (V-II).
- **Korea Selatan (4 Unit):** Hyundai (Creta, Ioniq 5), Kia (Sonet, Carnival).
- **Eropa (8 Unit):** BMW (Seri 3, X1), Mercedes-Benz (C-Class, GLC), MG (ZS EV), Volkswagen (Golf, Tiguan), Porsche (Macan).
- **Amerika (1 Unit):** Jeep (Wrangler Rubicon).

**Kemampuan Bilah Filter Interaktif:**
1. *Pencarian Teks:* Mencari berdasarkan merek, model, atau kata kunci deskripsi.
2. *Asal Negara:* Filter berdasarkan Jepang, Tiongkok, Korea Selatan, Eropa, atau Amerika.
3. *Merek (Dinamis):* Opsi dropdown merek otomatis menyesuaikan negara asal yang dipilih.
4. *Tipe Bodi:* Filter SUV, MPV, Sedan, Hatchback, City Car, Pick-Up, atau Crossover.
5. *Bahan Bakar:* Filter Bensin, Diesel, Listrik murni (EV), atau Hybrid.
6. *Urutan (Sorting):* Urutkan harga termurah, harga termahal, abjad A–Z, atau Z–A.
7. *Foto & Fallback Cerdas:* Setiap kartu dilengkapi foto mobil beresolusi tinggi dan sistem **Inline SVG Fallback** yang otomatis aktif jika koneksi gambar eksternal terganggu.
8. *Tombol Test Drive Cepat:* Tombol *"Test Drive →"* pada setiap kartu mobil akan otomatis memilih mobil tersebut di formulir dan menggulirkan halaman secara halus (*smooth scroll*).

---

## 4. Struktur Berkas Project

```text
Week6-Kelas[KELAS]-20240140211/
├── index.html        # Struktur markup semantik & penanda aksesibilitas (ARIA)
├── style.css         # Desain tampilan modern, responsif, grid sistem, & animasi
├── script.js         # Logika validasi DOM, Event Handling, Filter, & Fetch API
├── .gitignore        # Berkas pengecualian untuk pelacakan Git
└── README.md         # Dokumentasi teknis dan panduan pengujian project
```

---

## 5. Cara Menjalankan Project Secara Lokal

### Menggunakan VS Code Live Server (Sangat Direkomendasikan)
1. Buka folder project menggunakan **Visual Studio Code**:
   ```bash
   code .
   ```
2. Pastikan ekstensi **Live Server** (oleh Ritwick Dey) sudah terpasang di VS Code Anda.
3. Klik kanan pada berkas `index.html` di panel *Explorer*.
4. Pilih opsi **"Open with Live Server"** (atau tekan pintasan `Alt + L, Alt + O`).
5. Halaman web otomatis terbuka di peramban pada alamat `http://127.0.0.1:5500/index.html`.

### Menjalankan Langsung Tanpa Ekstensi
- Klik dua kali (*double click*) berkas `index.html` untuk langsung membukanya di browser modern apa pun (Google Chrome, Mozilla Firefox, Microsoft Edge).

---

## 6. Skenario Pengujian Fitur (Testing Checklist)

| No | Komponen yang Diuji | Tindakan Pengujian | Hasil yang Diharapkan |
| :---: | :--- | :--- | :--- |
| **1** | **Filter Asal Negara** | Pilih *"Tiongkok"* pada dropdown Asal Negara | Hanya 10 mobil asal Tiongkok yang tampil; dropdown Merek otomatis hanya berisi BYD, Wuling, Chery, GAC Aion, GWM, dan Neta. |
| **2** | **Filter Bahan Bakar** | Pilih *"Listrik"* pada dropdown Bahan Bakar | Hanya mobil listrik (EV) seperti BYD M6, Atto 3, Air EV, Aion Y Plus, Neta V-II, Ioniq 5, dan MG ZS EV yang tampil. |
| **3** | **Pencarian Mobil** | Ketik *"avanza"* di kotak pencarian | Hanya Toyota Avanza yang tampil di grid hasil. |
| **4** | **Pengurutan Harga** | Pilih *"Harga: Termurah"* | Mobil berharga paling terjangkau (Suzuki Carry & Honda Brio) tampil di posisi teratas. |
| **5** | **Tombol Reset Filter** | Klik tombol *"Reset Filter"* | Seluruh input pencarian dan dropdown kembali ke default; 41 mobil kembali ditampilkan. |
| **6** | **Integrasi Test Drive** | Klik tombol *"Test Drive →"* pada kartu Honda HR-V | Halaman otomatis scroll ke formulir dan dropdown *"Model Mobil Pilihan"* otomatis terpilih *"Honda HR-V"*. |
| **7** | **Validasi Form Kosong** | Klik *"Ajukan Jadwal Test Drive"* tanpa mengisi input | Seluruh field bergaris merah dan pesan error muncul di bawah masing-masing input. |
| **8** | **Validasi Real-Time** | Ketik nama yang benar pada input nama yang sedang merah | Garis merah dan teks error langsung hilang secara instan. |
| **9** | **Form Sukses & Reset** | Isi form lengkap dan klik submit | Banner hijau berisi nama dan model mobil muncul; seluruh isi formulir otomatis di-reset. |
| **10** | **Fetch API DummyJSON** | Refresh halaman atau klik *"Muat Ulang Mobil"* | Animasi skeleton loader tampil sejenak, lalu 4 kartu mobil import DummyJSON (Dodge Charger, Dodge Hornet, Dodge Durango, Chrysler Pacifica) berformat USD muncul rapi. |

---

## 7. Panduan Git & Pengunggahan ke GitHub

1. Buka terminal di VS Code (`Ctrl + ~`) dan inisialisasi Git:
   ```bash
   git init
   git add .
   git commit -m "feat: complete AutoMall project with 41 cars, filter system, DOM handling, and Fetch API"
   git branch -M main
   ```
2. Buat repository baru di [GitHub](https://github.com) dengan nama:
   `Week6-Kelas[KELAS]-20240140211`
   *(Ganti `[KELAS]` dengan kelas Anda, misalnya: `Week6-KelasA-20240140211`)*.
3. Hubungkan repository lokal dan lakukan push:
   ```bash
   git remote add origin https://github.com/USERNAME_GITHUB_ANDA/Week6-Kelas[KELAS]-20240140211.git
   git push -u origin main
   ```

---

## 8. Catatan Batasan Sistem

> [!NOTE]
> Formulir pemesanan test drive pada project ini murni merupakan **simulasi interaksi antarmuka di sisi klien (Client-Side Simulation)** menggunakan manipulasi DOM dan Event Handling JavaScript. Aplikasi ini **tidak mengirimkan atau menyimpan** data pengguna ke database backend, sesuai dengan ketentuan dan batasan materi praktikum PPAW Week 6.
