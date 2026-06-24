# Golfens Dag 2026 – Lyngbygaard Golfklub

## Filer
- `index.html` – App struktur (rør ikke uden grund)
- `style.css` – Design og layout
- `app.js` – **Al konfiguration redigeres her**
- `manifest.json` – PWA manifest
- `service-worker.js` – Offline-understøttelse
- `icon-192.png` / `icon-512.png` – App-ikoner

## Deployment – GitHub Pages

1. Opret et nyt repository, f.eks. `golfens-dag-2026`
2. Upload alle filer til repository-roden
3. Gå til **Settings → Pages → Branch: main / root**
4. Appen er live på: `https://johnfinmann-ctrl.github.io/golfens-dag-2026/`

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
    start: "17. marts 2026",         // Startdato
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
- PIN: **1234**
- Ændringer gemmes automatisk i localStorage på enheden

## PWA – installation

Appen kan installeres på:
- **iPhone/iPad**: Safari → Del-knap → "Føj til hjemmeskærm"
- **Android**: Chrome → menu → "Installér app"
- **Desktop**: Chrome/Edge → installér-ikon i adresselinjen

## Ikoner

Erstat `icon-192.png` og `icon-512.png` med Lyngbygaard Golfs officielle logo
(PNG, kvadratisk, gennemsigtig baggrund anbefales).
