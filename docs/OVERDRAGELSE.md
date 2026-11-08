# Fremtidig overdragelse til Lyngbygaard Golfklub (forberedelse – intet er flyttet)

**Status nu:** appen forbliver på Johns personlige GitHub-konto, indtil den er færdigudviklet og gennemtestet. Intet flyttes, før det er besluttet særskilt.

## Når klubben skal overtage – tjekliste
1. Klubben opretter en GitHub-organisation (eller bruger en eksisterende) med mindst to administratorer.
2. Repoet overføres (Settings → Danger zone → Transfer) – eller klubben får en kopi. GitHub Pages slås til i det nye repo (Settings → Pages → branch `main`, mappe `/`).
3. Ny adresse indsættes i `README.md`, og appen installeres igen på testenheder (PWA-cachen følger den nye adresse).
4. Admin-adgang afklares jf. `FORSLAG-ADMIN-SIKKERHED.md` før overtagelse.
5. Klubben tjekker, at tilmeldingslinkene under Begynderforløb (`beginnerCourses` i `app.js`) er de rigtige. Appen har ingen tilmelding til selve Golfens Dag.
6. Billeder: eventuelle nye, autentiske fotos fra Lyngbygaard lægges i `assets/images/` (se `VEDLIGEHOLDELSE.md`).

## Afhængigheder
Ingen backend, ingen abonnementer, ingen tredjepartsnøgler, ingen build. Eksterne links peger på lyg.dk. Skrifttyper er systemskrifter (ingen eksterne fonte).
