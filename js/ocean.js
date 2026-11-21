/* =====================================================================
   OCEAN.JS — lautan dalam di bawah hero + dasar laut di footer.
   Dipanggil SETELAH main.js dan extras.js (sudah dipasang di index.html).

   Yang digambar otomatis (semuanya SVG/CSS orisinal, tanpa gambar eksternal):
   - dinding terumbu karang kiri & kanan yang berjalan sepanjang section About → Contact
     (karang bercabang, karang kipas, karang otak, karang tabung, anemon, rumput laut)
   - sinar matahari & salju laut yang makin redup / makin rapat ke bawah
   - gerombolan ikan, ubur-ubur berpendar, pari manta, gelembung
   - dasar laut di footer: pasir, terumbu besar, peti harta (X di peta!)
   Warna latar ada di css/style.css (blok "LAUTAN DALAM", variabel --z0 … --z6).
   Karang otomatis berganti suasana: hangat di dangkal, ungu/biru di dalam,
   dan ujungnya berpendar saat mode malam.
   ===================================================================== */
(function () {
  'use strict';

  var ocean = document.getElementById('ocean');
  var deco = document.getElementById('ocean-deco');
  var seabedHost = document.getElementById('seabed');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- util ---------------- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function P(n) { return Math.round(n * 10) / 10; }
  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function swayAttr(r, extra) {
    return 'class="sw' + (extra || '') + '" style="--t:' + (5 + r() * 5).toFixed(1) + 's;--d:-' + (r() * 8).toFixed(1) + 's"';
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    return e;
  }

  /* =====================================================================
     GENERATOR KARANG — semua berpangkal di (0,0) dan tumbuh ke atas (−y), tinggi nominal h
     Warna lewat variabel CSS: --c (badan), --c2 (ujung/terang) → mudah ganti di CSS.
     ===================================================================== */
  function branch(r, h) {                       // karang bercabang (staghorn)
    var W = [h * .1, h * .075, h * .055, h * .038, h * .026], seg = [[], [], [], [], []], tips = [];
    (function grow(x, y, a, len, d) {
      var x2 = x + Math.sin(a) * len, y2 = y - Math.cos(a) * len;
      seg[d].push('M' + P(x) + ' ' + P(y) + 'L' + P(x2) + ' ' + P(y2));
      if (d === 4) { tips.push([x2, y2]); return; }
      var n = (d < 2 && r() < .4) ? 3 : 2;
      for (var i = 0; i < n; i++) {
        var off = (i - (n - 1) / 2) * (.5 + r() * .3) + (r() - .5) * .22;
        grow(x2, y2, a + off, len * (.7 + r() * .1), d + 1);
      }
    })(0, 0, (r() - .5) * .3, h * .3, 0);
    var s = '<g ' + swayAttr(r) + '><g fill="none" stroke="var(--c)" stroke-linecap="round">';
    for (var i = 0; i < 5; i++) s += '<path d="' + seg[i].join('') + '" stroke-width="' + P(W[i]) + '"/>';
    s += '</g>';
    tips.forEach(function (t, i) { if (i % 2 === 0) s += '<circle class="tip" cx="' + P(t[0]) + '" cy="' + P(t[1]) + '" r="' + P(W[4] * .8) + '"/>'; });
    return s + '</g>';
  }

  function fan(r, h) {                          // karang kipas (gorgonian)
    var cy = -h * .18, R = h * .85, N = 13, A = 1.05, rad = [.45, .72, 1], ring = [[], [], []], ribs = '', outer = [];
    for (var i = 0; i < N; i++) {
      var a = -A + 2 * A * i / (N - 1) + (r() - .5) * .05, k = .92 + r() * .08;
      ribs += 'M0 ' + P(cy) + 'L' + P(Math.sin(a) * R * k) + ' ' + P(cy - Math.cos(a) * R * k);
      for (var j = 0; j < 3; j++) ring[j].push(P(Math.sin(a) * R * rad[j] * k) + ' ' + P(cy - Math.cos(a) * R * rad[j] * k));
    }
    var s = '<g ' + swayAttr(r) + '>' +
      '<path d="M0 0L0 ' + P(cy) + '" stroke="var(--c)" stroke-width="' + P(h * .05) + '" stroke-linecap="round" fill="none"/>' +
      '<path d="M0 ' + P(cy) + 'L' + ring[2].join('L') + 'Z" fill="var(--c)" fill-opacity=".14"/>' +
      '<g fill="none" stroke="var(--c)" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + ribs + '" stroke-width="2"/>';
    for (var q = 0; q < 3; q++) s += '<path d="M' + ring[q].join('L') + '" stroke-width="1.5" stroke-opacity="' + (.95 - q * .12).toFixed(2) + '"/>';
    s += '</g>';
    for (var m = 0; m < N; m += 2) s += '<circle class="tip" r="2" cx="' + ring[2][m].split(' ')[0] + '" cy="' + ring[2][m].split(' ')[1] + '"/>';
    return s + '</g>';
  }

  function brain(r, h) {                        // karang otak
    var rx = h * .5, ry = h * .36;
    var s = '<path d="M' + P(-rx) + ' 0A' + P(rx) + ' ' + P(ry) + ' 0 0 1 ' + P(rx) + ' 0Z" fill="var(--c)"/>' +
      '<ellipse cx="' + P(-rx * .3) + '" cy="' + P(-ry * .6) + '" rx="' + P(rx * .38) + '" ry="' + P(ry * .22) + '" fill="var(--c2)" fill-opacity=".32"/>' +
      '<g fill="none" stroke="var(--c2)" stroke-linecap="round" stroke-opacity=".55" stroke-width="1.8">';
    for (var i = 0; i < 9; i++) {
      var x = (r() * 2 - 1) * rx * .78, y = -(6 + r() * ry * .85);
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) > .8) continue;
      s += '<path d="M' + P(x) + ' ' + P(y) + 'q4 -5 8 0t8 0t8 0"/>';
    }
    return s + '</g>';
  }

  function tubes(r, h) {                        // karang tabung / organ-pipe
    var n = 4 + Math.floor(r() * 3), s = '';
    for (var i = 0; i < n; i++) {
      var ang = ((i - (n - 1) / 2) * .22 + (r() - .5) * .1) * 57.3, th = h * (.45 + r() * .5), tw = h * (.12 + r() * .05), x0 = (i - (n - 1) / 2) * tw * 1.05;
      s += '<g transform="translate(' + P(x0) + ' 0) rotate(' + P(ang) + ')">' +
        '<path d="M' + P(-tw / 2) + ' 0V' + P(-th) + 'A' + P(tw / 2) + ' ' + P(tw * .22) + ' 0 0 1 ' + P(tw / 2) + ' ' + P(-th) + 'V0Z" fill="var(--c)"/>' +
        '<rect x="' + P(-tw / 2) + '" y="' + P(-th) + '" width="' + P(tw * .28) + '" height="' + P(th) + '" fill="var(--c2)" fill-opacity=".22"/>' +
        '<ellipse cx="0" cy="' + P(-th) + '" rx="' + P(tw / 2) + '" ry="' + P(tw * .22) + '" fill="var(--c2)"/>' +
        '<ellipse cx="0" cy="' + P(-th) + '" rx="' + P(tw * .32) + '" ry="' + P(tw * .12) + '" fill="rgba(4,20,40,.55)"/></g>';
    }
    return '<g>' + s + '</g>';
  }

  function anem(r, h) {                         // anemon laut
    var n = 15, s = '<g ' + swayAttr(r) + '><ellipse cx="0" cy="-2" rx="' + P(h * .2) + '" ry="' + P(h * .07) + '" fill="var(--c)"/><g fill="none" stroke="var(--c)" stroke-linecap="round" stroke-width="' + P(h * .04) + '">';
    var tipS = '';
    for (var i = 0; i < n; i++) {
      var bx = (i / (n - 1) - .5) * h * .3, a = (i / (n - 1) - .5) * 2.2 + (r() - .5) * .2, len = h * (.42 + r() * .32);
      var ex = bx + Math.sin(a) * len, ey = -Math.cos(a) * len, cx = bx + Math.sin(a) * len * .3 + (r() - .5) * h * .2, cy = ey * .55;
      s += '<path d="M' + P(bx) + ' 0Q' + P(cx) + ' ' + P(cy) + ' ' + P(ex) + ' ' + P(ey) + '"/>';
      tipS += '<circle class="tip" cx="' + P(ex) + '" cy="' + P(ey) + '" r="' + P(h * .032) + '"/>';
    }
    return s + '</g>' + tipS + '</g>';
  }

  function kelp(r, h) {                         // rumput laut / kelp
    var nb = 2 + Math.floor(r() * 2), s = '';
    for (var b = 0; b < nb; b++) {
      var hh = h * (.9 + r() * .8), ph = r() * 6, bw = h * (.08 + r() * .03), dx = (b - (nb - 1) / 2) * h * .16, L = [], R = [];
      for (var i = 0; i <= 14; i++) {
        var t = i / 14, x = dx + Math.sin(t * 3.2 + ph) * hh * .07 * t, w = bw * (1 - t * .78) / 2, y = -hh * t;
        L.push(P(x - w) + ' ' + P(y)); R.unshift(P(x + w) + ' ' + P(y));
      }
      s += '<g ' + swayAttr(r, ' sw--k') + '><path class="kelp" d="M' + L.join('L') + 'L' + R.join('L') + 'Z"/></g>';
    }
    return s;
  }
  var GEN = { branch: branch, fan: fan, brain: brain, tubes: tubes, anem: anem, kelp: kelp };

  /* ---------------- Dinding terumbu (kiri & kanan) ---------------- */
  var TW = 420, TH = 520;
  function smoothBody(p) {
    var d = '';
    for (var i = 1; i < p.length - 1; i++) {
      d += 'Q' + P(p[i][0]) + ' ' + P(p[i][1]) + ' ' + P((p[i][0] + p[i + 1][0]) / 2) + ' ' + P((p[i][1] + p[i + 1][1]) / 2);
    }
    return d + 'L' + P(p[p.length - 1][0]) + ' ' + P(p[p.length - 1][1]);
  }
  function pickType(r, f) {
    var t = r();
    if (f < .12) return t < .4 ? 'kelp' : t < .7 ? 'branch' : t < .85 ? 'brain' : 'anem';
    if (f < .55) return t < .3 ? 'branch' : t < .45 ? 'fan' : t < .6 ? 'tubes' : t < .75 ? 'brain' : t < .88 ? 'anem' : 'kelp';
    if (f < .85) return t < .3 ? 'fan' : t < .55 ? 'tubes' : t < .8 ? 'branch' : 'brain';
    return t < .4 ? 'tubes' : t < .7 ? 'fan' : 'branch';
  }
  function wallTile(seed, f) {
    var r = rng(seed), X0 = 30, n = 8, pts = [], pts2 = [], i;
    for (i = 0; i <= n; i++) pts.push([(i === 0 || i === n) ? X0 : 16 + r() * 50, TH * i / n]);
    for (i = 0; i <= n; i++) pts2.push([pts[i][0] * .55 + 4, pts[i][1]]);
    var s = '<path class="rk" d="M-20 -6L' + X0 + ' -6L' + X0 + ' 0' + smoothBody(pts) + 'L' + X0 + ' ' + (TH + 6) + 'L-20 ' + (TH + 6) + 'Z"/>' +
      '<path class="rk2" d="M-20 -6L' + P(pts2[0][0]) + ' -6L' + P(pts2[0][0]) + ' 0' + smoothBody(pts2) + 'L' + P(pts2[0][0]) + ' ' + (TH + 6) + 'L-20 ' + (TH + 6) + 'Z"/>' +
      '<path class="re" d="M' + X0 + ' 0' + smoothBody(pts) + '"/>';
    var cfg = f < .12 ? { n: 3, pal: ['a', 'b', 'e'] }
      : f < .55 ? { n: 5, pal: ['a', 'b', 'c', 'd', 'e'] }
      : f < .85 ? { n: 4, pal: ['c', 'd', 'e', 'f'] }
      : { n: 3, pal: ['d', 'c', 'f'] };
    for (var k = 0; k < cfg.n; k++) {
      var idx = Math.max(1, Math.min(n - 1, 1 + Math.floor((k + r() * .8) / cfg.n * (n - 1))));
      var type = pickType(r, f), sc = .75 + r() * .65;
      var a = type === 'kelp' ? (-8 + r() * 30) : (52 + r() * 46);
      s += '<g class="cc-' + pick(r, cfg.pal) + '" transform="translate(' + P(pts[idx][0] - 6) + ' ' + P(pts[idx][1]) + ') rotate(' + P(a) + ') scale(' + sc.toFixed(2) + ')">' + GEN[type](r, 105) + '</g>';
    }
    return '<svg class="wt" viewBox="0 0 ' + TW + ' ' + TH + '" aria-hidden="true" focusable="false"' + (f > .75 ? ' style="opacity:.9"' : '') + '>' + s + '</svg>';
  }

  /* =====================================================================
     Bangun kolom laut
     ===================================================================== */
  if (ocean && deco) {
    var wallL = el('div', 'wall wall--l'), wallR = el('div', 'wall wall--r');
    deco.appendChild(wallL); deco.appendChild(wallR);
    var cols = [{ host: wallL, n: 0, salt: 0 }, { host: wallR, n: 0, salt: 7919 }];
    var geo = { k: 1, w: 200, vw: 0 };

    function layout(rebuild) {
      var vw = window.innerWidth, H = ocean.offsetHeight;
      var w = Math.max(110, Math.min(420, vw * .17 + 40));
      var k = Math.max(w / TW, H / (30 * TH));              // batasi jumlah ubin pada halaman sangat panjang
      geo.w = w; geo.k = k; geo.vw = vw;
      cols.forEach(function (c) {
        c.host.style.width = w + 'px';
        if (rebuild) { c.host.innerHTML = ''; c.n = 0; }
        var need = Math.ceil(H / (TH * k)) + 1;
        while (c.n < need) {
          var f = Math.min(1, (c.n * TH * k) / Math.max(H, 1));
          c.host.insertAdjacentHTML('beforeend', wallTile(1000 + c.n * 17 + c.salt, f));
          c.n++;
        }
        while (c.n > need) { c.host.removeChild(c.host.lastChild); c.n--; }
        var svgs = c.host.children;
        for (var i = 0; i < svgs.length; i++) { svgs[i].setAttribute('width', P(TW * k)); svgs[i].setAttribute('height', P(TH * k)); }
      });
    }

    /* permukaan: riak cahaya di bawah ombak hero */
    var wv = '<svg viewBox="0 0 2400 90" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 40Q150 10 300 40T600 40T900 40T1200 40T1500 40T1800 40T2100 40T2400 40"/></svg>';
    deco.appendChild(el('div', 'surface', wv + wv));

    /* kehidupan laut */
    var small = window.innerWidth < 700;
    var life = el('div', 'life');
    var html = '', i, r = rng(99);
    for (i = 0; i < (small ? 14 : 28); i++) {
      var d = 12 + r() * 14;
      html += '<span class="bub" style="left:' + (r() * 100).toFixed(1) + '%;top:' + (4 + r() * 92).toFixed(1) + '%;--s:' + (4 + r() * 9).toFixed(1) + 'px;--d:' + d.toFixed(1) + 's;--dl:-' + (r() * d).toFixed(1) + 's;--x:' + ((r() - .5) * 40).toFixed(0) + 'px;--r:' + (500 + r() * 400).toFixed(0) + 'px"></span>';
    }
    var FISH = '<svg viewBox="0 0 40 20" aria-hidden="true" focusable="false"><path class="ft" d="M10 10L0 2.5 2.5 10 0 17.5Z"/><path class="fb" d="M8 10C12 2 28 1.5 38 10 28 18.5 12 18 8 10Z"/><path class="fs" d="M20 3.2C22 7 22 13 20 16.8L24 16.2C26 12 26 8 24 3.8Z"/><circle cx="32" cy="8.2" r="1.4" fill="#04213f"/></svg>';
    var SCHOOLS = [ // top%, jenis, jumlah, arah, durasi, delay, skala
      [3, 'b', 6, 1, 58, -8, .8], [10, 'a', 5, -1, 72, -30, .95], [18, 'a', 7, 1, 64, -44, .85], [27, 'c', 4, -1, 84, -12, 1.05],
      [36, 'b', 6, 1, 60, -20, .9], [45, 'a', 5, -1, 76, -50, 1], [54, 'd', 5, 1, 92, -26, .95], [63, 'd', 6, -1, 104, -60, 1], [78, 'd', 4, 1, 118, -40, 1.1]
    ];
    SCHOOLS.forEach(function (s, idx) {
      if (small && idx % 2) return;
      var rr = rng(s[0] * 100 + s[2]);
      html += '<div class="school school--' + (s[3] > 0 ? 'r' : 'l') + ' fh-' + s[1] + '" style="top:' + s[0] + '%;--dur:' + s[4] + 's;--dl:' + s[5] + 's;--sc:' + s[6] + '">';
      for (var f = 0; f < s[2]; f++) html += '<span class="fish" style="left:' + (rr() * 90).toFixed(0) + 'px;top:' + ((rr() - .5) * 46).toFixed(0) + 'px;--bd:' + (2 + rr() * 2).toFixed(1) + 's;--bl:-' + (rr() * 3).toFixed(1) + 's">' + FISH + '</span>';
      html += '</div>';
    });
    var JELLY = '<svg viewBox="0 0 80 130" aria-hidden="true" focusable="false"><circle class="jh" cx="40" cy="34" r="48"/><g class="jt" fill="none" stroke-linecap="round"><path d="M20 44q-6 18 0 34t0 40"/><path d="M32 46q-5 20 0 38t0 40"/><path d="M46 46q5 20 0 38t0 40"/><path d="M60 44q6 18 0 34t0 40"/></g><path class="jb" d="M6 44C6 8 74 8 74 44 66 38 58 47 50 41 44 48 36 48 30 41 22 47 14 38 6 44Z"/><path d="M16 36C18 20 34 14 46 16" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/></svg>';
    [[5, 60, .9, 26, -4], [90, 68, 1.1, 30, -10], [11, 77, .8, 24, -14], [86, 84, 1, 32, -7], [6, 91, .9, 28, -18]].forEach(function (j, idx) {
      if (small && idx > 2) return;
      html += '<div class="jelly" style="left:' + j[0] + '%;top:' + j[1] + '%;--sc:' + j[2] + ';--dur:' + j[3] + 's;--dl:' + j[4] + 's">' + JELLY + '</div>';
    });
    html += '<div class="manta" style="top:70%"><svg viewBox="0 0 200 100" aria-hidden="true" focusable="false"><path d="M196 50C170 44 130 24 70 6 84 22 96 34 104 42 70 44 40 48 6 50 40 52 70 56 104 58 96 66 84 78 70 94 130 76 170 56 196 50Z"/></svg></div>';
    life.innerHTML = html;
    deco.appendChild(life);

    /* efek mengikuti layar: sinar matahari, salju laut, redup di kedalaman */
    function snowTile(seed, size, count, r0, r1, alpha) {
      var q = rng(seed), s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '">';
      for (var n = 0; n < count; n++) s += '<circle cx="' + ((q() * size) | 0) + '" cy="' + ((q() * size) | 0) + '" r="' + (r0 + q() * (r1 - r0)).toFixed(1) + '" fill="#e8fbff" fill-opacity="' + (alpha * (.5 + q() * .5)).toFixed(2) + '"/>';
      return 'url("data:image/svg+xml,' + encodeURIComponent(s + '</svg>') + '")';
    }
    var fx = el('div', 'ocean__fx');
    fx.setAttribute('aria-hidden', 'true');
    var sun = el('div', 'fx-sun', '<div class="fx-rays"></div>');
    var snowA = el('div', 'fx-snow'), snowB = el('div', 'fx-snow'), vig = el('div', 'fx-vig');
    snowA.style.cssText = '--tile:400px;--sd:75s;background-image:' + snowTile(5, 400, 16, 1, 2.2, .55) + ';background-size:400px 400px';
    snowB.style.cssText = '--tile:240px;--sd:42s;background-image:' + snowTile(8, 240, 10, .8, 1.5, .4) + ';background-size:240px 240px';
    fx.appendChild(sun); fx.appendChild(snowA); fx.appendChild(snowB); fx.appendChild(vig);
    var fxw = el('div', 'ocean__fxwrap');
    fxw.setAttribute('aria-hidden', 'true');
    fxw.appendChild(fx);
    ocean.insertBefore(fxw, deco.nextSibling);

    var ticking = false;
    function depth() {
      ticking = false;
      var rc = ocean.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.max(0, Math.min(1, (vh * .5 - rc.top) / Math.max(rc.height, 1)));
      sun.style.opacity = Math.pow(1 - p, 1.5).toFixed(3);
      vig.style.opacity = (p * .9).toFixed(3);
      snowA.style.opacity = snowB.style.opacity = (.3 + .7 * p).toFixed(3);
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(depth); } }, { passive: true });

    /* hemat baterai: jeda animasi saat laut di luar layar */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { ocean.classList.toggle('is-off', !en[0].isIntersecting); }, { rootMargin: '200px' }).observe(ocean);
    }

    layout(true); depth();
    var rt = 0;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(function () { layout(Math.abs(window.innerWidth - geo.vw) > 40); depth(); }, 200);
    });
    window.addEventListener('load', function () { layout(true); depth(); });
    if ('ResizeObserver' in window) {
      var lastH = ocean.offsetHeight;
      new ResizeObserver(function () { var h = ocean.offsetHeight; if (Math.abs(h - lastH) > 4) { lastH = h; layout(false); } }).observe(ocean);
    }
  }

  /* =====================================================================
     DASAR LAUT (footer)
     ===================================================================== */
  if (seabedHost) {
    var q = rng(4242), s = '<svg viewBox="0 0 1600 520" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">' +
      '<defs><linearGradient id="sbSand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sand-1)"/><stop offset="1" style="stop-color:var(--sand-2)"/></linearGradient></defs>';
    var i2;
    // bukit karang jauh
    s += '<g class="sb-far">';
    for (i2 = 0; i2 < 8; i2++) {
      var cx = 40 + i2 * 215 + q() * 60, w = 220 + q() * 160, hh = 70 + q() * 110;
      s += '<path d="M' + P(cx - w / 2) + ' 480C' + P(cx - w * .3) + ' ' + P(480 - hh * 1.25) + ' ' + P(cx + w * .3) + ' ' + P(480 - hh * 1.25) + ' ' + P(cx + w / 2) + ' 480Z"/>';
    }
    s += '</g>';
    // karang jauh (kabur, kebiruan)
    s += '<g opacity=".38">';
    for (i2 = 0; i2 < 14; i2++) {
      var tf = pick(q, ['fan', 'tubes', 'branch']);
      s += '<g class="cc-' + pick(q, ['f', 'd', 'c']) + '" transform="translate(' + P(30 + i2 * 112 + q() * 60) + ' ' + P(452 + q() * 10) + ') scale(' + (.8 + q() * .5).toFixed(2) + ')">' + GEN[tf](q, 100) + '</g>';
    }
    s += '</g>';
    // karang tengah (urut dari belakang ke depan)
    var mid = [];
    for (i2 = 0; i2 < 26; i2++) mid.push({ x: 30 + i2 * (1540 / 26) + (q() - .5) * 40, y: 452 + q() * 26, sc: 1 + q() * .9, t: q(), c: pick(q, ['a', 'b', 'c', 'd', 'e', 'f']) });
    mid.sort(function (a, b) { return a.y - b.y; });
    mid.forEach(function (m) {
      var type = m.t < .3 ? 'branch' : m.t < .5 ? 'fan' : m.t < .65 ? 'tubes' : m.t < .8 ? 'brain' : m.t < .9 ? 'anem' : 'kelp';
      s += '<g class="cc-' + m.c + '" transform="translate(' + P(m.x) + ' ' + P(m.y) + ') scale(' + m.sc.toFixed(2) + ')">' + GEN[type](q, 100) + '</g>';
    });
    // pasir belakang, peti harta, pasir depan
    s += '<path d="M0 474C220 452 420 478 660 466C900 454 1100 480 1330 464C1450 456 1540 468 1600 462V520H0Z" fill="url(#sbSand)"/>';
    s += '<g transform="translate(1440 488) rotate(-6)">' +
      '<path d="M-34 0v-26h68v26z" fill="#6b4423" stroke="#2b1a0b" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M-34 -26a34 24 0 0 1 68 0z" fill="#85572c" stroke="#2b1a0b" stroke-width="2.4" stroke-linejoin="round"/>' +
      '<path d="M-34 -13H34M-18 -26V0M18 -26V0" stroke="#e9b44c" stroke-width="3.4" fill="none"/>' +
      '<rect x="-6.5" y="-21" width="13" height="15" rx="2.5" fill="#f4c95d" stroke="#2b1a0b" stroke-width="1.6"/><circle cx="0" cy="-14" r="2" fill="#2b1a0b"/>' +
      '<path class="glint" d="M0 -46L3 -38 11 -35 3 -32 0 -24 -3 -32 -11 -35 -3 -38Z" fill="#fff6c8"/></g>';
    s += '<path d="M0 492C260 478 520 506 800 494C1080 482 1300 474 1455 480C1520 482 1570 488 1600 484V520H0Z" fill="url(#sbSand)"/>';
    s += '<g fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="2" stroke-linecap="round"><path d="M60 504C220 496 340 510 520 502"/><path d="M640 508C820 498 940 512 1120 504"/><path d="M1200 506C1330 498 1420 510 1560 502"/></g>';
    s += '<g fill="#f4c95d" stroke="#a9791f" stroke-width="1.2"><ellipse cx="1388" cy="497" rx="7" ry="3"/><ellipse cx="1404" cy="502" rx="7" ry="3"/><ellipse cx="1500" cy="498" rx="7" ry="3"/></g>';
    s += '<g class="cc-b" transform="translate(300 500) scale(.8)"><path d="M0-26L7-9 26-9 11 3 17 22 0 11-17 22-11 3-26-9-7-9Z" fill="var(--c)" stroke="var(--c2)" stroke-width="2"/></g>';
    s += '<g fill="#cfe3ea" fill-opacity=".35"><ellipse cx="760" cy="506" rx="10" ry="4.5"/><ellipse cx="780" cy="510" rx="6" ry="3"/><ellipse cx="1110" cy="512" rx="9" ry="4"/></g>';
    // karang depan (besar) di tepi kiri & kanan
    [[70, 'kelp', 'e', 1.7], [210, 'branch', 'a', 1.9], [350, 'fan', 'c', 1.5], [1210, 'tubes', 'd', 1.6], [1330, 'anem', 'b', 1.8], [1545, 'branch', 'c', 2]].forEach(function (fg) {
      s += '<g class="cc-' + fg[2] + '" transform="translate(' + fg[0] + ' 514) scale(' + fg[3] + ')">' + GEN[fg[1]](q, 100) + '</g>';
    });
    s += '</svg>';
    seabedHost.innerHTML = s;
    var bh = '';
    for (i2 = 0; i2 < 7; i2++) {
      var dd = 9 + q() * 7;
      bh += '<span class="bub" style="left:' + (86 + q() * 8).toFixed(1) + '%;bottom:' + (12 + q() * 6).toFixed(1) + '%;--s:' + (4 + q() * 6).toFixed(1) + 'px;--d:' + dd.toFixed(1) + 's;--dl:-' + (q() * dd).toFixed(1) + 's;--x:' + ((q() - .5) * 24).toFixed(0) + 'px;--r:' + (160 + q() * 110).toFixed(0) + 'px"></span>';
    }
    seabedHost.insertAdjacentHTML('beforeend', bh);
  }
})();
