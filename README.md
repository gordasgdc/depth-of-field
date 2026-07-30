# Simulator de Profunzime a Câmpului

O aplicație web care te ajută să înțelegi profunzimea de câmp a unui obiectiv foto sau video. Poți ajusta diafragma, distanța focală și distanța până la subiect pentru a vedea cum se schimbă profunzimea de câmp. Aplicația mai arată și distanța hiperfocală, precum și limitele apropiată și îndepărtată ale profunzimii de câmp.

Creat de **Cristi Gordas** ([@gordasgdc](https://github.com/gordasgdc)).

Realizat pe baza proiectului original [depth-of-field](https://github.com/jherr/depth-of-field) al lui Jason Herr.

[Demo Live](https://gordasgdc.github.io/depth-of-field/)

## Funcționalități pentru video / wedding

Pe lângă simulatorul clasic de foto, aplicația include:

- **Presetări Video / Nuntă** — combinații reale de cameră + obiectiv pentru Sony (A7 III/IV, A7S III, FX3, FX30, A6400), Panasonic (GH5, GH6, S5, S1H) și Canon (R6, R6 II, C70), cu note despre crop-ul video specific fiecărei camere.
- **Simulare Rack Focus** — setezi o distanță de start și una finală, apeși Play și vezi live cum se schimbă profunzimea de câmp în timpul unei treceri de focus (tranziție cu ease-in-out, ca la un focus pull real).
- **Mod Nuntă (setează și uită)** — un switch care traduce distanța apropiată/îndepărtată calculată într-un sfat practic în limbaj simplu: "la acest f-stop și distanță, poți filma liber între X și Y metri, fără să mai atingi focusul".
- **Partajare prin link** — orice combinație de cameră/obiectiv/distanță se salvează automat în URL. Butonul „Copiază Link" din subsol copiază adresa curentă, gata de trimis unui student cu un setup exact.
- **Tooltip-uri educaționale** — un mic „?" lângă fiecare control (Unități, Distanță, Distanță Focală, Diafragmă, Senzor, Subiect) explică pe scurt de ce contează parametrul respectiv.
- **Mod Comparație** — pune două formate de senzor față în față (ex. Full Frame vs. APS-C vs. Super 35), la aceeași distanță focală și diafragmă, ca să vezi vizual diferența de profunzime de câmp.
- **Fișă de Platou (printabilă)** — butonul „Printează Fișa" generează o pagină curată, gata de print, cu toate setările curente (senzor, distanță focală, diafragmă, focalizare apropiată/îndepărtată, hiperfocală) — utilă de dus pe platou.
- **Cuplu de Miri** — un nou subiect de referință (două siluete alăturate), pentru cadre de nuntă unde vrei să măsori profunzimea de câmp pe doi oameni în loc de unul.
- **Senzori extinși** — pe lângă Full Frame, APS-C, Micro Four Thirds și Format Mediu, s-a adăugat și **Super 35 (Cine)**, standardul folosit de camerele de cinema digital (ex. Canon C70).

## Cum să pornești proiectul

Aceste instrucțiuni te vor ajuta să rulezi o copie a proiectului pe calculatorul tău, pentru dezvoltare și testare.

```bash
npm install
npm run dev
```

## Publicare pe GitHub Pages

Proiectul include deja un workflow GitHub Actions (`.github/workflows/deploy.yml`) care construiește și publică automat aplicația pe GitHub Pages la fiecare push pe ramura `main`.

Pentru a activa publicarea:

1. Urcă acest proiect într-un repository nou pe contul tău GitHub (`gordasgdc`).
2. În repository, mergi la **Settings → Pages** și setează sursa la **GitHub Actions**.
3. Verifică în `vite.config.ts` ca opțiunea `base` să corespundă cu numele repository-ului tău (implicit: `/depth-of-field/`).
4. La următorul push pe `main`, aplicația va fi publicată automat.
