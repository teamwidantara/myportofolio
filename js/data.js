/* =====================================================================
   DATA.JS — SATU-SATUNYA FILE YANG PERLU KAMU ISI
   Teks [EDIT: ...] tampil di website. Ganti seluruh teks beserta kurung sikunya.
   Komentar "MUNCUL DI" menunjukkan lokasi teks itu di website.
   Menambah item (hobi, proyek, dst.): salin satu blok { ... } lalu tempel di bawahnya.
   Jangan menghapus tanda koma / kurung yang ada.
   ===================================================================== */

const CONFIG = {

  /* MODE TAMPILAN AWAL: 'auto' (ikut pengaturan perangkat), 'day' (siang), atau 'night' (malam).
     Pilihan pengunjung lewat tombol ☀/🌙 di navbar disimpan di browsernya. */
  theme: 'auto',

  /* ---------------------------------------------------------------
     1. PROFIL
     --------------------------------------------------------------- */
  profile: {
    fullName: 'WILDAN ABKAR DEWANTARA',      // MUNCUL DI: Hero (judul besar), About, Footer
    nickname: 'Wildan Abkar Dewantara',      // MUNCUL DI: Navbar kiri atas
    role: 'Website Developer',              // MUNCUL DI: Hero (bawah nama), About
    tagline: 'Every dream begins with an adventure.', // MUNCUL DI: Hero (tulisan tangan)
    location: '[EDIT: profile.location]',      // MUNCUL DI: About (baris kecil)

    // FOTO — MUNCUL DI: Hero (poster bounty). Taruh file di folder images/ dengan nama profile.png
    photo: 'images/profile.png',
    photoAlt: '[EDIT: profile.photoAlt — deskripsi singkat fotomu]',
    photoFallback: 'images/profile-placeholder.svg', // gambar cadangan, jangan diubah

    // POSTER BOUNTY — MUNCUL DI: Hero, bingkai poster. Murni dekorasi.
    bounty: {
      enabled: true,                           // false = sembunyikan judul/julukan/nilai
      title: 'WANTED',                         // tulisan di atas foto
      alias: 'WORK OR ALIVE',           // julukan di bawah foto
      amount: '22.222.222',         // angka setelah simbol ฿
      note: 'ACCOUNTING'                  // catatan kecil
    },

    // MUNCUL DI: About, kartu utama. Satu string = satu paragraf.
    intro: [
      '[EDIT: profile.intro 1]',
      '[EDIT: profile.intro 2]'
    ],

    // MUNCUL DI: About, kartu "Pendidikan"
    education: [
      { school: '[EDIT: education.school]', detail: '[EDIT: education.detail]', period: '[EDIT: education.period]' }
    ],

    interests: ['[EDIT: interests 1]', '[EDIT: interests 2]'],   // MUNCUL DI: About, kartu "Minat & Tujuan" (Minat)
    goals: ['[EDIT: goals 1]', '[EDIT: goals 2]'],               // MUNCUL DI: About, kartu "Minat & Tujuan" (Tujuan)
    principles: ['[EDIT: principles 1]', '[EDIT: principles 2]'], // MUNCUL DI: About, kartu "Prinsip Hidup"

    // MUNCUL DI: About, kartu lebar "Perjalanan Belajar & Pengalaman"
    journey: [
      { period: '[EDIT: journey.period]', title: '[EDIT: journey.title]', text: '[EDIT: journey.text]' },
      { period: '[EDIT: journey.period]', title: '[EDIT: journey.title]', text: '[EDIT: journey.text]' }
    ]
  },

  /* ---------------------------------------------------------------
     2. HOBI — MUNCUL DI: section Hobbies (satu blok = satu kartu pulau)
        island: label kecil | icon: emoji | name: judul | description: isi
     --------------------------------------------------------------- */
  hobbies: [
    { island: 'Pulau 1', icon: '🏝️', name: '[EDIT: hobbies.name 1]', description: '[EDIT: hobbies.description 1]' },
    { island: 'Pulau 2', icon: '🏝️', name: '[EDIT: hobbies.name 2]', description: '[EDIT: hobbies.description 2]' },
    { island: 'Pulau 3', icon: '🏝️', name: '[EDIT: hobbies.name 3]', description: '[EDIT: hobbies.description 3]' },
    { island: 'Pulau 4', icon: '🏝️', name: '[EDIT: hobbies.name 4]', description: '[EDIT: hobbies.description 4]' }
  ],

  /* ---------------------------------------------------------------
     3. PROYEK — MUNCUL DI: section Portfolio (satu blok = satu kartu peti)
        title       : judul kartu
        description : teks pendek di kartu
        details     : teks panjang di jendela detail ("Buka Peti")
        category    : 'websites' | 'designs' | 'creative' | 'other'
        tech        : label kecil, mis. ['HTML', 'Figma']
        cover       : (opsional) 'images/projects/nama.png' — kosongkan untuk sampul otomatis
        demoUrl     : (opsional) tautan demo asli
        sourceUrl   : (opsional) tautan source code asli
        placeholder : true = tampil label "Placeholder". HAPUS baris ini jika proyek sudah asli.
     --------------------------------------------------------------- */
  filters: [ // teks tombol filter (id jangan diubah)
    { id: 'all', label: 'All Treasures' },
    { id: 'websites', label: 'Websites' },
    { id: 'designs', label: 'Designs' },
    { id: 'creative', label: 'Creative Projects' },
    { id: 'other', label: 'Other Works' }
  ],
  projects: [
    { title: '[EDIT: projects.title 1]', description: '[EDIT: projects.description 1]', details: '[EDIT: projects.details 1]',
      category: 'websites', tech: ['[EDIT: tech]'], cover: '', demoUrl: '', sourceUrl: '', placeholder: true },
    { title: '[EDIT: projects.title 2]', description: '[EDIT: projects.description 2]', details: '[EDIT: projects.details 2]',
      category: 'designs', tech: ['[EDIT: tools]'], cover: '', demoUrl: '', sourceUrl: '', placeholder: true },
    { title: '[EDIT: projects.title 3]', description: '[EDIT: projects.description 3]', details: '[EDIT: projects.details 3]',
      category: 'creative', tech: ['[EDIT: tools]'], cover: '', demoUrl: '', sourceUrl: '', placeholder: true },
    { title: '[EDIT: projects.title 4]', description: '[EDIT: projects.description 4]', details: '[EDIT: projects.details 4]',
      category: 'other', tech: ['[EDIT: tools]'], cover: '', demoUrl: '', sourceUrl: '', placeholder: true }
  ],

  /* ---------------------------------------------------------------
     4. SKILL — MUNCUL DI: section Skills (tiga kolom). Tanpa persentase.
        note adalah keterangan kecil (opsional, boleh dihapus)
     --------------------------------------------------------------- */
  skills: [
    { id: 'technical', title: 'Technical Skills', subtitle: 'Perlengkapan di geladak', items: [
      { icon: '⚙️', name: '[EDIT: technical skill 1]', note: '[EDIT: note — opsional]' },
      { icon: '⚙️', name: '[EDIT: technical skill 2]' }
    ]},
    { id: 'creative', title: 'Creative Skills', subtitle: 'Peta & kompas kreatif', items: [
      { icon: '🧭', name: '[EDIT: creative skill 1]' },
      { icon: '🧭', name: '[EDIT: creative skill 2]' }
    ]},
    { id: 'progress', title: 'Skills in Progress', subtitle: 'Sedang ditempa di galangan', items: [
      { icon: '⚓', name: '[EDIT: skill in progress 1]' },
      { icon: '⚓', name: '[EDIT: skill in progress 2]' }
    ]}
  ],

  /* ---------------------------------------------------------------
     5. KONTAK — MUNCUL DI: section Contact
        Kosong ('') = tombol abu-abu "Belum diatur" (tanpa tautan palsu).
        whatsappNumber : angka saja + kode negara, tanpa + spasi -. 081234567890 -> 6281234567890
        instagram/github : username saja, tanpa @
        email          : alamat email
        linkedin       : URL lengkap, diawali https://
        formEndpoint   : URL layanan form (mis. https://formspree.io/f/xxxxxxx). Kosong = form nonaktif.
     --------------------------------------------------------------- */
  contact: {
    whatsappNumber: '',
    whatsappMessage: 'Halo! Saya melihat portofolio kamu.',
    instagram: '',
    email: '',
    github: '',
    linkedin: '',
    formEndpoint: 'https://script.google.com/macros/s/AKfycbw5owK6JRcal7hbuPXaTKm2Ojeh8PV_hfh5oSbU2t9g-blficzVa_DIT3WXCH1KfR5Y/exec'
  },

  /* ---------------------------------------------------------------
     6. NAVBAR — teks menu (id jangan diubah)
     --------------------------------------------------------------- */
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'hobbies', label: 'Hobbies' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ]
};
