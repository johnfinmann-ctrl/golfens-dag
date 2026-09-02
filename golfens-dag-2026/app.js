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
  { time: "09.15", title: "Mødetid", icon: "🕘" },
  { time: "09.30", title: "Klargøring", icon: "🏌️" },
  { time: "10.00", title: "Velkomst", icon: "👋" },
  { time: "10.15", title: "Stationer", icon: "⛳" },
  { time: "12.45", title: "Afslutning", icon: "🏁" }
];

const stations = ["Putting", "Slag", "Indspil", "Børn", "Rundvisning"];

// --- GOLFBEGREBER ---
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
  { icon: "⛳", title: "18 huller", url: "https://lyg.dk/baner-faciliteter/" },
  { icon: "🏌️", title: "9 huller", url: "https://lyg.dk/baner-faciliteter/" },
  { icon: "🍽️", title: "Restaurant", url: "https://lyg.dk/brasseriet/" },
  { icon: "👨‍🏫", title: "Trænerteam", url: "https://lyg.dk/traenerteamet/" },
  { icon: "🎓", title: "Begynderhold", url: "https://lyg.dk/begyndergolf/" },
  { icon: "🌐", title: "Hjemmeside", url: "https://lyg.dk/" }
];

// ============================================================
// APP ENGINE – rør ikke nedenfor medmindre du ved hvad du gør
// ============================================================

const APP_VERSION = '2.4';
const APP_UPDATED = '2027-01-01';

const STORAGE_KEY = 'golfensdag2027_config';

function loadConfig() {
  try {
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
const pages = ['home', 'program', 'traener', 'begreber', 'begynder', 'kontakt', 'om', 'admin'];

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
        <span class="timeline-icon" aria-hidden="true">${item.icon}</span>
        <span class="timeline-title">${item.title}</span>
      </div>
    </div>
  `).join('');

  const stationsEl = document.getElementById('stations-list');
  stationsEl.innerHTML = stations.map(s => `
    <div class="station-chip" role="listitem">⛳ ${s}</div>
  `).join('');
}

function renderBegreber() {
  const list = document.getElementById('begreber-list');
  list.innerHTML = golfTerms.map(t => `
    <div class="term-card" role="listitem">
      <div class="term-badge">${t.term}</div>
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
  document.getElementById('kontakt-phone-text').textContent = '☎ ' + clubConfig.phone;
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
  grid.innerHTML = clubCards.map(c => `
    <a href="${c.url}" target="_blank" rel="noopener" class="om-card">
      <span class="om-icon">${c.icon}</span>
      <span class="om-label">${c.title}</span>
      <span class="om-arrow">↗</span>
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
    <button class="btn-primary" onclick="saveAdmin()">💾 Gem ændringer</button>
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
  if (confirm('Nulstil alle ændringer til standard?')) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
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

  // Kør micro-bold animation
  if (typeof window.gdMicroBall === 'function') {
    window.gdMicroBall(canvas, function () {
      content.classList.add('show');
    });
  } else {
    content.classList.add('show');
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
  document.querySelectorAll('.footer-phone').forEach(el => el.textContent = '☎ ' + clubConfig.phone);
  document.querySelectorAll('.footer-website').forEach(el => el.href = clubConfig.website);

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
