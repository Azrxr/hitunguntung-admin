# Hitung Untung Admin Panel

Admin Panel eksklusif untuk mengelola sistem iklan kustom (*custom ad-delivery*) dan konfigurasi internal untuk aplikasi Android kalkulator bisnis **Hitung Untung**.

## 🚀 Fitur Utama

Aplikasi ini difokuskan sebagai Control Center (CMS) yang terhubung sacara real-time dengan aplikasi mobile. HitungUntung Admin mensinkronisasikan perubahan langsung ke Firebase yang kemudian ditangkap oleh perangkat pengguna target.

*   **Autentikasi Aman berbasis Whitelist**: Login eksklusif menggunakan Google Sign-In yang terhubung dengan akun Firebase Auth. Akses dibatasi ketat—hanya email yang terdaftar di koleksi `admins` yang dapat masuk ke Panel.
*   **Ad Strategy Tracker & Settings**: Kontrol penuh atas alur kemunculan iklan pengguna. Konfigurasi dapat diatur menjadi:
    *   *First Open*: Iklan muncul tepat saat aplikasi pertama kali terbuka setelah splash screen.
    *   *Click-based Trigger*: Iklan muncul otomatis usai *N* interaksi / klik pindah halaman.
    *   *Time-based Trigger*: Iklan mendadak tampil sekian menit sekali.
    *   *Hybrid Trigger*: Kombinasi keduanya.
*   **Campaigns Management (Banner Promosi)**: Modul spesifik untuk CRUD (Create, Read, Update, Delete) iklan internal, yang mendukung:
    *   **Jenis Media**: Image, Video, atau In-App WebView.
    *   **Probabilitas Muncul (Weighting)**: Tentukan persentase/bobot peluang dominasi iklan mana yang sering muncul ketika waktu trigger tercapai.
    *   **Jadwal Tayang Otomatis**: Tetapkan Iklan A tayang hanya pada pukul `06:00 - 18:00` (Siang), dan Iklan B untuk sisanya (Malam).
*   **Play Console Privacy Policy Bypassed**: Endpoint laman `/privacy-policy` statis yang responsif secara publik *tanpa* navbar/sidebar rahasia milik admin. Tautan publik dikhususkan untuk didaftarkan ke Google Play Console.
*   **Modern Web UI**: Dashboard interaktif berestetika premium (*Dark Mode Glassmorphism*) menggunakan TailwindCSS.

## 🛠️ Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Directory)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Backend & DB**: Firebase (Authentication, Cloud Firestore)

## 📦 Penyiapan (Getting Started)

Untuk menjalankan environment di mesin lokal, pastikan Anda telah menyiapkan konfigurasi credentials kredensial Firebase.

1. **Install dependensi**:
   ```bash
   npm install
   ```

2. **Setup Environment Variabel (*.env.local*)**:
   Buat file `.env.local` di *root server* folder dan sediakan kunci firebase Anda.
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

3. **Menjalankan Server Web**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda. Panel Administrasi mengharuskan email Anda sudah di-register di Firestore `admins`.

---

*(Ini adalah dokumen auto-generated standar administrasi. Harap rahasiakan kredensial Anda dari publik)*.
