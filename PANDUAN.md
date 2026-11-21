# Grand Line Journey — Versi HTML (tanpa instalasi)

Buka `index.html` dengan klik dua kali. Tidak perlu Node/npm.

## Struktur
```
index.html            teks tetap (judul section, tombol hero, footer, judul tab)
css/style.css         warna & font (lihat bagian :root di atas file)
js/data.js            <<< SEMUA DATA PRIBADIMU ADA DI SINI
js/main.js            logika (tidak perlu diedit)
images/profile.png    <<< TARUH FOTOMU DI SINI (belum ada = tampil placeholder)
images/projects/      gambar sampul proyek
```

## Cara mengganti (teks `[EDIT: nama.field]` di halaman = nama field di data.js)
| Yang diganti | Lokasi |
|---|---|
| Nama, role, motto, lokasi, foto, poster bounty | `js/data.js` → `profile` |
| Perkenalan, pendidikan, minat, tujuan, prinsip, perjalanan | `js/data.js` → `profile` |
| Kartu hobi | `js/data.js` → `hobbies` |
| Proyek, filter, tautan demo/source, sampul | `js/data.js` → `projects`, `filters` |
| Skill | `js/data.js` → `skills` |
| WhatsApp, Instagram, Email, GitHub, LinkedIn, form | `js/data.js` → `contact` |
| Teks menu navbar | `js/data.js` → `nav` |
| Teks tombol hero, "AHOY!...", judul & kalimat tiap section, footer, pesan easter egg | `index.html` (cari dengan Ctrl+F, ada komentar `EDIT`) |
| Judul tab & deskripsi Google | `index.html` → `<title>` dan `<meta name="description">` |
| Warna & font | `css/style.css` → bagian `:root` |

Format kontak: WhatsApp = angka dengan kode negara tanpa `+`/spasi/`-` (`081234567890` → `6281234567890`);
Instagram & GitHub = username tanpa `@`; LinkedIn = URL lengkap `https://...`.
Kosong = tombol abu-abu "Belum diatur" (tidak ada tautan palsu).
Form pesan baru aktif jika `formEndpoint` diisi (mis. Formspree); sebelum itu dinonaktifkan.
Proyek asli: hapus `placeholder: true`.

## Publish ke GitHub Pages
1. Buat repo, unggah seluruh isi folder ini (index.html harus di root repo).
2. Settings → Pages → Source: "Deploy from a branch" → branch `main`, folder `/ (root)`.
3. Situs terbit di `https://USERNAME.github.io/NAMA-REPO/`. (Path relatif, jadi tidak perlu pengaturan base path.)

Catatan: font memakai Google Fonts (perlu internet); tanpa internet dipakai font bawaan sistem.

## Laut 3D & kapal
- Laut dirender dengan WebGL (shader di `js/main.js`, bagian "LAUT 3D"). Jika perangkat tidak mendukung WebGL, otomatis dipakai ombak CSS sebagai cadangan.
- Kualitas menyesuaikan otomatis dengan kecepatan perangkat; animasi berhenti saat hero tidak terlihat; mode "reduced motion" menampilkan gambar laut statis.
- Warna/ombak air: konstanta di awal shader (`SEA_HEIGHT`, `SEA_FREQ`, `SEA_BASE`, `SEA_WATER`).
- Kapal layar (orisinal) ada di `index.html` (cari `caravel`); ukuran & posisi di `css/style.css` bagian "KAPAL LAYAR ORISINAL".

## Mode siang / malam
- Tombol ☀/🌙 ada di navbar (kanan). Siang: matahari; malam: bulan, bintang, laut gelap, jendela kapal menyala. Pilihan pengunjung disimpan di browsernya.
- Mode awal diatur di `js/data.js` → `theme`: `'auto'` (ikut pengaturan perangkat), `'day'`, atau `'night'`.
- Warna mode malam: `css/style.css` bagian "MODE MALAM". Warna langit/laut malam: konstanta di shader `js/main.js`.

## Tali gantungan poster & footer
- Tali poster menempel di bawah navbar dan ikut bergoyang mengikuti poster (diatur di `js/main.js`, fungsi `ropes`; tampilannya di `css/style.css` bagian "TALI GANTUNGAN").
- Footer adalah laut 3D yang sama: senja saat siang, malam berbulan saat mode malam. Tinggi footer: `css/style.css` → `.footer { min-height }`. Warna sambungan dengan section Contact: variabel `--foot-top`.

## Lautan dalam (latar di bawah hero) & dasar laut
- Semua section di bawah hero (About → Contact) ada di dalam satu kolom laut `<div class="ocean">` di `index.html`. Makin ke bawah makin dalam: air terang berkas cahaya → terumbu → laut gelap berpendar → dasar laut di footer.
- Warna kedalaman ada di `css/style.css` blok "LAUTAN DALAM": variabel `--z0` … `--z6` (siang) dan versi malamnya. Hero memudar ke `--z0`, Contact berakhir di `--z5`, footer `--z5 → --z6`, jadi semua latar tersambung.
- Dinding terumbu karang (kiri/kanan), ikan, ubur-ubur, pari manta, gelembung, sinar matahari, salju laut, dan dasar laut + peti harta digambar otomatis oleh `js/ocean.js` (tanpa gambar). Palet karang: kelas `.cc-a … .cc-f` di CSS. Daftar gerombolan ikan: `SCHOOLS`; ubur-ubur: `JELLY` di `js/ocean.js`.
- Mode malam: karang meredup dan ujungnya berpendar, ubur-ubur bercahaya, sinar matahari menjadi cahaya bulan.
- Footer tidak lagi memakai laut 3D (WebGL); `main.js` otomatis melewatinya karena kanvas `#footer-gl` sudah tidak ada.
- `index.html`: tag `<script src="js/main.js">` yang sebelumnya dipanggil dua kali sudah dibuat satu (pemanggilan ganda membuat menu HP tidak bisa dibuka).
