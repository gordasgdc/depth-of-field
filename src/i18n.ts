// ── Internaționalizare (RO / EN / ES) ──
// Toate textele vizibile din interfață trec prin acest dicționar. Cheile
// interne de date (nume de senzori, subiecți, presetări) rămân neschimbate
// în cod (folosite în URL, localStorage etc.) — doar eticheta afișată se
// traduce, prin hărțile *_LABELS de mai jos.

export type Lang = "ro" | "en" | "es";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "ro", label: "Română" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  ro: {
    appTitle: "Simulator de Profunzime a Câmpului",
    appTitleBy: "Simulator de Profunzime a Câmpului · de",
    toggleLight: "Comută la modul luminos",
    toggleDark: "Comută la modul întunecat",
    toggleColorAria: "Comută modul de culoare",
    languageSelectorAria: "Alege limba",

    scenariiComune: "Scenarii Comune",
    modComparatie: "Mod Comparație (două formate de senzor)",
    compareWith: "Compară cu:",
    compareLabel: "Comparație — {sensor} (aceeași distanță focală și diafragmă, câmp vizual {fov}°)",
    setupPrincipal: "Setup Principal — {sensor}",
    totalDofFor: "Total DoF — {sensor}",

    focalizareApropiata: "Focalizare Apropiată",
    focalizareIndepartata: "Focalizare Îndepărtată",
    profunzimeTotala: "Profunzime Totală",
    hiperfocala: "Hiperfocală",
    seteazaHiperfocala: "Setează Hiperfocala",
    tooltipSetHyperfocalOk:
      "Focalizează la distanța hiperfocală — tot ce e de la jumătatea acestei distanțe până la ∞ va fi clar",
    tooltipSetHyperfocalBad: "Hiperfocala ({value}) depășește limitele scenei",

    modNunta: "Mod Nuntă (setează și uită)",
    weddingFreeInfinity:
      "La {ap}, {focal}mm, poți filma liber de la {near} până la infinit — totul rămâne clar, fără să mai atingi focusul.",
    weddingFreeRange:
      "La {ap}, {focal}mm, tot ce se află între {near} și {far} va fi clar. Cât timp mirii rămân în acest interval, poți filma fără să mai atingi focusul manual.",
    weddingTip:
      "Sfat: setează focusul la distanța hiperfocală (butonul de mai sus) pentru cea mai largă zonă de siguranță posibilă.",

    unitati: "Unități",
    unitatiTooltip:
      "Alege sistemul de unități pentru afișarea distanțelor: Imperial (ft/in) sau Metric (cm).",
    distanta: "Distanță",
    distantaTooltip:
      "Distanța până la subiectul pe care vrei să-l focalizezi. Cu cât te apropii mai mult, cu atât profunzimea de câmp devine mai mică.",
    hyperfocalBadgePrefix: "Distanța hiperfocală s-a mutat la",

    distantaFocala: "Distanța Focală (mm)",
    distantaFocalaTooltip:
      "Distanță focală mai mare = câmp vizual mai îngust și profunzime de câmp mai mică, la aceeași diafragmă.",
    echivalentCadru: "≈ {value}mm echivalent cadru complet",

    diafragma: "Diafragmă",
    diafragmaVideo: "Diafragmă (T-stop aprox.)",
    diafragmaTooltip:
      "Diafragmă mai deschisă (f mic) = profunzime de câmp mai mică, dar mai multă lumină. Diafragmă închisă (f mare) = profunzime mai mare, dar mai puțină lumină.",
    diafragmaTooltipVideo:
      "T-stop mic (deschis) = profunzime de câmp mai mică, dar mai multă lumină ajunge la senzor. T-stop mare (închis) = profunzime mai mare, dar mai puțină lumină. Spre deosebire de f-stop, T-stop măsoară lumina transmisă efectiv prin obiectiv, corectată pentru pierderile optice — de-asta obiectivele cinema sunt marcate în T, nu în f.",
    difractieWarning: "⚠ Difracția poate reduce claritatea peste {value} pe acest senzor",

    latimeMm: "Lățime (mm)",
    inaltimeMm: "Înălțime (mm)",
    senzor: "Senzor",
    senzorTooltip:
      "Senzorii mai mici au, de regulă, profunzime de câmp mai mare la aceeași distanță focală și diafragmă — de-asta un telefon are totul clar, iar un obiectiv full-frame poate izola subiectul.",
    senzorPersonalizat: "Personalizat",
    senzorPlaceholder: "Senzor",
    senzorCamera: "Senzor / Cameră",
    senzorCameraTooltip:
      "Alege un model de cameră real pentru dimensiuni exacte ale senzorului — lista se schimbă automat în funcție de Modul Foto/Video ales. Nu-ți găsești modelul? Folosește „Senzor Personalizat”.",
    senzorPersonalizatGrup: "Senzor Personalizat",
    toastModeSwitch: "Comutare la Mod {mode}",
    toastModeSwitchDesc: "Cameră selectată: {camera} ({type})",
    subiect: "Subiect",
    subiectTooltip:
      "Alege un subiect de referință, ca să vizualizezi mai ușor scara scenei și unde cade zona de focus pe el.",
    subiectPlaceholder: "Subiect",

    rackFocusTitle: "Simulare Trecere de Focus (Rack Focus)",
    rackFocusDesc:
      "Setează o distanță de start și una finală, apoi apasă Play ca să vezi cum se schimbă profunzimea de câmp în timpul unei treceri de focus — util pentru exersarea unui rack focus manual la nuntă.",
    rackStart: "Start",
    rackEnd: "Final",
    rackPlay: "Redă tranziția",
    rackLoading: "Rulează...",

    salveazaCombinatia: "Salvează această combinație",
    salveazaCombinatiaFull:
      "Salvează combinația curentă de senzor / focală / diafragmă / distanță",
    salveazaCombinatiaFull3: "Ai deja 3 presetări salvate — cea mai veche va fi înlocuită",
    presetariMele: "Presetările Mele",
    stergePresetare: "Șterge presetarea",
    toastSaved: "Combinație salvată!",
    toastSavedDesc: "{name} — o poți încărca oricând mai jos.",

    presetariRapide: "Presetări Rapide",
    presetariVideoNunta: "Presetări Video / Nuntă (camere reale)",

    faqTitle: "Întrebări Frecvente",

    printeazaFisa: "Printează Fișa",
    copiazaLink: "Copiază Link",
    veziPeGithub: "Vezi pe GitHub",
    creatDe: "Creat de",
    toastLinkCopiat: "Link copiat!",
    toastLinkCopiatDesc: "Trimite-l cuiva ca să vadă exact acest setup.",

    onboardingTitle: "Bine ai venit",
    onboardingIntro: "Câteva explicații rapide pentru controalele principale:",
    onboardingAperture:
      "Diafragma (f-stop) — controlează cât de blurat este fundalul. Numere mici = fundal foarte blurat.",
    onboardingFocal: 'Distanța focală — cât de "apropiat" vezi subiectul.',
    onboardingDistance: "Distanța până la subiect — cât de departe este subiectul de cameră.",
    onboardingSensor: "Senzor — formatul camerei tale (Full Frame, APS-C, etc.)",
    onboardingInfluencers:
      "Cine influențează profunzimea? — sub controale găsești un panou dedicat, cu tabel comparativ și un sfat practic, actualizate live.",
    onboardingButton: "Am înțeles",

    fisaDePlatou: "Fișă de Platou",
    fisaDePlatouSub: "Simulator de Profunzime a Câmpului · generat {date}",
    mod: "Mod:",
    senzorLabel: "Senzor:",
    distantaFocalaLabel: "Distanță Focală:",
    diafragmaLabel: "Diafragmă:",
    distantaSubiectLabel: "Distanță Subiect:",
    focalizareApropiataLabel: "Focalizare Apropiată:",
    focalizareIndepartataLabel: "Focalizare Îndepărtată:",
    profunzimeTotalaLabel: "Profunzime Totală:",
    distantaHiperfocalaLabel: "Distanță Hiperfocală:",
    fisaFooter: "Generat cu Simulator de Profunzime a Câmpului — Cristi Gordas · gordasgdc.github.io/depth-of-field",
  },

  en: {
    appTitle: "Depth of Field Simulator",
    appTitleBy: "Depth of Field Simulator · by",
    toggleLight: "Switch to light mode",
    toggleDark: "Switch to dark mode",
    toggleColorAria: "Toggle color mode",
    languageSelectorAria: "Choose language",

    scenariiComune: "Common Scenarios",
    modComparatie: "Compare Mode (two sensor formats)",
    compareWith: "Compare with:",
    compareLabel: "Comparison — {sensor} (same focal length and aperture, {fov}° field of view)",
    setupPrincipal: "Main Setup — {sensor}",
    totalDofFor: "Total DoF — {sensor}",

    focalizareApropiata: "Near Focus Point",
    focalizareIndepartata: "Far Focus Point",
    profunzimeTotala: "Total Depth",
    hiperfocala: "Hyperfocal",
    seteazaHiperfocala: "Set Hyperfocal",
    tooltipSetHyperfocalOk:
      "Focus at the hyperfocal distance — everything from half this distance to ∞ will be sharp",
    tooltipSetHyperfocalBad: "The hyperfocal distance ({value}) is beyond the scene limits",

    modNunta: "Wedding Mode (set and forget)",
    weddingFreeInfinity:
      "At {ap}, {focal}mm, you can shoot freely from {near} to infinity — everything stays sharp, without touching focus again.",
    weddingFreeRange:
      "At {ap}, {focal}mm, everything between {near} and {far} will be sharp. As long as the couple stays in this range, you can shoot without touching manual focus again.",
    weddingTip:
      "Tip: set focus at the hyperfocal distance (button above) for the widest possible safety margin.",

    unitati: "Units",
    unitatiTooltip:
      "Choose the unit system for displaying distances: Imperial (ft/in) or Metric (cm).",
    distanta: "Distance",
    distantaTooltip:
      "The distance to the subject you want to focus on. The closer you get, the shallower the depth of field becomes.",
    hyperfocalBadgePrefix: "The hyperfocal distance moved to",

    distantaFocala: "Focal Length (mm)",
    distantaFocalaTooltip:
      "A longer focal length = a narrower field of view and a shallower depth of field at the same aperture.",
    echivalentCadru: "≈ {value}mm full-frame equivalent",

    diafragma: "Aperture",
    diafragmaVideo: "Aperture (approx. T-stop)",
    diafragmaTooltip:
      "A wider aperture (small f-number) = shallower depth of field but more light. A narrower aperture (large f-number) = greater depth of field but less light.",
    diafragmaTooltipVideo:
      "A small T-stop (wide open) = shallower depth of field but more light reaches the sensor. A large T-stop (closed down) = greater depth of field but less light. Unlike f-stop, T-stop measures the light actually transmitted through the lens, corrected for optical losses — that's why cine lenses are marked in T, not f.",
    difractieWarning: "⚠ Diffraction may reduce sharpness above {value} on this sensor",

    latimeMm: "Width (mm)",
    inaltimeMm: "Height (mm)",
    senzor: "Sensor",
    senzorTooltip:
      "Smaller sensors generally have a greater depth of field at the same focal length and aperture — that's why a phone keeps everything sharp, while a full-frame lens can isolate the subject.",
    senzorPersonalizat: "Custom",
    senzorPlaceholder: "Sensor",
    senzorCamera: "Sensor / Camera",
    senzorCameraTooltip:
      "Pick a real camera model for exact sensor dimensions — the list switches automatically based on the Photo/Video mode you chose. Can't find your model? Use \"Custom Sensor\".",
    senzorPersonalizatGrup: "Custom Sensor",
    toastModeSwitch: "Switched to {mode} Mode",
    toastModeSwitchDesc: "Camera selected: {camera} ({type})",
    subiect: "Subject",
    subiectTooltip:
      "Pick a reference subject to more easily visualize the scale of the scene and where the focus zone falls on it.",
    subiectPlaceholder: "Subject",

    rackFocusTitle: "Rack Focus Simulation",
    rackFocusDesc:
      "Set a start and an end distance, then press Play to see how the depth of field changes during a focus pull — useful for practicing a manual rack focus at a wedding.",
    rackStart: "Start",
    rackEnd: "End",
    rackPlay: "Play transition",
    rackLoading: "Running...",

    salveazaCombinatia: "Save this combination",
    salveazaCombinatiaFull: "Save the current sensor / focal length / aperture / distance combination",
    salveazaCombinatiaFull3: "You already have 3 saved presets — the oldest one will be replaced",
    presetariMele: "My Presets",
    stergePresetare: "Delete preset",
    toastSaved: "Combination saved!",
    toastSavedDesc: "{name} — you can load it anytime below.",

    presetariRapide: "Quick Presets",
    presetariVideoNunta: "Video / Wedding Presets (real cameras)",

    faqTitle: "Frequently Asked Questions",

    printeazaFisa: "Print Spec Sheet",
    copiazaLink: "Copy Link",
    veziPeGithub: "View on GitHub",
    creatDe: "Created by",
    toastLinkCopiat: "Link copied!",
    toastLinkCopiatDesc: "Send it to someone so they see this exact setup.",

    onboardingTitle: "Welcome",
    onboardingIntro: "A few quick explanations for the main controls:",
    onboardingAperture:
      "Aperture (f-stop) — controls how blurry the background is. Small numbers = very blurry background.",
    onboardingFocal: 'Focal length — how "close" you see the subject.',
    onboardingDistance: "Distance to subject — how far the subject is from the camera.",
    onboardingSensor: "Sensor — your camera's format (Full Frame, APS-C, etc.)",
    onboardingInfluencers:
      "Who influences depth of field? — below the controls you'll find a dedicated panel, with a comparison table and a practical tip, both updated live.",
    onboardingButton: "Got it",

    fisaDePlatou: "Spec Sheet",
    fisaDePlatouSub: "Depth of Field Simulator · generated {date}",
    mod: "Mode:",
    senzorLabel: "Sensor:",
    distantaFocalaLabel: "Focal Length:",
    diafragmaLabel: "Aperture:",
    distantaSubiectLabel: "Subject Distance:",
    focalizareApropiataLabel: "Near Focus Point:",
    focalizareIndepartataLabel: "Far Focus Point:",
    profunzimeTotalaLabel: "Total Depth:",
    distantaHiperfocalaLabel: "Hyperfocal Distance:",
    fisaFooter: "Generated with Depth of Field Simulator — Cristi Gordas · gordasgdc.github.io/depth-of-field",
  },

  es: {
    appTitle: "Simulador de Profundidad de Campo",
    appTitleBy: "Simulador de Profundidad de Campo · por",
    toggleLight: "Cambiar a modo claro",
    toggleDark: "Cambiar a modo oscuro",
    toggleColorAria: "Cambiar modo de color",
    languageSelectorAria: "Elegir idioma",

    scenariiComune: "Escenarios Comunes",
    modComparatie: "Modo Comparación (dos formatos de sensor)",
    compareWith: "Comparar con:",
    compareLabel: "Comparación — {sensor} (misma distancia focal y apertura, {fov}° de campo visual)",
    setupPrincipal: "Configuración Principal — {sensor}",
    totalDofFor: "PdC Total — {sensor}",

    focalizareApropiata: "Punto de Enfoque Cercano",
    focalizareIndepartata: "Punto de Enfoque Lejano",
    profunzimeTotala: "Profundidad Total",
    hiperfocala: "Hiperfocal",
    seteazaHiperfocala: "Fijar Hiperfocal",
    tooltipSetHyperfocalOk:
      "Enfoca a la distancia hiperfocal — todo desde la mitad de esta distancia hasta el ∞ quedará nítido",
    tooltipSetHyperfocalBad: "La hiperfocal ({value}) supera los límites de la escena",

    modNunta: "Modo Boda (ajusta y olvida)",
    weddingFreeInfinity:
      "A {ap}, {focal}mm, puedes filmar libremente desde {near} hasta el infinito — todo permanece nítido, sin volver a tocar el enfoque.",
    weddingFreeRange:
      "A {ap}, {focal}mm, todo lo que esté entre {near} y {far} quedará nítido. Mientras los novios permanezcan en este rango, puedes filmar sin volver a tocar el enfoque manual.",
    weddingTip:
      "Consejo: fija el enfoque en la distancia hiperfocal (botón de arriba) para el margen de seguridad más amplio posible.",

    unitati: "Unidades",
    unitatiTooltip:
      "Elige el sistema de unidades para mostrar las distancias: Imperial (ft/in) o Métrico (cm).",
    distanta: "Distancia",
    distantaTooltip:
      "La distancia hasta el sujeto que quieres enfocar. Cuanto más te acercas, más estrecha se vuelve la profundidad de campo.",
    hyperfocalBadgePrefix: "La distancia hiperfocal se movió a",

    distantaFocala: "Distancia Focal (mm)",
    distantaFocalaTooltip:
      "Una distancia focal mayor = un campo visual más estrecho y una profundidad de campo menor, a la misma apertura.",
    echivalentCadru: "≈ {value}mm equivalente a cuadro completo",

    diafragma: "Apertura",
    diafragmaVideo: "Apertura (T-stop aprox.)",
    diafragmaTooltip:
      "Una apertura más abierta (número f pequeño) = menor profundidad de campo pero más luz. Una apertura cerrada (número f grande) = mayor profundidad de campo pero menos luz.",
    diafragmaTooltipVideo:
      "Un T-stop pequeño (abierto) = menor profundidad de campo pero llega más luz al sensor. Un T-stop grande (cerrado) = mayor profundidad de campo pero menos luz. A diferencia del f-stop, el T-stop mide la luz realmente transmitida por el objetivo, corregida por las pérdidas ópticas — por eso los objetivos de cine se marcan en T, no en f.",
    difractieWarning: "⚠ La difracción puede reducir la nitidez por encima de {value} en este sensor",

    latimeMm: "Ancho (mm)",
    inaltimeMm: "Alto (mm)",
    senzor: "Sensor",
    senzorTooltip:
      "Los sensores más pequeños suelen tener mayor profundidad de campo a la misma distancia focal y apertura — por eso un teléfono mantiene todo nítido, mientras que un objetivo full-frame puede aislar al sujeto.",
    senzorPersonalizat: "Personalizado",
    senzorPlaceholder: "Sensor",
    senzorCamera: "Sensor / Cámara",
    senzorCameraTooltip:
      "Elige un modelo de cámara real para obtener las dimensiones exactas del sensor — la lista cambia automáticamente según el Modo Foto/Video elegido. ¿No encuentras tu modelo? Usa «Sensor Personalizado».",
    senzorPersonalizatGrup: "Sensor Personalizado",
    toastModeSwitch: "Cambiado a Modo {mode}",
    toastModeSwitchDesc: "Cámara seleccionada: {camera} ({type})",
    subiect: "Sujeto",
    subiectTooltip:
      "Elige un sujeto de referencia para visualizar más fácilmente la escala de la escena y dónde cae la zona de enfoque sobre él.",
    subiectPlaceholder: "Sujeto",

    rackFocusTitle: "Simulación de Cambio de Enfoque (Rack Focus)",
    rackFocusDesc:
      "Fija una distancia de inicio y una final, luego pulsa Play para ver cómo cambia la profundidad de campo durante un cambio de enfoque — útil para practicar un rack focus manual en una boda.",
    rackStart: "Inicio",
    rackEnd: "Final",
    rackPlay: "Reproducir transición",
    rackLoading: "Ejecutando...",

    salveazaCombinatia: "Guardar esta combinación",
    salveazaCombinatiaFull: "Guarda la combinación actual de sensor / distancia focal / apertura / distancia",
    salveazaCombinatiaFull3: "Ya tienes 3 preajustes guardados — el más antiguo será reemplazado",
    presetariMele: "Mis Preajustes",
    stergePresetare: "Eliminar preajuste",
    toastSaved: "¡Combinación guardada!",
    toastSavedDesc: "{name} — puedes cargarla en cualquier momento más abajo.",

    presetariRapide: "Preajustes Rápidos",
    presetariVideoNunta: "Preajustes Video / Boda (cámaras reales)",

    faqTitle: "Preguntas Frecuentes",

    printeazaFisa: "Imprimir Ficha",
    copiazaLink: "Copiar Enlace",
    veziPeGithub: "Ver en GitHub",
    creatDe: "Creado por",
    toastLinkCopiat: "¡Enlace copiado!",
    toastLinkCopiatDesc: "Envíaselo a alguien para que vea exactamente esta configuración.",

    onboardingTitle: "Bienvenido",
    onboardingIntro: "Algunas explicaciones rápidas de los controles principales:",
    onboardingAperture:
      "Apertura (f-stop) — controla cuán borroso está el fondo. Números pequeños = fondo muy borroso.",
    onboardingFocal: 'Distancia focal — cuán "cerca" ves al sujeto.',
    onboardingDistance: "Distancia al sujeto — a qué distancia está el sujeto de la cámara.",
    onboardingSensor: "Sensor — el formato de tu cámara (Full Frame, APS-C, etc.)",
    onboardingInfluencers:
      "¿Qué influye en la profundidad de campo? — debajo de los controles hay un panel dedicado, con una tabla comparativa y un consejo práctico, actualizados en vivo.",
    onboardingButton: "Entendido",

    fisaDePlatou: "Ficha de Rodaje",
    fisaDePlatouSub: "Simulador de Profundidad de Campo · generado {date}",
    mod: "Modo:",
    senzorLabel: "Sensor:",
    distantaFocalaLabel: "Distancia Focal:",
    diafragmaLabel: "Apertura:",
    distantaSubiectLabel: "Distancia al Sujeto:",
    focalizareApropiataLabel: "Punto de Enfoque Cercano:",
    focalizareIndepartataLabel: "Punto de Enfoque Lejano:",
    profunzimeTotalaLabel: "Profundidad Total:",
    distantaHiperfocalaLabel: "Distancia Hiperfocal:",
    fisaFooter: "Generado con Simulador de Profundidad de Campo — Cristi Gordas · gordasgdc.github.io/depth-of-field",
  },
};

// Simple {placeholder} interpolation, e.g. t("weddingTip", {name: "x"})
export function translate(lang: Lang, key: string, vars?: Record<string, string | number>): string {
  let str = translations[lang][key] ?? translations.ro[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}

// ── Etichete pentru date interne (cheile de stare rămân neschimbate) ──

export const SYSTEM_LABELS: Record<string, Dict> = {
  Metric: { ro: "Metric", en: "Metric", es: "Métrico" },
  Imperial: { ro: "Imperial", en: "Imperial", es: "Imperial" },
};

export const CAPTURE_MODE_LABELS: Record<string, Dict> = {
  Foto: { ro: "Foto", en: "Photo", es: "Foto" },
  Video: { ro: "Video", en: "Video", es: "Video" },
};

export const SENSOR_LABELS: Record<string, Dict> = {
  Webcam: { ro: "Cameră Web", en: "Webcam", es: "Cámara Web" },
  Smartphone: { ro: "Smartphone", en: "Smartphone", es: "Smartphone" },
  "Full Frame (35mm)": {
    ro: "Full Frame (35mm)",
    en: "Full Frame (35mm)",
    es: "Full Frame (35mm)",
  },
  "Super 35 (Cine)": { ro: "Super 35 (Cine)", en: "Super 35 (Cine)", es: "Super 35 (Cine)" },
  "APS-C": { ro: "APS-C", en: "APS-C", es: "APS-C" },
  "Micro Four Thirds": {
    ro: "Micro Four Thirds",
    en: "Micro Four Thirds",
    es: "Micro Four Thirds",
  },
  "6x6 (Format Mediu)": {
    ro: "6x6 (Format Mediu)",
    en: "6x6 (Medium Format)",
    es: "6x6 (Formato Medio)",
  },
  "6x7 (Format Mediu)": {
    ro: "6x7 (Format Mediu)",
    en: "6x7 (Medium Format)",
    es: "6x7 (Formato Medio)",
  },
  Custom: { ro: "Personalizat", en: "Custom", es: "Personalizado" },
};

// Etichete pentru tipul de senzor al camerelor reale din src/data/cameras.ts
// (Camera.type) — folosite în meniul „Senzor / Cameră", grupat pe brand.
export const SENSOR_TYPE_LABELS: Record<string, Dict> = {
  "Full Frame": { ro: "Full Frame", en: "Full Frame", es: "Full Frame" },
  "APS-C": { ro: "APS-C", en: "APS-C", es: "APS-C" },
  "M4/3": { ro: "M4/3", en: "M4/3", es: "M4/3" },
  "Super 35": { ro: "Super 35", en: "Super 35", es: "Super 35" },
  "Medium Format": {
    ro: "Format Mediu",
    en: "Medium Format",
    es: "Formato Medio",
  },
};

export const SUBJECT_LABELS: Record<string, Dict> = {
  "Persoană": { ro: "Persoană", en: "Person", es: "Persona" },
  "Persoană la Birou": {
    ro: "Persoană la Birou",
    en: "Person at a Desk",
    es: "Persona en un Escritorio",
  },
  "Cuplu de Miri": { ro: "Cuplu de Miri", en: "Bride and Groom", es: "Pareja de Novios" },
  "Grup de Oameni": { ro: "Grup de Oameni", en: "Group of People", es: "Grupo de Personas" },
  "Dansatori": { ro: "Dansatori", en: "Dancers", es: "Bailarines" },
  "Invitat la Masă": { ro: "Invitat la Masă", en: "Guest at Table", es: "Invitado en Mesa" },
  "Inel de Logodnă": {
    ro: "Inel de Logodnă",
    en: "Engagement Ring",
    es: "Anillo de Compromiso",
  },
  "Buchet de Flori": { ro: "Buchet de Flori", en: "Bouquet", es: "Ramo de Flores" },
  "Ceas": { ro: "Ceas", en: "Watch", es: "Reloj" },
  "Câine Mic": { ro: "Câine Mic", en: "Small Dog", es: "Perro Pequeño" },
  "Câine Mediu": { ro: "Câine Mediu", en: "Medium Dog", es: "Perro Mediano" },
  "Câine Mare": { ro: "Câine Mare", en: "Large Dog", es: "Perro Grande" },
  "Pisică": { ro: "Pisică", en: "Cat", es: "Gato" },
};

// Etichete pentru grupurile din selectorul "Subiect" (Prioritate: extindere
// subiecți de referință) — cheia trebuie să corespundă câmpului `category`
// din SUBJECTS (PhotographyGraphic.tsx).
export const SUBJECT_CATEGORY_LABELS: Record<string, Dict> = {
  portret: { ro: "Portret", en: "Portrait", es: "Retrato" },
  eveniment: {
    ro: "Nuntă / Eveniment",
    en: "Wedding / Event",
    es: "Boda / Evento",
  },
  produs: { ro: "Produs / Macro", en: "Product / Macro", es: "Producto / Macro" },
  animal: { ro: "Animale", en: "Animals", es: "Animales" },
};

export const DOF_CHARACTER_LABELS: Record<string, Dict> = {
  "Macro / Produs": { ro: "Macro / Produs", en: "Macro / Product", es: "Macro / Producto" },
  "Portret": { ro: "Portret", en: "Portrait", es: "Retrato" },
  "Grup / Eveniment": { ro: "Grup / Eveniment", en: "Group / Event", es: "Grupo / Evento" },
  "Stradă / Arhitectură": {
    ro: "Stradă / Arhitectură",
    en: "Street / Architecture",
    es: "Calle / Arquitectura",
  },
  "Peisaj": { ro: "Peisaj", en: "Landscape", es: "Paisaje" },
};

// Presetări rapide (COMMON_SETUPS) — cheia e numele intern folosit ca id.
export const COMMON_SETUP_LABELS: Record<string, Dict> = {
  "Cameră Web": { ro: "Cameră Web", en: "Webcam", es: "Cámara Web" },
  "Telefon": { ro: "Telefon", en: "Phone", es: "Teléfono" },
  "APS-C - 35mm": { ro: "APS-C - 35mm", en: "APS-C - 35mm", es: "APS-C - 35mm" },
  "FF - 28mm": { ro: "FF - 28mm", en: "FF - 28mm", es: "FF - 28mm" },
  "FF - 35mm": { ro: "FF - 35mm", en: "FF - 35mm", es: "FF - 35mm" },
  "FF - 50mm": { ro: "FF - 50mm", en: "FF - 50mm", es: "FF - 50mm" },
  "FF - 70mm": { ro: "FF - 70mm", en: "FF - 70mm", es: "FF - 70mm" },
  "6x6 - 80mm": { ro: "6x6 - 80mm", en: "6x6 - 80mm", es: "6x6 - 80mm" },
  "6x7 - 80mm": { ro: "6x7 - 80mm", en: "6x7 - 80mm", es: "6x7 - 80mm" },
};

// Presetări Video / Nuntă — nume și notă explicativă.
export const VIDEO_WEDDING_SETUP_LABELS: Record<string, { name: Dict; note: Dict }> = {
  "Sony A7S III / FX3 — 35mm f/1.8": {
    name: {
      ro: "Sony A7S III / FX3 — 35mm f/1.8",
      en: "Sony A7S III / FX3 — 35mm f/1.8",
      es: "Sony A7S III / FX3 — 35mm f/1.8",
    },
    note: {
      ro: "Cadru complet, fără crop video — ideal pentru discurs sau ceremonie",
      en: "Full frame, no video crop — ideal for speeches or the ceremony",
      es: "Cuadro completo, sin recorte de video — ideal para discursos o la ceremonia",
    },
  },
  "Sony A7 III / A7 IV — 50mm f/1.4": {
    name: {
      ro: "Sony A7 III / A7 IV — 50mm f/1.4",
      en: "Sony A7 III / A7 IV — 50mm f/1.4",
      es: "Sony A7 III / A7 IV — 50mm f/1.4",
    },
    note: {
      ro: "Portret cu bokeh puternic — bun pentru primii ai mirilor",
      en: "Portrait with strong bokeh — good for close-ups of the couple",
      es: "Retrato con bokeh intenso — bueno para primeros planos de los novios",
    },
  },
  "Sony FX30 / A6400 — 35mm f/1.8": {
    name: {
      ro: "Sony FX30 / A6400 — 35mm f/1.8",
      en: "Sony FX30 / A6400 — 35mm f/1.8",
      es: "Sony FX30 / A6400 — 35mm f/1.8",
    },
    note: {
      ro: "Senzor APS-C — atenție, crop video suplimentar pe unele modele",
      en: "APS-C sensor — watch out for extra video crop on some models",
      es: "Sensor APS-C — cuidado, recorte de video adicional en algunos modelos",
    },
  },
  "Panasonic GH5 / GH6 — 25mm f/1.7": {
    name: {
      ro: "Panasonic GH5 / GH6 — 25mm f/1.7",
      en: "Panasonic GH5 / GH6 — 25mm f/1.7",
      es: "Panasonic GH5 / GH6 — 25mm f/1.7",
    },
    note: {
      ro: "Micro Four Thirds — profunzime de câmp mai mare, ideal pt. run-and-gun",
      en: "Micro Four Thirds — greater depth of field, ideal for run-and-gun",
      es: "Micro Four Thirds — mayor profundidad de campo, ideal para run-and-gun",
    },
  },
  "Panasonic S5 / S1H — 35mm f/1.8": {
    name: {
      ro: "Panasonic S5 / S1H — 35mm f/1.8",
      en: "Panasonic S5 / S1H — 35mm f/1.8",
      es: "Panasonic S5 / S1H — 35mm f/1.8",
    },
    note: {
      ro: "Cadru complet — bun echilibru între bokeh și zonă de focus",
      en: "Full frame — good balance between bokeh and focus zone",
      es: "Cuadro completo — buen equilibrio entre bokeh y zona de enfoque",
    },
  },
  "Canon R6 / R6 II — 50mm f/1.2": {
    name: {
      ro: "Canon R6 / R6 II — 50mm f/1.2",
      en: "Canon R6 / R6 II — 50mm f/1.2",
      es: "Canon R6 / R6 II — 50mm f/1.2",
    },
    note: {
      ro: "Bokeh extrem — profunzime de câmp foarte mică, focus critic",
      en: "Extreme bokeh — very shallow depth of field, critical focus",
      es: "Bokeh extremo — profundidad de campo muy reducida, enfoque crítico",
    },
  },
  "Canon C70 — 35mm T2.0 (Super 35)": {
    name: {
      ro: "Canon C70 — 35mm T2.0 (Super 35)",
      en: "Canon C70 — 35mm T2.0 (Super 35)",
      es: "Canon C70 — 35mm T2.0 (Super 35)",
    },
    note: {
      ro: "Senzor Super 35, standard pentru camere cine",
      en: "Super 35 sensor, standard for cine cameras",
      es: "Sensor Super 35, estándar en cámaras de cine",
    },
  },
};

// Scenarii rapide (Foto + Video) — cheia e id-ul intern (name-ul original).
export const QUICK_SCENARIO_LABELS: Record<string, Dict> = {
  "Portret": { ro: "Portret", en: "Portrait", es: "Retrato" },
  "Peisaj": { ro: "Peisaj", en: "Landscape", es: "Paisaje" },
  "Nuntă - inele": { ro: "Nuntă - inele", en: "Wedding - rings", es: "Boda - anillos" },
  "Street photo": { ro: "Street photo", en: "Street photo", es: "Foto callejera" },
  "Interviu": { ro: "Interviu", en: "Interview", es: "Entrevista" },
  "B-roll Peisaj": { ro: "B-roll Peisaj", en: "B-roll Landscape", es: "B-roll Paisaje" },
  "Nuntă - filmare inele": {
    ro: "Nuntă - filmare inele",
    en: "Wedding - filming rings",
    es: "Boda - filmar anillos",
  },
  "Vlog / Street": { ro: "Vlog / Street", en: "Vlog / Street", es: "Vlog / Calle" },
};

// Întrebări frecvente — id stabil (cheie scurtă) + text pe fiecare limbă.
export const FAQ_TRANSLATIONS: { id: string; question: Dict; answer: Dict }[] = [
  {
    id: "whatIsDof",
    question: {
      ro: "Ce este profunzimea de câmp?",
      en: "What is depth of field?",
      es: "¿Qué es la profundidad de campo?",
    },
    answer: {
      ro: "Profunzimea de câmp (DoF) este zona din fața și din spatele subiectului focalizat care rămâne acceptabil de clară în imagine. O profunzime mică izolează subiectul de fundal (bokeh puternic), iar o profunzime mare menține totul clar, de la prim-plan până în depărtare. Cei trei factori care o controlează sunt diafragma, distanța focală și distanța până la subiect — exact cele trei controale din partea de sus a acestei aplicații.",
      en: "Depth of field (DoF) is the zone in front of and behind the focused subject that stays acceptably sharp in the image. A shallow depth of field isolates the subject from the background (strong bokeh), while a large depth of field keeps everything sharp, from the foreground to the distance. The three factors that control it are aperture, focal length, and distance to subject — exactly the three controls at the top of this app.",
      es: "La profundidad de campo (PdC) es la zona delante y detrás del sujeto enfocado que permanece aceptablemente nítida en la imagen. Una profundidad de campo reducida aísla al sujeto del fondo (bokeh intenso), mientras que una profundidad de campo grande mantiene todo nítido, desde el primer plano hasta la distancia. Los tres factores que la controlan son la apertura, la distancia focal y la distancia al sujeto — exactamente los tres controles en la parte superior de esta aplicación.",
    },
  },
  {
    id: "fStopVsTStop",
    question: {
      ro: "Care e diferența dintre f-stop și T-stop?",
      en: "What's the difference between f-stop and T-stop?",
      es: "¿Cuál es la diferencia entre f-stop y T-stop?",
    },
    answer: {
      ro: "Ambele descriu cât de „deschisă” e diafragma unui obiectiv, dar măsoară lucruri diferite. F-stop-ul (f/) e un calcul pur geometric: raportul dintre distanța focală și diametrul deschiderii diafragmei — nu ține cont de câtă lumină se pierde efectiv în interiorul obiectivului. T-stop-ul (T) măsoară lumina transmisă real până la senzor, după ce se scad pierderile din lentile și acoperiri optice; de-asta obiectivele de cinema sunt marcate în T, nu în f — pe platou contează expunerea exactă, nu doar geometria. Important pentru profunzimea de câmp: DoF-ul depinde de deschiderea fizică reală a diafragmei (aceeași bază de calcul ca la f-stop), nu de cât de multă lumină ajunge la senzor. Practic, la aceeași valoare numerică, un obiectiv marcat T oferă o expunere mai previzibilă între obiective diferite, dar profunzimea de câmp rezultată e comparabilă cu un f-stop de aceeași valoare. De-asta, în modul Video al aplicației, cifra e afișată ca T/valoare, ca terminologie corectă pentru platou, deși calculul de profunzime de câmp folosește aceeași formulă ca la f-stop.",
      en: "Both describe how „open” a lens's aperture is, but they measure different things. F-stop (f/) is a purely geometric calculation: the ratio between focal length and the diameter of the aperture opening — it doesn't account for light actually lost inside the lens. T-stop (T) measures the light actually transmitted to the sensor, after subtracting losses from glass elements and coatings; that's why cine lenses are marked in T, not f — on set, exact exposure matters, not just geometry. Important for depth of field: DoF depends on the real physical aperture opening (the same basis as f-stop), not on how much light reaches the sensor. In practice, at the same numeric value, a T-marked lens gives more predictable exposure between different lenses, but the resulting depth of field is comparable to an f-stop of the same value. That's why, in the app's Video mode, the number is shown as T/value — correct terminology for set, even though the depth-of-field calculation uses the same formula as for f-stop.",
      es: "Ambos describen cuán „abierta” está la apertura de un objetivo, pero miden cosas distintas. El f-stop (f/) es un cálculo puramente geométrico: la relación entre la distancia focal y el diámetro de la apertura — no tiene en cuenta la luz que realmente se pierde dentro del objetivo. El T-stop (T) mide la luz realmente transmitida hasta el sensor, tras restar las pérdidas de los elementos de vidrio y los recubrimientos ópticos; por eso los objetivos de cine se marcan en T, no en f — en el set importa la exposición exacta, no solo la geometría. Importante para la profundidad de campo: la PdC depende de la apertura física real (la misma base de cálculo que el f-stop), no de cuánta luz llega al sensor. En la práctica, con el mismo valor numérico, un objetivo marcado en T ofrece una exposición más predecible entre objetivos distintos, pero la profundidad de campo resultante es comparable a un f-stop del mismo valor. Por eso, en el modo Video de la aplicación, el número se muestra como T/valor, terminología correcta para el set, aunque el cálculo de profundidad de campo use la misma fórmula que para el f-stop.",
    },
  },
  {
    id: "apertureForPortrait",
    question: {
      ro: "Ce diafragmă să aleg pentru un portret?",
      en: "What aperture should I choose for a portrait?",
      es: "¿Qué apertura debo elegir para un retrato?",
    },
    answer: {
      ro: "Pentru portrete, o diafragmă deschisă (f/1.4–f/2.8) izolează frumos subiectul de fundal. La mai multe persoane în cadru, urcă spre f/4–f/5.6 ca toată lumea să rămână clară, mai ales dacă nu sunt la aceeași distanță de cameră. Regula practică: cu cât grupul e mai mare sau mai adânc (persoane la distanțe diferite de cameră), cu atât ai nevoie de o diafragmă mai închisă ca să prinzi pe toată lumea în zona clară.",
      en: "For portraits, a wide aperture (f/1.4–f/2.8) nicely isolates the subject from the background. With more people in frame, go up to f/4–f/5.6 so everyone stays sharp, especially if they aren't all at the same distance from the camera. Rule of thumb: the larger or deeper the group (people at different distances from the camera), the smaller aperture you need to keep everyone in the sharp zone.",
      es: "Para retratos, una apertura abierta (f/1.4–f/2.8) aísla muy bien al sujeto del fondo. Con más personas en el encuadre, sube a f/4–f/5.6 para que todos queden nítidos, especialmente si no están todos a la misma distancia de la cámara. Regla práctica: cuanto más grande o profundo sea el grupo (personas a distancias diferentes de la cámara), más cerrada necesitas la apertura para mantener a todos en la zona nítida.",
    },
  },
  {
    id: "hyperfocalMeaning",
    question: {
      ro: "Ce înseamnă distanța hiperfocală?",
      en: "What does hyperfocal distance mean?",
      es: "¿Qué significa la distancia hiperfocal?",
    },
    answer: {
      ro: "Distanța hiperfocală este punctul de focalizare care maximizează profunzimea de câmp: dacă focalizezi acolo, tot ce se află de la jumătatea acestei distanțe până la infinit rămâne clar. E utilă la peisaje sau filmări unde nu vrei să mai atingi focusul — de exemplu la filmări run-and-gun de nuntă, unde nu ai timp să reajustezi focusul între cadre. Diafragme mai închise și distanțe focale mai mici (wide) apropie hiperfocala de cameră, ceea ce lărgește zona pe care o poți filma fără să mai atingi focusul.",
      en: "The hyperfocal distance is the focus point that maximizes depth of field: if you focus there, everything from half that distance to infinity stays sharp. It's useful for landscapes or shoots where you don't want to touch focus again — for example, run-and-gun wedding filming, where there's no time to readjust focus between shots. Smaller apertures and shorter (wide) focal lengths bring the hyperfocal distance closer to the camera, which widens the zone you can shoot without touching focus again.",
      es: "La distancia hiperfocal es el punto de enfoque que maximiza la profundidad de campo: si enfocas ahí, todo desde la mitad de esa distancia hasta el infinito queda nítido. Es útil para paisajes o rodajes donde no quieres volver a tocar el enfoque — por ejemplo, filmaciones run-and-gun de boda, donde no hay tiempo de reajustar el enfoque entre tomas. Aperturas más cerradas y distancias focales más cortas (angulares) acercan la hiperfocal a la cámara, lo que amplía la zona que puedes filmar sin volver a tocar el enfoque.",
    },
  },
  {
    id: "whichSensor",
    question: {
      ro: "Ce format de senzor să folosesc?",
      en: "Which sensor format should I use?",
      es: "¿Qué formato de sensor debo usar?",
    },
    answer: {
      ro: "Senzorii mai mari (Full Frame, format mediu) oferă profunzime de câmp mai mică la aceeași diafragmă și distanță focală — buni pentru izolarea subiectului. Senzorii mai mici (APS-C, Micro Four Thirds, telefon) oferă profunzime mai mare, utilă când vrei ca totul să fie clar. Motivul e cercul de confuzie: pe un senzor mic, aceeași imagine e mărită mai mult la vizionare, deci punctele neclare devin vizibile mai repede — de-asta senzorii mici „par” să aibă profunzime de câmp mai mare, deși optica de bază e aceeași.",
      en: "Larger sensors (Full Frame, medium format) give a shallower depth of field at the same aperture and focal length — good for isolating the subject. Smaller sensors (APS-C, Micro Four Thirds, phone) give a larger depth of field, useful when you want everything sharp. The reason is the circle of confusion: on a small sensor, the same image is magnified more when viewed, so blurry points become visible sooner — that's why small sensors „seem” to have a greater depth of field, even though the underlying optics are the same.",
      es: "Los sensores más grandes (Full Frame, formato medio) dan una profundidad de campo menor a la misma apertura y distancia focal — buenos para aislar al sujeto. Los sensores más pequeños (APS-C, Micro Four Thirds, teléfono) dan una profundidad de campo mayor, útil cuando quieres que todo quede nítido. La razón es el círculo de confusión: en un sensor pequeño, la misma imagen se amplía más al visualizarla, por lo que los puntos borrosos se vuelven visibles antes — por eso los sensores pequeños „parecen” tener mayor profundidad de campo, aunque la óptica de base sea la misma.",
    },
  },
  {
    id: "diffractionWarning",
    question: {
      ro: "De ce apare avertismentul de difracție?",
      en: "Why does the diffraction warning appear?",
      es: "¿Por qué aparece la advertencia de difracción?",
    },
    answer: {
      ro: "Când închizi foarte mult diafragma (f-stop mare), lumina începe să se difracteze la marginea deschiderii, iar imaginea își pierde din claritate — chiar dacă totul e teoretic „în focus”. Pragul la care apare acest efect depinde de senzor: senzorii mai mici ating limita de difracție la diafragme mai deschise decât cei mari. Aplicația calculează acest prag automat și te avertizează când ești peste el, ca să știi când mai multă profunzime de câmp vine cu prețul unei imagini ușor mai moi.",
      en: "When you close the aperture a lot (large f-number), light starts to diffract at the edge of the opening, and the image loses sharpness — even if everything is theoretically „in focus”. The threshold where this happens depends on the sensor: smaller sensors hit the diffraction limit at wider apertures than larger ones. The app calculates this threshold automatically and warns you when you're past it, so you know when more depth of field comes at the cost of a slightly softer image.",
      es: "Cuando cierras mucho la apertura (número f grande), la luz empieza a difractarse en el borde de la abertura, y la imagen pierde nitidez — aunque teóricamente todo esté „enfocado”. El umbral en el que ocurre esto depende del sensor: los sensores más pequeños alcanzan el límite de difracción con aperturas más abiertas que los grandes. La aplicación calcula este umbral automáticamente y te avisa cuando lo superas, para que sepas cuándo más profundidad de campo tiene el costo de una imagen ligeramente más suave.",
    },
  },
];
