# Library Loans API

REST API sederhana untuk mencatat peminjaman buku perpustakaan. Proyek ini dibuat menggunakan Node.js, Express.js, dan Supabase serta disiapkan untuk deployment ke Vercel.

## Tujuan Proyek

API ini membantu petugas perpustakaan menyimpan, melihat, mengubah, menghapus, dan memfilter data peminjaman buku oleh anggota. Data dikirim dan diterima dalam format JSON.

## Teknologi

- Node.js 18 atau lebih baru
- Express.js
- Supabase (PostgreSQL)
- Vercel

## Struktur Proyek

```text
.
├── database/
│   └── schema.sql
├── src/
│   ├── config/
│   │   └── supabaseClient.js
│   ├── controllers/
│   │   └── loanController.js
│   ├── middlewares/
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   └── loanModel.js
│   ├── routes/
│   │   └── loanRoutes.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   ├── httpError.js
│   │   └── loanValidation.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── vercel.json
```

Alur request adalah `route -> controller -> model -> Supabase`. Route menentukan endpoint, controller memproses request dan response, sedangkan model menjalankan query ke database.

## Struktur Data

Tabel `loans` menyimpan data berikut:

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `id` | UUID | Primary key, dibuat otomatis |
| `member_name` | Text | Wajib diisi |
| `member_email` | Text | Wajib diisi dan harus berupa email |
| `book_title` | Text | Wajib diisi |
| `book_isbn` | Text | Opsional |
| `loan_date` | Date | Default tanggal saat data dibuat |
| `due_date` | Date | Wajib diisi dan tidak boleh sebelum `loan_date` |
| `return_date` | Date | Opsional |
| `status` | Text | `Dipinjam`, `Dikembalikan`, atau `Terlambat` |
| `created_at` | Timestamp | Dibuat otomatis |
| `updated_at` | Timestamp | Diperbarui otomatis |

Schema lengkap tersedia pada [`database/schema.sql`](database/schema.sql).

## Endpoint

Base URL lokal: `http://localhost:3000`

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `GET` | `/` | Informasi API |
| `GET` | `/health` | Memeriksa status server |
| `POST` | `/loans` | Membuat data peminjaman |
| `GET` | `/loans` | Mengambil seluruh data peminjaman |
| `GET` | `/loans/:id` | Mengambil satu data berdasarkan ID |
| `PUT` | `/loans/:id` | Memperbarui data berdasarkan ID |
| `DELETE` | `/loans/:id` | Menghapus data berdasarkan ID |
| `GET` | `/loans?status=Terlambat` | Memfilter berdasarkan status |
| `GET` | `/loans?member_name=Budi` | Mencari berdasarkan nama anggota |

Filter `status` dan `member_name` dapat digabungkan:

```http
GET /loans?status=Dipinjam&member_name=Budi
```

## Contoh Request dan Response

### Membuat Peminjaman

```http
POST /loans
Content-Type: application/json
```

```json
{
  "member_name": "Budi Santoso",
  "member_email": "budi@example.com",
  "book_title": "Laskar Pelangi",
  "book_isbn": "9789793062792",
  "loan_date": "2026-10-02",
  "due_date": "2026-10-09",
  "status": "Dipinjam"
}
```

Contoh response `201 Created`:

```json
{
  "success": true,
  "message": "Data peminjaman berhasil dibuat.",
  "data": {
    "id": "6a114e44-50a8-4c30-a43f-7c769263ed1e",
    "member_name": "Budi Santoso",
    "member_email": "budi@example.com",
    "book_title": "Laskar Pelangi",
    "book_isbn": "9789793062792",
    "loan_date": "2026-10-02",
    "due_date": "2026-10-09",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-10-02T03:00:00.000000+00:00",
    "updated_at": "2026-10-02T03:00:00.000000+00:00"
  }
}
```

### Mengambil dan Memfilter Data

```http
GET /loans?status=Terlambat
```

Contoh response `200 OK`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "6a114e44-50a8-4c30-a43f-7c769263ed1e",
      "member_name": "Budi Santoso",
      "member_email": "budi@example.com",
      "book_title": "Laskar Pelangi",
      "book_isbn": "9789793062792",
      "loan_date": "2026-10-02",
      "due_date": "2026-10-09",
      "return_date": null,
      "status": "Terlambat",
      "created_at": "2026-10-02T03:00:00.000000+00:00",
      "updated_at": "2026-10-10T03:00:00.000000+00:00"
    }
  ]
}
```

### Memperbarui Peminjaman

```http
PUT /loans/6a114e44-50a8-4c30-a43f-7c769263ed1e
Content-Type: application/json
```

```json
{
  "return_date": "2026-10-11",
  "status": "Dikembalikan"
}
```

### Menghapus Peminjaman

```http
DELETE /loans/6a114e44-50a8-4c30-a43f-7c769263ed1e
```

Contoh response `200 OK`:

```json
{
  "success": true,
  "message": "Data peminjaman berhasil dihapus."
}
```

### Contoh Response Error

```json
{
  "success": false,
  "message": "Status tidak valid.",
  "details": {
    "allowed_values": ["Dipinjam", "Dikembalikan", "Terlambat"]
  }
}
```

## Instalasi dan Menjalankan Secara Lokal

1. Clone repository dan masuk ke folder proyek.

   ```bash
   git clone <URL_REPOSITORY_GITHUB>
   cd library-loans-api
   ```

2. Install dependency.

   ```bash
   npm install
   ```

3. Salin `.env.example` menjadi `.env`.

   ```bash
   cp .env.example .env
   ```

   Pengguna Windows PowerShell dapat menjalankan:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Isi environment variables pada `.env`.

   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   PORT=3000
   ```

5. Jalankan schema pada Supabase SQL Editor menggunakan isi file `database/schema.sql`.

6. Jalankan server.

   ```bash
   npm run dev
   ```

7. Akses API melalui `http://localhost:3000`.

## Deployment Vercel

1. Push proyek ke repository GitHub publik.
2. Buka Vercel, pilih **Add New > Project**, lalu import repository.
3. Tambahkan environment variables `SUPABASE_URL` dan `SUPABASE_KEY` pada pengaturan proyek Vercel.
4. Klik **Deploy**.
5. Uji endpoint `/health` dan `/loans` menggunakan URL deployment.

## Link Proyek

- Repository GitHub: https://github.com/aisyahaprilia154/Responsi-MOD1
- Base URL Vercel: https://responsi-mod1.vercel.app

## Catatan Keamanan

Policy Supabase pada schema mengizinkan akses CRUD melalui anon key agar API responsi dapat langsung diuji. Untuk aplikasi produksi, tambahkan autentikasi dan batasi policy Row Level Security berdasarkan pengguna atau peran.
