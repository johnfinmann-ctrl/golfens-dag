# Golfens Dag – Lyngbygaard Golf · v3.0.0 – ændringsoversigt (TESTVERSION, ikke publiceret)
Gren: `design/premium-2027` · `main` og produktion er urørt.

## Det der er ændret
- **Forside:** serif-overskrift (kursivt "Golfklub"), guld eyebrow, mere luft, bedre kontrast. De seks billedkort er uændrede (rækkefølge, billeder, links, funktion).
- **Ny sektion "Hvorfor prøve golf?":** lys creme, mørkegrøn tekst, guld detaljer, ingen ikoner/illustrationer. Tekstfarver kontrolleret (≥ 4,5:1 til brødtekst).
- **Tilmelding:** (v3.0.4) Der er ingen tilmelding til selve Golfens Dag i appen – gæsterne får appen på dagen (QR-kode). Knappen "Se vores begynderforløb" fører til appens begynderside. Begynderforløb-linkene er uændrede.
- **Velkomstanimation:** bolden ruller mod flaget som før; teksten "Prøv golf på Lyngbygaard" vises først, når bolden er stoppet. Varighed ca. 5,5 s, én gang pr. session, "Spring over", reduceret bevægelse respekteres. Titlen er gjort mindre på brede/lave skærme, så den ikke ligger over træerne.
- **Rettelser:** kort stak ud over kanten på 320 px; hero var unødigt høj på iPad stående.
- **Navn:** "Golfens Dag – Lyngbygaard Golf" (titel + manifest). Ingen personlige udviklernavne i brugerfladen.

## Ikke ændret (efter ønske)
Adgangssystem/admin-PIN, GitHub `main`, ejerskab af repo, eksisterende billeder og links.

## Test (Chromium, simuleret – ikke rigtig iPhone/iPad/Safari)
Bredder 320–1920: ingen vandret scroll, ingen beskåret tekst, alle seks kort navigerer, eksterne links uændrede, tilmeldingsknap ikke dækket af nyhedsbåndet, ingen JS-fejl. Animation: bold ude af flagets område og inden for skærmen, tekst først efter stop, "Spring over" inden for skærmen, reduceret bevægelse virker – testet på 320×568, 360×640, 390×844, 430×932, 667×375, 820×1180, 1180×820.

## Tillæg v3.0.2–v3.0.3 (test)
- Blok "Kom og oplev golfens verden" er tekst direkte på golfbaggrunden (ingen cremeboks, ingen ikoner), med de fire punkter som én diskret tekstlinje, mellem velkomst og de seks fotokort.
- Seks ubrugte mellemversioner af billeder fjernet fra pakken (erstattet af de -logo-versioner; originaler ligger i `originaler/`).
- Cacheversion hævet til v3.0.2 (automatisk opdatering hos brugerne). Tilmeldingsknappen afventer stadig linket.
- v3.0.3: forsidens baggrund er nu et ægte klubfoto (fra klubbens egen 18-hullers-optagelse, `forside-hero-bane*.webp`), lysere toning; de fire aktivitetsord er fjernet; mindre tom plads; blød overgang til cremesektionen; informationsbjælken viser de to budskaber skiftevis (rolig, ingen tekst skæres af). Links, navigation, animation og tilmeldingsknap uændrede.
- v3.0.4: appens formål præciseret (digital velkomstguide på dagen, åbnes via QR-kode uden login). Knappen "Tilmeld dig Golfens Dag" og teksten om afventende link er fjernet; erstattet af "Se vores begynderforløb" (fører til begynderforløb-siden). Ny velkomsttekst under "Kom og oplev golfens verden". Nyhedsbjælken viser én besked: "Velkommen til Golfens Dag – find dagens program og aktiviteter her." (link til Program). Design, billedkort, animation, navigation og PWA uændrede.
