# REST API Peminjaman Buku Perpustakaan

## Deskripsi Umum dan Tujuan Proyek

REST API untuk mencatat peminjaman buku oleh anggota perpustakaan. API menyediakan operasi CRUD dan filter status peminjaman. Proyek menggunakan Node.js, Express.js, Supabase PostgreSQL, dan Vercel.

## Struktur Data dan Schema

Data disimpan pada tabel `loans` di Supabase.

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| `id` | UUID | Primary key, dibuat otomatis |
| `member_name` | Text | Nama anggota, wajib |
| `member_email` | Text | Email anggota, wajib |
| `book_title` | Text | Judul buku, wajib |
| `book_isbn` | Text | ISBN buku, opsional |
| `loan_date` | Date | Tanggal pinjam, default tanggal saat ini |
| `due_date` | Date | Tanggal jatuh tempo, wajib |
| `return_date` | Date | Tanggal pengembalian, opsional |
| `status` | Text | `Dipinjam`, `Dikembalikan`, atau `Terlambat` |
| `created_at` | Timestamp | Waktu data dibuat |
| `updated_at` | Timestamp | Waktu data diperbarui |

Schema SQL lengkap tersedia di [`database/schema.sql`](database/schema.sql).

## Contoh Request dan Response

Base URL: `https://responsi-mod1.vercel.app`

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| `POST` | `/loans` | Membuat peminjaman |
| `GET` | `/loans` | Melihat semua peminjaman |
| `GET` | `/loans/:id` | Melihat peminjaman berdasarkan ID |
| `PUT` | `/loans/:id` | Memperbarui peminjaman |
| `DELETE` | `/loans/:id` | Menghapus peminjaman |
| `GET` | `/loans?status=Terlambat` | Memfilter berdasarkan status |

Contoh request `POST /loans`:

```json
{
  "member_name": "Lana del rey",
  "member_email": "lanacaca123@gmail.com",
  "book_title": "Laskar Pelangi",
  "book_isbn": "9789793062792",
  "loan_date": "2026-10-01",
  "due_date": "2026-10-02",
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
    "member_name": "Lana del rey",
    "member_email": "lanacaca123@gmail.com",
    "book_title": "Laskar Pelangi",
    "book_isbn": "9789793062792",
    "loan_date": "2026-10-01",
    "due_date": "2026-10-02",
    "return_date": null,
    "status": "Dipinjam",
    "created_at": "2026-10-02T03:00:00.000000+00:00",
    "updated_at": "2026-10-02T03:00:00.000000+00:00"
  }
}
```

Contoh filter dan response `GET /loans?status=Terlambat`:

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "6a114e44-50a8-4c30-a43f-7c769263ed1e",
      "member_name": "Lana del rey",
      "member_email": "lanacaca123@gmail.com",
      "book_title": "Laskar Pelangi",
      "book_isbn": "9789793062792",
      "loan_date": "2026-10-01",
      "due_date": "2026-10-02",
      "return_date": null,
      "status": "Terlambat",
      "created_at": "2026-10-02T03:00:00.000000+00:00",
      "updated_at": "2026-10-10T03:00:00.000000+00:00"
    }
  ]
}
```

## Panduan Instalasi dan Menjalankan Lokal

1. Clone repository dan masuk ke folder proyek:

   ```bash
   git clone https://github.com/aisyahaprilia154/Responsi-MOD1.git
   cd Responsi-MOD1
   ```

2. Install dependency:

   ```bash
   npm install
   ```

3. Buat file `.env` di folder utama proyek dan isi dengan kredensial Supabase:

   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_KEY=your-supabase-anon-key
   PORT=3000
   ```

4. Jalankan isi `database/schema.sql` melalui SQL Editor di Supabase.
5. Jalankan server:

   ```bash
   npm run dev
   ```

6. API lokal tersedia di `http://localhost:3000`.

## Link Hasil Deployment Vercel

Base URL API: [https://responsi-mod1.vercel.app](https://responsi-mod1.vercel.app)
