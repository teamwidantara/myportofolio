/* =====================================================================
   EXTRAS.JS — taruh di folder js/, panggil SETELAH main.js di index.html:
   <script src="js/main.js"></script>
   <script src="js/extras.js"></script>

   Isi: efek hover pada foto poster -> muncul wajah kartun 3D ORISINAL
   ("Kapten Berani") yang beranimasi, matanya mengikuti kursor.
   ===================================================================== */
(function () {
  'use strict';
  var photo = document.querySelector('.poster__photo');
  if (!photo) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- CSS ---------- */
  var css = [
    '.poster__photo{position:relative;perspective:800px;touch-action:manipulation}',
    '.poster__photo img{transition:filter .3s,transform .4s}',
    '.poster__photo.is-face img{filter:blur(3px) brightness(.8);transform:scale(1.04)}',
    '.face-fx{position:absolute;inset:0;display:grid;place-items:center;opacity:0;pointer-events:none;',
    '  background:radial-gradient(circle at 50% 38%,#fff1bd,#f2c35e 62%,#c98a2b);transition:opacity .25s}',
    '.poster__photo.is-face .face-fx{opacity:1}',
    '.face-fx__rays{position:absolute;inset:-30%;background:repeating-conic-gradient(rgba(255,255,255,.22) 0 8deg,transparent 8deg 22deg);',
    '  animation:fx-spin 14s linear infinite;mask-image:radial-gradient(circle,#000 25%,transparent 70%);-webkit-mask-image:radial-gradient(circle,#000 25%,transparent 70%)}',
    '.face-fx__tilt{position:relative;width:88%;transform-style:preserve-3d;',
    '  transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));transition:transform .15s ease-out}',
    '.face-fx svg{display:block;width:100%;height:auto;max-width:none;overflow:visible;filter:drop-shadow(0 14px 14px rgba(62,39,20,.45))}',
    '.poster__photo.is-face .face-fx__head{animation:fx-boing .6s cubic-bezier(.3,1.4,.5,1) both,fx-idle 2.6s .6s ease-in-out infinite;transform-box:fill-box;transform-origin:50% 90%}',
    '.fx-eyes{transform-box:fill-box;transform-origin:50% 50%;animation:fx-blink 3.6s infinite}',
    '.fx-mouth{transform-box:fill-box;transform-origin:50% 0;animation:fx-talk 1.1s ease-in-out infinite alternate}',
    '.fx-brows{transform-box:fill-box;transform-origin:50% 50%;animation:fx-brows 2.2s ease-in-out infinite}',
    '.fx-star{transform-box:fill-box;transform-origin:50% 50%;animation:fx-spin 6s linear infinite}',
    '.fx-pupils{transition:transform .08s linear}',
    '@keyframes fx-spin{to{transform:rotate(360deg)}}',
    '@keyframes fx-boing{0%{transform:scale(.55,1.25)}35%{transform:scale(1.18,.86)}65%{transform:scale(.95,1.06)}100%{transform:scale(1)}}',
    '@keyframes fx-idle{0%,100%{transform:translateY(0) rotate(-1.5deg)}50%{transform:translateY(-5px) rotate(1.8deg)}}',
    '@keyframes fx-blink{0%,90%,100%{transform:scaleY(1)}94%{transform:scaleY(.08)}}',
    '@keyframes fx-talk{from{transform:scaleY(.55)}to{transform:scaleY(1.05)}}',
    '@keyframes fx-brows{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
    '@media (prefers-reduced-motion:reduce){.face-fx *{animation:none!important}.face-fx__tilt{transition:none}}'
  ].join('\n');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ---------- Wajah kartun orisinal (SVG) ---------- */
  var svg =
    '<svg viewBox="0 0 200 240" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<radialGradient id="fx-skin" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffd9b0"/><stop offset=".6" stop-color="#f0b17f"/><stop offset="1" stop-color="#cf8a58"/></radialGradient>' +
    '<linearGradient id="fx-band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a4d86"/><stop offset="1" stop-color="#0b2545"/></linearGradient>' +
    '<linearGradient id="fx-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#e9b44c"/><stop offset="1" stop-color="#a9791f"/></linearGradient>' +
    '</defs>' +
    '<g class="face-fx__head">' +
    /* rambut belakang */
    '<path d="M28 96C18 50 52 18 100 16s82 34 72 80c-10-22-28-34-72-34S38 74 28 96Z" fill="#1b1410"/>' +
    '<path d="M24 100l-12-18 20 4zM176 100l12-18-20 4zM100 14l-8-14 18 6z" fill="#1b1410"/>' +
    /* telinga */
    '<ellipse cx="24" cy="118" rx="12" ry="17" fill="url(#fx-skin)" stroke="#8a5530" stroke-width="2"/>' +
    '<ellipse cx="176" cy="118" rx="12" ry="17" fill="url(#fx-skin)" stroke="#8a5530" stroke-width="2"/>' +
    /* kepala */
    '<path d="M30 100C30 56 62 30 100 30s70 26 70 70v28c0 48-32 84-70 84s-70-36-70-84Z" fill="url(#fx-skin)" stroke="#8a5530" stroke-width="3"/>' +
    /* bandana */
    '<path d="M28 78C34 40 66 22 100 22s66 18 72 56c-26-14-48-20-72-20s-46 6-72 20Z" fill="url(#fx-band)" stroke="#06152b" stroke-width="3"/>' +
    '<path d="M168 70l24 12-18 8zM172 84l22 18-24-2z" fill="#0b2545" stroke="#06152b" stroke-width="2"/>' +
    '<g class="fx-star" transform="translate(100 44)"><path d="M0-15L4-5 15-4 7 3 9 14 0 8-9 14-7 3-15-4-4-5Z" fill="url(#fx-gold)" stroke="#6b4423" stroke-width="1.5" stroke-linejoin="round"/></g>' +
    /* alis */
    '<g class="fx-brows" fill="none" stroke="#1b1410" stroke-width="6" stroke-linecap="round">' +
    '<path d="M54 92Q70 82 88 90"/><path d="M112 90Q130 82 146 92"/></g>' +
    /* mata */
    '<g class="fx-eyes">' +
    '<ellipse cx="72" cy="112" rx="17" ry="20" fill="#fff" stroke="#1b1410" stroke-width="3"/>' +
    '<ellipse cx="128" cy="112" rx="17" ry="20" fill="#fff" stroke="#1b1410" stroke-width="3"/>' +
    '<g class="fx-pupils" id="fx-pupils">' +
    '<circle cx="72" cy="114" r="9" fill="#2b1a0b"/><circle cx="128" cy="114" r="9" fill="#2b1a0b"/>' +
    '<circle cx="69" cy="110" r="3" fill="#fff"/><circle cx="125" cy="110" r="3" fill="#fff"/></g></g>' +
    /* pipi & hidung */
    '<ellipse cx="52" cy="146" rx="13" ry="8" fill="#ff8f7a" opacity=".55"/>' +
    '<ellipse cx="148" cy="146" rx="13" ry="8" fill="#ff8f7a" opacity=".55"/>' +
    '<path d="M96 128Q100 140 106 132" fill="none" stroke="#8a5530" stroke-width="3" stroke-linecap="round"/>' +
    /* mulut */
    '<g class="fx-mouth">' +
    '<path d="M58 152Q100 158 142 152Q136 204 100 204T58 152Z" fill="#6e1f1c" stroke="#2b0f0d" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M62 154Q100 160 138 154L136 166Q100 172 64 166Z" fill="#fff"/>' +
    '<path d="M76 190Q100 172 124 190Q112 204 100 204T76 190Z" fill="#e8545a"/></g>' +
    '</g></svg>';

  var fx = document.createElement('div');
  fx.className = 'face-fx';
  fx.setAttribute('aria-hidden', 'true');
  fx.innerHTML = '<div class="face-fx__rays"></div><div class="face-fx__tilt" id="fx-tilt">' + svg + '</div>';
  photo.appendChild(fx);

  var tilt = fx.querySelector('#fx-tilt');
  var pupils = fx.querySelector('#fx-pupils');
  var head = fx.querySelector('.face-fx__head');

  function look(e) {
    var r = photo.getBoundingClientRect();
    var nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    var ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    nx = Math.max(-1, Math.min(1, nx));
    ny = Math.max(-1, Math.min(1, ny));
    tilt.style.setProperty('--ry', (nx * 22).toFixed(1) + 'deg');
    tilt.style.setProperty('--rx', (-ny * 16).toFixed(1) + 'deg');
    pupils.style.transform = 'translate(' + (nx * 6).toFixed(1) + 'px,' + (ny * 5).toFixed(1) + 'px)';
  }
  function on(e) {
    photo.classList.add('is-face');
    if (head && !reduced) { head.style.animation = 'none'; void head.getBoundingClientRect(); head.style.animation = ''; }
    if (e) look(e);
  }
  function off() {
    photo.classList.remove('is-face');
    tilt.style.setProperty('--rx', '0deg');
    tilt.style.setProperty('--ry', '0deg');
    pupils.style.transform = '';
  }

  photo.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') on(e); });
  photo.addEventListener('pointermove', function (e) { if (photo.classList.contains('is-face')) look(e); });
  photo.addEventListener('pointerleave', off);
  /* layar sentuh: ketuk foto untuk memunculkan / menyembunyikan */
  photo.addEventListener('click', function (e) {
    if (!('ontouchstart' in window)) return;
    if (photo.classList.contains('is-face')) off(); else on(e);
  });
})();
