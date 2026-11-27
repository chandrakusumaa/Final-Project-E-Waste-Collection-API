# REST API Pencarian Titik Pengumpulan Sampah Elektronik (E-Waste)

Final Project **Study Club Backend Basic — KSM Veterantech UPNVJ 2026 (Kabinet Genesis)**

- **Nama:** Mursid Jafar Chandra Kusuma
- **NIM:** 2510511030
- **Judul Project:** REST API Pencarian Titik Pengumpulan Sampah Elektronik (E-Waste)

## Deskripsi Proyek & Arsitektur Modular

Proyek ini adalah layanan backend REST API menggunakan **Node.js**, **ExpressJS**, dan **MongoDB (Mongoose)** untuk mengelola dan mencari informasi lokasi titik pengumpulan sampah elektronik (*E-Waste*). Seluruh data disimpan secara persisten di database MongoDB pada koleksi `locations` (tanpa menggunakan array lokal di dalam kode) dan disusun menggunakan **Arsitektur Modular (MVC)**:

```text
ewaste-collection-api/
├── src/
│   ├── config/
│   │   └── db.js                   # Konfigurasi koneksi MongoDB (Mongoose)
│   ├── models/
│   │   └── Location.js             # Skema dan validasi koleksi 'locations'
│   ├── controllers/
│   │   ├── authController.js       # Logika endpoint simulasi login
│   │   └── locationController.js   # Logika bisnis CRUD & pencarian lokasi E-Waste
│   └── routes/
│       ├── authRoutes.js           # Definisi route /api/auth
│       └── locationRoutes.js       # Definisi route /api/locations & dynamic routing /:id
├── .env.example                    # Contoh konfigurasi environment variable
├── .gitignore                      # Mengabaikan node_modules dan .env dari Git
├── ewaste-api.postman_collection.json # Koleksi pengujian Postman seluruh endpoint
├── package.json                    # Konfigurasi dependencies & script NPM
├── README.md                       # Dokumentasi proyek
└── server.js                       # Entry point utama aplikasi ExpressJS
```

## Skema Database (Koleksi: `locations`)

| Field (Key) | Tipe Data | Keterangan Validasi |
| :--- | :--- | :--- |
| `namaTempat` | `String` | **Wajib diisi (Required)**. Contoh: `"Bank Sampah E-Waste Jakarta"` |
| `alamat` | `String` | **Wajib diisi (Required)**. |
| `kategoriSampah` | `Array of String` | Bebas/Opsional. Contoh: `["Baterai", "Kabel", "Layar"]` |
| `jamOperasional` | `String` | Opsional (default: `"08.00 - 17.00 WIB"`). |
| `createdAt` | `Date` | Otomatis ditambahkan (*Timestamp* saat dokumen dibuat). |

## Cara Instalasi

Pastikan **Node.js** dan **MongoDB** (lokal atau MongoDB Atlas) sudah terpasang di perangkat Anda.

1. **Clone repository** ke komputer lokal:
   ```bash
   git clone https://github.com/chandrakusumaa/Final-Project-E-Waste-Collection-API.git
   cd Final-Project-E-Waste-Collection-API
   ```

2. **Instal seluruh dependencies** melalui NPM:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variable** dengan menyalin file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   *(Di Windows PowerShell dapat menggunakan `Copy-Item .env.example .env`, lalu sesuaikan nilainya di dalam file `.env`.)*

## Daftar Environment Variable

Atur konfigurasi berikut di dalam file `.env` pada root proyek:

| Variabel | Contoh Nilai | Keterangan |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port server HTTP tempat aplikasi Express berjalan (default: `5000`) |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/e-waste_database` | Connection string MongoDB lokal atau MongoDB Atlas (**Wajib diisi**) |

Contoh isi file `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/e-waste_database
```

## Cara Menjalankan Server

- **Mode Development** (otomatis reload menggunakan `nodemon`):
  ```bash
  npm run dev
  ```

- **Mode Production**:
  ```bash
  npm start
  ```

Jika berhasil, server akan berjalan pada `http://localhost:5000` dan menampilkan pesan koneksi MongoDB di terminal.

## Dokumentasi / Daftar Endpoint

Base URL: `http://localhost:5000`

| Fitur | Method | Endpoint URL | Status Code | Deskripsi & Kriteria Khusus |
| :--- | :--- | :--- | :--- | :--- |
| **Health Check** | `GET` | `/` | `200` | Mengecek status API dan menampilkan ringkasan daftar endpoint. |
| **Simulasi Login** | `POST` | `/api/auth/login` | `200`, `400`, `500` | Menerima payload `username` dan `password`. Mengembalikan response sukses dan *dummy token*. |
| **Tambah Titik (Create)** | `POST` | `/api/locations` | `201`, `400`, `500` | Menyimpan data lokasi baru ke MongoDB. Memvalidasi input wajib (`namaTempat`, `alamat`). |
| **Lihat Semua (Read All)** | `GET` | `/api/locations` | `200`, `500` | Menampilkan seluruh data lokasi. Mendukung **Query Parameter** `?search=keyword` (pencarian berdasarkan `namaTempat` atau `alamat`) serta `?kategori=jenis`. |
| **Lihat Detail (Read One)** | `GET` | `/api/locations/:id` | `200`, `404`, `500` | Menampilkan satu lokasi spesifik dengan **Dynamic Routing** (`/:id`). Mengembalikan `404` jika ID tidak ditemukan atau tidak valid. |
| **Ubah Data (Update)** | `PUT` | `/api/locations/:id` | `200`, `400`, `404`, `500` | Memperbarui data titik pengumpulan berdasarkan `/:id`. |
| **Hapus Data (Delete)** | `DELETE` | `/api/locations/:id` | `200`, `404`, `500` | Menghapus data titik pengumpulan secara permanen dari MongoDB berdasarkan `/:id`. |

### Contoh Request Payload

**`POST /api/auth/login`**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**`POST /api/locations` & `PUT /api/locations/:id`**
```json
{
  "namaTempat": "Bank Sampah E-Waste Jakarta",
  "alamat": "Jl. RS. Fatmawati Raya No. 1, Pondok Labu, Jakarta Selatan",
  "kategoriSampah": ["Baterai", "Kabel", "Layar"],
  "jamOperasional": "Senin - Jumat (08.00 - 16.00 WIB)"
}
```

## Pengujian dengan Postman

1. Buka aplikasi **Postman**.
2. Klik tombol **Import** lalu pilih file `ewaste-api.postman_collection.json` yang berada di root proyek ini.
3. Jalankan request **Tambah Titik E-Waste (Create)** terlebih dahulu, salin nilai `_id` dari response yang dihasilkan, lalu tempelkan ke variabel koleksi `location_id` untuk menguji endpoint `GET /:id`, `PUT /:id`, dan `DELETE /:id`.
