# Golfens Dag 2027 – Lyngbygaard Golfklub

## Filer
- `index.html` – App struktur (rør ikke uden grund)
- `style.css` – Design og layout
- `app.js` – **Al konfiguration redigeres her**
- `intro.js` – Ken Burns-velkomstskærm (golfbolde, "KOM I GANG") + mikroanimation på Begynderforløb
- `manifest.json` – PWA manifest
- `service-worker.js` – Offline-understøttelse og cacheversionering
- `icon-192.png` / `icon-512.png` – App-ikoner

> Mappen `golfens-dag-2026/` indeholder en tidligere parallel version.
> Den publiceres ikke og må ikke slettes – se leveringsrapporten for baggrund.

## Deployment – GitHub Pages

1. Repository: `golfens-dag` (already oprettet)
2. Upload alle filer til repository-roden
3. **Settings → Pages → Branch: main / root**
4. Appen er live på: `https://johnfinmann-ctrl.github.io/golfens-dag/`

### Ved enhver ny deploy
Bump versionsnummeret tre steder, ellers risikerer besøgende at blive
siddende med gamle filer i deres cache:
1. `CACHE_NAME` i `service-worker.js`
2. `?v=` på `style.css`, `app.js` og `intro.js` i `index.html`
3. `APP_VERSION` i `app.js` (styrer også footer-versionsnummeret automatisk)

## Rediger indhold (app.js)

Åbn `app.js` og find de tre konfigurationsblokke øverst:

### Klub oplysninger
```js
const clubConfig = {
  name: "Lyngbygaard Golfklub",
  phone: "87 44 10 70",
  email: "kontor@lyg.dk",
  ...
}
```

### Begynderhold
```js
const beginnerCourses = [
  {
    name: "Hold 7A",
    start: "17. marts 2027",         // Startdato
    dates: ["17/3","24/3","31/3"],   // Alle datoer
    price: "2.500 kr.",
    seats: "16 pladser",
    signup: "https://lyg.dk/begyndergolf/#kontakt-form"
  },
  ...
]
```

## Admin-panel

- Tryk ⚙️ nederst til højre i appen
- PIN: **1234** – kun en let afskærmning, **ikke** sikker adgangskontrol (koden ligger i klientkoden)
- Adminpanelet er kun en **lokal forhåndsvisning**: ændringer gemmes i localStorage på den enkelte enhed og opdaterer ikke appen for andre besøgende
- Permanente ændringer til alle besøgende kræver redigering af `app.js` (og senere evt. Supabase)

## PWA – installation

Appen kan installeres på:
- **iPhone/iPad**: Safari → Del-knap → "Føj til hjemmeskærm"
- **Android**: Chrome → menu → "Installér app"
- **Desktop**: Chrome/Edge → installér-ikon i adresselinjen

## Ikoner

Erstat `icon-192.png` og `icon-512.png` med Lyngbygaard Golfs officielle logo
(PNG, kvadratisk, gennemsigtig baggrund anbefales).
