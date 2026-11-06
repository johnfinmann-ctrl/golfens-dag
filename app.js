// ============================================================
// GOLFENS DAG 2027 – app.js
// Rediger denne fil for at opdatere indhold uden at røre HTML.
// ============================================================

// --- KLUB KONFIGURATION ---
const clubConfig = {
  name: "Lyngbygaard Golfklub",
  address: "Lyngbygårdsvej 29",
  city: "8220 Brabrand",
  phone: "87 44 10 70",
  email: "kontor@lyg.dk",
  website: "https://lyg.dk",
  maps: "https://maps.google.com/?q=Lyngbygaard+Golfklub,+Lyngbygårdsvej+29,+8220+Brabrand"
};

// --- BEGYNDERFORLØB ---
const beginnerCourses = [
  {
    name: "Hold 7A",
    start: "",
    dates: [],
    price: "",
    seats: "",
    signup: "https://lyg.dk/begyndergolf/#kontakt-form"
  },
  {
    name: "Turbohold 4",
    start: "",
    dates: [],
    price: "",
    seats: "",
    signup: "https://lyg.dk/begyndergolf/#kontakt-form"
  },
  {
    name: "Turbohold 5",
    start: "",
    dates: [],
    price: "",
    seats: "",
    signup: "https://lyg.dk/begyndergolf/#kontakt-form"
  }
];

// --- PROGRAM ---
const programItems = [
  { time: "09.15", title: "Mødetid", icon: "gi-clock" },
  { time: "09.30", title: "Klargøring", icon: "gi-golfer" },
  { time: "10.00", title: "Velkomst", icon: "gi-people" },
  { time: "10.15", title: "Stationer", icon: "gi-flag" },
  { time: "12.45", title: "Afslutning", icon: "gi-checker" }
];

const stationIcons = { Putting: 'gi-putter', Slag: 'gi-club', Indspil: 'gi-pitch', Børn: 'gi-kids', Rundvisning: 'gi-binoc' };
const stations = ["Putting", "Slag", "Indspil", "Børn", "Rundvisning"];

// --- GOLFBEGREBER ---
const termIcons = {
  'Tee': 'gi-ball', 'Fairway': 'gi-trees', 'Rough': 'gi-grass', 'Green': 'gi-flag', 'Putt': 'gi-putter',
  'Chip': 'gi-chip', 'Pitch': 'gi-pitch', 'Bunker': 'gi-bunker', 'Par': 'gi-trophy', 'Birdie': 'gi-bird',
  'Bogey': 'gi-bird2', 'Handicap': 'gi-chart', 'DGU-kort': 'gi-card', 'Stableford': 'gi-score',
  'Tee-sted': 'gi-markers', 'Hulflag': 'gi-flag', 'Out of Bounds': 'gi-stakes', 'Vandhazard': 'gi-water',
  'Provisorisk bold': 'gi-ball'
};
const golfTerms = [
  { term: "Tee", def: "Startstedet for hvert hul. Spillerne slår fra tee-stedet." },
  { term: "Fairway", def: "Den klippede midtergang fra tee til green." },
  { term: "Rough", def: "Det høje græs i siderne af fairway." },
  { term: "Green", def: "Det korte, glatte græsareal omkring hullet." },
  { term: "Putt", def: "Slag på green med putteren for at rulle bolden i hullet." },
  { term: "Chip", def: "Kort lavt slag fra kanten af greenen." },
  { term: "Pitch", def: "Højt slag der lander blødt på green." },
  { term: "Bunker", def: "Sandgrav som en naturlig forhindring på banen." },
  { term: "Par", def: "Det forventede antal slag på et hul for en god spiller." },
  { term: "Birdie", def: "Ét slag under par på et hul." },
  { term: "Bogey", def: "Ét slag over par på et hul." },
  { term: "Handicap", def: "Dit niveau som spiller – lavere tal = bedre spiller." },
  { term: "DGU-kort", def: "Officielt spillerkort fra Dansk Golf Union." },
  { term: "Stableford", def: "Pointsystem hvor du scorer point pr. hul." },
  { term: "Tee-sted", def: "Markeringer der angiver, hvorfra du må slå." },
  { term: "Hulflag", def: "Flag i hullet, så du kan se, hvor greenen er." },
  { term: "Out of Bounds", def: "Uden for banen – hvide pæle markerer grænsen." },
  { term: "Vandhazard", def: "Sø eller vandløb på banen – giver straftslag." },
  { term: "Provisorisk bold", def: "Reserve-bold spillet, hvis din bold kan være tabt." }
];

// --- OM KLUBBEN KORT ---
const clubCards = [
  { key: "18", icon: "⛳", title: "18 huller", url: "https://lyg.dk/baner-faciliteter/" },
  { key: "9", icon: "🏌️", title: "9 huller", url: "https://lyg.dk/baner-faciliteter/" },
  { key: "restaurant", icon: "🍽️", title: "Restaurant", url: "https://lyg.dk/brasseriet/" },
  { key: "traener", icon: "👨‍🏫", title: "Trænerteam", url: "https://lyg.dk/traenerteamet/" },
  { key: "begynder", icon: "🎓", title: "Begynderhold", url: "https://lyg.dk/begyndergolf/" },
  { key: "web", icon: "🌐", title: "Hjemmeside", url: "https://lyg.dk/" }
]; // icon-feltet bruges ikke længere (v2.7.7 viser fotokort) – bevaret til evt. senere brug

// ============================================================
// APP ENGINE – rør ikke nedenfor medmindre du ved hvad du gør
// ============================================================

const APP_VERSION = '2.9.0';
const APP_UPDATED = '2026-11-04';

const STORAGE_KEY = 'golfensdag2027_config';
const LEGACY_STORAGE_KEY = 'golfensdag2026_config'; // for migrering, se nedenfor

function loadConfig() {
  try {
    // Migrering: hvis en besøgende/admin tidligere har gemt ændringer under
    // det gamle 2026-nøglenavn, flyttes de automatisk til det nye 2027-navn,
    // så ingen eksisterende brugerdata går tabt ved denne oprydning.
    if (!localStorage.getItem(STORAGE_KEY)) {
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacy) localStorage.setItem(STORAGE_KEY, legacy);
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data.club) Object.assign(clubConfig, data.club);
      if (data.courses) data.courses.forEach((c, i) => {
        if (beginnerCourses[i]) Object.assign(beginnerCourses[i], c);
      });
    }
  } catch (e) {}
}

function saveConfig(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- ROUTER ---
const pages = ['home', 'program', 'begreber', 'begynder', 'kontakt', 'om', 'admin'];

function navigate(page) {
  pages.forEach(p => {
    const el = document.getElementById('page-' + p);
    if (el) el.classList.toggle('active', p === page);
  });
  if (page !== 'home') {
    document.getElementById('back-btn').style.display = 'flex';
  } else {
    document.getElementById('back-btn').style.display = 'none';
  }
  window.scrollTo(0, 0);
  closeMenu();
  if (page === 'admin') renderAdmin();

  // Micro-animation: vises ved første besøg på begynder-siden i denne session
  if (page === 'begynder') triggerMicroBall();
}

// --- MICRO-ANIMATION (Begynder-side) ---
const MICRO_KEY = 'gd2027_micro_shown';
function triggerMicroBall() {
  const canvas = document.getElementById('micro-canvas');
  const content = document.getElementById('micro-content');
  if (!canvas || !content) return;

  // Reduced-motion eller allerede vist: vis indhold direkte
  const reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const alreadySeen = sessionStorage.getItem(MICRO_KEY);

  if (reducedMotion || alreadySeen) {
    content.classList.add('show');
    return;
  }

  sessionStorage.setItem(MICRO_KEY, '1');

  // Indholdet (overskrift, tekst, knap) vises altid med det samme – bolden animeres bagved
  content.classList.add('show');

  // Kør micro-bold animation (defineret i intro.js)
  if (typeof window.gdMicroBall === 'function') {
    window.gdMicroBall(canvas, function () {
      content.classList.add('show');
    });
  }
}

function closeMenu() {
  document.getElementById('nav-menu').classList.remove('open');
  document.getElementById('menu-overlay').classList.remove('open');
}

// --- RENDER ---
function renderHome() {
  // Statisk i HTML
}

function renderProgram() {
  const timeline = document.getElementById('timeline');
  timeline.innerHTML = programItems.map(item => `
    <div class="timeline-item" role="listitem">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-dot"><div class="timeline-dot-inner"></div></div>
      <div class="timeline-content">
        <svg class="gi" aria-hidden="true" focusable="false"><use href="#${item.icon}"/></svg>
        <span class="timeline-title">${item.title}</span>
      </div>
    </div>
  `).join('');

  const stationsEl = document.getElementById('stations-list');
  stationsEl.innerHTML = stations.map(s => `
    <div class="station-chip" role="listitem"><svg class="gi" aria-hidden="true" focusable="false"><use href="#${stationIcons[s] || 'gi-flag'}"/></svg><span>${s}</span></div>
  `).join('');
}

function renderBegreber() {
  const list = document.getElementById('begreber-list');
  list.innerHTML = golfTerms.map(t => `
    <div class="term-card" role="listitem">
      <svg class="gi" aria-hidden="true" focusable="false"><use href="#${termIcons[t.term] || 'gi-ball'}"/></svg>
      <div class="term-body">
        <div class="term-name">${t.term}</div>
        <div class="term-def">${t.def}</div>
      </div>
    </div>
  `).join('');
}

function renderBegynder() {
  const list = document.getElementById('courses-list');
  list.innerHTML = beginnerCourses.map((c, i) => `
    <div class="course-card" role="listitem">
      <div class="course-card-header">
        <span class="course-name">${c.name}</span>
        <span class="course-badge">Hold ${i + 1}</span>
      </div>
      <div class="course-card-body">
        ${c.start ? `<div class="course-detail"><span class="course-detail-icon">📅</span> Start: ${c.start}</div>` : ''}
        ${c.dates && c.dates.length ? `<div class="course-detail"><span class="course-detail-icon">📆</span> Datoer: ${c.dates.join(', ')}</div>` : ''}
        ${c.price ? `<div class="course-detail"><span class="course-detail-icon">💰</span> Pris: ${c.price}</div>` : ''}
        ${c.seats ? `<div class="course-detail"><span class="course-detail-icon">🏌️</span> Pladser: ${c.seats}</div>` : ''}
        ${!c.start && !c.price && !c.seats ? `<div class="course-detail" style="color:var(--grey);font-style:italic">Dato og pris oplyses snarest</div>` : ''}
      </div>
    </div>
  `).join('');
}

function renderKontakt() {
  document.getElementById('kontakt-name').textContent = clubConfig.name;
  document.getElementById('kontakt-address').textContent = clubConfig.address + ', ' + clubConfig.city;
  document.getElementById('kontakt-phone-text').textContent = clubConfig.phone;
  document.getElementById('kontakt-email-text').textContent = clubConfig.email;

  document.getElementById('btn-ring').href = 'tel:' + clubConfig.phone.replace(/\s/g, '');
  document.getElementById('btn-sendmail').href = 'mailto:' + clubConfig.email;
  document.getElementById('btn-maps').href = clubConfig.maps;
  document.getElementById('btn-website').href = clubConfig.website;
}

function copyEmail() {
  navigator.clipboard.writeText(clubConfig.email).then(() => {
    const btn = document.getElementById('btn-copy-email');
    btn.textContent = '✓ Kopieret';
    setTimeout(() => btn.textContent = 'Kopier mail', 2000);
  });
}

function renderOm() {
  const grid = document.getElementById('om-grid');
  const chev = '<svg class="om-ne" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12L12 4M5.5 4H12v6.5"/></svg>';
  grid.innerHTML = clubCards.map(c => `
    <a href="${c.url}" target="_blank" rel="noopener" class="gh-card om-photo" role="listitem" data-card="om-${c.key}" aria-label="${c.title} (åbner eksternt)">
      <span class="gh-card-photo" aria-hidden="true"></span>
      <span class="gh-card-label">${c.title}</span>
      ${chev}
    </a>
  `).join('');
}

function renderAdmin() {
  const html = `
    <div class="admin-section">
      <h3>Klub oplysninger</h3>
      <label>Navn<input id="a-name" value="${clubConfig.name}"></label>
      <label>Adresse<input id="a-address" value="${clubConfig.address}"></label>
      <label>By<input id="a-city" value="${clubConfig.city}"></label>
      <label>Telefon<input id="a-phone" value="${clubConfig.phone}"></label>
      <label>E-mail<input id="a-email" value="${clubConfig.email}"></label>
      <label>Hjemmeside<input id="a-website" value="${clubConfig.website}"></label>
      <label>Google Maps URL<input id="a-maps" value="${clubConfig.maps}"></label>
    </div>
    <div class="admin-section">
      <h3>Begynderhold</h3>
      ${beginnerCourses.map((c, i) => `
        <div class="admin-course">
          <strong>${c.name}</strong>
          <label>Startdato<input id="ac-start-${i}" value="${c.start || ''}"></label>
          <label>Datoer (komma-adskilt)<input id="ac-dates-${i}" value="${c.dates ? c.dates.join(', ') : ''}"></label>
          <label>Pris<input id="ac-price-${i}" value="${c.price || ''}"></label>
          <label>Antal pladser<input id="ac-seats-${i}" value="${c.seats || ''}"></label>
          <label>Tilmeldings-link<input id="ac-signup-${i}" value="${c.signup || ''}"></label>
        </div>
      `).join('')}
    </div>
    <button class="btn-primary" onclick="saveAdmin()">💾 Gem lokalt (kun denne enhed)</button>
    <button class="btn-secondary" style="margin-top:0.5rem" onclick="resetAdmin()">↺ Nulstil til standard</button>
  `;
  document.getElementById('admin-content').innerHTML = html;
}

function saveAdmin() {
  clubConfig.name = document.getElementById('a-name').value;
  clubConfig.address = document.getElementById('a-address').value;
  clubConfig.city = document.getElementById('a-city').value;
  clubConfig.phone = document.getElementById('a-phone').value;
  clubConfig.email = document.getElementById('a-email').value;
  clubConfig.website = document.getElementById('a-website').value;
  clubConfig.maps = document.getElementById('a-maps').value;

  beginnerCourses.forEach((c, i) => {
    c.start = document.getElementById(`ac-start-${i}`).value;
    const rawDates = document.getElementById(`ac-dates-${i}`).value;
    c.dates = rawDates ? rawDates.split(',').map(d => d.trim()).filter(Boolean) : [];
    c.price = document.getElementById(`ac-price-${i}`).value;
    c.seats = document.getElementById(`ac-seats-${i}`).value;
    c.signup = document.getElementById(`ac-signup-${i}`).value;
  });

  saveConfig({ club: clubConfig, courses: beginnerCourses });
  renderKontakt();
  renderBegynder();

  const msg = document.getElementById('admin-saved-msg');
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 2500);
}

function resetAdmin() {
  if (confirm('Nulstil de lokale ændringer på denne enhed til standard?')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

// --- ADMIN LOGIN ---
let adminUnlocked = false;
function showAdminLogin() {
  document.getElementById('admin-login').style.display = 'block';
  document.getElementById('admin-pin-input').focus();
}

function checkAdminPin() {
  const pin = document.getElementById('admin-pin-input').value;
  if (pin === '1234') {
    adminUnlocked = true;
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-content-wrapper').style.display = 'block';
    navigate('admin');
  } else {
    document.getElementById('admin-pin-error').style.display = 'block';
    document.getElementById('admin-pin-input').value = '';
    document.getElementById('admin-pin-input').focus();
  }
}

// --- PWA INSTALL ---
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  document.getElementById('install-btn').classList.add('visible');
});

function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(() => {
    deferredInstallPrompt = null;
    document.getElementById('install-btn').classList.remove('visible');
  });
}

// --- INIT ---
document.addEventListener('DOMContentLoaded', () => {
  loadConfig();
  renderProgram();
  renderBegreber();
  renderBegynder();
  renderKontakt();
  renderOm();

  // Footer
  document.querySelectorAll('.footer-phone').forEach(el => el.textContent = clubConfig.phone);
  document.querySelectorAll('.footer-website').forEach(el => el.href = clubConfig.website);
  document.querySelectorAll('.footer-version').forEach(el => el.textContent = 'v' + APP_VERSION);

  // Service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }

  // Menu
  document.getElementById('menu-btn').addEventListener('click', () => {
    const isOpen = document.getElementById('nav-menu').classList.toggle('open');
    document.getElementById('menu-overlay').classList.toggle('open', isOpen);
    document.getElementById('menu-btn').setAttribute('aria-expanded', isOpen);
  });
  document.getElementById('menu-overlay').addEventListener('click', closeMenu);

  // Back button
  document.getElementById('back-btn').addEventListener('click', () => navigate('home'));

  // Admin pin enter key
  document.getElementById('admin-pin-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') checkAdminPin();
  });
});

// --- v2.7.7: INFORMATIONSBJÆLKE (interne links) + POPUP ---
const POPUP_KEY = 'gd2027_popup_v1';
(function () {
  function go(e) {
    const a = e.target.closest('[data-go]');
    if (!a) return;
    e.preventDefault();
    closePopup(true);
    navigate(a.getAttribute('data-go'));
  }
  let lastFocus = null;
  function popupEl() { return document.getElementById('gd-popup'); }
  function openPopup() {
    const el = popupEl(); if (!el || !el.hidden) return;
    try { sessionStorage.setItem(POPUP_KEY, '1'); } catch (e) {}
    lastFocus = document.activeElement;
    el.hidden = false;
    el.querySelector('.gd-modal-card').focus();
  }
  function closePopup(skipFocus) {
    const el = popupEl(); if (!el || el.hidden) return;
    el.hidden = true;
    if (!skipFocus && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  window.closePopup = closePopup;
  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('gd-ticker')?.addEventListener('click', go);
    const el = popupEl(); if (!el) return;
    el.addEventListener('click', e => {
      if (e.target.closest('[data-close]')) { closePopup(); return; }
      go(e);
    });
    document.addEventListener('keydown', e => {
      if (el.hidden) return;
      if (e.key === 'Escape') { e.preventDefault(); closePopup(); return; }
      if (e.key === 'Tab') {
        const f = [...el.querySelectorAll('a[href],button')].filter(x => x.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1], card = el.querySelector('.gd-modal-card');
        if (e.shiftKey && (document.activeElement === first || document.activeElement === card)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let seen = false;
    try { seen = !!sessionStorage.getItem(POPUP_KEY); } catch (e) {}
    if (seen) return;
    if (document.getElementById('gd-intro')) {
      document.addEventListener('gd:intro-closed', () => setTimeout(openPopup, 600), { once: true });
    } else {
      setTimeout(openPopup, 900);
    }
  });
})();

// --- v2.9.0: golfbolden nederst triller ind over græsset (bevægelse + rotation i takt) ---
(function () {
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  function roll(wrap) {
    const img = wrap.querySelector('.gd-ball');
    const turf = wrap.parentElement;
    if (!img || !turf) return;
    const d = wrap.offsetWidth;
    const tr = turf.getBoundingClientRect();
    const wr = wrap.getBoundingClientRect();
    const dist = (wr.right - tr.left) + 4;                       // fra uden for venstre kant til hvilestedet
    const deg = (dist / (d / 2)) * (180 / Math.PI);              // rulning uden glid: vinkel = strækning / radius
    const turns = Math.max(1, Math.round(deg / 360)) * 360;      // slutter med logoet vendt rigtigt
    const ease = 'cubic-bezier(.15,.6,.3,1)';
    const dur = 2600;
    wrap.animate([{ transform: 'translateX(' + (-dist) + 'px)' }, { transform: 'none' }], { duration: dur, easing: ease });
    img.animate([{ transform: 'rotate(' + (-turns) + 'deg)' }, { transform: 'none' }], { duration: dur, easing: ease });
  }
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      const w = e.target;
      if (e.isIntersecting && e.intersectionRatio >= 0.6) {
        if (!w._rolled) { w._rolled = true; roll(w); }
      } else if (!e.isIntersecting) {
        w._rolled = false;
      }
    });
  }, { threshold: [0, 0.6] });
  document.querySelectorAll('.gd-ballwrap').forEach(function (w) { io.observe(w); });
})();
