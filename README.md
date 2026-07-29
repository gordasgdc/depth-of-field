# Simulator de Profunzime a Câmpului

O aplicație web care te ajută să înțelegi profunzimea de câmp a unui obiectiv foto. Poți ajusta diafragma, distanța focală și distanța până la subiect pentru a vedea cum se schimbă profunzimea de câmp. Aplicația mai arată și distanța hiperfocală, precum și limitele apropiată și îndepărtată ale profunzimii de câmp.

Creat de **Cristi Gordas** ([@gordasgdc](https://github.com/gordasgdc)).

Realizat pe baza proiectului original [depth-of-field](https://github.com/jherr/depth-of-field) al lui Jason Herr.

[Demo Live](https://gordasgdc.github.io/depth-of-field/)

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
