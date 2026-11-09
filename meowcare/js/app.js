/* MeowCare - logika aplikasi (HTML, CSS, JS biasa; data di localStorage) */
(function () {
  'use strict';

  var D = window.MEOW_DATA;
  var KEY = 'meowcare.v1';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- State ---------- */
  var state = load();
  var ui = {
    fTab: 'usia', hTab: 'jadwal',
    quizOrder: null, quizIdx: 0, quizScore: 0, quizFb: null,
    greeted: false, lastToggled: null, alerted: {}, pendingPhoto: ''
  };

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && Array.isArray(s.cats)) {
        s.feeds = s.feeds || []; s.reminders = s.reminders || [];
        s.quizBest = s.quizBest || 0; s.sound = s.sound !== false; s.user = s.user || '';
        return s;
      }
    } catch (e) {}
    return { user: '', cats: [], feeds: [], reminders: [], sound: true, quizBest: 0 };
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); }
    catch (e) { toast('Penyimpanan penuh. Coba pakai foto yang lebih kecil.'); }
  }

  /* ---------- Helper ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function todayStr() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function nowHM() { var d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function daysUntil(s) {
    var a = new Date(todayStr() + 'T00:00:00'), b = new Date(s + 'T00:00:00');
    return Math.round((b - a) / 86400000);
  }
  function ageMonths(birth) {
    if (!birth) return null;
    var b = new Date(birth + 'T00:00:00'), n = new Date();
    var m = (n.getFullYear() - b.getFullYear()) * 12 + (n.getMonth() - b.getMonth());
    if (n.getDate() < b.getDate()) m--;
    return Math.max(m, 0);
  }
  function ageLabel(m) {
    if (m == null) return 'Usia belum diisi';
    if (m < 1) return 'Kurang dari 1 bulan';
    if (m < 12) return m + ' bulan';
    var y = Math.floor(m / 12), r = m % 12;
    return y + ' tahun' + (r ? ' ' + r + ' bulan' : '');
  }
  function ageGroup(m) {
    if (m == null) return 'dewasa';
    if (m < 4) return 'kitten';
    if (m < 12) return 'junior';
    if (m >= 84) return 'senior';
    return 'dewasa';
  }
  function fmtDate(s) {
    var d = new Date(s + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function catById(id) { return state.cats.filter(function (c) { return c.id === id; })[0]; }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function avatar(c, small) {
    var cls = 'avatar' + (small ? ' sm' : '');
    if (c && c.photo) return '<img class="' + cls + '" src="' + esc(c.photo) + '" alt="Foto ' + esc(c.name) + '">';
    return '<div class="' + cls + '" aria-hidden="true">🐱</div>';
  }

  /* ---------- Suara (WebAudio, tanpa file, bebas hak cipta) ---------- */
  var ac = null;
  function chime(kind) {
    if (!state.sound) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      var t = ac.currentTime;
      var notes = kind === 'alert' ? [784, 988, 784, 988] : kind === 'bad' ? [330, 262] : [660, 880];
      notes.forEach(function (f, i) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * 0.14);
        g.gain.exponentialRampToValueAtTime(0.18, t + i * 0.14 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.14 + 0.22);
        o.connect(g); g.connect(ac.destination);
        o.start(t + i * 0.14); o.stop(t + i * 0.14 + 0.25);
      });
    } catch (e) {}
  }
  function updateSoundBtn() {
    var b = $('#sound-btn');
    if (b) { b.textContent = state.sound ? '🔊' : '🔇'; b.setAttribute('aria-pressed', state.sound ? 'true' : 'false'); }
  }

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3600);
  }

  /* ---------- Kucing berjalan (SVG buatan sendiri) ---------- */
  var WALKER_SVG =
    '<svg viewBox="0 0 160 100" width="100%" role="img" aria-label="Kucing cokelat sedang berjalan"><g class="bob">' +
    '<path class="tail" style="transform-origin:36px 55px" d="M36 55 C10 55 8 26 22 20" stroke="#513229" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<rect class="leg-b" style="transform-origin:53px 66px" x="48" y="64" width="10" height="26" rx="5" fill="#3b231d"/>' +
    '<rect class="leg-a" style="transform-origin:108px 66px" x="103" y="64" width="10" height="26" rx="5" fill="#3b231d"/>' +
    '<ellipse cx="80" cy="55" rx="46" ry="22" fill="#513229"/><ellipse cx="80" cy="63" rx="30" ry="12" fill="#f4f1e2"/>' +
    '<rect class="leg-a" style="transform-origin:69px 66px" x="64" y="64" width="10" height="26" rx="5" fill="#513229"/>' +
    '<rect class="leg-b" style="transform-origin:94px 66px" x="89" y="64" width="10" height="26" rx="5" fill="#513229"/>' +
    '<polygon points="107,30 109,10 123,24" fill="#513229"/><polygon points="137,30 135,10 121,24" fill="#513229"/>' +
    '<polygon points="110,27 111,16 119,24" fill="#fce6b7"/><circle cx="122" cy="40" r="19" fill="#513229"/>' +
    '<circle cx="115" cy="38" r="3.2" fill="#fce6b7"/><circle cx="129" cy="38" r="3.2" fill="#fce6b7"/>' +
    '<circle cx="116" cy="38" r="1.5" fill="#513229"/><circle cx="130" cy="38" r="1.5" fill="#513229"/>' +
    '<polygon points="119,45 125,45 122,48" fill="#fce6b7"/>' +
    '<path d="M138 44 L152 41 M138 47 L152 49" stroke="#f4f1e2" stroke-width="1.4" stroke-linecap="round"/></g></svg>';

  function injectWalkers(root) {
    $$('[data-walker]', root).forEach(function (n) { if (!n.firstChild) n.innerHTML = WALKER_SVG; });
  }

  function typeInto(el, text, done) {
    if (!el) return;
    if (reduce) { el.textContent = text; el.classList.add('typed-finished'); if (done) done(); return; }
    var i = 0;
    setTimeout(function tick() {
      if (!document.body.contains(el)) return;
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 55);
      else { el.classList.add('typed-finished'); if (done) done(); }
    }, 400);
  }

  function countUp(root) {
    $$('[data-count]', root).forEach(function (n) {
      var target = parseInt(n.getAttribute('data-count'), 10) || 0;
      if (reduce || target === 0) { n.textContent = target; return; }
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 700, 1);
        n.textContent = Math.round(target * p);
        if (p < 1 && document.body.contains(n)) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- Modal ---------- */
  function openModal(html) {
    var m = $('#modal');
    m.innerHTML = '<div class="modal-box">' + html + '</div>';
    m.classList.remove('hidden');
    var first = $('input, select', m);
    if (first) setTimeout(function () { first.focus(); }, 50);
  }
  function closeModal() { var m = $('#modal'); m.classList.add('hidden'); m.innerHTML = ''; }

  /* ---------- Bagian halaman ---------- */
  function emptyBlock(icon, title, text, btn) {
    return '<div class="card empty fade-in"><div class="big">' + icon + '</div><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p>' + (btn || '') + '</div>';
  }

  function checkBtn(f) {
    var done = f.doneOn === todayStr();
    var fresh = ui.lastToggled === f.id && done;
    return '<button class="check' + (done ? ' on' : '') + '" data-action="toggle-feed" data-id="' + esc(f.id) + '" aria-pressed="' + done + '" aria-label="' + (done ? 'Batalkan centang jadwal makan' : 'Tandai sudah diberi makan') + '">' +
      (done ? '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path class="' + (fresh ? 'check-path' : 'check-static') + '" d="M5 12.5l4.5 4.5L19 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') +
      '</button>';
  }

  function feedRow(f, withDelete) {
    var c = catById(f.catId);
    if (!c) return '';
    var done = f.doneOn === todayStr();
    return '<div class="row pop-in' + (done ? ' done' : '') + '">' + checkBtn(f) +
      '<span class="time">' + esc(f.time) + '</span>' + avatar(c, true) +
      '<div class="row-main"><b>' + esc(c.name) + '</b><small>' + esc(f.portion) + ' · ' + esc(f.type) + '</small></div>' +
      (withDelete ? '<button class="btn btn-ghost btn-sm" data-action="del-feed" data-id="' + esc(f.id) + '" aria-label="Hapus jadwal">Hapus</button>' : '') +
      '</div>';
  }

  function remStatus(r) {
    var d = daysUntil(r.date);
    if (r.done) return { cls: 'done', label: 'Selesai', ring: false };
    if (d < 0) return { cls: 'late', label: 'Terlambat ' + (-d) + ' hari', ring: true };
    if (d === 0) return { cls: 'late', label: 'Hari ini', ring: true };
    if (d <= 3) return { cls: 'soon', label: d + ' hari lagi', ring: true };
    if (d <= 14) return { cls: 'mid', label: d + ' hari lagi', ring: false };
    return { cls: 'ok', label: d + ' hari lagi', ring: false };
  }
  function remIcon(t) {
    return { 'Vaksin': '💉', 'Obat cacing': '💊', 'Grooming': '🪮', 'Ganti pasir': '🧹', 'Kontrol dokter': '🩺' }[t] || '⏰';
  }
  function remRow(r, withActions) {
    var c = catById(r.catId);
    if (!c) return '';
    var s = remStatus(r);
    return '<div class="row rem ' + s.cls + ' pop-in"><span class="big-icon">' + remIcon(r.type) + '</span>' +
      '<div class="row-main"><b>' + esc(r.type) + ' · ' + esc(c.name) + '</b><small>' + esc(fmtDate(r.date)) + (r.note ? ' · ' + esc(r.note) : '') + '</small></div>' +
      '<span class="chip ' + (s.cls === 'ok' || s.cls === 'done' ? 'mint' : s.cls === 'mid' ? 'sun' : 'rose') + '"><span class="bell' + (s.ring ? ' bell-shake' : '') + '" aria-hidden="true">🔔</span> ' + esc(s.label) + '</span>' +
      (withActions ? ((!r.done ? '<button class="btn btn-ghost btn-sm" data-action="done-rem" data-id="' + esc(r.id) + '">Selesai</button>' : '') +
        '<button class="btn btn-ghost btn-sm" data-action="del-rem" data-id="' + esc(r.id) + '" aria-label="Hapus pengingat">Hapus</button>') : '') +
      '</div>';
  }
  function sortedReminders() {
    return state.reminders.filter(function (r) { return catById(r.catId); }).sort(function (a, b) {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
    });
  }
  function catOptions(sel) {
    return state.cats.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === sel ? ' selected' : '') + '>' + esc(c.name) + '</option>';
    }).join('');
  }
  function sourcesBlock() {
    return '<div class="foot-note"><b>Sumber rujukan umum</b> (isi ditulis ulang dengan kata sendiri):<ul>' +
      D.sources.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ul></div>';
  }
  var DISCLAIMER = '<div class="note">ℹ️ Informasi ini bersifat umum dan <b>bukan pengganti pemeriksaan dokter hewan</b>. Kalau kucingmu terlihat sakit, hubungi dokter hewan.</div>';

  /* ---------- Halaman: Dashboard ---------- */
  function pageDashboard() {
    var today = todayStr();
    var feeds = state.feeds.filter(function (f) { return catById(f.catId); }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
    var done = feeds.filter(function (f) { return f.doneOn === today; }).length;
    var rems = sortedReminders().filter(function (r) { return !r.done; });
    var next = rems[0];
    var nextTxt = next ? remStatus(next).label : 'Tidak ada';
    var d = new Date(); var doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
    var tip = D.tips[doy % D.tips.length];
    var name = state.user || 'teman';

    var h = '<h1 class="hello" id="hello" data-name="' + esc(name) + '">' + (ui.greeted ? 'Halo, ' + esc(name) + '! 🐾' : '') + '</h1>';
    h += '<div class="stats">' +
      '<div class="stat s1 pop-in"><div class="num" data-count="' + state.cats.length + '">0</div><div class="lbl">🐱 Kucingku</div></div>' +
      '<div class="stat s2 pop-in" style="animation-delay:.1s"><div class="num"><span data-count="' + done + '">0</span>/' + feeds.length + '</div><div class="lbl">🍽️ Makan hari ini</div></div>' +
      '<div class="stat s3 pop-in" style="animation-delay:.2s"><div class="num" style="font-size:1.4rem">' + (next ? '<span class="bell' + (remStatus(next).ring ? ' bell-shake' : '') + '" aria-hidden="true">🔔</span> ' : '') + esc(nextTxt) + '</div><div class="lbl">' + (next ? esc(next.type) + ' · ' + esc(catById(next.catId).name) : '⏰ Pengingat terdekat') + '</div></div>' +
      '</div>';
    h += '<div class="tip fade-in">💡 Tips hari ini: ' + esc(tip) + '</div>';

    h += '<h2 class="section-title">Jadwal makan hari ini</h2>';
    if (!state.cats.length) {
      h += emptyBlock('🐱', 'Belum ada kucing', 'Tambahkan kucingmu dulu supaya bisa membuat jadwal makan dan pengingat.', '<a class="btn btn-primary" href="#/cats">Tambah kucing</a>');
    } else if (!feeds.length) {
      h += emptyBlock('🍽️', 'Belum ada jadwal makan', 'Atur jam dan porsi makan kucingmu.', '<a class="btn btn-primary" href="#/feeding">Atur jadwal</a>');
    } else {
      h += '<div class="list">' + feeds.map(function (f) { return feedRow(f, false); }).join('') + '</div>';
    }

    if (rems.length) {
      h += '<h2 class="section-title">Pengingat berikutnya</h2><div class="list">' + rems.slice(0, 3).map(function (r) { return remRow(r, false); }).join('') + '</div>';
    }

    if (state.cats.length) {
      h += '<h2 class="section-title">Kucing saya</h2><div class="grid cols-3">' + state.cats.map(function (c, i) {
        return '<a class="card pop-in" style="text-decoration:none;animation-delay:' + (i * 0.08) + 's" href="#/cats"><div class="cat-top">' + avatar(c) + '<div><h3>' + esc(c.name) + '</h3><small>' + esc(ageLabel(ageMonths(c.birth))) + '</small></div></div></a>';
      }).join('') + '</div>';
    }

    h += '<h2 class="section-title">Pintasan</h2><div class="row-actions"><a class="btn btn-ghost" href="#/fguide">🥣 Feeding Guide</a><a class="btn btn-ghost" href="#/hguide">🩺 Health Guide</a></div>';
    h += '<div class="strip" aria-hidden="true"><div class="cloud" style="top:14px;width:70px;animation-delay:-8s"></div><div class="ground"></div><div class="walker" data-walker></div></div>';
    return h;
  }

  /* ---------- Halaman: Kucingku ---------- */
  function catCard(c, i) {
    var m = ageMonths(c.birth), g = ageGroup(m);
    var vac = state.reminders.filter(function (r) { return r.catId === c.id && r.type === 'Vaksin' && !r.done; })
      .sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0];
    return '<div class="card cat-card pop-in" style="animation-delay:' + (i * 0.07) + 's">' +
      '<div class="cat-top">' + avatar(c) + '<div><h3>' + esc(c.name) + '</h3>' +
      '<div class="badges"><span class="chip">' + esc(c.breed || 'Ras belum diisi') + '</span><span class="chip sky">' + esc(c.gender) + '</span>' +
      '<span class="chip ' + (c.sterile === 'Sudah' ? 'mint' : 'sun') + '">' + (c.sterile === 'Sudah' ? 'Sudah steril' : 'Belum steril') + '</span></div></div></div>' +
      '<div class="cat-meta"><span>🎂 ' + esc(ageLabel(m)) + '</span>' + (c.weight ? '<span>⚖️ ' + esc(c.weight) + ' kg</span>' : '') +
      '<span>🍽️ ' + esc(D.feedFreq[g]) + '</span>' +
      '<span>💉 ' + (vac ? 'Vaksin berikutnya: ' + esc(remStatus(vac).label) : 'Belum ada pengingat vaksin') + '</span></div>' +
      '<div class="row-actions">' +
      '<button class="btn btn-ghost btn-sm" data-action="goto-vaksin">💉 Jadwal vaksin</button>' +
      '<button class="btn btn-ghost btn-sm" data-action="edit-cat" data-id="' + esc(c.id) + '">Edit</button>' +
      '<button class="btn btn-danger btn-sm" data-action="del-cat" data-id="' + esc(c.id) + '">Hapus</button></div></div>';
  }
  function pageCats() {
    var h = '<header class="page-head"><div><h1>Kucingku 🐱</h1><p>Data kucing dipakai di jadwal makan, pengingat, dan kalkulator porsi.</p></div>' +
      '<button class="btn btn-primary" data-action="add-cat">+ Tambah kucing</button></header>';
    if (!state.cats.length) {
      return h + emptyBlock('🐱', 'Belum ada kucing', 'Belum ada kucing, tambahkan dulu ya.', '<button class="btn btn-primary" data-action="add-cat">+ Tambah kucing</button>');
    }
    return h + '<div class="grid cols-2">' + state.cats.map(catCard).join('') + '</div>';
  }

  function openCatModal(id) {
    var c = id ? catById(id) : null;
    ui.pendingPhoto = c && c.photo ? c.photo : '';
    var v = c || { name: '', breed: '', gender: 'Betina', sterile: 'Belum', birth: '', weight: '' };
    var breeds = D.breeds.map(function (b) { return '<option value="' + esc(b) + '">'; }).join('');
    openModal(
      '<h2>' + (c ? 'Edit kucing' : 'Tambah kucing') + '</h2>' +
      '<form class="form-grid" data-form="cat" data-id="' + esc(id || '') + '" novalidate>' +
      '<div class="photo-row"><div id="photo-prev">' + (ui.pendingPhoto ? '<img class="avatar" src="' + esc(ui.pendingPhoto) + '" alt="Pratinjau foto">' : '<div class="avatar" aria-hidden="true">🐱</div>') + '</div>' +
      '<label class="field" style="flex:1"><span>Foto (opsional)</span><input type="file" id="cat-photo" accept="image/*"></label></div>' +
      '<label class="field"><span>Nama kucing *</span><input name="name" maxlength="30" value="' + esc(v.name) + '" placeholder="mis. Mochi" required><small class="err" data-for="name"></small></label>' +
      '<label class="field"><span>Ras</span><input name="breed" list="breeds" maxlength="40" value="' + esc(v.breed) + '" placeholder="Pilih atau ketik ras"><datalist id="breeds">' + breeds + '</datalist></label>' +
      '<div class="two"><label class="field"><span>Jenis kelamin</span><select name="gender"><option' + (v.gender === 'Betina' ? ' selected' : '') + '>Betina</option><option' + (v.gender === 'Jantan' ? ' selected' : '') + '>Jantan</option></select></label>' +
      '<label class="field"><span>Status steril</span><select name="sterile"><option value="Belum"' + (v.sterile === 'Belum' ? ' selected' : '') + '>Belum</option><option value="Sudah"' + (v.sterile === 'Sudah' ? ' selected' : '') + '>Sudah</option></select></label></div>' +
      '<div class="two"><label class="field"><span>Tanggal lahir (perkiraan)</span><input type="date" name="birth" max="' + todayStr() + '" value="' + esc(v.birth) + '"><small class="err" data-for="birth"></small></label>' +
      '<label class="field"><span>Berat (kg)</span><input type="number" name="weight" step="0.1" min="0.1" max="15" value="' + esc(v.weight) + '" placeholder="mis. 3.5"><small class="err" data-for="weight"></small></label></div>' +
      '<div class="row-actions"><button class="btn btn-primary" type="submit">Simpan</button><button class="btn btn-ghost" type="button" data-action="close-modal">Batal</button></div>' +
      '</form>');
  }

  function readPhoto(file, cb) {
    if (!file || !/^image\//.test(file.type)) { toast('Pilih file gambar ya.'); return; }
    var fr = new FileReader();
    fr.onload = function () {
      var img = new Image();
      img.onload = function () {
        var size = 240, cv = document.createElement('canvas');
        cv.width = size; cv.height = size;
        var s = Math.min(img.width, img.height), sx = (img.width - s) / 2, sy = (img.height - s) / 2;
        cv.getContext('2d').drawImage(img, sx, sy, s, s, 0, 0, size, size);
        cb(cv.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = function () { toast('Foto tidak bisa dibaca.'); };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  }

  function submitCat(f) {
    var fd = new FormData(f), errs = {};
    var name = String(fd.get('name') || '').trim();
    var birth = String(fd.get('birth') || '');
    var weightRaw = String(fd.get('weight') || '').trim();
    var weight = weightRaw === '' ? '' : parseFloat(weightRaw);
    if (!name) errs.name = 'Nama kucing wajib diisi.';
    if (birth && birth > todayStr()) errs.birth = 'Tanggal lahir tidak boleh di masa depan.';
    if (weight !== '' && (isNaN(weight) || weight <= 0 || weight > 15)) errs.weight = 'Isi berat antara 0,1 sampai 15 kg.';
    $$('.err[data-for]', f).forEach(function (e) { e.textContent = errs[e.getAttribute('data-for')] || ''; });
    if (Object.keys(errs).length) return;

    var obj = {
      name: name, breed: String(fd.get('breed') || '').trim(), gender: fd.get('gender'),
      sterile: fd.get('sterile'), birth: birth, weight: weight, photo: ui.pendingPhoto || ''
    };
    var id = f.getAttribute('data-id');
    if (id) {
      var c = catById(id); for (var k in obj) c[k] = obj[k];
      toast('Data ' + name + ' diperbarui.');
    } else {
      obj.id = uid(); state.cats.push(obj);
      var g = ageGroup(ageMonths(birth));
      toast(name + ' ditambahkan! Tips: ' + D.feedFreq[g]);
    }
    save(); closeModal(); chime('ok'); route(true);
  }

  /* ---------- Halaman: Feeding ---------- */
  function pageFeeding() {
    var h = '<header class="page-head"><div><h1>Jadwal makan 🍽️</h1><p>Atur jam dan porsi. Centang kalau sudah diberi makan, centang akan reset otomatis tiap hari.</p></div></header>';
    if (!state.cats.length) {
      return h + emptyBlock('🐱', 'Belum ada kucing', 'Tambahkan kucing dulu sebelum membuat jadwal makan.', '<a class="btn btn-primary" href="#/cats">Tambah kucing</a>');
    }
    h += '<form class="card form-inline" data-form="feed" novalidate>' +
      '<label class="field"><span>Kucing</span><select name="cat">' + catOptions() + '</select></label>' +
      '<label class="field"><span>Jam</span><input type="time" name="time" required><small class="err" data-for="time"></small></label>' +
      '<label class="field"><span>Porsi</span><input name="portion" maxlength="30" placeholder="mis. 50 gr" required><small class="err" data-for="portion"></small></label>' +
      '<label class="field"><span>Jenis</span><select name="type"><option>Makanan kering</option><option>Makanan basah</option><option>Campuran</option></select></label>' +
      '<button class="btn btn-primary" type="submit">Simpan jadwal</button></form>';
    var feeds = state.feeds.filter(function (f) { return catById(f.catId); }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
    if (!feeds.length) return h + emptyBlock('⏰', 'Belum ada jadwal', 'Isi form di atas untuk membuat jadwal makan pertama.');
    var done = feeds.filter(function (f) { return f.doneOn === todayStr(); }).length;
    h += '<b>Hari ini: ' + done + ' dari ' + feeds.length + ' sudah selesai</b><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + feeds.length + '" aria-valuenow="' + done + '"><i style="width:' + Math.round(done / feeds.length * 100) + '%"></i></div>';
    return h + '<div class="list">' + feeds.map(function (f) { return feedRow(f, true); }).join('') + '</div>';
  }
  function submitFeed(f) {
    var fd = new FormData(f), errs = {};
    var time = String(fd.get('time') || ''), portion = String(fd.get('portion') || '').trim();
    if (!time) errs.time = 'Pilih jam.';
    if (!portion) errs.portion = 'Isi porsi.';
    $$('.err[data-for]', f).forEach(function (e) { e.textContent = errs[e.getAttribute('data-for')] || ''; });
    if (Object.keys(errs).length) return;
    state.feeds.push({ id: uid(), catId: fd.get('cat'), time: time, portion: portion, type: fd.get('type'), doneOn: '' });
    save(); chime('ok'); toast('Jadwal makan disimpan.'); route(true);
  }

  /* ---------- Halaman: Pengingat ---------- */
  function pageReminders() {
    var h = '<header class="page-head"><div><h1>Pengingat ⏰</h1><p>Catat vaksin, obat cacing, grooming, dan lainnya. Lonceng bergetar kalau sudah dekat.</p></div></header>';
    if (!state.cats.length) {
      return h + emptyBlock('🐱', 'Belum ada kucing', 'Tambahkan kucing dulu sebelum membuat pengingat.', '<a class="btn btn-primary" href="#/cats">Tambah kucing</a>');
    }
    h += '<form class="card form-inline" data-form="rem" novalidate>' +
      '<label class="field"><span>Kucing</span><select name="cat">' + catOptions() + '</select></label>' +
      '<label class="field"><span>Jenis</span><select name="type"><option>Vaksin</option><option>Obat cacing</option><option>Grooming</option><option>Ganti pasir</option><option>Kontrol dokter</option></select></label>' +
      '<label class="field"><span>Tanggal</span><input type="date" name="date" value="' + todayStr() + '" required><small class="err" data-for="date"></small></label>' +
      '<label class="field"><span>Catatan (opsional)</span><input name="note" maxlength="60" placeholder="mis. vaksin F3 kedua"></label>' +
      '<button class="btn btn-primary" type="submit">Simpan pengingat</button></form>';
    var rems = sortedReminders();
    if (!rems.length) return h + emptyBlock('🔔', 'Belum ada pengingat', 'Buat pengingat pertama lewat form di atas.');
    return h + '<div class="list">' + rems.map(function (r) { return remRow(r, true); }).join('') + '</div>';
  }
  function submitRem(f) {
    var fd = new FormData(f), date = String(fd.get('date') || '');
    var e = $('.err[data-for="date"]', f);
    if (!date) { e.textContent = 'Pilih tanggal.'; return; }
    state.reminders.push({ id: uid(), catId: fd.get('cat'), type: fd.get('type'), date: date, note: String(fd.get('note') || '').trim(), done: false });
    save(); chime('ok'); toast('Pengingat disimpan.'); route(true);
  }

  /* ---------- Halaman: Feeding Guide ---------- */
  var F_TABS = [['usia', '🍼 Usia'], ['jenis', '🥣 Jenis makanan'], ['porsi', '🧮 Porsi'], ['air', '💧 Air minum'], ['bahaya', '⚠️ Aman atau bahaya'], ['mitos', '🧐 Mitos'], ['kuis', '🎮 Kuis']];
  function tabsHtml(list, active, action) {
    return '<div class="tabs" role="tablist">' + list.map(function (t) {
      return '<button class="tab' + (t[0] === active ? ' active' : '') + '" role="tab" aria-selected="' + (t[0] === active) + '" data-action="' + action + '" data-tab="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div>';
  }
  function pageFGuide() {
    var h = '<header class="page-head"><div><h1>Feeding Guide 🥣</h1><p>Panduan makan kucing untuk pemilik pemula: kapan, apa, berapa banyak, dan apa yang harus dihindari.</p></div></header>' + tabsHtml(F_TABS, ui.fTab, 'tab-f');
    var body = '';
    var t = ui.fTab;
    if (t === 'usia') {
      body = '<div class="grid cols-2">' + D.ages.map(function (a, i) {
        return '<div class="card info-card pop-in" style="animation-delay:' + (i * .07) + 's"><span class="big-icon">' + a.icon + '</span><h3>' + esc(a.title) + ' <small>(' + esc(a.range) + ')</small></h3>' +
          '<p><span class="k">Frekuensi:</span> ' + esc(a.freq) + '</p><p><span class="k">Makanan:</span> ' + esc(a.food) + '</p><p>' + esc(a.note) + '</p></div>';
      }).join('') + '</div>';
    } else if (t === 'jenis') {
      body = '<div class="grid cols-2">' + D.foodTypes.map(function (f, i) {
        return '<div class="card info-card pop-in" style="animation-delay:' + (i * .07) + 's"><span class="big-icon">' + f.icon + '</span><h3>' + esc(f.name) + '</h3>' +
          '<span class="k">Kelebihan</span><ul>' + f.pros.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
          '<span class="k">Kekurangan</span><ul>' + f.cons.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>';
    } else if (t === 'porsi') {
      body = calcHtml();
    } else if (t === 'air') {
      body = '<div class="card info-card"><span class="big-icon">💧</span><h3>Tips supaya kucing cukup minum</h3><ul>' + D.water.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>';
    } else if (t === 'bahaya') {
      body = '<div class="warn">⚠️ Makanan dan tanaman di bawah ini berbahaya. Kalau kucing sudah terlanjur memakannya, segera hubungi dokter hewan.</div>' +
        '<h2 class="section-title">Berbahaya</h2><div class="grid cols-3">' + D.danger.map(function (d, i) {
          return '<div class="card danger-card info-card pop-in" style="animation-delay:' + (i * .05) + 's"><span class="big-icon">' + d.icon + '</span><h3>' + esc(d.name) + '</h3><p>' + esc(d.why) + '</p></div>';
        }).join('') + '</div>' +
        '<h2 class="section-title">Umumnya aman (dalam jumlah kecil)</h2><div class="grid cols-3">' + D.safe.map(function (d, i) {
          return '<div class="card safe-card info-card pop-in" style="animation-delay:' + (i * .05) + 's"><span class="big-icon">' + d.icon + '</span><h3>' + esc(d.name) + '</h3><p>' + esc(d.note) + '</p></div>';
        }).join('') + '</div>';
    } else if (t === 'mitos') {
      body = D.myths.map(function (m) {
        return '<details class="acc"><summary><span aria-hidden="true">🧐</span> Mitos: ' + esc(m.myth) + '</summary><div class="acc-body"><p><span class="k">Fakta:</span> ' + esc(m.fact) + '</p></div></details>';
      }).join('');
    } else if (t === 'kuis') {
      body = quizHtml();
    }
    return h + '<div class="fade-in">' + body + '</div>' + DISCLAIMER + sourcesBlock();
  }

  /* Kalkulator porsi: perkiraan energi harian (RER x faktor) */
  function calcHtml() {
    var opts = '<option value="">Isi manual</option>' + state.cats.map(function (c) { return '<option value="' + esc(c.id) + '">' + esc(c.name) + '</option>'; }).join('');
    return '<div class="card"><h3>Kalkulator porsi harian</h3><p class="muted">Perkiraan kasar kebutuhan energi per hari. Utamakan petunjuk di kemasan makanan dan saran dokter hewan.</p>' +
      '<div class="form-inline" style="margin-top:12px">' +
      '<label class="field"><span>Kucing</span><select id="calc-cat" data-change="calc-cat">' + opts + '</select></label>' +
      '<label class="field"><span>Berat (kg)</span><input id="calc-w" type="number" step="0.1" min="0.3" max="15" placeholder="mis. 4"></label>' +
      '<label class="field"><span>Fase usia</span><select id="calc-age"><option value="kitten">Anak kucing (&lt;4 bln)</option><option value="junior">Remaja (4-12 bln)</option><option value="dewasa" selected>Dewasa</option><option value="senior">Senior (&gt;7 thn)</option></select></label>' +
      '<label class="field"><span>Steril?</span><select id="calc-ster"><option value="Belum">Belum</option><option value="Sudah">Sudah</option></select></label>' +
      '<button class="btn btn-primary" data-action="calc">Hitung</button></div>' +
      '<small class="err" id="calc-err"></small><div class="calc-out" id="calc-out"></div></div>';
  }
  function runCalc() {
    var w = parseFloat($('#calc-w').value), age = $('#calc-age').value, ster = $('#calc-ster').value;
    var err = $('#calc-err'), out = $('#calc-out');
    if (isNaN(w) || w < 0.3 || w > 15) { err.textContent = 'Isi berat antara 0,3 sampai 15 kg.'; out.innerHTML = ''; return; }
    err.textContent = '';
    var rer = 70 * Math.pow(w, 0.75);
    var factor = age === 'kitten' ? 2.5 : age === 'junior' ? 2.0 : age === 'senior' ? 1.1 : (ster === 'Sudah' ? 1.2 : 1.4);
    var kcal = Math.round(rer * factor);
    var dry = Math.round(kcal / 3.7), wet = Math.round(kcal / 0.9);
    var meals = { kitten: '3-4', junior: '2-3', dewasa: '2', senior: '2-3' }[age];
    out.innerHTML = '<div class="result-box fade-in"><span>Perkiraan kebutuhan energi</span><span class="num">±' + kcal + ' kkal / hari</span>' +
      '<span>Kalau makanan kering (±3,7 kkal/g): sekitar <b>' + dry + ' g</b> per hari</span>' +
      '<span>Kalau makanan basah (±0,9 kkal/g): sekitar <b>' + wet + ' g</b> per hari</span>' +
      '<span>Bagi menjadi <b>' + meals + ' kali makan</b> sehari.</span>' +
      '<small>Kandungan kalori tiap merek berbeda. Cek kemasan dan konsultasikan dengan dokter hewan, terutama kalau kucing terlalu kurus atau gemuk.</small></div>';
    chime('ok');
  }

  /* Kuis aman atau bahaya */
  function quizHtml() {
    var q = D.quiz;
    if (!ui.quizOrder) { ui.quizOrder = shuffle(q.map(function (x, i) { return i; })); ui.quizIdx = 0; ui.quizScore = 0; ui.quizFb = null; }
    if (ui.quizIdx >= q.length) {
      var best = Math.max(state.quizBest || 0, ui.quizScore);
      if (best !== state.quizBest) { state.quizBest = best; save(); }
      var msg = ui.quizScore === q.length ? 'Sempurna! Kamu siap jadi pemilik kucing yang hebat. 🏆' : ui.quizScore >= q.length * 0.6 ? 'Bagus! Baca lagi tab Aman atau bahaya untuk yang masih salah.' : 'Yuk pelajari lagi tab Aman atau bahaya, lalu coba lagi.';
      return '<div class="card quiz-card"><div class="quiz-emoji">🎉</div><h3>Skor: ' + ui.quizScore + ' dari ' + q.length + '</h3><p>' + msg + '</p><p class="muted">Skor terbaikmu: ' + best + '</p><button class="btn btn-primary" data-action="quiz-restart">Main lagi</button></div>';
    }
    var item = q[ui.quizOrder[ui.quizIdx]];
    var h = '<div class="card quiz-card"><small>Pertanyaan ' + (ui.quizIdx + 1) + ' dari ' + q.length + ' · Skor ' + ui.quizScore + '</small>' +
      '<div class="quiz-emoji">' + item.icon + '</div><h3>Apakah ini aman untuk kucing?</h3><p><b>' + esc(item.food) + '</b></p>';
    if (ui.quizFb) {
      h += '<div class="quiz-fb ' + (ui.quizFb.ok ? 'ok' : 'no') + ' pop-in">' + (ui.quizFb.ok ? '✅ Benar! ' : '❌ Kurang tepat. ') + esc(item.why) + '</div>' +
        '<button class="btn btn-primary" data-action="quiz-next">' + (ui.quizIdx + 1 >= q.length ? 'Lihat skor' : 'Lanjut') + '</button>';
    } else {
      h += '<div class="quiz-actions"><button class="btn btn-safe" data-action="quiz-answer" data-ans="safe">✅ Aman</button><button class="btn btn-bad" data-action="quiz-answer" data-ans="bad">⚠️ Bahaya</button></div>';
    }
    return h + '</div>';
  }

  /* ---------- Halaman: Health Guide ---------- */
  var H_TABS = [['jadwal', '💉 Vaksin dan obat cacing'], ['tanda', '🔍 Sehat atau sakit'], ['penyakit', '🤒 Penyakit umum'], ['darurat', '🚨 Darurat'], ['rutin', '🪮 Perawatan rutin'], ['p3k', '🩹 Pertolongan pertama']];
  function pageHGuide() {
    var h = '<header class="page-head"><div><h1>Health Guide 🩺</h1><p>Kenali tanda kucing sehat, penyakit umum, dan kapan harus segera ke dokter hewan.</p></div></header>' + tabsHtml(H_TABS, ui.hTab, 'tab-h');
    var body = '', t = ui.hTab;
    if (t === 'jadwal') {
      body = '<h2 class="section-title" style="margin-top:0">Jadwal vaksin (garis besar)</h2><div class="timeline">' + D.vaccine.map(function (v) {
        return '<div class="tl-item pop-in"><div class="tl-when">' + esc(v.when) + '</div><b>' + esc(v.title) + '</b><p>' + esc(v.detail) + '</p></div>';
      }).join('') + '</div>' +
        '<h2 class="section-title">Obat cacing dan anti kutu</h2><div class="timeline">' + D.deworm.map(function (v) {
          return '<div class="tl-item pop-in"><div class="tl-when">' + esc(v.when) + '</div><p>' + esc(v.text) + '</p></div>';
        }).join('') + '</div>' +
        '<div class="note">Jadwal pastinya bisa berbeda antar dokter hewan dan tergantung kondisi kucing. Konfirmasikan ke dokter hewanmu, lalu catat tanggalnya di <a href="#/reminders"><b>Pengingat</b></a>.</div>';
    } else if (t === 'tanda') {
      body = '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Bagian</th><th>Tanda sehat ✅</th><th>Tanda sakit ⚠️</th></tr></thead><tbody>' +
        D.signs.map(function (s) { return '<tr><td><b>' + esc(s.part) + '</b></td><td class="ok">' + esc(s.healthy) + '</td><td class="bad">' + esc(s.sick) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    } else if (t === 'penyakit') {
      body = D.diseases.map(function (d) {
        return '<details class="acc"><summary><span aria-hidden="true">' + d.icon + '</span> ' + esc(d.name) + '</summary><div class="acc-body">' +
          '<p><span class="k">Gejala:</span> ' + esc(d.symptoms) + '</p><p><span class="k">Penyebab umum:</span> ' + esc(d.cause) + '</p>' +
          '<p><span class="k">Langkah awal:</span> ' + esc(d.firstAid) + '</p><p><span class="k">Ke dokter hewan:</span> ' + esc(d.vet) + '</p></div></details>';
      }).join('');
    } else if (t === 'darurat') {
      body = '<div class="warn">🚨 Kalau melihat salah satu tanda ini, jangan menunggu. Segera bawa kucing ke dokter hewan.</div><div class="grid cols-2">' +
        D.emergency.map(function (e, i) { return '<div class="card danger-card pop-in" style="animation-delay:' + (i * .05) + 's"><span class="big-icon">' + e.icon + '</span> ' + esc(e.text) + '</div>'; }).join('') + '</div>';
    } else if (t === 'rutin') {
      body = '<div class="grid cols-2">' + D.care.map(function (c, i) {
        return '<div class="card info-card pop-in" style="animation-delay:' + (i * .05) + 's"><span class="big-icon">' + c.icon + '</span><h3>' + esc(c.title) + '</h3><p>' + esc(c.text) + '</p></div>';
      }).join('') + '</div>';
    } else if (t === 'p3k') {
      body = '<div class="warn">Jangan memberi obat manusia ke kucing (misalnya paracetamol). Bisa fatal.</div>' + D.firstAid.map(function (p) {
        return '<details class="acc"><summary><span aria-hidden="true">🩹</span> ' + esc(p.title) + '</summary><div class="acc-body"><ol>' + p.steps.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol></div></details>';
      }).join('');
    }
    return h + '<div class="fade-in">' + body + '</div>' + DISCLAIMER + sourcesBlock();
  }

  /* ---------- Halaman: Tentang dan Kredit ---------- */
  function pageAbout() {
    return '<header class="page-head"><div><h1>Tentang dan Kredit 🐾</h1></div></header>' +
      '<div class="card info-card"><h3>Tujuan dan target pengguna</h3><p>MeowCare membantu pemilik kucing pemula (remaja dan dewasa muda) mencatat perawatan harian dan belajar merawat kucing dengan benar, supaya tidak bingung soal makanan, vaksin, dan kesehatan.</p></div>' +
      '<h2 class="section-title">Elemen multimedia</h2><div class="card info-card"><ul>' +
      '<li><b>Teks:</b> panduan makan dan kesehatan, tips harian.</li><li><b>Gambar:</b> foto kucing yang diunggah pengguna, ikon, dan ilustrasi.</li>' +
      '<li><b>Animasi:</b> kucing berjalan, teks mengetik, kartu muncul bergantian, lonceng bergetar, centang tergambar.</li><li><b>Audio:</b> bunyi pengingat dan notifikasi (bisa dimatikan).</li></ul></div>' +
      '<h2 class="section-title">Hak cipta dan etika digital</h2><div class="card info-card"><ul>' +
      '<li>Ilustrasi kucing berjalan dibuat sendiri dengan SVG.</li><li>Bunyi dihasilkan langsung oleh browser (WebAudio), tanpa file audio dari pihak lain.</li>' +
      '<li>Ikon memakai emoji Unicode standar. Font: Nunito (Google Fonts, lisensi SIL Open Font License).</li>' +
      '<li>Foto kucing hanya disimpan di browser pengguna dan tidak dikirim ke server.</li>' +
      '<li>Isi panduan ditulis ulang dengan kata sendiri dari rujukan umum dan bukan pengganti dokter hewan.</li></ul></div>' +
      sourcesBlock() +
      '<h2 class="section-title">Penyimpanan data</h2><div class="card info-card"><p>Data disimpan di localStorage browser ini. Kalau cache dihapus atau pindah perangkat, data akan hilang.</p>' +
      '<div class="row-actions"><button class="btn btn-danger btn-sm" data-action="reset-data">Hapus semua data</button></div></div>';
  }

  /* ---------- Router ---------- */
  var routes = { dashboard: pageDashboard, cats: pageCats, feeding: pageFeeding, reminders: pageReminders, fguide: pageFGuide, hguide: pageHGuide, about: pageAbout };

  function route(keepScroll) {
    var key = (location.hash || '#/dashboard').replace(/^#\//, '');
    if (!routes[key]) key = 'dashboard';
    var v = $('#view');
    v.innerHTML = routes[key]();
    $$('.nav a').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === key); });
    injectWalkers(v);
    countUp(v);
    if (!keepScroll) window.scrollTo(0, 0);
    if (key === 'dashboard' && !ui.greeted) {
      ui.greeted = true;
      var el = $('#hello');
      if (el) typeInto(el, 'Halo, ' + el.getAttribute('data-name') + '! 🐾');
    }
    ui.lastToggled = null;
  }

  /* ---------- Sambutan / masuk ---------- */
  function showWelcome() {
    $('#app').classList.add('hidden');
    $('#welcome').classList.remove('hidden');
    document.body.classList.remove('typed-done');
    injectWalkers($('#welcome'));
    typeInto($('#typed'), $('#typed').getAttribute('data-text'), function () { document.body.classList.add('typed-done'); });
  }
  function showApp() {
    $('#welcome').classList.add('hidden');
    $('#app').classList.remove('hidden');
    document.body.classList.add('typed-done');
    updateSoundBtn();
    route();
  }

  /* ---------- Event ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-action]');
    if (t) { handle(t.getAttribute('data-action'), t); return; }
    if (e.target.id === 'modal') closeModal();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'cat-photo') {
      readPhoto(e.target.files && e.target.files[0], function (data) {
        ui.pendingPhoto = data;
        $('#photo-prev').innerHTML = '<img class="avatar" src="' + data + '" alt="Pratinjau foto">';
      });
    } else if (e.target.id === 'calc-cat') {
      var c = catById(e.target.value);
      if (c) {
        if (c.weight) $('#calc-w').value = c.weight;
        $('#calc-age').value = ageGroup(ageMonths(c.birth));
        $('#calc-ster').value = c.sterile;
      }
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (f.id === 'welcome-form') {
      e.preventDefault();
      var n = $('#welcome-name').value.trim();
      if (!n) { $('#welcome-err').textContent = 'Tulis namamu dulu ya.'; return; }
      state.user = n; save(); chime('ok'); showApp();
      return;
    }
    var kind = f.getAttribute('data-form');
    if (!kind) return;
    e.preventDefault();
    if (kind === 'cat') submitCat(f);
    else if (kind === 'feed') submitFeed(f);
    else if (kind === 'rem') submitRem(f);
  });
  window.addEventListener('hashchange', function () { route(); });

  function handle(action, el) {
    var id = el.getAttribute('data-id');
    switch (action) {
      case 'add-cat': openCatModal(); break;
      case 'edit-cat': openCatModal(id); break;
      case 'close-modal': closeModal(); break;
      case 'del-cat':
        var c = catById(id);
        if (c && confirm('Hapus ' + c.name + '? Jadwal makan dan pengingatnya ikut terhapus.')) {
          state.cats = state.cats.filter(function (x) { return x.id !== id; });
          state.feeds = state.feeds.filter(function (x) { return x.catId !== id; });
          state.reminders = state.reminders.filter(function (x) { return x.catId !== id; });
          save(); toast(c.name + ' dihapus.'); route(true);
        }
        break;
      case 'goto-vaksin': ui.hTab = 'jadwal'; location.hash = '#/hguide'; break;
      case 'toggle-feed':
        var f = state.feeds.filter(function (x) { return x.id === id; })[0];
        if (f) {
          f.doneOn = f.doneOn === todayStr() ? '' : todayStr();
          ui.lastToggled = f.id; save();
          if (f.doneOn) chime('ok');
          route(true);
        }
        break;
      case 'del-feed':
        state.feeds = state.feeds.filter(function (x) { return x.id !== id; }); save(); route(true); break;
      case 'done-rem':
        var r = state.reminders.filter(function (x) { return x.id === id; })[0];
        if (r) { r.done = true; save(); chime('ok'); toast('Pengingat ditandai selesai.'); route(true); }
        break;
      case 'del-rem':
        state.reminders = state.reminders.filter(function (x) { return x.id !== id; }); save(); route(true); break;
      case 'tab-f': ui.fTab = el.getAttribute('data-tab'); route(true); break;
      case 'tab-h': ui.hTab = el.getAttribute('data-tab'); route(true); break;
      case 'calc': runCalc(); break;
      case 'quiz-answer':
        if (ui.quizFb) break;
        var item = D.quiz[ui.quizOrder[ui.quizIdx]];
        var ok = (el.getAttribute('data-ans') === 'safe') === item.safe;
        if (ok) ui.quizScore++;
        ui.quizFb = { ok: ok }; chime(ok ? 'ok' : 'bad'); route(true); break;
      case 'quiz-next': ui.quizIdx++; ui.quizFb = null; route(true); break;
      case 'quiz-restart': ui.quizOrder = null; route(true); break;
      case 'toggle-sound': state.sound = !state.sound; save(); updateSoundBtn(); if (state.sound) chime('ok'); break;
      case 'logout': state.user = ''; save(); ui.greeted = false; $('#welcome-name').value = ''; showWelcome(); break;
      case 'reset-data':
        if (confirm('Hapus semua data MeowCare di browser ini? Tindakan ini tidak bisa dibatalkan.')) {
          try { localStorage.removeItem(KEY); } catch (e) {}
          state = load(); ui.greeted = false; showWelcome();
        }
        break;
    }
  }

  /* ---------- Pengingat jam makan saat halaman terbuka ---------- */
  function checkFeedAlerts() {
    if ($('#app').classList.contains('hidden')) return;
    var hm = nowHM(), today = todayStr();
    state.feeds.forEach(function (f) {
      var key = f.id + today;
      if (f.time === hm && f.doneOn !== today && !ui.alerted[key] && catById(f.catId)) {
        ui.alerted[key] = true;
        chime('alert');
        toast('🍽️ Waktunya makan: ' + catById(f.catId).name + ' (' + f.portion + ')');
      }
    });
  }
  setInterval(checkFeedAlerts, 20000);

  /* ---------- Mulai ---------- */
  if (state.user) showApp(); else showWelcome();
})();
