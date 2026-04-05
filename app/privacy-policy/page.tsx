import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi - Hitung Untung",
  description: "Kebijakan Privasi aplikasi Hitung Untung",
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 prose prose-invert overflow-x-hidden">
      <h1 className="text-3xl font-bold mb-2">Kebijakan Privasi (Privacy Policy)</h1>
      <p className="text-foreground/60 mb-8 italic">Terakhir diperbarui: 5 April 2026</p>

      <div className="space-y-6 text-foreground/80 leading-relaxed text-sm md:text-base">
        <p>
          Aplikasi Hitung Untung dibangun sebagai aplikasi yang didukung iklan (Ad-Supported). Layanan ini disediakan tanpa biaya dan ditujukan untuk digunakan sebagaimana adanya.
        </p>
        
        <p>
          Halaman ini digunakan untuk memberi tahu pengunjung dan pengguna mengenai kebijakan kami terkait pengumpulan, penggunaan, dan pengungkapan Informasi Pribadi jika ada yang memutuskan untuk menggunakan Layanan ini.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Pengumpulan dan Penggunaan Informasi</h2>
        <p>
          Kami <strong>tidak mengumpulkan, meminta, atau menyimpan informasi identitas pribadi (PII) apa pun</strong> dari Anda. Aplikasi Hitung Untung berfungsi murni sebagai alat kalkulasi bisnis. Semua data yang Anda masukkan (seperti modal, harga jual, diskon, dan nominal pembayaran) hanya diproses secara lokal di dalam perangkat (smartphone) Anda. Kami tidak memiliki akses ke data tersebut dan tidak ada data finansial yang dikirimkan ke server mana pun.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Layanan Pihak Ketiga dan Akses Internet</h2>
        <p>
          Meskipun aplikasi ini tidak mengumpulkan data pribadi, Hitung Untung memerlukan izin akses Internet (Network Access) untuk beberapa fitur pendukung. Aplikasi ini menggunakan layanan pihak ketiga yang mungkin mengumpulkan informasi anonim yang digunakan untuk mengidentifikasi perangkat Anda (seperti alamat IP atau ID Iklan perangkat) demi keperluan pengiriman iklan dan pemantauan stabilitas aplikasi.
        </p>

        <p>Layanan pihak ketiga yang digunakan oleh aplikasi ini meliputi:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Google Play Services</strong> (Untuk memfasilitasi pembaruan aplikasi dalam aplikasi / In-App Updates).</li>
          <li><strong>Firebase / Google Analytics for Firebase</strong> (Untuk mengambil konfigurasi tampilan iklan internal secara real-time).</li>
        </ul>

        <p className="mt-4">Tautan ke kebijakan privasi penyedia layanan pihak ketiga yang digunakan oleh aplikasi:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><a href="https://policies.google.com/privacy" className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noreferrer">Kebijakan Privasi Google</a></li>
          <li><a href="https://firebase.google.com/support/privacy" className="text-indigo-400 hover:text-indigo-300 underline" target="_blank" rel="noreferrer">Kebijakan Privasi Firebase</a></li>
        </ul>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Data Log (Log Data)</h2>
        <p>
          Kami ingin memberi tahu Anda bahwa setiap kali Anda menggunakan Layanan ini, jika terjadi kesalahan atau crash pada aplikasi, kami (melalui produk pihak ketiga seperti Google Play) mungkin mengumpulkan data dan informasi pada ponsel Anda yang disebut Data Log. Data Log ini dapat mencakup informasi anonim seperti alamat Protokol Internet ("IP") perangkat Anda, nama perangkat, versi sistem operasi, konfigurasi aplikasi saat memanfaatkan Layanan kami, waktu dan tanggal penggunaan Anda, serta statistik lainnya untuk membantu kami memperbaiki bug.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Keamanan</h2>
        <p>
          Kami sangat menghargai kepercayaan Anda dalam menggunakan aplikasi ini. Karena aplikasi memproses semua data perhitungan secara luring (offline) di penyimpanan lokal perangkat Anda, risiko kebocoran data sangatlah minim. Namun, ingatlah bahwa tidak ada metode transmisi melalui internet, atau metode penyimpanan elektronik yang 100% aman dan andal, dan kami tidak dapat menjamin keamanan mutlaknya.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Privasi Anak-Anak</h2>
        <p>
          Layanan ini tidak ditujukan untuk siapa pun yang berusia di bawah 13 tahun. Kami tidak secara sadar mengumpulkan informasi identitas pribadi dari anak-anak di bawah 13 tahun.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Perubahan pada Kebijakan Privasi Ini</h2>
        <p>
          Kami dapat memperbarui Kebijakan Privasi dari waktu ke waktu. Oleh karena itu, Anda disarankan untuk meninjau halaman ini secara berkala untuk melihat segala perubahan. Kami akan memberi tahu Anda tentang segala perubahan dengan memposting Kebijakan Privasi baru di halaman ini. Perubahan tersebut langsung berlaku setelah diposting.
        </p>

        <h2 className="text-xl font-bold mt-8 mb-4 text-foreground">Hubungi Kami</h2>
        <p>
          Jika Anda memiliki pertanyaan atau saran mengenai Kebijakan Privasi ini, jangan ragu untuk menghubungi melalui email di:
        </p>
        <p className="font-bold text-indigo-400">
          <a href="mailto:mohassrorii@gmail.com">mohassrorii@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
