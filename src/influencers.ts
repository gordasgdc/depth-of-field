// Texte pentru panoul "Cine influențează profunzimea de câmp?", tabelul
// comparativ și sfatul practic dinamic. 100% client-side — niciun text nu
// vine de pe server, totul e static, la fel ca restul aplicației.

import type { Lang } from "../i18n";

type Dict = Record<string, string>;

export const influencersTranslations: Record<Lang, Dict> = {
  ro: {
    panelTitle: "Cine influențează profunzimea de câmp?",
    panelSubtitle:
      "Trei factori decid cât de mult din imagine rămâne clar. Ajustează-i mai sus și vezi cum se schimbă panoul de mai jos, în timp real.",
    panelReopen: "Arată din nou factorii care influențează profunzimea",
    panelCloseAria: "Închide panoul",

    factor1TitlePhoto: "Diafragma (f-stop)",
    factor1TitleVideo: "Diafragma (T-stop)",
    factor1Bullet1: "Număr mic ({prefix}/1.4) = fundal foarte blurat",
    factor1Bullet2: "Număr mare ({prefix}/16) = totul clar",
    factor1Effect: "Efect: {prefix}-stop mic → profunzime mică",

    factor2Title: "Distanța Focală",
    factor2Bullet1: "Tele (85mm+) = izolează subiectul",
    factor2Bullet2: "Wide (24mm) = totul mai clar",
    factor2Effect: "Efect: mm mai mult → profunzime mai mică",

    factor3Title: "Distanța până la subiect",
    factor3Bullet1: "Aproape de subiect = profunzime mică",
    factor3Bullet2: "Departe de subiect = profunzime mare",
    factor3Effect: "Efect: distanță mai mică → profunzime mai mică",

    tableTitle: "Tabel Comparativ — cum afectează fiecare factor claritatea",
    colFactor: "Factor",
    colCurrent: "Valoarea ta acum",
    colIncrease: "Dacă crește",
    colDecrease: "Dacă scade",
    colEffect: "Efect asupra clarității",

    rowApertureIncrease: "spre {prefix}/16 → mai clar",
    rowApertureDecrease: "spre {prefix}/1.4 → mai blurat",
    rowApertureEffect: "Diafragmă = principalul control al blur-ului",

    rowFocalIncrease: "spre 200mm+ → mai blurat",
    rowFocalDecrease: "spre 14mm → mai clar",
    rowFocalEffect: "Distanța focală amplifică sau reduce efectul diafragmei",

    rowDistanceIncrease: "te îndepărtezi → mai clar",
    rowDistanceDecrease: "te apropii → mai blurat",
    rowDistanceEffect: "Distanța mică e cea mai rapidă cale spre blur puternic",

    tipTitle: "Sfat Practic",
    tipAllShallow:
      "Atenție! Toți cei trei factori contribuie la un blur puternic (diafragmă deschisă, tele, subiect aproape). Verifică focusul cu grijă — zona clară e foarte îngustă.",
    tipAllDeep:
      "Totul va fi clar! Diafragmă închisă, obiectiv wide, subiect departe — combinație ideală pentru peisaje sau grupuri mari.",
    tipCloseDistance:
      "Ești aproape de subiect ({dist}) — fii atent la focus, zona clară este îngustă la această distanță.",
    tipTele:
      "Distanța focală mare ({mm}mm) comprimă fundalul și izolează subiectul — ideală pentru portrete.",
    tipAperturePortrait:
      "Diafragmă deschisă ({ap}) — ideală pentru portrete sau subiecte izolate de fundal.",
    tipNeutral:
      "Ajustează diafragma, distanța focală sau distanța până la subiect mai sus, ca să vezi imediat cum se schimbă profunzimea de câmp.",
  },

  en: {
    panelTitle: "Who influences depth of field?",
    panelSubtitle:
      "Three factors decide how much of the image stays sharp. Adjust them above and watch the panel below update in real time.",
    panelReopen: "Show the depth-of-field factors again",
    panelCloseAria: "Close panel",

    factor1TitlePhoto: "Aperture (f-stop)",
    factor1TitleVideo: "Aperture (T-stop)",
    factor1Bullet1: "Small number ({prefix}/1.4) = very blurry background",
    factor1Bullet2: "Large number ({prefix}/16) = everything sharp",
    factor1Effect: "Effect: small {prefix}-stop → shallow depth of field",

    factor2Title: "Focal Length",
    factor2Bullet1: "Tele (85mm+) = isolates the subject",
    factor2Bullet2: "Wide (24mm) = everything sharper",
    factor2Effect: "Effect: more mm → shallower depth of field",

    factor3Title: "Distance to Subject",
    factor3Bullet1: "Close to subject = shallow depth of field",
    factor3Bullet2: "Far from subject = deep depth of field",
    factor3Effect: "Effect: shorter distance → shallower depth of field",

    tableTitle: "Comparison Table — how each factor affects sharpness",
    colFactor: "Factor",
    colCurrent: "Your value now",
    colIncrease: "If it increases",
    colDecrease: "If it decreases",
    colEffect: "Effect on sharpness",

    rowApertureIncrease: "toward {prefix}/16 → sharper",
    rowApertureDecrease: "toward {prefix}/1.4 → blurrier",
    rowApertureEffect: "Aperture is the main control over blur",

    rowFocalIncrease: "toward 200mm+ → blurrier",
    rowFocalDecrease: "toward 14mm → sharper",
    rowFocalEffect: "Focal length amplifies or reduces the aperture's effect",

    rowDistanceIncrease: "moving away → sharper",
    rowDistanceDecrease: "moving closer → blurrier",
    rowDistanceEffect: "A short distance is the fastest path to strong blur",

    tipTitle: "Practical Tip",
    tipAllShallow:
      "Careful! All three factors are pushing toward strong blur (wide aperture, tele, close subject). Check focus carefully — the sharp zone is very narrow.",
    tipAllDeep:
      "Everything will be sharp! Closed aperture, wide lens, distant subject — an ideal combination for landscapes or large groups.",
    tipCloseDistance:
      "You're close to the subject ({dist}) — watch your focus, the sharp zone is narrow at this distance.",
    tipTele:
      "The long focal length ({mm}mm) compresses the background and isolates the subject — ideal for portraits.",
    tipAperturePortrait:
      "Wide aperture ({ap}) — ideal for portraits or subjects isolated from the background.",
    tipNeutral:
      "Adjust the aperture, focal length, or distance to subject above to instantly see how the depth of field changes.",
  },

  es: {
    panelTitle: "¿Qué influye en la profundidad de campo?",
    panelSubtitle:
      "Tres factores deciden cuánto de la imagen permanece nítido. Ajústalos arriba y observa cómo se actualiza el panel de abajo en tiempo real.",
    panelReopen: "Mostrar de nuevo los factores de la profundidad de campo",
    panelCloseAria: "Cerrar panel",

    factor1TitlePhoto: "Apertura (f-stop)",
    factor1TitleVideo: "Apertura (T-stop)",
    factor1Bullet1: "Número pequeño ({prefix}/1.4) = fondo muy borroso",
    factor1Bullet2: "Número grande ({prefix}/16) = todo nítido",
    factor1Effect: "Efecto: {prefix}-stop pequeño → profundidad de campo reducida",

    factor2Title: "Distancia Focal",
    factor2Bullet1: "Tele (85mm+) = aísla al sujeto",
    factor2Bullet2: "Angular (24mm) = todo más nítido",
    factor2Effect: "Efecto: más mm → profundidad de campo menor",

    factor3Title: "Distancia al Sujeto",
    factor3Bullet1: "Cerca del sujeto = profundidad de campo reducida",
    factor3Bullet2: "Lejos del sujeto = profundidad de campo amplia",
    factor3Effect: "Efecto: menor distancia → profundidad de campo menor",

    tableTitle: "Tabla Comparativa — cómo afecta cada factor a la nitidez",
    colFactor: "Factor",
    colCurrent: "Tu valor actual",
    colIncrease: "Si aumenta",
    colDecrease: "Si disminuye",
    colEffect: "Efecto sobre la nitidez",

    rowApertureIncrease: "hacia {prefix}/16 → más nítido",
    rowApertureDecrease: "hacia {prefix}/1.4 → más borroso",
    rowApertureEffect: "La apertura es el control principal del desenfoque",

    rowFocalIncrease: "hacia 200mm+ → más borroso",
    rowFocalDecrease: "hacia 14mm → más nítido",
    rowFocalEffect: "La distancia focal amplifica o reduce el efecto de la apertura",

    rowDistanceIncrease: "alejándote → más nítido",
    rowDistanceDecrease: "acercándote → más borroso",
    rowDistanceEffect: "Una distancia corta es el camino más rápido hacia un desenfoque fuerte",

    tipTitle: "Consejo Práctico",
    tipAllShallow:
      "¡Cuidado! Los tres factores empujan hacia un desenfoque fuerte (apertura abierta, tele, sujeto cercano). Revisa el enfoque con cuidado — la zona nítida es muy estrecha.",
    tipAllDeep:
      "¡Todo quedará nítido! Apertura cerrada, objetivo angular, sujeto lejano — combinación ideal para paisajes o grupos grandes.",
    tipCloseDistance:
      "Estás cerca del sujeto ({dist}) — presta atención al enfoque, la zona nítida es estrecha a esta distancia.",
    tipTele:
      "La distancia focal larga ({mm}mm) comprime el fondo y aísla al sujeto — ideal para retratos.",
    tipAperturePortrait:
      "Apertura abierta ({ap}) — ideal para retratos o sujetos aislados del fondo.",
    tipNeutral:
      "Ajusta la apertura, la distancia focal o la distancia al sujeto arriba para ver al instante cómo cambia la profundidad de campo.",
  },
};

export function translateInfluencers(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>
): string {
  let str = influencersTranslations[lang][key] ?? influencersTranslations.ro[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return str;
}
