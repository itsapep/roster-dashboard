# Inisiasi Project Next.js dengan Drizzle ORM & PostgreSQL

## Deskripsi Tujuan
Tugas ini adalah melakukan setup awal (scaffolding) untuk project web baru menggunakan **Next.js** di folder ini. Aplikasi ini akan bergantung pada **Drizzle ORM** untuk manajemen basis data dan **PostgreSQL** sebagai sistem databasenya. 

Instruksi ini sengaja dibuat *high-level*. Anda dibebaskan untuk menentukan detail implementasi yang paling optimal selama mengikuti kaidah dan *best practices* standar dari teknologi yang digunakan.

## Tech Stack
- **Framework:** Next.js (disarankan menggunakan App Router & TypeScript)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM (termasuk Drizzle Kit untuk migrasi)

## Daftar Pekerjaan (High-Level Tasks)

### 1. Setup Next.js
- Inisialisasi project Next.js baru langsung di root folder ini.
- Aktifkan konfigurasi standar yang umum digunakan (seperti TypeScript, ESLint, dan TailwindCSS).

### 2. Konfigurasi Database & ORM
- Install library Drizzle ORM dan driver PostgreSQL yang sesuai (contoh: `postgres` atau `pg`).
- Setup *environment variables* (file `.env`) untuk menyimpan *connection string* database (`DATABASE_URL`). Pastikan file ini masuk ke dalam `.gitignore`.
- Buat file konfigurasi Drizzle (`drizzle.config.ts` atau sejenisnya) untuk mengatur direktori schema dan URL database.

### 3. Pembuatan Skema Awal & Koneksi
- Buat struktur folder yang rapi untuk manajemen database (misalnya `src/db/`).
- Definisikan *instance* koneksi database.
- Buat satu skema tabel contoh (contoh: tabel `users` sederhana) sebagai *proof of concept*.
- Siapkan script di `package.json` untuk menjalankan operasi migrasi (misal: generate schema atau push schema ke database).

### 4. Verifikasi (Testing Koneksi)
- Lakukan migrasi skema tabel contoh ke database PostgreSQL.
- Buat satu komponen atau halaman sederhana (bisa menggunakan *Server Component* atau *Server Action*) yang mengambil data dari database tersebut untuk memastikan bahwa *query* via Drizzle ORM berjalan dengan sukses.

## Kriteria Penerimaan (Acceptance Criteria)
- [ ] Project Next.js berhasil berjalan secara lokal tanpa error (`npm run dev`).
- [ ] Koneksi database ke PostgreSQL berhasil dilakukan.
- [ ] Migrasi Drizzle (push/generate) bisa dieksekusi melalui terminal.
- [ ] Terdapat bukti *query* sederhana yang berhasil merender data dari database ke layar.
