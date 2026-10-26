/**
 * ==============================================================================
 * TUGAS PRAKTIKUM PEMROGRAMAN APLIKASI WEB (PPAW) - WEEK 6
 * JavaScript DOM, Event Handling, dan Fetch API
 * Tema: AutoMall Indonesia — Marketplace Mobil Baru & Test Drive
 *
 * Nama  : Rangga Fadhilah Akbar
 * NIM   : 20240140211
 * Kelas : [KELAS]
 * ==============================================================================
 */

'use strict';

/* ==============================================================================
   1. KONFIGURASI GLOBAL (CLEAN CODE — NO MAGIC NUMBERS)
   Semua konstanta nilai, batasan, URL, regex, dan pesan terpusat di sini.
   ============================================================================== */

const CONFIG = {
  // Endpoint API DummyJSON untuk fitur Fetch API (Kategori Vehicle / Mobil)
  API_URL: 'https://dummyjson.com/products/category/vehicle',
  PRODUCT_LIMIT: 4,

  // Batasan input formulir
  MIN_NAME_LENGTH: 3,
  MIN_PHONE_DIGITS: 10,
  MAX_PHONE_DIGITS: 15,

  // Format mata uang
  CURRENCY_LOCALE_ID: 'id-ID',
  CURRENCY_CODE_IDR: 'IDR',
  CURRENCY_LOCALE_US: 'en-US',
  CURRENCY_CODE_USD: 'USD',

  // Durasi notifikasi keberhasilan (milidetik)
  AUTO_DISMISS_ALERT_MS: 6000,

  // Regex validasi email dan nomor telepon (standar Indonesia)
  EMAIL_REGEX: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
  PHONE_REGEX: /^(\+62|62|0)[0-9]{9,13}$/,

  // URL fallback gambar produk DummyJSON
  FALLBACK_PRODUCT_IMAGE: 'https://placehold.co/400x300/e2e8f0/475569?text=No+Image',

  // Gradient warna kartu mobil berdasarkan asal negara
  ORIGIN_GRADIENTS: {
    'Jepang':        { from: '#1e3a5f', to: '#2563eb' },
    'Tiongkok':      { from: '#831843', to: '#e11d48' },
    'Korea Selatan': { from: '#312e81', to: '#6366f1' },
    'Eropa':         { from: '#1e293b', to: '#475569' },
    'Amerika':       { from: '#14532d', to: '#16a34a' },
  },

  // Bendera negara asal mobil
  ORIGIN_FLAGS: {
    'Jepang':        '🇯🇵',
    'Tiongkok':      '🇨🇳',
    'Korea Selatan': '🇰🇷',
    'Eropa':         '🇪🇺',
    'Amerika':       '🇺🇸',
  },
};

/**
 * Kumpulan pesan antarmuka (UI Messages)
 */
const MESSAGES = {
  VALIDATION: {
    NAME_EMPTY:      'Nama lengkap wajib diisi.',
    NAME_TOO_SHORT:  `Nama lengkap minimal harus terdiri dari ${CONFIG.MIN_NAME_LENGTH} karakter.`,
    EMAIL_EMPTY:     'Alamat email wajib diisi.',
    EMAIL_INVALID:   'Format email tidak valid. Gunakan format seperti nama@domain.com.',
    PHONE_EMPTY:     'Nomor WhatsApp wajib diisi.',
    PHONE_INVALID:   'Nomor tidak valid. Gunakan format 08xx atau +628xx (10-14 digit).',
    CAR_EMPTY:       'Silakan pilih salah satu model mobil untuk test drive.',
  },
  FETCH: {
    LOADING:         'Sedang memuat data mobil import dari DummyJSON...',
    EMPTY:           'Tidak ada mobil import yang tersedia dari server.',
    ERROR_NETWORK:   'Koneksi internet bermasalah. Periksa jaringan Anda.',
    ERROR_GENERIC:   'Terjadi kesalahan saat memuat data mobil import dari server.',
    BTN_IDLE:        'Muat Ulang Mobil',
    BTN_LOADING:     'Memuat Data...',
  },
  CAR: {
    EMPTY_FILTER:    'Tidak ada mobil yang sesuai dengan kombinasi filter yang Anda pilih.',
    RESULT_COUNT:    (shown, total) => `Menampilkan ${shown} dari total ${total} mobil`,
  },
  FORM: {
    SUCCESS_TITLE:   'Pengajuan Test Drive Berhasil!',
    SUCCESS_BODY:    (name, car) => `Terima kasih Bapak/Ibu ${name}. Permintaan test drive unit "${car}" telah berhasil diproses secara lokal. Tim sales kami akan menghubungi Anda melalui WhatsApp.`,
  },
};

/* ==============================================================================
   2. OPSI FILTER DROPDOWN
   Seluruh opsi filter tersimpan terpusat di atas.
   ============================================================================== */

const FILTER_OPTIONS = {
  origins: ['Jepang', 'Tiongkok', 'Korea Selatan', 'Eropa', 'Amerika'],
  types:   ['SUV', 'MPV', 'Sedan', 'Hatchback', 'City Car', 'Pick-Up', 'Crossover'],
  fuels:   ['Bensin', 'Diesel', 'Listrik', 'Hybrid'],
  sorts: [
    { value: 'default',    label: 'Urutan Default' },
    { value: 'price-asc',  label: 'Harga: Termurah &rarr; Termahal' },
    { value: 'price-desc', label: 'Harga: Termahal &rarr; Termurah' },
    { value: 'name-asc',   label: 'Nama Model: A &rarr; Z' },
    { value: 'name-desc',  label: 'Nama Model: Z &rarr; A' },
  ],
};

/* ==============================================================================
   3. DATABASE MOBIL LENGKAP (41 UNIT BESERTA FOTO & SPESIFIKASI)
   Seluruh data mobil disimpan di atas, bukan di tengah atau bawah kode.
   ============================================================================== */

const CAR_DATABASE = [
  // ─── 1. MEREK ASAL JEPANG (18 Unit) ───
  {
    id: 1,
    brand: 'Toyota',
    model: 'Avanza',
    origin: 'Jepang',
    type: 'MPV',
    fuel: 'Bensin',
    price: 237000000,
    year: 2024,
    seats: 7,
    tagline: 'Mobil keluarga legendaris sebutan "mobil sejuta umat" dengan kabin lega dan efisien.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    brand: 'Toyota',
    model: 'Kijang Innova',
    origin: 'Jepang',
    type: 'MPV',
    fuel: 'Bensin',
    price: 419000000,
    year: 2024,
    seats: 7,
    tagline: 'MPV medium terlaris di Indonesia dengan kenyamanan premium dan resale value tinggi.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    brand: 'Daihatsu',
    model: 'Sigra',
    origin: 'Jepang',
    type: 'MPV',
    fuel: 'Bensin',
    price: 172000000,
    year: 2024,
    seats: 7,
    tagline: 'LCGC 7-seater paling laku di Indonesia, sangat hemat bahan bakar dan praktis.',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    brand: 'Daihatsu',
    model: 'Gran Max',
    origin: 'Jepang',
    type: 'Pick-Up',
    fuel: 'Bensin',
    price: 178000000,
    year: 2024,
    seats: 2,
    tagline: 'Kendaraan niaga handal dan tangguh untuk mendukung kelancaran segala bisnis Anda.',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    brand: 'Honda',
    model: 'Brio',
    origin: 'Jepang',
    type: 'City Car',
    fuel: 'Bensin',
    price: 167000000,
    year: 2024,
    seats: 5,
    tagline: 'LCGC/City Car konsisten terlaris dengan mesin responsif dan desain sporty kekinian.',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 6,
    brand: 'Honda',
    model: 'HR-V',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Bensin',
    price: 383000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV ringkas terpopuler dengan fitur Honda Sensing canggih dan tampilan maskulin.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    brand: 'Mitsubishi',
    model: 'Xpander',
    origin: 'Jepang',
    type: 'MPV',
    fuel: 'Bensin',
    price: 273000000,
    year: 2024,
    seats: 7,
    tagline: 'Rival utama Avanza di segmen MPV dengan suspensi empuk ala sedan dan kabin kedap.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 8,
    brand: 'Mitsubishi',
    model: 'Pajero Sport',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Diesel',
    price: 557000000,
    year: 2024,
    seats: 7,
    tagline: 'SUV ladder-frame premium diesel bertenaga badak yang sangat populer dan berwibawa.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    brand: 'Suzuki',
    model: 'Carry Pick-Up',
    origin: 'Jepang',
    type: 'Pick-Up',
    fuel: 'Bensin',
    price: 165000000,
    year: 2024,
    seats: 2,
    tagline: 'Raja niaga ringan sejati Indonesia dengan bak luas dan daya angkut legendaris.',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    brand: 'Suzuki',
    model: 'XL7',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Hybrid',
    price: 295000000,
    year: 2024,
    seats: 7,
    tagline: 'SUV keluarga berbasis Ertiga dengan teknologi Smart Hybrid hemat BBM dan ground clearance tinggi.',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 11,
    brand: 'Mazda',
    model: 'CX-5',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Bensin',
    price: 577000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV premium dengan filosofi desain Kodo serta kenikmatan berkendara Jinba-Ittai.',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 12,
    brand: 'Mazda',
    model: '2',
    origin: 'Jepang',
    type: 'Hatchback',
    fuel: 'Bensin',
    price: 328000000,
    year: 2024,
    seats: 5,
    tagline: 'Hatchback stylish berkelas dengan material interior mewah dan handling lincah.',
    image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 13,
    brand: 'Subaru',
    model: 'Forester',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Bensin',
    price: 648000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV tangguh dengan mesin Boxer dan sistem Symmetrical All-Wheel Drive khas Subaru.',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 14,
    brand: 'Lexus',
    model: 'RX',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Hybrid',
    price: 1530000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV mewah papan atas yang sangat digemari kaum jetset dengan kenyamanan akustik sempurna.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 15,
    brand: 'Nissan',
    model: 'Serena',
    origin: 'Jepang',
    type: 'MPV',
    fuel: 'Hybrid',
    price: 498000000,
    year: 2024,
    seats: 7,
    tagline: 'MPV pintu geser elektrik dengan kursi captain seat super empuk untuk kenyamanan keluarga.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 16,
    brand: 'Nissan',
    model: 'Livina',
    origin: 'Jepang',
    type: 'MPV',
    fuel: 'Bensin',
    price: 268000000,
    year: 2024,
    seats: 7,
    tagline: 'MPV elegan saudara kembar Xpander dengan grille khas V-Motion dan kabin lapang.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 17,
    brand: 'Isuzu',
    model: 'Traga',
    origin: 'Jepang',
    type: 'Pick-Up',
    fuel: 'Diesel',
    price: 243000000,
    year: 2024,
    seats: 3,
    tagline: 'Medium pick-up diesel terlaris dengan bak ekstra lega untuk angkutan beban berat bisnis.',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 18,
    brand: 'Isuzu',
    model: 'MU-X',
    origin: 'Jepang',
    type: 'SUV',
    fuel: 'Diesel',
    price: 527000000,
    year: 2024,
    seats: 7,
    tagline: 'SUV bermesin diesel tangguh berstandar Euro 4, siap melibas segala medan tambang maupun kota.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 2. MEREK ASAL TIONGKOK (10 Unit) ───
  {
    id: 19,
    brand: 'BYD',
    model: 'M6',
    origin: 'Tiongkok',
    type: 'MPV',
    fuel: 'Listrik',
    price: 379000000,
    year: 2024,
    seats: 7,
    tagline: 'MPV listrik 7-seater pertama di Indonesia yang langsung laris manis memikat pasar keluarga.',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 20,
    brand: 'BYD',
    model: 'Atto 3',
    origin: 'Tiongkok',
    type: 'SUV',
    fuel: 'Listrik',
    price: 519000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV listrik murni dengan Blade Battery aman, jarak tempuh hingga 480 km dan kabin futuristik.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 21,
    brand: 'Wuling',
    model: 'Air EV',
    origin: 'Tiongkok',
    type: 'City Car',
    fuel: 'Listrik',
    price: 238000000,
    year: 2024,
    seats: 4,
    tagline: 'Mobil listrik mini pionir di Indonesia, mudah bermanuver dan praktis untuk mobilitas kota.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 22,
    brand: 'Wuling',
    model: 'Almaz',
    origin: 'Tiongkok',
    type: 'SUV',
    fuel: 'Bensin',
    price: 347000000,
    year: 2024,
    seats: 7,
    tagline: 'SUV kaya fitur dengan voice command berbahasa Indonesia (WIND) dan panoramic sunroof.',
    image: 'https://images.unsplash.com/photo-1542362567-b07e53578357?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 23,
    brand: 'Chery',
    model: 'Omoda 5',
    origin: 'Tiongkok',
    type: 'SUV',
    fuel: 'Bensin',
    price: 339000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV crossover futuristik dengan desain avant-garde yang sangat diminati kawula muda.',
    image: 'https://images.unsplash.com/photo-1570733577526-2a83e01bc61a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 24,
    brand: 'Chery',
    model: 'Tiggo 7 Pro',
    origin: 'Tiongkok',
    type: 'SUV',
    fuel: 'Bensin',
    price: 397000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV premium keluarga dengan material interior berkelas dan paket keselamatan ADAS lengkap.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 25,
    brand: 'GAC Aion',
    model: 'Y Plus',
    origin: 'Tiongkok',
    type: 'Crossover',
    fuel: 'Listrik',
    price: 418000000,
    year: 2024,
    seats: 5,
    tagline: 'Crossover listrik inovatif dengan ruang kabin super lega layaknya ruang keluarga berjalan.',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 26,
    brand: 'GWM',
    model: 'Haval H6',
    origin: 'Tiongkok',
    type: 'SUV',
    fuel: 'Hybrid',
    price: 469000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV hybrid bertenaga tinggi dengan kombinasi performa garang dan efisiensi optimal.',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 27,
    brand: 'GWM',
    model: 'Tank 500',
    origin: 'Tiongkok',
    type: 'SUV',
    fuel: 'Hybrid',
    price: 847000000,
    year: 2024,
    seats: 7,
    tagline: 'SUV off-road mewah berbadan besar dengan sistem 4WD pintar dan interior ultra-luxury.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 28,
    brand: 'Neta',
    model: 'V-II',
    origin: 'Tiongkok',
    type: 'City Car',
    fuel: 'Listrik',
    price: 249000000,
    year: 2024,
    seats: 5,
    tagline: 'Mobil listrik perkotaan berharga terjangkau dengan fitur Smart Driving V2L praktis.',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 3. MEREK ASAL KOREA SELATAN (4 Unit) ───
  {
    id: 29,
    brand: 'Hyundai',
    model: 'Creta',
    origin: 'Korea Selatan',
    type: 'SUV',
    fuel: 'Bensin',
    price: 308000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV kompak rakitan lokal Cikarang dengan Hyundai Bluelink dan desain Parametric Jewel.',
    image: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 30,
    brand: 'Hyundai',
    model: 'Ioniq 5',
    origin: 'Korea Selatan',
    type: 'SUV',
    fuel: 'Listrik',
    price: 748000000,
    year: 2024,
    seats: 5,
    tagline: 'Mobil listrik murni futuristik pertama dirakit di Indonesia dengan platform E-GMP terdepan.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 31,
    brand: 'Kia',
    model: 'Sonet',
    origin: 'Korea Selatan',
    type: 'SUV',
    fuel: 'Bensin',
    price: 237000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV kompak dinamis dengan sistem audio Bose dan ventilated seats yang memanjakan.',
    image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 32,
    brand: 'Kia',
    model: 'Carnival',
    origin: 'Korea Selatan',
    type: 'MPV',
    fuel: 'Diesel',
    price: 797000000,
    year: 2024,
    seats: 7,
    tagline: 'MPV besar mewah (Grand Utility Vehicle) dengan kenyamanan setara kabin pesawat first-class.',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 4. MEREK ASAL EROPA (8 Unit) ───
  {
    id: 33,
    brand: 'BMW',
    model: 'Seri 3',
    origin: 'Eropa',
    type: 'Sedan',
    fuel: 'Bensin',
    price: 895000000,
    year: 2024,
    seats: 5,
    tagline: 'Sedan mewah paling ikonik di dunia dengan distribusi bobot sempurna 50:50 khas Munich.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 34,
    brand: 'BMW',
    model: 'X1',
    origin: 'Eropa',
    type: 'SUV',
    fuel: 'Bensin',
    price: 849000000,
    year: 2024,
    seats: 5,
    tagline: 'SAV (Sports Activity Vehicle) premium terlaris dengan kabin digital BMW Curved Display.',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 35,
    brand: 'Mercedes-Benz',
    model: 'C-Class',
    origin: 'Eropa',
    type: 'Sedan',
    fuel: 'Bensin',
    price: 879000000,
    year: 2024,
    seats: 5,
    tagline: 'Sedan eksekutif terpopuler dengan interior digital MBUX layaknya mini S-Class.',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 36,
    brand: 'Mercedes-Benz',
    model: 'GLC',
    origin: 'Eropa',
    type: 'SUV',
    fuel: 'Bensin',
    price: 1048000000,
    year: 2024,
    seats: 5,
    tagline: 'Crossover premium terlaris bintang tiga yang memadukan keanggunan dan kemampuan off-road.',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 37,
    brand: 'MG',
    model: 'ZS EV',
    origin: 'Eropa',
    type: 'SUV',
    fuel: 'Listrik',
    price: 468000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV listrik ringkas berjiwa British sport heritage dengan efisiensi baterai tinggi.',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 38,
    brand: 'Volkswagen',
    model: 'Golf',
    origin: 'Eropa',
    type: 'Hatchback',
    fuel: 'Bensin',
    price: 648000000,
    year: 2024,
    seats: 5,
    tagline: 'Hatchback legendaris Jerman dengan pengendalian presisi dan transmisi DSG responsif.',
    image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 39,
    brand: 'Volkswagen',
    model: 'Tiguan',
    origin: 'Eropa',
    type: 'SUV',
    fuel: 'Bensin',
    price: 697000000,
    year: 2024,
    seats: 7,
    tagline: 'SUV keluarga 7-seater tangguh dari Wolfsburg dengan kenyamanan berkendara khas Eropa.',
    image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 40,
    brand: 'Porsche',
    model: 'Macan',
    origin: 'Eropa',
    type: 'SUV',
    fuel: 'Bensin',
    price: 1395000000,
    year: 2024,
    seats: 5,
    tagline: 'SUV premium berperforma tinggi dari Stuttgart dengan DNA mobil sport sejati.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
  },

  // ─── 5. MEREK ASAL AMERIKA (1 Unit) ───
  {
    id: 41,
    brand: 'Jeep',
    model: 'Wrangler Rubicon',
    origin: 'Amerika',
    type: 'SUV',
    fuel: 'Bensin',
    price: 1589000000,
    year: 2024,
    seats: 5,
    tagline: 'Mobil off-road tangguh kasta tertinggi dengan kapabilitas Trail Rated legendaris.',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
  },
];

/* ==============================================================================
   4. CACHE ELEMEN DOM
   ============================================================================== */

const DOM = {
  // Komponen Filter Katalog Mobil
  filterSearch:    document.getElementById('filter-search'),
  filterOrigin:    document.getElementById('filter-origin'),
  filterBrand:     document.getElementById('filter-brand'),
  filterType:      document.getElementById('filter-type'),
  filterFuel:      document.getElementById('filter-fuel'),
  filterSort:      document.getElementById('filter-sort'),
  btnResetFilters: document.getElementById('btn-reset-filters'),
  carResultsCount: document.getElementById('car-results-count'),
  carGrid:         document.getElementById('car-grid'),

  // Komponen DummyJSON Fetch API
  btnRefresh:       document.getElementById('btn-refresh-products'),
  refreshBtnText:   document.getElementById('refresh-button-text'),
  refreshIcon:      document.querySelector('.btn-refresh-icon'),
  productGrid:      document.getElementById('product-grid'),
  productAnnouncer: document.getElementById('product-announcer'),

  // Komponen Formulir Test Drive
  form:               document.getElementById('test-drive-form'),
  nameInput:          document.getElementById('full-name'),
  nameError:          document.getElementById('full-name-error'),
  emailInput:         document.getElementById('email-address'),
  emailError:         document.getElementById('email-error'),
  phoneInput:         document.getElementById('whatsapp-number'),
  phoneError:         document.getElementById('whatsapp-error'),
  carSelect:          document.getElementById('car-select'),
  carSelectError:     document.getElementById('car-select-error'),
  formSuccessBanner:  document.getElementById('form-success-banner'),
  successTitle:       document.getElementById('success-banner-title'),
  successMessage:     document.getElementById('success-banner-message'),
  btnCloseSuccess:    document.getElementById('btn-close-success'),
};

/* ==============================================================================
   5. STATE APLIKASI
   ============================================================================== */

const appState = {
  isFetchingProducts: false,
  alertTimeoutId: null,
};

/* ==============================================================================
   6. FUNGSI UTILITAS FORMATTER & FALLBACK SVG
   ============================================================================== */

/**
 * Format angka ke mata uang Rupiah (IDR).
 * @param {number} amount - Nilai angka.
 * @returns {string} String format Rupiah, contoh: "Rp237.000.000".
 */
function formatRupiah(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Rp0';
  }
  return new Intl.NumberFormat(CONFIG.CURRENCY_LOCALE_ID, {
    style: 'currency',
    currency: CONFIG.CURRENCY_CODE_IDR,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka ke mata uang USD ($).
 * @param {number} amount - Nilai angka.
 * @returns {string} String format USD, contoh: "$9.99".
 */
function formatUSD(amount) {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }
  return new Intl.NumberFormat(CONFIG.CURRENCY_LOCALE_US, {
    style: 'currency',
    currency: CONFIG.CURRENCY_CODE_USD,
  }).format(amount);
}

/**
 * Buat gambar SVG vektor cadangan secara dinamis jika koneksi gambar eksternal gagal.
 * @param {string} brand - Merek mobil.
 * @param {string} model - Model mobil.
 * @param {string} origin - Asal negara.
 * @param {string} type - Tipe bodi mobil.
 * @returns {string} Data URI SVG.
 */
function getCarFallbackSVG(brand, model, origin, type) {
  const gradient = CONFIG.ORIGIN_GRADIENTS[origin] || { from: '#1e293b', to: '#334155' };
  const flag = CONFIG.ORIGIN_FLAGS[origin] || '🚗';

  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" width="400" height="240">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradient.from}"/>
          <stop offset="100%" stop-color="${gradient.to}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bgGrad)"/>
      <g opacity="0.12" fill="#ffffff">
        <circle cx="50" cy="40" r="75"/>
        <circle cx="360" cy="200" r="90"/>
      </g>
      <!-- Siluet Vektor Mobil -->
      <path d="M70,140 Q90,110 130,105 L230,105 Q270,105 295,125 L320,135 Q340,140 340,155 L340,165 Q340,170 330,170 L305,170 Q300,150 280,150 Q260,150 255,170 L145,170 Q140,150 120,150 Q100,150 95,170 L70,170 Q60,170 60,160 L60,150 Q60,140 70,140 Z" fill="#ffffff" opacity="0.9"/>
      <circle cx="120" cy="170" r="16" fill="#1e293b" stroke="#ffffff" stroke-width="4"/>
      <circle cx="280" cy="170" r="16" fill="#1e293b" stroke="#ffffff" stroke-width="4"/>
      <path d="M140,112 L225,112 L225,135 L125,135 Q132,120 140,112 Z" fill="#1e293b" opacity="0.6"/>
      <path d="M233,112 L265,112 Q282,125 290,135 L233,135 Z" fill="#1e293b" opacity="0.6"/>
      <!-- Teks Badge & Identitas -->
      <text x="20" y="32" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ffffff" opacity="0.9">${flag} ${origin.toUpperCase()} &bull; ${type}</text>
      <text x="200" y="215" font-family="system-ui, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">${brand} ${model}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}

/**
 * Umumkan pesan status ke pembaca layar (screen reader) secara dinamis.
 * @param {string} message - Pesan.
 */
function announceToScreenReader(message) {
  if (DOM.productAnnouncer) {
    DOM.productAnnouncer.textContent = message;
  }
}

/* ==============================================================================
   7. KATALOG MOBIL — POPULASI DROPDOWN & FILTER (DOM MANIPULATION)
   ============================================================================== */

/**
 * Isi opsi seluruh dropdown filter dari data FILTER_OPTIONS.
 */
function populateFilterDropdowns() {
  // Asal Negara
  FILTER_OPTIONS.origins.forEach((origin) => {
    const opt = document.createElement('option');
    opt.value = origin;
    opt.textContent = `${CONFIG.ORIGIN_FLAGS[origin] || '🌍'} ${origin}`;
    DOM.filterOrigin.appendChild(opt);
  });

  // Tipe Bodi
  FILTER_OPTIONS.types.forEach((type) => {
    const opt = document.createElement('option');
    opt.value = type;
    opt.textContent = type;
    DOM.filterType.appendChild(opt);
  });

  // Bahan Bakar
  FILTER_OPTIONS.fuels.forEach((fuel) => {
    const opt = document.createElement('option');
    opt.value = fuel;
    opt.textContent = fuel;
    DOM.filterFuel.appendChild(opt);
  });

  // Urutan Pengurutan
  FILTER_OPTIONS.sorts.forEach((sort) => {
    const opt = document.createElement('option');
    opt.value = sort.value;
    opt.innerHTML = sort.label;
    DOM.filterSort.appendChild(opt);
  });

  // Merek
  populateBrandOptions('');

  // Dropdown Pilihan Mobil pada Formulir Test Drive
  populateCarSelectOptions();
}

/**
 * Perbarui opsi dropdown merek mobil berdasarkan negara asal yang dipilih.
 * @param {string} selectedOrigin - Nama negara asal (kosong = semua).
 */
function populateBrandOptions(selectedOrigin) {
  const previousValue = DOM.filterBrand.value;

  DOM.filterBrand.innerHTML = '';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = 'Semua Merek';
  DOM.filterBrand.appendChild(defaultOpt);

  const filteredCars = selectedOrigin
    ? CAR_DATABASE.filter((car) => car.origin === selectedOrigin)
    : CAR_DATABASE;

  const uniqueBrands = [...new Set(filteredCars.map((car) => car.brand))].sort();

  uniqueBrands.forEach((brand) => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    DOM.filterBrand.appendChild(opt);
  });

  if (uniqueBrands.includes(previousValue)) {
    DOM.filterBrand.value = previousValue;
  } else {
    DOM.filterBrand.value = '';
  }
}

/**
 * Mengisi dropdown pilihan mobil pada Formulir Test Drive dari CAR_DATABASE.
 */
function populateCarSelectOptions() {
  if (!DOM.carSelect) return;

  DOM.carSelect.innerHTML = '';
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '-- Pilih Mobil untuk Test Drive --';
  DOM.carSelect.appendChild(defaultOption);

  CAR_DATABASE.forEach((car) => {
    const opt = document.createElement('option');
    opt.value = `${car.brand} ${car.model}`;
    opt.textContent = `${car.brand} ${car.model} (${car.type} - ${formatRupiah(car.price)})`;
    DOM.carSelect.appendChild(opt);
  });
}

/**
 * Ambil daftar mobil yang lolos dari seluruh filter aktif.
 * @returns {Array<Object>} Daftar mobil tersaring.
 */
function getFilteredCars() {
  const searchTerm   = DOM.filterSearch.value.trim().toLowerCase();
  const originFilter = DOM.filterOrigin.value;
  const brandFilter  = DOM.filterBrand.value;
  const typeFilter   = DOM.filterType.value;
  const fuelFilter   = DOM.filterFuel.value;

  return CAR_DATABASE.filter((car) => {
    const fullName = `${car.brand} ${car.model}`.toLowerCase();
    const matchesSearch = !searchTerm
      || fullName.includes(searchTerm)
      || car.tagline.toLowerCase().includes(searchTerm)
      || car.type.toLowerCase().includes(searchTerm);
    const matchesOrigin = !originFilter || car.origin === originFilter;
    const matchesBrand  = !brandFilter  || car.brand  === brandFilter;
    const matchesType   = !typeFilter   || car.type   === typeFilter;
    const matchesFuel   = !fuelFilter   || car.fuel   === fuelFilter;

    return matchesSearch && matchesOrigin && matchesBrand && matchesType && matchesFuel;
  });
}

/**
 * Terapkan pengurutan (sorting) data mobil.
 * @param {Array<Object>} cars - Koleksi mobil.
 * @returns {Array<Object>} Koleksi mobil terurut.
 */
function applySortOrder(cars) {
  const sortValue = DOM.filterSort.value;
  const sorted = [...cars];

  switch (sortValue) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      sorted.sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
      break;
    case 'name-desc':
      sorted.sort((a, b) => `${b.brand} ${b.model}`.localeCompare(`${a.brand} ${a.model}`));
      break;
    default:
      // Urutan ID default
      sorted.sort((a, b) => a.id - b.id);
      break;
  }
  return sorted;
}

/**
 * Hubungkan kartu mobil ke formulir test drive.
 * Memilih mobil di dropdown form, men-scroll ke section form, dan memfokuskan input.
 * @param {Object} car - Data mobil terpilih.
 */
function selectCarForTestDrive(car) {
  const carName = `${car.brand} ${car.model}`;

  if (DOM.carSelect) {
    DOM.carSelect.value = carName;
    setFieldState(DOM.carSelect, DOM.carSelectError, { isValid: true, message: '' });
  }

  const formSection = document.getElementById('form-section');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      if (DOM.nameInput) DOM.nameInput.focus();
    }, 400);
  }
}

/**
 * Membuat satu kartu mobil lengkap dengan gambar dan tombol interaktif menggunakan DOM Manipulation aman.
 * @param {Object} car - Objek mobil.
 * @returns {HTMLElement} Elemen kartu artikel mobil.
 */
function createCarCardElement(car) {
  const card = document.createElement('article');
  card.className = 'car-card';

  // 1. Gambar Mobil & Badges
  const imageContainer = document.createElement('div');
  imageContainer.className = 'car-image-container';

  const img = document.createElement('img');
  img.className = 'car-image';
  img.src = car.image;
  img.alt = `Mobil ${car.brand} ${car.model}`;
  img.loading = 'lazy';

  // Fallback gambar aman jika gagal dimuat
  img.addEventListener('error', function onImageError() {
    this.removeEventListener('error', onImageError);
    this.src = getCarFallbackSVG(car.brand, car.model, car.origin, car.type);
  });

  // Badge Asal Negara
  const originBadge = document.createElement('span');
  originBadge.className = 'car-badge-origin';
  originBadge.textContent = `${CONFIG.ORIGIN_FLAGS[car.origin] || '🌍'} ${car.origin}`;

  // Badge Tahun
  const yearBadge = document.createElement('span');
  yearBadge.className = 'car-badge-year';
  yearBadge.textContent = car.year;

  imageContainer.appendChild(img);
  imageContainer.appendChild(originBadge);
  imageContainer.appendChild(yearBadge);

  // 2. Body Kartu Mobil
  const body = document.createElement('div');
  body.className = 'car-card-body';

  const brandEl = document.createElement('span');
  brandEl.className = 'car-brand';
  brandEl.textContent = car.brand;

  const modelEl = document.createElement('h3');
  modelEl.className = 'car-model';
  modelEl.textContent = car.model;

  const taglineEl = document.createElement('p');
  taglineEl.className = 'car-tagline';
  taglineEl.textContent = car.tagline;

  // 3. Badges Spesifikasi
  const badgesContainer = document.createElement('div');
  badgesContainer.className = 'car-badges';

  const typeBadge = document.createElement('span');
  typeBadge.className = 'badge badge-type';
  typeBadge.textContent = car.type;

  const fuelBadge = document.createElement('span');
  let fuelClass = 'badge-fuel';
  if (car.fuel === 'Listrik') fuelClass = 'badge-fuel-electric';
  else if (car.fuel === 'Hybrid') fuelClass = 'badge-fuel-hybrid';
  else if (car.fuel === 'Diesel') fuelClass = 'badge-fuel-diesel';
  fuelBadge.className = `badge ${fuelClass}`;
  fuelBadge.textContent = car.fuel;

  const seatsBadge = document.createElement('span');
  seatsBadge.className = 'badge badge-seats';
  seatsBadge.textContent = `${car.seats} Kursi`;

  badgesContainer.appendChild(typeBadge);
  badgesContainer.appendChild(fuelBadge);
  badgesContainer.appendChild(seatsBadge);

  // 4. Footer Kartu (Harga & Tombol Test Drive)
  const footer = document.createElement('div');
  footer.className = 'car-card-footer';

  const priceBox = document.createElement('div');
  priceBox.className = 'price-box';

  const priceLabel = document.createElement('span');
  priceLabel.className = 'price-label';
  priceLabel.textContent = 'Mulai Dari';

  const priceValue = document.createElement('span');
  priceValue.className = 'car-price';
  priceValue.textContent = formatRupiah(car.price);

  priceBox.appendChild(priceLabel);
  priceBox.appendChild(priceValue);

  const testDriveBtn = document.createElement('button');
  testDriveBtn.type = 'button';
  testDriveBtn.className = 'btn-card-action';
  testDriveBtn.textContent = 'Test Drive →';
  testDriveBtn.setAttribute('aria-label', `Pesan Test Drive untuk ${car.brand} ${car.model}`);
  testDriveBtn.addEventListener('click', () => {
    selectCarForTestDrive(car);
  });

  footer.appendChild(priceBox);
  footer.appendChild(testDriveBtn);

  // Rakit kartu
  body.appendChild(brandEl);
  body.appendChild(modelEl);
  body.appendChild(taglineEl);
  body.appendChild(badgesContainer);
  body.appendChild(footer);

  card.appendChild(imageContainer);
  card.appendChild(body);

  return card;
}

/**
 * Tampilkan pesan jika hasil filter kosong.
 */
function renderCarEmptyState() {
  DOM.carGrid.innerHTML = '';

  const box = document.createElement('div');
  box.className = 'state-message-box';

  const icon = document.createElement('div');
  icon.className = 'state-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '🔍';

  const title = document.createElement('h3');
  title.className = 'state-title';
  title.textContent = 'Mobil Tidak Ditemukan';

  const desc = document.createElement('p');
  desc.className = 'state-description';
  desc.textContent = MESSAGES.CAR.EMPTY_FILTER;

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.className = 'btn btn-primary';
  resetBtn.textContent = 'Reset Semua Filter';
  resetBtn.addEventListener('click', resetAllFilters);

  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(desc);
  box.appendChild(resetBtn);

  DOM.carGrid.appendChild(box);
}

/**
 * Render ulang seluruh kartu mobil ke grid berdasarkan filter yang aktif.
 */
function renderCarCatalog() {
  const filtered = getFilteredCars();
  const sorted   = applySortOrder(filtered);

  // Perbarui counter hasil
  DOM.carResultsCount.textContent = MESSAGES.CAR.RESULT_COUNT(sorted.length, CAR_DATABASE.length);

  if (sorted.length === 0) {
    renderCarEmptyState();
    return;
  }

  DOM.carGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  sorted.forEach((car) => {
    fragment.appendChild(createCarCardElement(car));
  });

  DOM.carGrid.appendChild(fragment);
}

/**
 * Reset seluruh filter ke kondisi default.
 */
function resetAllFilters() {
  DOM.filterSearch.value = '';
  DOM.filterOrigin.value = '';
  DOM.filterType.value   = '';
  DOM.filterFuel.value   = '';
  DOM.filterSort.value   = 'default';
  populateBrandOptions('');
  DOM.filterBrand.value = '';
  renderCarCatalog();
}

/* ==============================================================================
   8. FETCH API — PRODUK DUMMYJSON (ASYNC / AWAIT)
   ============================================================================== */

/**
 * Render kartu skeleton loader selama request Fetch berlangsung.
 * @param {number} count - Jumlah kartu skeleton.
 */
function renderProductSkeletons(count) {
  DOM.productGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'skeleton-card';
    card.setAttribute('aria-hidden', 'true');

    const media = document.createElement('div');
    media.className = 'skeleton-media shimmer';

    const content = document.createElement('div');
    content.className = 'skeleton-content';

    const line1 = document.createElement('div');
    line1.className = 'skeleton-line line-short shimmer';
    const line2 = document.createElement('div');
    line2.className = 'skeleton-line line-title shimmer';
    const line3 = document.createElement('div');
    line3.className = 'skeleton-line line-price shimmer';

    content.appendChild(line1);
    content.appendChild(line2);
    content.appendChild(line3);

    card.appendChild(media);
    card.appendChild(content);

    fragment.appendChild(card);
  }

  DOM.productGrid.appendChild(fragment);
}

/**
 * Buat kartu mobil import DummyJSON menggunakan DOM aman.
 * @param {Object} product - Data objek produk mobil dari DummyJSON.
 * @returns {HTMLElement} Elemen kartu produk mobil import.
 */
function createProductCardElement(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  // 1. Gambar Mobil & Badges
  const imgContainer = document.createElement('div');
  imgContainer.className = 'product-image-container';

  const img = document.createElement('img');
  img.className = 'product-image';
  img.src = product.thumbnail || CONFIG.FALLBACK_PRODUCT_IMAGE;
  img.alt = product.title ? `Foto ${product.title}` : 'Foto mobil import';
  img.loading = 'lazy';
  img.addEventListener('error', function onProductImgError() {
    this.removeEventListener('error', onProductImgError);
    this.src = getCarFallbackSVG(product.brand || 'Dodge', product.title || 'Vehicle', 'Amerika', 'Sedan');
  });

  const catBadge = document.createElement('span');
  catBadge.className = 'product-category-badge';
  catBadge.textContent = 'Mobil Import (CBU)';

  const ratingBadge = document.createElement('span');
  ratingBadge.className = 'product-rating-badge';
  const ratingVal = typeof product.rating === 'number' ? product.rating.toFixed(1) : '4.7';
  ratingBadge.textContent = `★ ${ratingVal}`;

  imgContainer.appendChild(img);
  imgContainer.appendChild(catBadge);
  imgContainer.appendChild(ratingBadge);

  // 2. Body Kartu Mobil
  const body = document.createElement('div');
  body.className = 'product-body';

  const brandEl = document.createElement('span');
  brandEl.className = 'product-brand';
  brandEl.textContent = (product.brand || 'Import Car').toUpperCase();

  const title = document.createElement('h3');
  title.className = 'product-title';
  title.textContent = product.title || 'Mobil Import';

  const desc = document.createElement('p');
  desc.className = 'product-description';
  desc.textContent = product.description || 'Unit kendaraan internasional CBU dengan performa mesin dan kenyamanan tingkat tinggi.';

  // 3. Footer (Harga USD & Tombol Pesan/Test Drive)
  const footer = document.createElement('div');
  footer.className = 'product-footer';

  const priceBox = document.createElement('div');
  priceBox.className = 'price-box';

  const priceLabel = document.createElement('span');
  priceLabel.className = 'price-label';
  priceLabel.textContent = 'Harga (MSRP USD)';

  const price = document.createElement('span');
  price.className = 'product-price';
  price.textContent = formatUSD(product.price);

  priceBox.appendChild(priceLabel);
  priceBox.appendChild(price);

  const actionBtn = document.createElement('button');
  actionBtn.type = 'button';
  actionBtn.className = 'btn-card-action';
  actionBtn.textContent = 'Pesan Import →';
  actionBtn.setAttribute('aria-label', `Pesan unit import ${product.title}`);
  actionBtn.addEventListener('click', () => {
    const carName = `${product.brand ? product.brand + ' ' : ''}${product.title}`;
    if (DOM.carSelect) {
      let match = Array.from(DOM.carSelect.options).find((o) => o.value.toLowerCase().includes(product.title.toLowerCase()));
      if (!match) {
        const customOpt = document.createElement('option');
        customOpt.value = carName;
        customOpt.textContent = `[Import] ${carName} (${formatUSD(product.price)})`;
        DOM.carSelect.appendChild(customOpt);
        DOM.carSelect.value = carName;
      } else {
        DOM.carSelect.value = match.value;
      }
      setFieldState(DOM.carSelect, DOM.carSelectError, { isValid: true, message: '' });
    }
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        if (DOM.nameInput) DOM.nameInput.focus();
      }, 400);
    }
  });

  footer.appendChild(priceBox);
  footer.appendChild(actionBtn);

  body.appendChild(brandEl);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(footer);

  card.appendChild(imgContainer);
  card.appendChild(body);

  return card;
}

/**
 * Render produk DummyJSON ke grid.
 * @param {Array<Object>} products - Koleksi produk.
 */
function renderProducts(products) {
  DOM.productGrid.innerHTML = '';
  const fragment = document.createDocumentFragment();

  products.forEach((p) => {
    fragment.appendChild(createProductCardElement(p));
  });

  DOM.productGrid.appendChild(fragment);
}

/**
 * Tampilkan pesan error saat pengambilan data API gagal.
 * @param {string} message - Pesan error.
 */
function renderProductErrorState(message) {
  DOM.productGrid.innerHTML = '';

  const box = document.createElement('div');
  box.className = 'state-message-box state-box-error';

  const icon = document.createElement('div');
  icon.className = 'state-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '⚠️';

  const title = document.createElement('h3');
  title.className = 'state-title';
  title.textContent = 'Gagal Memuat Produk';

  const desc = document.createElement('p');
  desc.className = 'state-description';
  desc.textContent = message;

  const retryBtn = document.createElement('button');
  retryBtn.type = 'button';
  retryBtn.className = 'btn btn-primary';
  retryBtn.textContent = 'Coba Muat Ulang';
  retryBtn.addEventListener('click', fetchProducts);

  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(desc);
  box.appendChild(retryBtn);

  DOM.productGrid.appendChild(box);
}

/**
 * Tampilkan pesan jika respons API kosong.
 */
function renderProductEmptyState() {
  DOM.productGrid.innerHTML = '';

  const box = document.createElement('div');
  box.className = 'state-message-box';

  const icon = document.createElement('div');
  icon.className = 'state-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '📦';

  const title = document.createElement('h3');
  title.className = 'state-title';
  title.textContent = 'Belum Ada Produk';

  const desc = document.createElement('p');
  desc.className = 'state-description';
  desc.textContent = MESSAGES.FETCH.EMPTY;

  box.appendChild(icon);
  box.appendChild(title);
  box.appendChild(desc);

  DOM.productGrid.appendChild(box);
}

/**
 * Atur status visual loading pada tombol refresh produk.
 * @param {boolean} isLoading - Apakah sedang proses memuat.
 */
function setRefreshLoadingState(isLoading) {
  DOM.btnRefresh.disabled = isLoading;

  if (isLoading) {
    DOM.refreshIcon.classList.add('is-spinning');
    DOM.refreshBtnText.textContent = MESSAGES.FETCH.BTN_LOADING;
    DOM.productGrid.setAttribute('aria-busy', 'true');
  } else {
    DOM.refreshIcon.classList.remove('is-spinning');
    DOM.refreshBtnText.textContent = MESSAGES.FETCH.BTN_IDLE;
    DOM.productGrid.setAttribute('aria-busy', 'false');
  }
}

/**
 * Mengambil data produk dari API DummyJSON secara asynchronous menggunakan Fetch API.
 * Menerapkan proteksi request ganda, pemeriksaan response.ok, serta blok try...catch...finally.
 */
async function fetchProducts() {
  if (appState.isFetchingProducts) {
    return;
  }

  try {
    appState.isFetchingProducts = true;
    setRefreshLoadingState(true);
    renderProductSkeletons(CONFIG.PRODUCT_LIMIT);
    announceToScreenReader(MESSAGES.FETCH.LOADING);

    const response = await fetch(CONFIG.API_URL);

    if (!response.ok) {
      throw new Error(`Permintaan API gagal dengan status HTTP ${response.status} (${response.statusText || 'Server Error'}).`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.products)) {
      throw new Error('Format data produk yang diterima dari server tidak valid.');
    }

    if (data.products.length === 0) {
      renderProductEmptyState();
      announceToScreenReader(MESSAGES.FETCH.EMPTY);
      return;
    }

    renderProducts(data.products);
    announceToScreenReader(`Berhasil memuat ${data.products.length} produk dari DummyJSON.`);
  } catch (error) {
    const errorDetail = navigator.onLine === false
      ? MESSAGES.FETCH.ERROR_NETWORK
      : (error.message || MESSAGES.FETCH.ERROR_GENERIC);

    renderProductErrorState(errorDetail);
    announceToScreenReader(errorDetail);
  } finally {
    appState.isFetchingProducts = false;
    setRefreshLoadingState(false);
  }
}

/* ==============================================================================
   9. FORMULIR TEST DRIVE — VALIDASI & EVENT HANDLING (DOM)
   ============================================================================== */

/**
 * Validasi input nama lengkap.
 * @param {string} value - String nama.
 * @returns {{ isValid: boolean, message: string }}
 */
function validateName(value) {
  const trimmed = (value || '').trim();
  if (trimmed.length === 0) {
    return { isValid: false, message: MESSAGES.VALIDATION.NAME_EMPTY };
  }
  if (trimmed.length < CONFIG.MIN_NAME_LENGTH) {
    return { isValid: false, message: MESSAGES.VALIDATION.NAME_TOO_SHORT };
  }
  return { isValid: true, message: '' };
}

/**
 * Validasi alamat email.
 * @param {string} value - String email.
 * @returns {{ isValid: boolean, message: string }}
 */
function validateEmail(value) {
  const trimmed = (value || '').trim();
  if (trimmed.length === 0) {
    return { isValid: false, message: MESSAGES.VALIDATION.EMAIL_EMPTY };
  }
  if (!CONFIG.EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, message: MESSAGES.VALIDATION.EMAIL_INVALID };
  }
  return { isValid: true, message: '' };
}

/**
 * Validasi nomor WhatsApp.
 * @param {string} value - String telepon.
 * @returns {{ isValid: boolean, message: string }}
 */
function validatePhone(value) {
  const cleaned = (value || '').replace(/[\s\-().]/g, '');
  if (cleaned.length === 0) {
    return { isValid: false, message: MESSAGES.VALIDATION.PHONE_EMPTY };
  }
  if (!CONFIG.PHONE_REGEX.test(cleaned)) {
    return { isValid: false, message: MESSAGES.VALIDATION.PHONE_INVALID };
  }
  return { isValid: true, message: '' };
}

/**
 * Validasi pilihan model mobil.
 * @param {string} value - Nilai pilihan mobil.
 * @returns {{ isValid: boolean, message: string }}
 */
function validateCarSelection(value) {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: MESSAGES.VALIDATION.CAR_EMPTY };
  }
  return { isValid: true, message: '' };
}

/**
 * Terapkan status visual valid atau invalid pada elemen input/select.
 * @param {HTMLElement} inputEl - Elemen input/select.
 * @param {HTMLElement} errorEl - Elemen paragraf pesan error.
 * @param {{ isValid: boolean, message: string }} result - Hasil validasi.
 */
function setFieldState(inputEl, errorEl, result) {
  if (result.isValid) {
    inputEl.classList.remove('is-invalid');
    inputEl.classList.add('is-valid');
    inputEl.setAttribute('aria-invalid', 'false');
    errorEl.textContent = '';
  } else {
    inputEl.classList.remove('is-valid');
    inputEl.classList.add('is-invalid');
    inputEl.setAttribute('aria-invalid', 'true');
    errorEl.textContent = result.message;
  }
}

/**
 * Bersihkan penanda visual dari elemen input.
 * @param {HTMLElement} inputEl - Elemen input/select.
 * @param {HTMLElement} errorEl - Elemen pesan error.
 */
function clearFieldState(inputEl, errorEl) {
  inputEl.classList.remove('is-valid', 'is-invalid');
  inputEl.removeAttribute('aria-invalid');
  errorEl.textContent = '';
}

/**
 * Tampilkan banner pesan sukses pemesanan test drive.
 * @param {string} name - Nama pemesan.
 * @param {string} car - Model mobil pilihan.
 */
function showSuccessBanner(name, car) {
  if (!DOM.formSuccessBanner) return;

  if (appState.alertTimeoutId) {
    clearTimeout(appState.alertTimeoutId);
    appState.alertTimeoutId = null;
  }

  DOM.successTitle.textContent   = MESSAGES.FORM.SUCCESS_TITLE;
  DOM.successMessage.textContent = MESSAGES.FORM.SUCCESS_BODY(name, car);
  DOM.formSuccessBanner.classList.remove('is-hidden');
  DOM.formSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  appState.alertTimeoutId = setTimeout(hideSuccessBanner, CONFIG.AUTO_DISMISS_ALERT_MS);
}

/** Sembunyikan banner pesan sukses. */
function hideSuccessBanner() {
  if (DOM.formSuccessBanner) {
    DOM.formSuccessBanner.classList.add('is-hidden');
  }
}

/**
 * Menangani event submit formulir test drive.
 * Menerapkan preventDefault(), validasi seluruh input, fokus ke error pertama, dan reset formulir.
 * @param {SubmitEvent} event - Objek submit event.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const nameResult  = validateName(DOM.nameInput.value);
  const emailResult = validateEmail(DOM.emailInput.value);
  const phoneResult = validatePhone(DOM.phoneInput.value);
  const carResult   = validateCarSelection(DOM.carSelect.value);

  setFieldState(DOM.nameInput,  DOM.nameError,      nameResult);
  setFieldState(DOM.emailInput, DOM.emailError,     emailResult);
  setFieldState(DOM.phoneInput, DOM.phoneError,     phoneResult);
  setFieldState(DOM.carSelect,  DOM.carSelectError, carResult);

  // Fokus ke field pertama yang bermasalah
  if (!nameResult.isValid)  { DOM.nameInput.focus();  return; }
  if (!emailResult.isValid) { DOM.emailInput.focus(); return; }
  if (!phoneResult.isValid) { DOM.phoneInput.focus(); return; }
  if (!carResult.isValid)   { DOM.carSelect.focus();  return; }

  // Jika semua valid, tampilkan notifikasi keberhasilan dan reset formulir
  const cleanName = DOM.nameInput.value.trim();
  const cleanCar  = DOM.carSelect.value;

  showSuccessBanner(cleanName, cleanCar);

  DOM.form.reset();
  clearFieldState(DOM.nameInput,  DOM.nameError);
  clearFieldState(DOM.emailInput, DOM.emailError);
  clearFieldState(DOM.phoneInput, DOM.phoneError);
  clearFieldState(DOM.carSelect,  DOM.carSelectError);
}

/* ==============================================================================
   10. PENDAFTARAN SELURUH EVENT LISTENERS
   ============================================================================== */

function setupEventListeners() {
  // ─── Event Filter Katalog Mobil ───
  DOM.filterSearch.addEventListener('input', renderCarCatalog);

  DOM.filterOrigin.addEventListener('change', () => {
    populateBrandOptions(DOM.filterOrigin.value);
    renderCarCatalog();
  });

  DOM.filterBrand.addEventListener('change',  renderCarCatalog);
  DOM.filterType.addEventListener('change',   renderCarCatalog);
  DOM.filterFuel.addEventListener('change',   renderCarCatalog);
  DOM.filterSort.addEventListener('change',   renderCarCatalog);
  DOM.btnResetFilters.addEventListener('click', resetAllFilters);

  // ─── Event Refresh DummyJSON ───
  DOM.btnRefresh.addEventListener('click', fetchProducts);

  // ─── Event Formulir Test Drive: Submit ───
  DOM.form.addEventListener('submit', handleFormSubmit);

  // ─── Event Real-time pada Input Nama ───
  DOM.nameInput.addEventListener('input', () => {
    if (DOM.nameInput.classList.contains('is-invalid')) {
      const r = validateName(DOM.nameInput.value);
      if (r.isValid) setFieldState(DOM.nameInput, DOM.nameError, r);
    }
  });
  DOM.nameInput.addEventListener('blur', () => {
    if (DOM.nameInput.value.trim().length > 0) {
      setFieldState(DOM.nameInput, DOM.nameError, validateName(DOM.nameInput.value));
    }
  });

  // ─── Event Real-time pada Input Email ───
  DOM.emailInput.addEventListener('input', () => {
    if (DOM.emailInput.classList.contains('is-invalid')) {
      const r = validateEmail(DOM.emailInput.value);
      if (r.isValid) setFieldState(DOM.emailInput, DOM.emailError, r);
    }
  });
  DOM.emailInput.addEventListener('blur', () => {
    if (DOM.emailInput.value.trim().length > 0) {
      setFieldState(DOM.emailInput, DOM.emailError, validateEmail(DOM.emailInput.value));
    }
  });

  // ─── Event Real-time pada Input WhatsApp ───
  DOM.phoneInput.addEventListener('input', () => {
    if (DOM.phoneInput.classList.contains('is-invalid')) {
      const r = validatePhone(DOM.phoneInput.value);
      if (r.isValid) setFieldState(DOM.phoneInput, DOM.phoneError, r);
    }
  });
  DOM.phoneInput.addEventListener('blur', () => {
    if (DOM.phoneInput.value.trim().length > 0) {
      setFieldState(DOM.phoneInput, DOM.phoneError, validatePhone(DOM.phoneInput.value));
    }
  });

  // ─── Event Real-time pada Pilihan Mobil ───
  DOM.carSelect.addEventListener('change', () => {
    const r = validateCarSelection(DOM.carSelect.value);
    setFieldState(DOM.carSelect, DOM.carSelectError, r);
  });

  // ─── Tutup Banner Notifikasi Sukses ───
  if (DOM.btnCloseSuccess) {
    DOM.btnCloseSuccess.addEventListener('click', hideSuccessBanner);
  }
}

/* ==============================================================================
   11. INISIALISASI UTAMA APLIKASI
   ============================================================================== */

function initializeApp() {
  populateFilterDropdowns();
  renderCarCatalog();
  setupEventListeners();
  fetchProducts();
}

// Jalankan ketika DOM siap
document.addEventListener('DOMContentLoaded', initializeApp);
