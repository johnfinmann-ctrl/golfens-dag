# Forslag: admin-PIN og sikkerhed (INGEN ændringer er foretaget)

## Hvad undersøgelsen viser
- PIN `1234` står i klartekst i `app.js` (`checkAdminPin`). Alle kan læse den i kildekoden.
- Admin-siden gemmer **kun i den enkelte enheds localStorage** ("Gem lokalt (kun denne enhed)"). Ændringer deles ikke med andre brugere og ændrer ikke appen for resten.
- Det betyder: i dag kan en udefrakommende ikke ødelægge indhold for andre via admin. Risikoen er lav, men PIN'en giver **falsk tryghed** og kan ikke beskytte noget rigtigt – GitHub Pages er statisk og har ingen server, hvor en hemmelighed kan gemmes.
- Mindre fund: felterne i admin indsættes med `innerHTML`/`value="…"` uden escaping (kun egen enhed berørt); links kunne i teorien være `javascript:` (kun egen enhed).

## Muligheder
A. **Anbefalet – indhold i repoet, adgang via GitHub:** flyt redigerbart indhold til én fil (fx `data/indhold.json`) og lad klubbens administratorer redigere den direkte på github.com (tilladelser, historik og fortryd følger med GitHub). Admin-siden i appen fjernes eller omdøbes til "lokal forhåndsvisning". Ingen ekstra tjenester.
B. **Hash i stedet for klartekst:** gem kun et saltet hash (WebCrypto PBKDF2) af en lang adgangskode. Skjuler koden, men beskytter stadig ikke mod en der kopierer appen – kun relevant hvis admin-siden beholdes som lokalt værktøj.
C. **Rigtig login:** hosted login (fx Supabase Auth/Firebase) eller Decap CMS med GitHub-login. Giver fælles redigering fra appen, men indfører en ekstern tjeneste og drift – kun hvis klubben vil redigere uden GitHub.

## Anbefaling
Behold nuværende adgangssystem uændret til test. Før overtagelse: vælg A (evt. B som overgang). Beslutning og ændringer afventer Johns godkendelse.
