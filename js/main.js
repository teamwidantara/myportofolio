/* =====================================================================
   MAIN.JS — logika website (render data, navigasi, animasi).
   Biasanya TIDAK perlu diedit. Data pribadi ada di js/data.js.
   ===================================================================== */
(function () {
  'use strict';

  var C = CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function isPh(s) { return /\[.*\]/.test(String(s)); }
  function ph(s) { return isPh(s) ? ' is-placeholder' : ''; }
  function get(path) { return path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, C); }

  /* ---------------- Ikon (SVG string) ---------------- */
  var ICONS = {
    compass: function (size) {
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="29" fill="#f4e4bc" stroke="#6b4423" stroke-width="3"/><circle cx="32" cy="32" r="22" fill="none" stroke="#6b4423" stroke-width="1" stroke-dasharray="2 3"/><path d="M32 7l6 25-6 25-6-25z" fill="#c8312b"/><path d="M7 32l25-6 25 6-25 6z" fill="#e9b44c" opacity=".9"/><circle cx="32" cy="32" r="4" fill="#0b2545"/></svg>';
    },
    ship: function (size) {
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><path d="M32 6v36" stroke="#3e2714" stroke-width="3" stroke-linecap="round"/><path d="M34 9c12 3 16 14 14 24H34z" fill="#fdfaf2" stroke="#3e2714" stroke-width="2" stroke-linejoin="round"/><path d="M30 14c-9 3-13 12-11 21h11z" fill="#fdfaf2" stroke="#3e2714" stroke-width="2" stroke-linejoin="round"/><path d="M32 6l9 3-9 3z" fill="#c8312b"/><path d="M8 42h48l-7 13H15z" fill="#6b4423" stroke="#3e2714" stroke-width="2" stroke-linejoin="round"/><path d="M12 47h40" stroke="#e9b44c" stroke-width="2"/></svg>';
    }
  };
  var S = 'width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
  var SOCIAL = {
    whatsapp: '<svg ' + S + '><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6L3 21z"/><path d="M9 9.2c.2 2.6 2.4 4.9 5.8 5.8l1.2-1.3-2-1-.9.7c-.8-.4-1.6-1.2-2-2l.7-.9-1-2L9 9.2z"/></svg>',
    instagram: '<svg ' + S + '><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>',
    email: '<svg ' + S + '><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
    github: '<svg ' + S + '><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>',
    linkedin: '<svg ' + S + '><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>'
  };

  /* ---------------- Isi ikon/dekorasi statis ---------------- */
  $$('[data-icon]').forEach(function (el) {
    var size = parseInt(el.getAttribute('data-size') || '32', 10);
    el.innerHTML = ICONS[el.getAttribute('data-icon')](size);
  });
  var cloudSvg = '<svg viewBox="0 0 200 80" aria-hidden="true" focusable="false"><g fill="#fdfaf2"><ellipse cx="60" cy="52" rx="48" ry="22"/><ellipse cx="105" cy="40" rx="42" ry="28"/><ellipse cx="145" cy="54" rx="42" ry="20"/></g></svg>';
  $$('[data-clouds]').forEach(function (wrap) {
    wrap.innerHTML = wrap.getAttribute('data-clouds').split(' ').map(function (n) {
      return '<span class="cloud cloud--' + n + '">' + cloudSvg + '</span>';
    }).join('');
    $$('.cloud', wrap).forEach(function (c) { c.style.display = 'block'; });
  });
  $$('[data-gull]').forEach(function (el) {
    var n = el.getAttribute('data-gull');
    el.outerHTML = '<svg class="gull gull--' + n + '" viewBox="0 0 40 20" aria-hidden="true" focusable="false"><path class="gull__wings" d="M2 12q9-12 18 0q9-12 18 0" fill="none" stroke="#fdfaf2" stroke-width="2.4" stroke-linecap="round"/></svg>';
  });

  /* ---------------- Bind teks sederhana ---------------- */
  $$('[data-bind]').forEach(function (el) {
    var v = get(el.getAttribute('data-bind'));
    el.textContent = v == null ? '' : v;
    if (isPh(v)) el.classList.add('is-placeholder');
  });
  $('#year').textContent = new Date().getFullYear();
  if (!C.profile.bounty.enabled) {
    $('#poster-title').hidden = true;
    $('#poster-foot').hidden = true;
  }

  /* ---------------- Foto profil (dengan fallback) ---------------- */
  var photo = $('#profile-photo');
  photo.alt = C.profile.photoAlt;
  photo.onerror = function () { photo.onerror = null; photo.src = C.profile.photoFallback; };
  photo.src = C.profile.photo;

  /* ---------------- Navbar ---------------- */
  var menu = $('#nav-menu');
  var toggle = $('#nav-toggle');
  menu.innerHTML = C.nav.map(function (n) {
    return '<li><a href="#' + n.id + '" data-nav="' + n.id + '">' + esc(n.label) + '</a></li>';
  }).join('');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  }
  toggle.addEventListener('click', function () { setMenu(!menu.classList.contains('is-open')); });
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + id);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  if ('IntersectionObserver' in window) {
    var links = $$('[data-nav]');
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          var on = l.getAttribute('data-nav') === en.target.id;
          l.classList.toggle('is-active', on);
          if (on) l.setAttribute('aria-current', 'page'); else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' });
    C.nav.forEach(function (n) { var s = document.getElementById(n.id); if (s) secObs.observe(s); });
  }

  /* ---------------- Render: About ---------------- */
  var P = C.profile;
  function list(items) {
    return '<ul class="log__list">' + items.map(function (t) { return '<li class="' + ph(t).trim() + '">' + esc(t) + '</li>'; }).join('') + '</ul>';
  }
  $('#about-log').innerHTML =
    '<div class="reveal log__page log__page--intro"><span class="pin" aria-hidden="true"></span>' +
      '<h3 class="' + ph(P.fullName).trim() + '">' + esc(P.fullName) + '</h3>' +
      '<p class="log__meta">' + esc(P.role) + ' · 📍 ' + esc(P.location) + '</p>' +
      P.intro.map(function (p) { return '<p class="' + ph(p).trim() + '">' + esc(p) + '</p>'; }).join('') +
    '</div>' +
    '<div class="reveal log__page log__page--tilt-r" style="transition-delay:80ms"><span class="pin pin--red" aria-hidden="true"></span><h3>🎓 Pendidikan</h3>' +
      '<ul class="edu">' + P.education.map(function (e) {
        return '<li><strong class="' + ph(e.school).trim() + '">' + esc(e.school) + '</strong><span class="' + ph(e.detail).trim() + '">' + esc(e.detail) + '</span><em class="' + ph(e.period).trim() + '">' + esc(e.period) + '</em></li>';
      }).join('') + '</ul></div>' +
    '<div class="reveal log__page log__page--tilt-l" style="transition-delay:120ms"><span class="pin pin--gold" aria-hidden="true"></span><h3>🧭 Minat &amp; Tujuan</h3><h4>Minat</h4>' + list(P.interests) + '<h4>Tujuan</h4>' + list(P.goals) + '</div>' +
    '<div class="reveal log__page" style="transition-delay:160ms"><span class="pin" aria-hidden="true"></span><h3>⚓ Prinsip Hidup</h3>' + list(P.principles) + '</div>' +
    '<div class="reveal log__page log__page--wide" style="transition-delay:80ms"><span class="pin pin--red" aria-hidden="true"></span><h3>🗺️ Perjalanan Belajar &amp; Pengalaman</h3>' +
      '<ol class="route">' + P.journey.map(function (j) {
        return '<li><span class="route__dot" aria-hidden="true"></span><div><p class="route__period' + ph(j.period) + '">' + esc(j.period) + '</p><h4 class="' + ph(j.title).trim() + '">' + esc(j.title) + '</h4><p class="' + ph(j.text).trim() + '">' + esc(j.text) + '</p></div></li>';
      }).join('') + '</ol></div>';

  /* ---------------- Render: Hobbies ---------------- */
  $('#hobbies-list').innerHTML = C.hobbies.map(function (h, i) {
    return '<li class="reveal island" style="transition-delay:' + (i * 70) + 'ms"><div class="island__card" tabindex="0">' +
      '<span class="island__tag">' + esc(h.island) + '</span><span class="island__icon" aria-hidden="true">' + esc(h.icon) + '</span>' +
      '<h3>' + esc(h.name) + '</h3><p>' + esc(h.description) + '</p><span class="island__sand" aria-hidden="true"></span></div></li>';
  }).join('');

  /* ---------------- Render: Portfolio ---------------- */
  var CAT_ICON = { websites: '🌐', designs: '🎨', creative: '🧭', other: '⚓' };
  function catLabel(id) { var f = C.filters.filter(function (x) { return x.id === id; })[0]; return f ? f.label : id; }
  function coverHtml(p) {
    if (p.cover) return '<img src="' + esc(p.cover) + '" alt="Cover proyek ' + esc(p.title) + '" loading="lazy" onerror="this.outerHTML=\'<div class=&quot;cover cover--' + esc(p.category) + '&quot;><span>' + CAT_ICON[p.category] + '</span></div>\'">';
    return '<div class="cover cover--' + esc(p.category) + '" role="img" aria-label="Cover otomatis"><span aria-hidden="true">' + (CAT_ICON[p.category] || '⚓') + '</span></div>';
  }
  function linksHtml(p) {
    return '<div class="chest__links">' +
      (p.demoUrl ? '<a class="btn btn--small btn--primary" href="' + esc(p.demoUrl) + '" target="_blank" rel="noopener noreferrer">Live Demo</a>'
                 : '<span class="btn btn--small btn--disabled" aria-disabled="true">Demo belum tersedia</span>') +
      (p.sourceUrl ? '<a class="btn btn--small btn--ghost-dark" href="' + esc(p.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Source Code</a>' : '') +
      '</div>';
  }
  var filter = 'all';
  var filtersEl = $('#filters');
  var listEl = $('#projects-list');
  function renderFilters() {
    filtersEl.innerHTML = C.filters.map(function (f) {
      return '<button type="button" class="chip' + (filter === f.id ? ' is-active' : '') + '" data-filter="' + esc(f.id) + '" aria-pressed="' + (filter === f.id) + '">' + esc(f.label) + '</button>';
    }).join('');
  }
  function renderProjects() {
    var items = C.projects.map(function (p, i) { p._i = i; return p; }).filter(function (p) { return filter === 'all' || p.category === filter; });
    if (!items.length) {
      listEl.innerHTML = '<li class="empty" style="grid-column:1/-1">Belum ada harta karun di kategori ini. Tambahkan proyek di js/data.js.</li>';
      return;
    }
    listEl.innerHTML = items.map(function (p, i) {
      return '<li class="reveal chest" style="transition-delay:' + (i * 60) + 'ms"><article class="chest__card">' +
        '<div class="chest__cover">' + coverHtml(p) + '</div><div class="chest__body">' +
        '<p class="chest__cat">' + (CAT_ICON[p.category] || '') + ' ' + esc(catLabel(p.category)) + '</p>' +
        '<h3>' + esc(p.title) + '</h3>' + (p.placeholder ? '<p class="badge">Placeholder</p>' : '') +
        '<p>' + esc(p.description) + '</p>' +
        '<ul class="tags" aria-label="Teknologi">' + (p.tech || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
        '<div class="chest__actions"><button type="button" class="btn btn--small btn--wood" data-open="' + p._i + '">Buka Peti</button>' + linksHtml(p) + '</div>' +
        '</div></article></li>';
    }).join('');
    observeReveals();
  }
  filtersEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = b.getAttribute('data-filter');
    renderFilters();
    renderProjects();
  });

  /* Modal detail proyek */
  var modalEl = null, lastFocus = null;
  function closeModal() {
    if (!modalEl) return;
    modalEl.remove(); modalEl = null;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', modalKey);
    if (lastFocus) lastFocus.focus();
  }
  function modalKey(e) {
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key !== 'Tab' || !modalEl) return;
    var f = $$('a[href],button:not([disabled])', modalEl);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  function openModal(p) {
    lastFocus = document.activeElement;
    modalEl = document.createElement('div');
    modalEl.className = 'modal';
    modalEl.innerHTML = '<div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
      '<button type="button" class="modal__close" aria-label="Tutup detail proyek">✕</button>' +
      '<div class="modal__cover">' + coverHtml(p) + '</div><div class="modal__body">' +
      '<p class="chest__cat">' + (CAT_ICON[p.category] || '') + ' ' + esc(catLabel(p.category)) + '</p>' +
      '<h3 id="modal-title">' + esc(p.title) + '</h3>' +
      (p.placeholder ? '<p class="badge">Placeholder — ganti dengan karya aslimu</p>' : '') +
      '<p>' + esc(p.details || p.description) + '</p>' +
      '<ul class="tags" aria-label="Teknologi yang digunakan">' + (p.tech || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      linksHtml(p) + '</div></div>';
    document.body.appendChild(modalEl);
    document.body.classList.add('no-scroll');
    modalEl.addEventListener('mousedown', function (e) { if (e.target === modalEl) closeModal(); });
    $('.modal__close', modalEl).addEventListener('click', closeModal);
    document.addEventListener('keydown', modalKey);
    $('.modal__close', modalEl).focus();
  }
  listEl.addEventListener('click', function (e) {
    var b = e.target.closest('[data-open]');
    if (b) openModal(C.projects[parseInt(b.getAttribute('data-open'), 10)]);
  });
  renderFilters();
  renderProjects();

  /* ---------------- Render: Skills ---------------- */
  $('#skills-list').innerHTML = C.skills.map(function (g, gi) {
    return '<div class="reveal gear__group gear__group--' + esc(g.id) + '" style="transition-delay:' + (gi * 90) + 'ms"><h3>' + esc(g.title) + '</h3><p class="gear__sub">' + esc(g.subtitle) + '</p><ul>' +
      g.items.map(function (s) {
        return '<li class="gear__card" tabindex="0"><span class="gear__icon" aria-hidden="true">' + esc(s.icon) + '</span><span><strong>' + esc(s.name) + '</strong>' + (s.note ? '<small>' + esc(s.note) + '</small>' : '') + '</span></li>';
      }).join('') + '</ul></div>';
  }).join('');

  /* ---------------- Render: Contact ---------------- */
  var K = C.contact;
  function digits(v) { return String(v || '').replace(/\D/g, ''); }
  var wa = digits(K.whatsappNumber);
  var ig = String(K.instagram || '').trim().replace(/^@/, '');
  var mail = String(K.email || '').trim();
  var gh = String(K.github || '').trim().replace(/^@/, '');
  var li = String(K.linkedin || '').trim();
  var contacts = [
    { kind: 'whatsapp', label: 'WhatsApp', hint: wa ? '+' + wa : 'Belum diatur', url: wa ? 'https://wa.me/' + wa + '?text=' + encodeURIComponent(K.whatsappMessage || '') : '', ext: true },
    { kind: 'instagram', label: 'Instagram', hint: ig ? '@' + ig : 'Belum diatur', url: ig ? 'https://instagram.com/' + ig : '', ext: true },
    { kind: 'email', label: 'Email', hint: mail || 'Belum diatur', url: mail ? 'mailto:' + mail : '', ext: false },
    { kind: 'github', label: 'GitHub', hint: gh ? '@' + gh : 'Belum diatur', url: gh ? 'https://github.com/' + gh : '', ext: true },
    { kind: 'linkedin', label: 'LinkedIn', hint: li ? 'Profil LinkedIn' : 'Belum diatur', url: /^https?:\/\//.test(li) ? li : '', ext: true }
  ];
  $('#contact-list').innerHTML = contacts.map(function (c, i) {
    var inner = SOCIAL[c.kind] + '<span><strong>' + c.label + '</strong><small>' + esc(c.hint) + '</small></span>';
    var body = c.url
      ? '<a class="dock dock--' + c.kind + '" href="' + esc(c.url) + '"' + (c.ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + inner + '</a>'
      : '<span class="dock dock--off" aria-disabled="true" title="Atur di js/data.js">' + inner + '</span>';
    return '<li class="reveal" style="transition-delay:' + (i * 60) + 'ms">' + body + '</li>';
  }).join('');

  /* Form kontak — hanya aktif bila formEndpoint diisi; sukses hanya jika server membalas OK */
  var form = $('#contact-form');
  var statusEl = $('#form-status');
  var submitBtn = $('#form-submit');
  var endpoint = String(K.formEndpoint || '').trim();
  if (!endpoint) {
    $('#form-notice').hidden = false;
    $$('input,textarea,button', form).forEach(function (el) { el.disabled = true; });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!endpoint) return;
    submitBtn.disabled = true; submitBtn.textContent = 'Mengirim…'; statusEl.textContent = '';
    fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) })
      .then(function (res) {
      return res.json().then(function (d) {
  if (res.ok && d && d.ok === true) { statusEl.textContent = '✅ Pesan terkirim. Terima kasih!'; form.reset(); }
  else statusEl.textContent = '⚠️ Pesan gagal terkirim. Coba lagi atau hubungi lewat tombol di atas.';
}).catch(function () {
  statusEl.textContent = '⚠️ Pesan gagal terkirim. Coba lagi atau hubungi lewat tombol di atas.';
});
      })
      .catch(function () { statusEl.textContent = '⚠️ Tidak dapat terhubung ke layanan form. Periksa koneksi internetmu.'; })
      .then(function () { submitBtn.disabled = false; submitBtn.textContent = 'Kirim Pesan'; });
  });

  /* ---------------- Reveal saat scroll ---------------- */
  var revObs = null;
  function observeReveals() {
    var els = $$('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    if (!revObs) {
      revObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); revObs.unobserve(en.target); } });
      }, { threshold: 0.12 });
    }
    els.forEach(function (el) { revObs.observe(el); });
  }
  observeReveals();

  /* ---------------- Parallax hero (mouse + scroll) ---------------- */
  var hero = $('#home');
  if (!reduced) {
    var raf = 0;
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = hero.getBoundingClientRect();
        hero.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        hero.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      });
    });
  }


  /* =====================================================================
     TEMA SIANG / MALAM + LAUT 3D (WebGL, tanpa library) + TALI POSTER
     - Dua laut memakai shader yang sama: hero (siang/malam) dan footer (senja/malam).
     - Cadangan: ombak CSS bila WebGL tidak tersedia.
     - Kualitas render menyesuaikan otomatis dengan kecepatan perangkat.
     ===================================================================== */
  var SEA_FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;',
    'uniform float uNight; uniform float uDusk; uniform vec3 uSun; uniform vec2 uCam;',
    'const float SEA_HEIGHT = 0.6; const float SEA_CHOPPY = 4.0; const float SEA_SPEED = 0.8; const float SEA_FREQ = 0.16;',
    'const vec3 SEA_BASE = vec3(0.01, 0.10, 0.24); const vec3 SEA_WATER = vec3(0.12, 0.62, 0.74);',
    'const mat2 octave_m = mat2(1.6, 1.2, -1.2, 1.6);',
    'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }',
    'float noise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return -1.0 + 2.0 * mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }',
    'float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * (noise(p) * 0.5 + 0.5); p = p * 2.03 + vec2(7.1, 3.7); a *= 0.5; } return v; }',
    'float diffuse(vec3 n, vec3 l, float p){ return pow(dot(n, l) * 0.4 + 0.6, p); }',
    'float specular(vec3 n, vec3 l, vec3 e, float s){ float nrm = (s + 8.0) / (3.14159 * 8.0); return pow(max(dot(reflect(e, n), l), 0.0), s) * nrm; }',
    'vec3 sunDir(){ return normalize(uSun); }',
    'vec3 skyColor(vec3 e){',
    '  float y = max(e.y, 0.0);',
    '  vec3 H = mix(mix(vec3(0.98, 0.91, 0.73), vec3(1.0, 0.58, 0.26), uDusk), vec3(0.10, 0.17, 0.32), uNight);',
    '  vec3 M = mix(mix(vec3(0.56, 0.79, 0.91), vec3(0.86, 0.42, 0.40), uDusk), vec3(0.04, 0.08, 0.22), uNight);',
    '  vec3 T = mix(mix(vec3(0.24, 0.58, 0.84), vec3(0.22, 0.24, 0.52), uDusk), vec3(0.01, 0.02, 0.09), uNight);',
    '  vec3 sky = mix(H, M, smoothstep(0.0, 0.18, y)); sky = mix(sky, T, smoothstep(0.12, 0.8, y));',
    '  vec3 sd = sunDir(); float s = max(dot(e, sd), 0.0); float day = 1.0 - uNight;',
    '  vec3 sunCol = mix(vec3(1.0, 0.86, 0.55), vec3(1.0, 0.6, 0.3), uDusk);',
    '  sky += sunCol * (pow(s, 6.0) * 0.12 + pow(s, 48.0) * 0.30) * day;',
    '  sky = mix(sky, mix(vec3(1.0, 0.89, 0.50), vec3(1.0, 0.72, 0.34), uDusk) * 1.2, smoothstep(0.9966, 0.9970, s) * day);',
    '  vec3 moonCol = vec3(0.72, 0.82, 1.0);',
    '  sky += moonCol * (pow(s, 9.0) * 0.10 + pow(s, 110.0) * 0.28) * uNight;',
    '  float disc = smoothstep(0.9965, 0.9968, s);',
    '  sky = mix(sky, vec3(0.94, 0.96, 1.0) * (0.80 + 0.26 * fbm(e.xy * 150.0)), disc * uNight);',
    '  if (uNight > 0.01 && e.y > 0.0) {',
    '    vec2 sp = vec2(atan(e.x, -e.z) * 70.0, e.y * 90.0);',
    '    vec2 ci = floor(sp); vec2 cf = fract(sp);',
    '    float h = hash(ci);',
    '    vec2 so = vec2(hash(ci + 7.3), hash(ci + 3.1)) * 0.6 + 0.2;',
    '    float d = length(cf - so);',
    '    float tw = 0.65 + 0.35 * sin(uTime * 2.2 + h * 60.0);',
    '    float st = step(0.955, h) * smoothstep(0.16, 0.0, d) * tw * smoothstep(0.03, 0.3, e.y);',
    '    sky += vec3(0.85, 0.92, 1.0) * st * 1.5 * uNight; }',
    '  float cy = e.y + 0.12; vec2 cp = e.xz / cy * 0.55 + vec2(uTime * 0.012, 0.0);',
    '  float c = fbm(cp * 1.4); float cloud = smoothstep(0.52, 0.86, c) * smoothstep(0.0, 0.22, e.y);',
    '  vec3 cloudCol = mix(vec3(0.82, 0.88, 0.95), vec3(1.0, 0.98, 0.94), smoothstep(0.45, 0.85, c));',
    '  cloudCol = mix(cloudCol, vec3(1.0, 0.74, 0.58), uDusk * 0.7);',
    '  cloudCol = mix(cloudCol, vec3(0.20, 0.25, 0.42) * (0.6 + 0.5 * c), uNight);',
    '  sky = mix(sky, cloudCol, cloud * mix(0.9, 0.55, uNight));',
    '  return sky; }',
    'float sea_octave(vec2 uv, float choppy){ uv += noise(uv); vec2 wv = 1.0 - abs(sin(uv)); vec2 swv = abs(cos(uv)); wv = mix(wv, swv, wv); return pow(1.0 - pow(wv.x * wv.y, 0.65), choppy); }',
    'float map(vec3 p, int iters){',
    '  float freq = SEA_FREQ; float amp = SEA_HEIGHT; float choppy = SEA_CHOPPY;',
    '  vec2 uv = p.xz; uv.x *= 0.75; float t = 1.0 + uTime * SEA_SPEED; float h = 0.0;',
    '  for (int i = 0; i < 5; i++) { if (i >= iters) break;',
    '    float d = sea_octave((uv + t) * freq, choppy); d += sea_octave((uv - t) * freq, choppy);',
    '    h += d * amp; uv = octave_m * uv; freq *= 1.9; amp *= 0.22; choppy = mix(choppy, 1.0, 0.2); }',
    '  return p.y - h; }',
    'vec3 getNormal(vec3 p, float eps){ vec3 n; n.y = map(p, 5); n.x = map(vec3(p.x + eps, p.y, p.z), 5) - n.y; n.z = map(vec3(p.x, p.y, p.z + eps), 5) - n.y; n.y = eps; return normalize(n + vec3(0.0, 1e-4, 0.0)); }',
    'float trace(vec3 ori, vec3 dir, out vec3 p){',
    '  float tm = 0.0; float tx = 1000.0; float hx = map(ori + dir * tx, 3);',
    '  if (hx > 0.0) { p = ori + dir * tx; return tx; }',
    '  float hm = map(ori, 3);',
    '  for (int i = 0; i < 8; i++) { float tmid = mix(tm, tx, hm / (hm - hx)); p = ori + dir * tmid; float hmid = map(p, 3);',
    '    if (hmid < 0.0) { tx = tmid; hx = hmid; } else { tm = tmid; hm = hmid; } }',
    '  return mix(tm, tx, hm / (hm - hx)); }',
    'vec3 seaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist){',
    '  vec3 sBase = mix(SEA_BASE, vec3(0.0, 0.015, 0.06), uNight);',
    '  vec3 sWater = mix(SEA_WATER, vec3(0.05, 0.20, 0.36), uNight);',
    '  sWater = mix(sWater, vec3(0.20, 0.30, 0.50), uDusk * (1.0 - uNight));',
    '  float fresnel = clamp(1.0 - dot(n, -eye), 0.0, 1.0); fresnel = pow(fresnel, 3.0) * 0.55;',
    '  vec3 reflected = skyColor(reflect(eye, n));',
    '  vec3 refracted = sBase + diffuse(n, l, 60.0) * sWater * 0.42;',
    '  vec3 col = mix(refracted, reflected, fresnel);',
    '  float atten = max(1.0 - dot(dist, dist) * 0.0016, 0.0);',
    '  col += sWater * clamp(p.y - SEA_HEIGHT, -0.5, 0.6) * 0.5 * atten;',
    '  float crest = smoothstep(0.62, 1.0, p.y) * atten; col = mix(col, mix(vec3(0.93, 0.98, 1.0), vec3(0.55, 0.65, 0.85), uNight), crest * 0.5);',
    '  vec3 specCol = mix(mix(vec3(1.0, 0.92, 0.7), vec3(1.0, 0.62, 0.3), uDusk), vec3(0.75, 0.85, 1.0), uNight);',
    '  col += specCol * min(specular(n, l, eye, 180.0), 2.5);',
    '  return col; }',
    'void main(){',
    '  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / uRes.y;',
    '  float hOff = uCam.y + uMouse.y * 0.02 - uScroll * 0.1;',
    '  vec3 ro = vec3(uMouse.x * 1.2, uCam.x + uMouse.y * 0.15, -uTime * 1.2);',
    '  vec3 rd = normalize(vec3(uv.x + uMouse.x * 0.025, uv.y + hOff, -1.6));',
    '  vec3 col = skyColor(rd);',
    '  if (rd.y < 0.03) {',
    '    vec3 p; float t = trace(ro, rd, p); vec3 dist = p - ro;',
    '    vec3 n = getNormal(p, dot(dist, dist) * (0.1 / uRes.x));',
    '    vec3 sea = seaColor(p, n, sunDir(), rd, dist);',
    '    sea = mix(sea, skyColor(vec3(rd.x, 0.0, rd.z)), clamp(dot(dist, dist) * 0.00018, 0.0, 0.85));',
    '    col = mix(col, sea, pow(1.0 - smoothstep(-0.03, 0.03, rd.y), 0.35)); }',
    '  col = clamp(col, 0.0, 1.0); col = pow(col, vec3(0.82)); col = mix(col, col * col * (3.0 - 2.0 * col), 0.22);',
    '  gl_FragColor = vec4(col, 1.0); }'
  ].join('\n');

  var root = document.documentElement;
  var themeBtn = $('#theme-btn');
  var themeMeta = $('meta[name="theme-color"]');
  var night = 0, nightTarget = 0;
  var seas = [];
  var shared = { q: window.innerWidth < 700 ? 0.55 : 0.85, mx: 0, my: 0, tmx: 0, tmy: 0 };
  var T0 = performance.now(), loopRaf = 0, lastT = 0, accT = 0, nT = 0;

  function makeSea(canvas, host, cfg) {
    var gl = null;
    try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' }) || canvas.getContext('experimental-webgl'); } catch (e) {}
    if (!gl) return null;
    function sh(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { if (window.console) console.warn('Shader laut gagal:', gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var vs = sh(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }');
    var fs = sh(gl.FRAGMENT_SHADER, SEA_FS);
    if (!vs || !fs) return null;
    var prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ['uRes', 'uTime', 'uMouse', 'uScroll', 'uNight', 'uDusk', 'uSun', 'uCam'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    host.classList.add('is-gl');            // tampilkan kanvas DULU agar ukurannya terbaca
    var sea = { visible: true, host: host };
    sea.draw = function (time, nightV) {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(2, Math.floor(canvas.clientWidth * dpr * shared.q));
      var h = Math.max(2, Math.floor(canvas.clientHeight * dpr * shared.q));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, w, h);
      var sd = cfg.sun(w / h);
      gl.uniform2f(U.uRes, w, h);
      gl.uniform1f(U.uTime, time + cfg.timeOffset);
      gl.uniform2f(U.uMouse, cfg.mouse ? shared.mx : 0, cfg.mouse ? shared.my : 0);
      gl.uniform1f(U.uScroll, cfg.scroll ? Math.min(window.scrollY / window.innerHeight, 1) : 0);
      gl.uniform1f(U.uNight, nightV);
      gl.uniform1f(U.uDusk, cfg.dusk);
      gl.uniform3f(U.uSun, sd[0], sd[1], sd[2]);
      gl.uniform2f(U.uCam, cfg.cam[0], cfg.cam[1]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); host.classList.remove('is-gl'); sea.visible = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { sea.visible = en[0].isIntersecting; if (sea.visible) kick(); }, { threshold: 0 }).observe(host);
    }
    seas.push(sea);
    return sea;
  }
  function norm(v) { var l = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]); return [v[0] / l, v[1] / l, v[2] / l]; }

  // Laut HERO: siang cerah / malam berbulan. Matahari & bulan diletakkan di celah antara teks dan poster.
  var heroCam = [2.3, 0.2];
  makeSea($('#sea-gl'), $('.sea'), {
    dusk: 0, cam: heroCam, mouse: true, scroll: true, timeOffset: 4,
    sun: function (asp) { return asp > 1 ? norm([0.2, 0.3 + heroCam[1], -1.6]) : norm([0.42, 0.62 + heroCam[1], -1.6]); }
  });
  // Laut FOOTER: senja (matahari terbenam) / malam berbulan, matahari/bulan rendah di dekat cakrawala
  if ($('#footer-gl')) makeSea($('#footer-gl'), $('#footer'), {   // footer kini dasar laut (js/ocean.js); laut 3D footer dilewati bila kanvasnya tidak ada
    dusk: 1, cam: [2.0, 0.08], mouse: false, scroll: false, timeOffset: 40,
    sun: function (asp) { return norm([asp > 1.6 ? -0.9 : -0.26 * asp, 0.075, -1.6]); }
  });

  function drawAll() {
    var t = (performance.now() - T0) / 1000;
    seas.forEach(function (s) { s.draw(t, night); });
  }
  function frame(now) {
    loopRaf = 0;
    if (document.hidden) return;
    var dt = lastT ? Math.min((now - lastT) / 1000, 0.1) : 0.016;
    var dn = nightTarget - night;
    night = Math.abs(dn) > 0.003 ? night + dn * (1 - Math.exp(-dt * 3.2)) : nightTarget;
    shared.mx += (shared.tmx - shared.mx) * 0.05; shared.my += (shared.tmy - shared.my) * 0.05;
    var t = (now - T0) / 1000, any = false;
    seas.forEach(function (s) { if (s.visible) { any = true; s.draw(t, night); } });
    ropes();
    if (lastT) { accT += now - lastT; nT++; if (nT >= 40) { if (accT / nT > 28 && shared.q > 0.4) shared.q *= 0.8; accT = 0; nT = 0; } }
    lastT = now;
    if (any || night !== nightTarget) loopRaf = requestAnimationFrame(frame); else lastT = 0;
  }
  function kick() { if (!loopRaf && !reduced) { lastT = 0; loopRaf = requestAnimationFrame(frame); } }

  /* ---- Tali gantungan poster: menempel di bawah navbar, ujung bawah di paku poster ---- */
  var ropeSvg = $('#ropes'), ropeSets = ropeSvg ? $$('.rope-set', ropeSvg) : [];
  var navBar = $('.nav__bar'), nails = [$('.poster__nail--l'), $('.poster__nail--r')];
  function ropes() {
    if (!ropeSvg || !navBar) return;
    var hr = hero.getBoundingClientRect(), nb = navBar.getBoundingClientRect();
    var ay = nb.bottom - hr.top - 3, t = performance.now() / 1000;
    nails.forEach(function (nail, i) {
      var set = ropeSets[i]; if (!nail || !set) return;
      var r = nail.getBoundingClientRect();
      var nx = r.left + r.width / 2 - hr.left, ny = r.top + r.height / 2 - hr.top;
      if (ny - ay < 12) { set.style.opacity = '0'; return; }
      set.style.opacity = '1';
      var sway = reduced ? 0 : Math.sin(t * 1.3 + i * 1.7) * 5;
      var d = 'M' + nx.toFixed(1) + ' ' + ay.toFixed(1) + ' Q ' + (nx + sway).toFixed(1) + ' ' + ((ay + ny) / 2).toFixed(1) + ' ' + nx.toFixed(1) + ' ' + ny.toFixed(1);
      $$('path', set).forEach(function (p) { p.setAttribute('d', d); });
      var ring = $('.rope-ring', set), knot = $('.rope-knot', set);
      ring.setAttribute('cx', nx.toFixed(1)); ring.setAttribute('cy', ay.toFixed(1));
      knot.setAttribute('cx', nx.toFixed(1)); knot.setAttribute('cy', ny.toFixed(1));
    });
  }

  /* ---- Tema siang / malam ---- */
  function savedTheme() { try { return localStorage.getItem('gl-theme'); } catch (e) { return null; } }
  function saveTheme(t) { try { localStorage.setItem('gl-theme', t); } catch (e) {} }
  function applyTheme(t, instant) {
    root.setAttribute('data-theme', t);
    nightTarget = t === 'night' ? 1 : 0;
    if (themeMeta) themeMeta.setAttribute('content', t === 'night' ? '#050d1c' : '#0b2545');
    themeBtn.setAttribute('aria-pressed', String(t === 'night'));
    themeBtn.setAttribute('aria-label', t === 'night' ? 'Ganti ke mode siang' : 'Ganti ke mode malam');
    if (instant || reduced) { night = nightTarget; drawAll(); ropes(); } else kick();
  }
  var theme = savedTheme();
  if (theme !== 'day' && theme !== 'night') {
    var pref = C.theme || 'auto';
    theme = (pref === 'day' || pref === 'night') ? pref
      : ((window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'night' : 'day');
  }
  themeBtn.addEventListener('click', function () {
    theme = theme === 'night' ? 'day' : 'night';
    saveTheme(theme);
    applyTheme(theme, false);
  });
  applyTheme(theme, true);

  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var r = hero.getBoundingClientRect();
    shared.tmx = ((e.clientX - r.left) / r.width) * 2 - 1;
    shared.tmy = -(((e.clientY - r.top) / r.height) * 2 - 1);
  });
  document.addEventListener('visibilitychange', function () { if (!document.hidden) kick(); });
  if (reduced) {                                   // reduced-motion: gambar statis, perbarui saat resize/scroll
    window.addEventListener('resize', function () { drawAll(); ropes(); });
    window.addEventListener('scroll', ropes, { passive: true });
  }
  ropes();
  kick();

  /* ---------------- Scroll: progress rute + tombol ke atas + parallax scroll ---------------- */
  var done = $('#voyage-done'), ship = $('#voyage-ship'), toTop = $('#to-top');
  var ticking = false;
  function onScroll() {
    ticking = false;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0;
    done.style.transform = 'scaleX(' + p + ')';
    ship.style.left = (p * 100) + '%';
    var show = p > 0.08;
    toTop.classList.toggle('is-visible', show);
    toTop.tabIndex = show ? 0 : -1;
    if (!reduced) hero.style.setProperty('--sy', String(Math.min(window.scrollY, window.innerHeight)));
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

  /* ---------------- Kursor kompas (hanya perangkat dengan mouse) ---------------- */
  var cur = $('#compass-cursor');
  if (finePointer && cur) {
    cur.hidden = false;
    document.documentElement.classList.add('has-compass');
    var x = 0, y = 0, lx = 0, ly = 0, angle = 0, cr = 0;
    var tick = function () {
      cr = 0;
      var dx = x - lx, dy = y - ly;
      if (!reduced && Math.hypot(dx, dy) > 2) angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      lx = x; ly = y;
      cur.style.transform = 'translate3d(' + (x - 18) + 'px,' + (y - 18) + 'px,0) rotate(' + angle + 'deg)';
    };
    window.addEventListener('pointermove', function (e) {
      x = e.clientX; y = e.clientY; cur.style.opacity = '1';
      if (!cr) cr = requestAnimationFrame(tick);
    });
    document.addEventListener('pointerleave', function () { cur.style.opacity = '0'; });
  } else if (cur) {
    cur.remove();
  }

  /* ---------------- Easter egg ---------------- */
  var toast = $('#toast'), toastT = 0;
  $('#easter-egg').addEventListener('click', function () {
    toast.hidden = false;
    clearTimeout(toastT);
    toastT = setTimeout(function () { toast.hidden = true; }, 5000);
  });
})();
