# Vedligeholdelse – hvor ændrer man hvad?
Al indhold ligger i almindelige filer uden build. Efter en ændring: skift versionsnummer (se bunden), så alle enheder henter det nye.

| Hvad | Hvor |
|---|---|
| Klubbens adresse, telefon, mail, hjemmeside, kort-link | `app.js` → `clubConfig` (øverst) |
| Begynderhold: navne, datoer, pris, pladser, tilmeldingslink | `app.js` → `beginnerCourses` |
| Dagens program (tider/titler) og stationer | `app.js` → `programItems`, `stations` |
| Golfbegreber | `app.js` → `golfTerms` |
| Kort på siden "Om klubben" (titel + link) | `app.js` → `clubCards` |
| Nyhedsbjælken (besked til gæster) | `index.html` → `<nav class="ticker">` |
| Forsidens tekster, "Hvorfor prøve golf?", nyhedsbånd, popup | `index.html` |
| Link på kortet "Mød trænerteamet" og "lyg.dk" på forsiden | `index.html` (søg efter `lyg.dk`) |
| Billeder på de seks forsidekort | `style.css` → `.gh-card[data-card="…"] { --img: url(…) }` + filen i `assets/images/` |
| Velkomstanimation (tider, tekst) | `velkomst.js` → `CONFIG` (øverst) |
| Farver | `style.css` (guld `#C9A45C`, mørkegrøn `#0B3D2B`, creme `#F4EFE6`) |

**Nye billeder:** læg filen i `assets/images/` (WebP, ca. 800 px bred til kort), peg `--img` på den, og tilføj filnavnet i `service-worker.js` → `ASSETS`.

**Versionsnummer (så cachen opdateres):** erstat det gamle nummer i `app.js`, `style.css`, `index.html`, `service-worker.js`, `intro.js`, `velkomst.js`, fx
`sed -i 's/3\.0\.0/3.0.1/g' app.js style.css index.html service-worker.js intro.js velkomst.js`

**OBS:** admin-siden i appen gemmer kun ændringer på den enhed, den bruges på (localStorage). Den ændrer ikke appen for andre brugere – brug tabellen ovenfor til rigtige ændringer.
