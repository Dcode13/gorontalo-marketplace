# Panduan checkout via WhatsApp

Pastikan Node.js/npm dan Python 3 tersedia. Jalankan situs dari folder proyek:

```sh
npm run dev
```

Perintah ini menjalankan server statis Python 3. Tidak perlu `npm install` karena tidak ada dependensi npm. Hentikan server dengan `Ctrl+C`.

Buka `http://localhost:8765` dan gunakan alamat yang sama selama pengujian, karena data disimpan per origin browser.

1. Tambahkan produk ke keranjang, lalu pilih **Lanjut ke Pembayaran**.
2. Isi data penerima, alamat, dan wilayah tujuan.
3. Pengiriman menggunakan **Kurir Lokal Gorontalo**. Ongkir mengikuti wilayah, gratis mulai Rp500.000 setelah diskon. Kupon yang tersedia: `HULONTHALO10`.
4. Klik **Bayar via WhatsApp**. Setelah pesanan tersimpan, browser membuka WhatsApp admin **082152720849** (`6282152720849` dalam tautan).
5. Pesan otomatis memuat nomor pesanan, semua produk beserta penjual, jumlah dan harga, subtotal, diskon, ongkir, total, serta nama, nomor WhatsApp, alamat, dan catatan penerima. Periksa pesan lalu tekan **Kirim** di WhatsApp.
6. Lanjutkan konfirmasi ketersediaan, pembayaran, dan pengiriman bersama admin melalui chat.
7. Riwayat tersedia di **Pesanan Saya**, termasuk setelah halaman dimuat ulang. Buka pesanan untuk menggunakan kembali tombol **Bayar via WhatsApp** dengan rincian yang sama.

## Produk favorit

Klik ikon hati pada kartu atau detail produk untuk menyimpan/menghapus favorit. Ikon hati di header menampilkan jumlah favorit dan membuka daftar **Produk Favorit**. Gunakan **Lihat semua produk** untuk kembali ke katalog. Favorit tersimpan di browser pada `gm_favorites`, tetap tersedia setelah refresh, dan tersinkron antar-tab dengan alamat situs yang sama. Produk yang telah dihapus dari katalog tidak ditampilkan sebagai favorit.

## Batas fungsi pembayaran

Checkout baru menggunakan WhatsApp. Membuka tautan hanya menyiapkan pesan, tidak mengirimkannya otomatis dan tidak menandai pesanan sebagai lunas. Situs menyimpan pesanan di browser tanpa sinkronisasi status pembayaran dari WhatsApp; konfirmasi dilanjutkan melalui chat admin. Nomor tujuan diatur pada `CONFIG.adminWhatsApp` di `js/data.js`.

## Pesanan bank dan QRIS lama

Pesanan lama beserta tampilan bank/QRIS tetap dapat dibuka dari riwayat. Konfirmasi manual pada pesanan simulasi lama hanya mengubah status di browser. Metode ini tidak ditawarkan pada checkout baru.

Secara bawaan QR **memuat teks detail pesanan, bukan payload QRIS untuk transfer uang**. Kode bisa dipindai dengan kamera/pemindai QR, tetapi bukan untuk dibayar lewat aplikasi bank. QR tidak memuat nama, telepon, atau alamat pembeli. Pembuatan QR berlangsung lokal menggunakan `qrcode-generator` 2.0.4 (MIT), tanpa mengirim data ke layanan gambar QR eksternal.

Jika sudah tersedia QRIS merchant resmi, masukkan payload persis dari PJP pada `CONFIG.qris.merchantPayload` di `js/data.js`, beserta `merchantName`. Payload tersebut di-encode utuh, tidak diubah menjadi QRIS dinamis buatan. Untuk QRIS statis, nominal harus dimasukkan sesuai total pesanan. Implementasi ini tidak memverifikasi pembayaran, termasuk saat payload merchant diisi. Integrasi produksi memerlukan backend dan verifikasi dari penyedia pembayaran.

Untuk rekening bank yang benar, isi `accountNumber` dan `accountHolder` pada bank terkait di `CONFIG.banks`. Nilai bawaan kosong agar tidak menampilkan rekening rekaan.

Referensi: [Bank Indonesia tentang QRIS](https://www.bi.go.id/id/fungsi-utama/sistem-pembayaran/ritel/kanal-layanan/qris/default.aspx), [dokumentasi generator QR](https://github.com/kazuhikoarase/qrcode-generator/blob/master/js/README.md).

## Penyimpanan dan pengujian

Data tetap menggunakan `gm_sandbox_orders` dan `gm_sandbox_buyer` untuk mempertahankan pesanan dari versi sebelumnya. Pesanan pada `gm_orders` tidak diubah. Keranjang/kupon dikosongkan setelah pesanan berhasil disimpan; kesalahan penyimpanan ditampilkan tanpa meneruskan checkout.

Hapus hanya riwayat pengujian melalui konsol browser:

```js
localStorage.removeItem('gm_sandbox_orders');
localStorage.removeItem('gm_sandbox_buyer');
location.reload();
```

Jalankan pengujian:

```sh
npm test
```
