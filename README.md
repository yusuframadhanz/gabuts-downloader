# GABUTS — Website downloader

Ini adalah starter project website GABUTS untuk tautan media publik TikTok dan Instagram.

## Cara termudah menjalankan di komputer

1. Instal Node.js 20 atau lebih baru.
2. Instal Python 3 dan `yt-dlp`.
3. Ekstrak ZIP ini.
4. Buka Terminal/Command Prompt di folder hasil ekstrak.
5. Jalankan:

```bash
npm install
npm start
```

6. Buka `http://localhost:3000`.

## Agar website bisa online

Project ini sudah disiapkan dengan `Dockerfile` dan `render.yaml` untuk mempermudah deployment ke layanan hosting yang mendukung Docker (contohnya Render).

Langkah yang tetap perlu dilakukan pemilik akun:
1. Buat/masuk ke akun GitHub.
2. Buat repository baru bernama `gabuts-downloader`.
3. Upload seluruh isi folder project ini ke repository tersebut.
4. Buat/masuk ke akun Render, pilih **New > Web Service**, lalu hubungkan repository GitHub.
5. Pilih deployment menggunakan Docker. Jika Render membaca `render.yaml`, periksa pengaturannya lalu deploy.
6. Setelah proses selesai, Render akan memberikan alamat `*.onrender.com`.

Saya tidak bisa membuat akun hosting/GitHub atau menyetujui syarat layanan atas nama Anda dari chat ini. Jangan kirim password atau kode OTP ke chat.

## Catatan penting

- Server harus dapat menjalankan `yt-dlp`; Dockerfile memasangnya saat build.
- Dukungan TikTok/Instagram dapat berubah sewaktu-waktu dan tidak dijamin untuk setiap tautan.
- Tidak dapat mengakses akun privat, melewati login wall, DRM, atau kontrol akses.
- Unduh hanya konten milik sendiri atau konten yang pemiliknya mengizinkan.
- Project ini independen, bukan aplikasi resmi TikTok atau Instagram.
- Sebelum dipakai publik, tambahkan rate limit, batas ukuran/waktu unduhan, pemantauan biaya/traffic, dan kebijakan privasi yang sesuai.
