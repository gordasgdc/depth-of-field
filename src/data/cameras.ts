// Bază de date de camere reale, 100% statică (TypeScript, fără API/server) —
// înlocuiește selecția generică de senzor din meniul principal cu modele
// reale, grupate pe brand și filtrate în funcție de Modul Foto/Video ales.
//
// Notă de design: unele modele (ex. Sony A7 IV, Canon R6 Mark II, Nikon Z6 II,
// Panasonic S5 II) sunt hibride și apar în ambele liste de mai jos — cu id
// distinct pentru contextul Video (sufix "-video"), ca să nu existe coliziuni
// de id în lista combinată `CAMERAS`, folosită pentru lookup after reîncărcare
// pagină (din parametrul `camera` din URL).

export type SensorType =
  | "Full Frame"
  | "APS-C"
  | "M4/3"
  | "Super 35"
  | "Medium Format";

export interface Camera {
  id: string;
  brand: "Sony" | "Canon" | "Nikon" | "Panasonic" | "Fuji";
  model: string;
  sensorWidth: number; // mm
  sensorHeight: number; // mm
  cropFactor: number;
  type: SensorType;
  modes: ("photo" | "video")[];
  notes?: string;
}

// ── Modul FOTO — modele populare pentru nunți/fotografie ──
export const PHOTO_CAMERAS: Camera[] = [
  { id: "sony-a7iv", brand: "Sony", model: "A7 IV", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Versatilă, hybrid" },
  { id: "sony-a7iii", brand: "Sony", model: "A7 III", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Clasică, încă folosită" },
  { id: "sony-a7rv", brand: "Sony", model: "A7R V", sensorWidth: 35.7, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Rezoluție mare" },
  { id: "sony-a6700", brand: "Sony", model: "A6700", sensorWidth: 23.3, sensorHeight: 15.5, cropFactor: 1.5, type: "APS-C", modes: ["photo"], notes: "Pentru buget redus" },

  { id: "canon-r6ii", brand: "Canon", model: "R6 Mark II", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Excelentă pentru evenimente" },
  { id: "canon-r5", brand: "Canon", model: "R5", sensorWidth: 36.0, sensorHeight: 24.0, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Rezoluție mare, video 8K" },
  { id: "canon-r8", brand: "Canon", model: "R8", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Entry-level full frame" },
  { id: "canon-r7", brand: "Canon", model: "R7", sensorWidth: 22.3, sensorHeight: 14.8, cropFactor: 1.6, type: "APS-C", modes: ["photo"], notes: "APS-C pentru acțiune" },

  { id: "nikon-z6ii", brand: "Nikon", model: "Z6 II", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Hybrid foto-video" },
  { id: "nikon-z7ii", brand: "Nikon", model: "Z7 II", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Rezoluție mare" },
  { id: "nikon-z5", brand: "Nikon", model: "Z5", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Accesibilă full frame" },
  { id: "nikon-z50", brand: "Nikon", model: "Z50", sensorWidth: 23.5, sensorHeight: 15.7, cropFactor: 1.5, type: "APS-C", modes: ["photo"], notes: "APS-C entry-level" },

  { id: "panasonic-s5ii", brand: "Panasonic", model: "S5 II", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Hybrid, stabilizare bună" },
  { id: "panasonic-s1", brand: "Panasonic", model: "S1", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["photo"], notes: "Profesională" },

  { id: "fuji-xt5", brand: "Fuji", model: "X-T5", sensorWidth: 23.5, sensorHeight: 15.6, cropFactor: 1.5, type: "APS-C", modes: ["photo"], notes: "Populară pentru stil retro" },
  { id: "fuji-xh2", brand: "Fuji", model: "X-H2", sensorWidth: 23.5, sensorHeight: 15.6, cropFactor: 1.5, type: "APS-C", modes: ["photo"], notes: "Pentru video și foto" },
  { id: "fuji-gfx100s", brand: "Fuji", model: "GFX 100S", sensorWidth: 43.8, sensorHeight: 32.9, cropFactor: 0.79, type: "Medium Format", modes: ["photo"], notes: "Pentru studio/produs" },
];

// ── Modul VIDEO — modele populare pentru nunți/video ──
export const VIDEO_CAMERAS: Camera[] = [
  { id: "sony-fx3", brand: "Sony", model: "FX3", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Cinema line, low light" },
  { id: "sony-fx30", brand: "Sony", model: "FX30", sensorWidth: 23.3, sensorHeight: 15.5, cropFactor: 1.5, type: "APS-C", modes: ["video"], notes: "Cinema line APS-C" },
  { id: "sony-a7siii", brand: "Sony", model: "A7S III", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Low light king" },
  { id: "sony-a7iv-video", brand: "Sony", model: "A7 IV", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Hybrid populară" },

  { id: "canon-c70", brand: "Canon", model: "C70", sensorWidth: 26.2, sensorHeight: 13.8, cropFactor: 1.46, type: "Super 35", modes: ["video"], notes: "Cinema camera" },
  { id: "canon-r6ii-video", brand: "Canon", model: "R6 Mark II", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Hybrid populară" },
  { id: "canon-r5c", brand: "Canon", model: "R5 C", sensorWidth: 36.0, sensorHeight: 24.0, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Cinema + foto" },

  { id: "panasonic-gh6", brand: "Panasonic", model: "GH6", sensorWidth: 17.3, sensorHeight: 13.0, cropFactor: 2.0, type: "M4/3", modes: ["video"], notes: "Micro 4/3 pentru video" },
  { id: "panasonic-gh7", brand: "Panasonic", model: "GH7", sensorWidth: 17.3, sensorHeight: 13.0, cropFactor: 2.0, type: "M4/3", modes: ["video"], notes: "Nou, foarte performantă" },
  { id: "panasonic-s5ii-video", brand: "Panasonic", model: "S5 II", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Hybrid" },
  { id: "panasonic-s1h", brand: "Panasonic", model: "S1H", sensorWidth: 35.6, sensorHeight: 23.8, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Cinema certified" },

  { id: "nikon-z6ii-video", brand: "Nikon", model: "Z6 II", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Hybrid" },
  { id: "nikon-z8", brand: "Nikon", model: "Z8", sensorWidth: 35.9, sensorHeight: 23.9, cropFactor: 1.0, type: "Full Frame", modes: ["video"], notes: "Profesională" },
];

// Listă combinată, doar pentru lookup rapid după id (ex. la restaurarea
// selecției din parametrul `camera` din URL) — nu se folosește pentru
// afișarea dropdown-ului, care rămâne întotdeauna filtrat pe un singur mod.
export const CAMERAS: Camera[] = [...PHOTO_CAMERAS, ...VIDEO_CAMERAS];

export function findCameraById(id: string | null): Camera | undefined {
  if (!id) return undefined;
  return CAMERAS.find((c) => c.id === id);
}

// Grupează o listă de camere pe brand, păstrând ordinea din listă.
export function groupCamerasByBrand(cameras: Camera[]): Record<string, Camera[]> {
  const groups: Record<string, Camera[]> = {};
  for (const cam of cameras) {
    if (!groups[cam.brand]) groups[cam.brand] = [];
    groups[cam.brand].push(cam);
  }
  return groups;
}
