# Simulator de Profunzime a Câmpului

O aplicație web care te ajută să înțelegi profunzimea de câmp (depth of field) pentru foto și video. Ajustezi diafragma, distanța focală, distanța până la subiect și camera folosită, iar aplicația recalculează instant limitele apropiată/îndepărtată ale zonei clare, distanța hiperfocală și câmpul vizual — cu o schemă vizuală care arată totul dintr-o privire, în 3 limbi.

Creat de **Cristi Gordas** ([@gordasgdc](https://github.com/gordasgdc)).

**[➡ Demo live](https://gordasgdc.github.io/depth-of-field/)**

---

## Cuprins

- [Ce face aplicația](#ce-face-aplicația)
- [Funcționalități principale](#funcționalități-principale)
- [Mod Foto vs. Mod Video](#mod-foto-vs-mod-video)
- [Selectorul de Senzor / Cameră](#selectorul-de-senzor--cameră)
- [Cine influențează profunzimea de câmp?](#cine-influențează-profunzimea-de-câmp)
- [Limbi disponibile (RO / EN / ES)](#limbi-disponibile-ro--en--es)
- [Funcționalități pentru video / wedding](#funcționalități-pentru-video--wedding)
- [Stack tehnic](#stack-tehnic)
- [Structura proiectului](#structura-proiectului)
- [Cum să pornești proiectul local](#cum-să-pornești-proiectul-local)
- [Scripturi disponibile](#scripturi-disponibile)
- [Publicare pe GitHub Pages](#publicare-pe-github-pages)
- [Cum funcționează calculul (pe scurt)](#cum-funcționează-calculul-pe-scurt)
- [Contribuții](#contribuții)

---

## Ce face aplicația

Profunzimea de câmp (DoF) este zona din fața și din spatele punctului de focalizare care rămâne acceptabil de clară într-o imagine. Trei parametri o controlează în principal:

- **diafragma** (f-stop / T-stop) — deschisă (f/1.4) = fundal foarte blurat; închisă (f/16) = totul clar;
- **distanța focală** — un obiectiv tele (85mm+) izolează mai mult subiectul decât unul wide (24mm);
- **distanța până la subiect** — cu cât te apropii, cu atât zona clară devine mai îngustă.

Aplicația face calculele astea în timp real, folosind formulele standard de optică fotografică (cerc de confuzie, distanță hiperfocală etc.), și afișează rezultatul atât numeric, cât și printr-o diagramă vizuală a scenei, plus explicații educaționale gândite pentru studenți la foto/film.

## Funcționalități principale

- **Diagramă vizuală a scenei** — o reprezentare grafică a camerei, a subiectului și a zonei clare/neclare, care se actualizează live pe măsură ce miști controalele.
- **Scenarii Comune (preseturi rapide)** — patru butoane predefinite pe fiecare mod: *Portret / Peisaj / Nuntă - inele / Street photo* (Foto) sau *Interviu / B-roll Peisaj / Nuntă - filmare inele / Vlog-Street* (Video). Un click setează instant diafragma, distanța focală și distanța la valorile tipice pentru acel gen de cadru.
- **Cine influențează profunzimea de câmp?** — panou educațional dedicat, tabel comparativ live și un sfat practic dinamic (detalii [mai jos](#cine-influențează-profunzimea-de-câmp)).
- **Ghid inițial (onboarding)** — la prima vizită apare un mic modal care explică pe scurt ce face fiecare control (diafragmă, distanță focală, distanță, senzor) și unde găsești panoul „Cine influențează". Apare o singură dată per browser (reține asta în `localStorage`).
- **Bară de profunzime colorată** — sub slider-ul de distanță apare o bară verde/roșu: verde = zona în care subiectul rămâne clar, roșu = zona neclară. Se actualizează instant la orice modificare.
- **Badge „Distanța hiperfocală s-a mutat"** — un mic indicator apare temporar lângă slider-ul de distanță de fiecare dată când distanța hiperfocală se schimbă semnificativ.
- **Panou de statistici** — Focalizare Apropiată, Focalizare Îndepărtată, Profunzime Totală și Distanța Hiperfocală, afișate clar, cu buton „Setează Hiperfocala" pentru focalizare cu un click la distanța optimă.
- **Etichetă de gen de cadru** — un badge colorat (ex. „Portret", „Peisaj", „Macro / Produs") care recunoaște automat, din profunzimea totală calculată, ce tip de fotografie/filmare se potrivește cu setarea curentă.
- **Avertisment de difracție** — dacă închizi prea mult diafragma pentru senzorul ales, apare un avertisment că imaginea își poate pierde din claritate din cauza difracției.
- **Mod Comparație** — pune două formate de senzor față în față (ex. Full Frame vs. APS-C vs. Super 35), la aceeași distanță focală și diafragmă, ca să vezi vizual diferența de profunzime de câmp introdusă doar de senzor.
- **Subiecți de referință** — Persoană, Persoană la Birou, Cuplu de Miri, Câine Mic/Mediu/Mare — utili ca reper vizual de scară în diagramă.
- **Unități Metric / Imperial** — comutare instant între metri/cm și picioare/inch.
- **Partajare prin link** — orice combinație curentă (cameră, obiectiv, diafragmă, distanță, mod Foto/Video, limbă) se salvează automat în URL. Butonul „Copiază Link" din subsol copiază adresa exactă, gata de trimis cuiva.
- **Presetări salvate de utilizator** — butonul „Salvează această combinație" reține până la 3 seturi de parametri (inclusiv camera exactă) direct în browser (`localStorage`), pe care le poți încărca sau șterge rapid oricând revii pe site.
- **Fișă de Platou (printabilă)** — butonul „Printează Fișa" generează o pagină curată, gata de print, cu toate setările curente — utilă de dus fizic pe platou.
- **FAQ / Ajutor integrat** — o secțiune de tip acordeon la finalul paginii, cu 6 întrebări frecvente (inclusiv diferența f-stop vs. T-stop), scrise ca material didactic.
- **Mod întunecat / luminos** — comutare din colțul din dreapta sus, cu toate culorile diagramei adaptate automat.
- **Design responsive** — layout-ul se rearanjează pe telefon (coloane în loc de grid), iar butoanele/slider-ele au dimensiuni suficient de mari pentru control cu degetul (minimum 44px înălțime).
- **Accesibilitate** — contur de focus vizibil pentru navigarea cu tastatura, etichete `aria-label` pe elementele interactive.
- **Tooltip-uri educaționale** — un mic „?" lângă fiecare control explică pe scurt de ce contează parametrul respectiv.

## Mod Foto vs. Mod Video

Un comutator **Foto / Video**, plasat deasupra secțiunii de scenarii rapide, schimbă atât presetările afișate, cât și terminologia:

| | **Foto** (implicit) | **Video** |
|---|---|---|
| Scenarii rapide | Portret · Peisaj · Nuntă - inele · Street photo | Interviu · B-roll Peisaj · Nuntă - filmare inele · Vlog / Street |
| Presetări de mai jos | „Presetări Rapide" (camere web, telefon, APS-C, Full Frame, Format Mediu) | „Presetări Video / Nuntă" (combinații reale Sony / Panasonic / Canon) |
| Selector Senzor / Cameră | 17 camere foto reale, grupate pe brand | 13 camere video reale, grupate pe brand |
| Eticheta diafragmei | „Diafragmă" | „Diafragmă (T-stop aprox.)" |

La comutarea între moduri, camera selectată sare automat pe primul model din noua listă (Sony A7 IV pentru Foto, Sony FX3 pentru Video), cu un mesaj de confirmare (toast). Alegerea modului se salvează și în URL (`?captureMode=Video`), deci un link partajat păstrează contextul corect.

## Selectorul de Senzor / Cameră

În loc de o listă generică de tipuri de senzor, meniul principal **„Senzor / Cameră"** afișează modele reale de cameră, grupate pe brand (`<optgroup>`), filtrate automat după modul ales:

- **Modul Foto** — 17 modele: Sony (A7 IV, A7 III, A7R V, A6700), Canon (R6 Mark II, R5, R8, R7), Nikon (Z6 II, Z7 II, Z5, Z50), Panasonic (S5 II, S1), Fuji (X-T5, X-H2, GFX 100S).
- **Modul Video** — 13 modele: Sony (FX3, FX30, A7S III, A7 IV), Canon (C70, R6 Mark II, R5 C), Panasonic (GH6, GH7, S5 II, S1H), Nikon (Z6 II, Z8).

Fiecare cameră are dimensiunea exactă a senzorului (mm), din care se calculează automat crop factor-ul și cercul de confuzie folosite în formulele de profunzime de câmp — nu mai sunt valori generice aproximative. La finalul listei rămâne opțiunea **„Senzor Personalizat"**, pentru camere care nu apar în bază de date: introduci manual lățimea și înălțimea senzorului (mm).

Datele stau într-un singur fișier static, `src/data/cameras.ts` — ușor de extins cu modele noi, fără nicio dependență de server.

## Cine influențează profunzimea de câmp?

Sub controalele principale, un panou dedicat explică cei 3 factori care controlează DoF:

- **Panoul „Cine influențează?"** — trei carduri colorate (diafragmă, distanță focală, distanță până la subiect), fiecare cu explicație simplă și efectul pe scurt. Se poate închide (✕) și rămâne închis prin `localStorage`, cu buton mic de redeschidere.
- **Tabel Comparativ** — actualizat live cu valorile tale curente, arată ce se întâmplă cu claritatea dacă fiecare factor crește sau scade.
- **Sfat Practic dinamic** — un mesaj calculat local (fără server), care recunoaște combinații tipice: diafragmă deschisă + tele + subiect aproape → avertisment „blur puternic, verifică focusul"; diafragmă închisă + wide + subiect departe → „totul va fi clar, ideal pentru peisaje"; și alte 3 sfaturi intermediare.

Toată logica ("care sfat se potrivește") stă într-un hook dedicat, `src/hooks/useInfluencers.ts` — simplă aritmetică pe valorile curente, fără nicio cerere de rețea.

## Limbi disponibile (RO / EN / ES)

Aplicația e complet tradusă în **Română, English și Español**, printr-un selector în bara de sus. Traducerea acoperă tot: titluri, butoane, tooltip-uri, badge-uri, Mod Nuntă, FAQ, modalul de onboarding, panoul „Cine influențează" și Fișa de Platou printabilă.

Datele interne (nume de senzori, subiecți, presetări, camere) rămân neschimbate ca **chei** (folosite în URL, `localStorage`, calcule), dar eticheta afișată se traduce separat — deci linkurile partajate și presetările salvate rămân valide indiferent de limbă. Alegerea limbii se salvează și ea în URL (`?lang=en`).

Textele stau în `src/i18n.ts` (traducerile generale ale interfeței) și `src/translations/influencers.ts` (textele panoului „Cine influențează").

## Funcționalități pentru video / wedding

- **Presetări Video / Nuntă** — combinații reale de cameră + obiectiv pentru Sony, Panasonic și Canon, cu note despre crop-ul video specific fiecărei camere. Vizibile în Mod Video.
- **Simulare Rack Focus** — setezi o distanță de start și una finală, apeși Play și vezi live cum se schimbă profunzimea de câmp în timpul unei treceri de focus (tranziție cu ease-in-out, ca la un focus pull real).
- **Mod Nuntă (setează și uită)** — un switch care traduce distanța apropiată/îndepărtată calculată într-un sfat practic în limbaj simplu: „la acest f-stop și distanță, poți filma liber între X și Y metri, fără să mai atingi focusul".
- **Senzor Super 35 (Cine)** — standardul folosit de camerele de cinema digital (ex. Canon C70), alături de Full Frame, APS-C, Micro Four Thirds și Format Mediu.

## Stack tehnic

- **React 18** + **TypeScript** — componente funcționale, cu hooks (`useState`, `useMemo`, `useEffect`, `useRef`).
- **Vite** — build tool și dev server.
- **Chakra UI 2** — biblioteca de componente UI (sliders, modal, accordion, toast, tabel, tema light/dark).
- **react-icons** (Tabler + Feather) — iconițe folosite consecvent în toată interfața.
- **GitHub Actions + GitHub Pages** — build și publicare automată la fiecare push pe `main`.

Nu există niciun server backend, bază de date sau API extern — toată logica (inclusiv baza de date de camere și traducerile) rulează în browser, din fișiere TypeScript statice, iar persistența (ghid văzut, presetări salvate, limbă) folosește `localStorage` și URL.

## Structura proiectului

```
depth-of-field/
├── .github/workflows/deploy.yml   # Workflow GitHub Actions pentru publicare pe Pages
├── public/                        # Fișiere statice servite ca atare
├── src/
│   ├── App.tsx                    # Componenta principală: stare, calcule DoF, întreaga interfață
│   ├── App.css / index.css        # Stiluri globale + reguli responsive pentru mobil
│   ├── PhotographyGraphic.tsx     # Diagrama SVG a scenei (cameră, subiect, zonă clară/neclară)
│   ├── i18n.ts                    # Traduceri RO/EN/ES pentru toată interfața
│   ├── selectStyles.ts            # Stiluri pentru select-urile native, adaptate la tema light/dark
│   ├── utils/units.ts             # Conversii inch ↔ metric/imperial pentru afișare
│   ├── data/
│   │   └── cameras.ts             # Baza de date de camere reale (Foto + Video), grupate pe brand
│   ├── components/
│   │   ├── InfluencersPanel.tsx   # Panoul "Cine influențează profunzimea?"
│   │   ├── ComparisonTable.tsx    # Tabelul comparativ live
│   │   └── PracticalTip.tsx       # Sfatul practic dinamic
│   ├── hooks/
│   │   └── useInfluencers.ts      # Logica (100% locală) care alege sfatul potrivit
│   ├── translations/
│   │   └── influencers.ts         # Traducerile RO/EN/ES pentru panoul "Cine influențează"
│   └── *.test.tsx                 # Teste (vezi „Scripturi disponibile")
├── index.html
├── vite.config.ts                 # base: '/depth-of-field/' — necesar pentru GitHub Pages
├── tsconfig.json / tsconfig.node.json
└── package.json
```

## Cum să pornești proiectul local

```bash
npm install
npm run dev
```

Aplicația pornește implicit la `http://localhost:5173`.

## Scripturi disponibile

| Comandă | Ce face |
|---|---|
| `npm run dev` | Pornește serverul de dezvoltare Vite, cu reîncărcare instant la salvare |
| `npm run build` | Verifică tipurile TypeScript (`tsc`) și construiește versiunea de producție în `dist/` |
| `npm run preview` | Servește local build-ul de producție din `dist/`, ca test final înainte de push |
| `npm run lint` | Rulează ESLint pe tot codul sursă |
| `npm test` | Rulează suita de teste (`src/**/*.test.tsx`) |

**Recomandare înainte de orice `git push`:** rulează `npm run build` (verifică erorile de tip) și `npm run preview` (verifică vizual în browser) ca să confirmi că totul funcționează înainte de publicare.

## Publicare pe GitHub Pages

Proiectul include deja un workflow GitHub Actions (`.github/workflows/deploy.yml`) care construiește și publică automat aplicația pe GitHub Pages la fiecare push pe ramura `main`.

Pentru a activa publicarea (dacă pornești de la un fork sau un repo nou):

1. Urcă acest proiect într-un repository pe contul tău GitHub.
2. În repository, mergi la **Settings → Pages** și setează sursa la **GitHub Actions**.
3. Verifică în `vite.config.ts` ca opțiunea `base` să corespundă cu numele repository-ului tău (implicit: `/depth-of-field/`).
4. La următorul push pe `main`, aplicația va fi publicată automat — progresul poate fi urmărit în tab-ul **Actions** al repo-ului.

**Notă importantă:** orice modificare trebuie să păstreze `base: '/depth-of-field/'` din `vite.config.ts`, să folosească doar căi relative către imagini/resurse și să nu introducă dependențe care necesită server-side rendering sau variabile de mediu la build — altfel site-ul publicat pe GitHub Pages nu va funcționa corect. La fiecare fișier nou (ex. o componentă din `src/components/`), asigură-te că îl plasezi exact în folderul indicat mai sus — o cale greșită produce erori de tipul „Cannot find module" la build în GitHub Actions.

## Cum funcționează calculul (pe scurt)

Pentru fiecare combinație de distanță focală, diafragmă, cameră (sau senzor personalizat) și distanță până la subiect, aplicația calculează:

1. **Cercul de confuzie** (CoC) — cel mai mic punct pe care ochiul uman îl percepe ca fiind „clar" pe un anumit format de senzor; se calculează din diagonala senzorului (`√(lățime² + înălțime²) / 1500`), la fel pentru camerele din baza de date și pentru senzorul personalizat.
2. **Crop factor** — raportul dintre diagonala unui senzor full-frame (43.27mm) și diagonala senzorului curent.
3. **Distanța hiperfocală** — distanța de focalizare la care tot ce se află de la jumătatea ei până la infinit rămâne clar. Formula: `H = f + f² / (N × CoC)`, unde `f` = distanța focală, `N` = diafragma.
4. **Limitele apropiată și îndepărtată ale zonei clare** — derivate din distanța hiperfocală și distanța până la subiect.
5. **Câmpul vizual vertical** — din dimensiunile senzorului și distanța focală, folosit pentru a desena corect diagrama scenei.

Toate aceste formule sunt cele standard din optica fotografică clasică (aceleași folosite de calculatoarele DoF profesionale), aplicate live pe măsură ce miști controalele.

## Contribuții

Proiectul e personal, dar sugestii și probleme (issues) sunt binevenite prin [pagina de GitHub](https://github.com/gordasgdc/depth-of-field).
