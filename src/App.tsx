import { useState, useMemo, useEffect, useRef } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Box,
  Flex,
  Text,
  Select,
  Button,
  Radio,
  Stack,
  RadioGroup,
  Icon,
  Wrap,
  WrapItem,
  Divider,
  SimpleGrid,
  Badge,
  IconButton,
  Switch,
  FormControl,
  FormLabel,
  useColorMode,
  useColorModeValue,
  useToast,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SlideFade,
} from "@chakra-ui/react";
import { TbRuler, TbAperture, TbZoomIn, TbUser, TbMountain, TbBuildingSkyscraper, TbDeviceFloppy, TbX, TbBulb, TbAlertTriangle } from "react-icons/tb";
import { FiGithub, FiCamera, FiSun, FiMoon, FiPlay, FiHeart, FiLink, FiPrinter } from "react-icons/fi";
import { toImperial, toMetric } from "./utils/units";
import { buildNativeSelectStyles } from "./selectStyles";

import PhotographyGraphic, { SUBJECTS } from "./PhotographyGraphic";
import InfluencersPanel from "./components/InfluencersPanel";
import LensRing from "./components/LensRing";
import ComparisonTable from "./components/ComparisonTable";
import PracticalTip from "./components/PracticalTip";
import { useInfluencers } from "./hooks/useInfluencers";
import {
  PHOTO_CAMERAS,
  VIDEO_CAMERAS,
  findCameraById,
  groupCamerasByBrand,
} from "./data/cameras";
import {
  Lang,
  LANGUAGES,
  translate,
  SYSTEM_LABELS,
  CAPTURE_MODE_LABELS,
  SENSOR_LABELS,
  SENSOR_TYPE_LABELS,
  SUBJECT_LABELS,
  SUBJECT_CATEGORY_LABELS,
  DOF_CHARACTER_LABELS,
  COMMON_SETUP_LABELS,
  VIDEO_WEDDING_SETUP_LABELS,
  QUICK_SCENARIO_LABELS,
  FAQ_TRANSLATIONS,
} from "./i18n";

import Telephoto from "./assets/100-400.png";
import Fisheye from "./assets/fishey.png";

const CIRCLES_OF_CONFUSION: Record<
  string,
  {
    coc: number;
    sensorHeight: number;
    cropFactor: number;
  }
> = {
  Webcam: {
    coc: 0.002,
    sensorHeight: 3.6,
    cropFactor: 9.6 
  },
  Smartphone: {
    coc: 0.002,
    sensorHeight: 7.3,
    cropFactor: 6.1
  },
  "Full Frame (35mm)": {
    coc: 0.029,
    sensorHeight: 24,
    cropFactor: 1.0
  },
  "Super 35 (Cine)": {
    coc: 0.019,
    sensorHeight: 13.8,
    cropFactor: 1.54
  },
  "APS-C": {
    coc: 0.019,
    sensorHeight: 15.6,
    cropFactor: 1.52
  },
  "Micro Four Thirds": {
    coc: 0.015,
    sensorHeight: 13,
    cropFactor: 2.0
  },
  "6x6 (Format Mediu)": {
    // CoC recalculat: era 0.02mm, mai mic decat Full Frame (0.029mm) — imposibil fizic,
    // un senzor mai mare tolereaza un cerc de confuzie mai mare. Formula: 43.27 / (1500 * cropFactor),
    // consecventa cu restul formatelor de mai sus.
    coc: 0.052,
    sensorHeight: 60,
    cropFactor: 0.55
  },
  "6x7 (Format Mediu)": {
    // Idem — era 0.025mm, recalculat cu aceeasi formula ca mai sus.
    coc: 0.061,
    sensorHeight: 70,
    cropFactor: 0.47
  },
};

const COMMON_SETUPS: {
  name: string;
  focalLength: number;
  aperture: number;
  idealDistance: number;
  sensor: string;
}[] = [
  {
    name: "Cameră Web",
    focalLength: 3.6,
    aperture: 2.8,
    idealDistance: 36,
    sensor: "Webcam",
  },
  {
    name: "Telefon",
    focalLength: 4.3,
    aperture: 2.0,
    idealDistance: 36,
    sensor: "Smartphone",
  },
  {
    name: "APS-C - 35mm",
    focalLength: 35,
    aperture: 1.8,
    idealDistance: 72,
    sensor: "APS-C",
  },
  {
    name: "FF - 28mm",
    focalLength: 28,
    aperture: 1.4,
    idealDistance: 48,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "FF - 35mm",
    focalLength: 35,
    aperture: 1.4,
    idealDistance: 60,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "FF - 50mm",
    focalLength: 50,
    aperture: 1.8,
    idealDistance: 72,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "FF - 70mm",
    focalLength: 70,
    aperture: 2.8,
    idealDistance: 96,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "6x6 - 80mm",
    focalLength: 80,
    aperture: 2.8,
    idealDistance: 90,
    sensor: "6x6 (Format Mediu)",
  },
  {
    name: "6x7 - 80mm",
    focalLength: 80,
    aperture: 2.8,
    idealDistance: 80,
    sensor: "6x7 (Format Mediu)",
  },
];

const SYSTEMS = ["Metric", "Imperial"] as const;

// Metri → inch, folosit pentru presetările rapide de mai jos (parametrii au
// fost gândiți în metri, motorul de calcul intern lucrează în inch).
function metersToInches(meters: number): number {
  return meters * 39.3701;
}

const CAPTURE_MODES = ["Foto", "Video"] as const;

type QuickScenario = {
  name: string;
  icon: typeof TbUser;
  colorScheme: string;
  aperture: number;
  focalLength: number;
  distanceInMeters: number;
  sensor: string;
};

// Scenarii foto comune — Prioritate 1. Un click setează instant
// diafragma, distanța focală și distanța până la subiect.
const PHOTO_QUICK_SCENARIOS: QuickScenario[] = [
  {
    name: "Portret",
    icon: TbUser,
    colorScheme: "blue",
    aperture: 1.8,
    focalLength: 85,
    distanceInMeters: 2,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "Peisaj",
    icon: TbMountain,
    colorScheme: "green",
    aperture: 11,
    // Distanta = hiperfocala reala pentru 24mm f/11 pe Full Frame (~1.83m),
    // ca sa demonstreze tehnica corecta (focus la hiperfocala = maxim de la
    // jumatatea distantei pana la infinit clar), nu o distanta arbitrara.
    focalLength: 24,
    distanceInMeters: 1.83,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "Nuntă - inele",
    icon: FiHeart,
    colorScheme: "pink",
    // Macro real: un inel are ~2cm diametru, la 5m cu 50mm ar fi un punct
    // invizibil in cadru. 100mm (focala tipica macro) la ~35cm de distanta,
    // f/8 pentru profunzime rezonabila (la distante macro DOF e oricum sub
    // 1cm, chiar si inchis).
    aperture: 8,
    focalLength: 100,
    distanceInMeters: 0.35,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "Street photo",
    icon: TbBuildingSkyscraper,
    colorScheme: "orange",
    aperture: 5.6,
    focalLength: 35,
    distanceInMeters: 3,
    sensor: "Full Frame (35mm)",
  },
];

// Scenarii video echivalente — aceleași principii de profunzime de câmp,
// dar gândite pentru situații tipice de filmare.
const VIDEO_QUICK_SCENARIOS: QuickScenario[] = [
  {
    name: "Interviu",
    icon: TbUser,
    colorScheme: "blue",
    aperture: 2.8,
    focalLength: 50,
    distanceInMeters: 1.5,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "B-roll Peisaj",
    icon: TbMountain,
    colorScheme: "green",
    // Hiperfocala reala pentru 24mm f/8 pe Full Frame (~2.5m).
    aperture: 8,
    focalLength: 24,
    distanceInMeters: 2.5,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "Nuntă - filmare inele",
    icon: FiHeart,
    colorScheme: "pink",
    // Aceeasi corectie ca la preset-ul foto — macro real, nu 5m.
    aperture: 8,
    focalLength: 100,
    distanceInMeters: 0.35,
    sensor: "Full Frame (35mm)",
  },
  {
    name: "Vlog / Street",
    icon: TbBuildingSkyscraper,
    colorScheme: "orange",
    aperture: 4,
    focalLength: 24,
    distanceInMeters: 1,
    sensor: "APS-C",
  },
];

// Întrebările frecvente (Prioritate 5) sunt acum definite, pe cele 3 limbi,
// în FAQ_TRANSLATIONS din ./i18n.ts.

// Presetări pentru camere video reale, folosite frecvent la filmări de nuntă.
// Fiecare presetare mapează camera pe formatul ei real de senzor (în modul video),
// cu o combinație tipică de distanță focală și diafragmă pentru acel gen de cadru.
const VIDEO_WEDDING_SETUPS: {
  name: string;
  brand: "Sony" | "Panasonic" | "Canon";
  focalLength: number;
  aperture: number;
  idealDistance: number;
  sensor: string;
  note: string;
}[] = [
  {
    name: "Sony A7S III / FX3 — 35mm f/1.8",
    brand: "Sony",
    focalLength: 35,
    aperture: 1.8,
    idealDistance: 60,
    sensor: "Full Frame (35mm)",
    note: "Cadru complet, fără crop video — ideal pentru discurs sau ceremonie",
  },
  {
    name: "Sony A7 III / A7 IV — 50mm f/1.4",
    brand: "Sony",
    focalLength: 50,
    aperture: 1.4,
    idealDistance: 72,
    sensor: "Full Frame (35mm)",
    note: "Portret cu bokeh puternic — bun pentru primii ai mirilor",
  },
  {
    name: "Sony FX30 / A6400 — 35mm f/1.8",
    brand: "Sony",
    focalLength: 35,
    aperture: 1.8,
    idealDistance: 60,
    sensor: "APS-C",
    note: "Senzor APS-C — atenție, crop video suplimentar pe unele modele",
  },
  {
    name: "Panasonic GH5 / GH6 — 25mm f/1.7",
    brand: "Panasonic",
    focalLength: 25,
    aperture: 1.7,
    idealDistance: 48,
    sensor: "Micro Four Thirds",
    note: "Micro Four Thirds — profunzime de câmp mai mare, ideal pt. run-and-gun",
  },
  {
    name: "Panasonic S5 / S1H — 35mm f/1.8",
    brand: "Panasonic",
    focalLength: 35,
    aperture: 1.8,
    idealDistance: 60,
    sensor: "Full Frame (35mm)",
    note: "Cadru complet — bun echilibru între bokeh și zonă de focus",
  },
  {
    name: "Canon R6 / R6 II — 50mm f/1.2",
    brand: "Canon",
    focalLength: 50,
    aperture: 1.2,
    idealDistance: 72,
    sensor: "Full Frame (35mm)",
    note: "Bokeh extrem — profunzime de câmp foarte mică, focus critic",
  },
  {
    name: "Canon C70 — 35mm T2.0 (Super 35)",
    brand: "Canon",
    focalLength: 35,
    aperture: 2.0,
    idealDistance: 60,
    sensor: "Super 35 (Cine)",
    note: "Senzor Super 35, standard pentru camere cine",
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Mic indicator "?" cu tooltip educațional — explică pe scurt "de ce"
// contează fiecare control, pentru studenți la început de drum.
function InfoTip({ label }: { label: string }) {
  return (
    <Tooltip label={label} hasArrow placement="top">
      <Box
        as="span"
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        boxSize="14px"
        borderRadius="full"
        border="1px solid currentColor"
        fontSize="10px"
        fontWeight="bold"
        opacity={0.6}
        cursor="help"
        ml={1}
        flexShrink={0}
      >
        ?
      </Box>
    </Tooltip>
  );
}

// Citește un parametru din URL (folosit pentru partajarea unui setup exact
// printr-un link — util pentru profesori care vor să trimită elevilor
// o configurație precisă de cameră/obiectiv/distanță).
function getInitialParam(key: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
}

// Calculează profunzimea de câmp pentru o combinație independentă de
// distanță focală / diafragmă / senzor — folosită de Modul Comparație,
// ca să poți vedea, la aceeași distanță focală și diafragmă, diferența
// dintre două formate de senzor (ex: Full Frame vs. APS-C).
type DofResult = {
  hyperFocalDistanceInMM: number;
  depthOfFieldNearLimitInMM: number;
  depthOfFieldFarLimitInMM: number;
};

function computeDof(
  focalLengthInMillimeters: number,
  aperture: number,
  sensorKey: string,
  distanceToSubjectInMM: number,
  customSensorWidth: number,
  customSensorHeight: number
): DofResult {
  const isCustomSensor = sensorKey === "Custom";
  const customCocCalculated =
    Math.sqrt(customSensorWidth ** 2 + customSensorHeight ** 2) / 1500;
  const circleOfConfusionInMillimeters = isCustomSensor
    ? customCocCalculated
    : CIRCLES_OF_CONFUSION[sensorKey].coc;

  const hyperFocalDistanceInMM =
    focalLengthInMillimeters +
    (focalLengthInMillimeters * focalLengthInMillimeters) /
      (aperture * circleOfConfusionInMillimeters);
  const depthOfFieldFarLimitInMM =
    (hyperFocalDistanceInMM * distanceToSubjectInMM) /
    (hyperFocalDistanceInMM -
      (distanceToSubjectInMM - focalLengthInMillimeters));
  const depthOfFieldNearLimitInMM =
    (hyperFocalDistanceInMM * distanceToSubjectInMM) /
    (hyperFocalDistanceInMM +
      (distanceToSubjectInMM - focalLengthInMillimeters));

  return {
    hyperFocalDistanceInMM,
    depthOfFieldNearLimitInMM,
    depthOfFieldFarLimitInMM,
  };
}

function App() {
  const [distanceToSubjectInInches, setDistanceToSubjectInInches] = useState(
    () => {
      const v = getInitialParam("dist");
      return v ? Number(v) : 72;
    }
  );
  const [focalLengthInMillimeters, setFocalLengthInMillimeters] = useState(
    () => {
      const v = getInitialParam("focal");
      return v ? Number(v) : 50;
    }
  );
  const [aperture, setAperture] = useState(() => {
    const v = getInitialParam("f");
    return v ? Number(v) : 1.8;
  });
  const [subject, setSubject] = useState(
    () => getInitialParam("subject") || "Persoană"
  );
  const [system, setSystem] = useState<(typeof SYSTEMS)[number]>(() => {
    const v = getInitialParam("system");
    return v === "Metric" ? "Metric" : "Imperial";
  });
  const [captureMode, setCaptureMode] = useState<(typeof CAPTURE_MODES)[number]>(
    () => {
      const v = getInitialParam("captureMode");
      return v === "Video" ? "Video" : "Foto";
    }
  );
  const [language, setLanguage] = useState<Lang>(() => {
    const v = getInitialParam("lang");
    return v === "en" || v === "es" ? v : "ro";
  });
  const [sensor, setSensor] = useState(
    () => getInitialParam("sensor") || "Full Frame (35mm)"
  );
  const [customSensorWidth, setCustomSensorWidth] = useState(() => {
    const v = getInitialParam("sw");
    return v ? Number(v) : 36;
  });
  const [customSensorHeight, setCustomSensorHeight] = useState(() => {
    const v = getInitialParam("sh");
    return v ? Number(v) : 24;
  });
  // Cameră reală selectată în meniul "Senzor / Cameră" (id din src/data/cameras.ts),
  // sau null dacă utilizatorul a introdus manual un senzor personalizat.
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(
    () => getInitialParam("camera") || null
  );
  const [weddingMode, setWeddingMode] = useState(false);
  const [rackStartInInches, setRackStartInInches] = useState(48);
  const [rackEndInInches, setRackEndInInches] = useState(120);
  const [isRacking, setIsRacking] = useState(false);
  const rackAnimationRef = useRef<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSensor, setCompareSensor] = useState("APS-C");
  const toast = useToast();

  // ── Onboarding (Prioritate 2) ──
  const {
    isOpen: isOnboardingOpen,
    onClose: onOnboardingClose,
    onOpen: onOnboardingOpen,
  } = useDisclosure();
  const ONBOARDING_STORAGE_KEY = "dof-onboarding-seen-v1";

  // ── Presetări salvate de utilizator (Prioritate 6) ──
  const SAVED_PRESETS_STORAGE_KEY = "dof-saved-presets-v1";
  type SavedPreset = {
    id: string;
    name: string;
    distanceToSubjectInInches: number;
    focalLengthInMillimeters: number;
    aperture: number;
    sensor: string;
    cameraId: string | null;
    customSensorWidth: number;
    customSensorHeight: number;
    system: (typeof SYSTEMS)[number];
  };
  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(SAVED_PRESETS_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as SavedPreset[]) : [];
    } catch {
      return [];
    }
  });

  const { colorMode, toggleColorMode } = useColorMode();

  const convertUnits = system === "Imperial" ? toImperial : toMetric;

  const distanceToSubjectInMM = distanceToSubjectInInches * 25.4;

  const isCustomSensor = sensor === "Custom";
const customCocCalculated = Math.sqrt(customSensorWidth ** 2 + customSensorHeight ** 2) / 1500;
const circleOfConfusionInMillimeters = isCustomSensor
  ? customCocCalculated
  : CIRCLES_OF_CONFUSION[sensor].coc;
const cropFactor = isCustomSensor
  ? 43.27 / Math.sqrt(customSensorWidth ** 2 + customSensorHeight ** 2)
  : CIRCLES_OF_CONFUSION[sensor].cropFactor;

  // Preferă numele real al camerei (brand + model) dacă una e selectată;
  // altfel cade pe eticheta generică de senzor (compare mode, presetări).
  function getSensorDisplayName(sensorKey: string, cameraId?: string | null): string {
    const cam = findCameraById(cameraId ?? null);
    if (cam) {
      return `${cam.brand} ${cam.model} (${SENSOR_TYPE_LABELS[cam.type][language]})`;
    }
    return SENSOR_LABELS[sensorKey]?.[language] ?? sensorKey;
  }

  const hyperFocalDistanceInMM =
    focalLengthInMillimeters +
    (focalLengthInMillimeters * focalLengthInMillimeters) /
      (aperture * circleOfConfusionInMillimeters);
  const depthOfFieldFarLimitInMM =
    (hyperFocalDistanceInMM * distanceToSubjectInMM) /
    (hyperFocalDistanceInMM -
      (distanceToSubjectInMM - focalLengthInMillimeters));
  const depthOfFieldNearLimitInMM =
    (hyperFocalDistanceInMM * distanceToSubjectInMM) /
    (hyperFocalDistanceInMM +
      (distanceToSubjectInMM - focalLengthInMillimeters));

  const farDistanceInInches = 360;
  const nearFocalPointInInches = clamp(
    depthOfFieldNearLimitInMM / 25.4,
    0,
    farDistanceInInches
  );
  let farFocalPointInInches = clamp(
    depthOfFieldFarLimitInMM / 25.4,
    0,
    farDistanceInInches
  );
  if (farFocalPointInInches < nearFocalPointInInches) {
    farFocalPointInInches = farDistanceInInches;
  }

  const sensorHeight = isCustomSensor
  ? customSensorHeight
  : CIRCLES_OF_CONFUSION[sensor].sensorHeight;
  const verticalFieldOfView =
    (2 * Math.atan(sensorHeight / 2 / focalLengthInMillimeters) * 180) /
    Math.PI;

  // ── Derived photography values
  const hyperFocalDistanceInInches = hyperFocalDistanceInMM / 25.4;
  const isInfinityFar =
    depthOfFieldFarLimitInMM / 25.4 > farDistanceInInches ||
    depthOfFieldFarLimitInMM <= 0;
  const totalDofInches = farFocalPointInInches - nearFocalPointInInches;
  const canSetHyperfocal = hyperFocalDistanceInInches <= farDistanceInInches;

  // ── Mod Comparație: calculează DoF pentru un al doilea senzor, la aceeași
  // distanță focală, diafragmă și distanță — ca să vezi clar diferența
  // introdusă doar de formatul senzorului.
  const compareDof = compareMode
    ? computeDof(
        focalLengthInMillimeters,
        aperture,
        compareSensor,
        distanceToSubjectInMM,
        customSensorWidth,
        customSensorHeight
      )
    : null;
  const compareNearFocalPointInInches = compareDof
    ? clamp(compareDof.depthOfFieldNearLimitInMM / 25.4, 0, farDistanceInInches)
    : 0;
  let compareFarFocalPointInInches = compareDof
    ? clamp(compareDof.depthOfFieldFarLimitInMM / 25.4, 0, farDistanceInInches)
    : 0;
  if (compareDof && compareFarFocalPointInInches < compareNearFocalPointInInches) {
    compareFarFocalPointInInches = farDistanceInInches;
  }
  const compareIsInfinityFar = compareDof
    ? compareDof.depthOfFieldFarLimitInMM / 25.4 > farDistanceInInches ||
      compareDof.depthOfFieldFarLimitInMM <= 0
    : false;
  const compareTotalDofInches =
    compareFarFocalPointInInches - compareNearFocalPointInInches;
  const compareSensorHeight = (() => {
    if (compareSensor === "Custom") return customSensorHeight;
    return CIRCLES_OF_CONFUSION[compareSensor]?.sensorHeight ?? sensorHeight;
  })();
  const compareVerticalFieldOfView =
    (2 * Math.atan(compareSensorHeight / 2 / focalLengthInMillimeters) * 180) /
    Math.PI;

  // 35mm equivalent focal length (only relevant when not on full frame)
  const equivalentFocalLength = Math.round(
    focalLengthInMillimeters * cropFactor
  );

  // Diffraction: airy disk (0.001342 × N mm) should not exceed CoC
  const diffractionLimitFStop =
    circleOfConfusionInMillimeters / 0.001342;
  const hasDiffractionRisk = aperture > diffractionLimitFStop;

  // DoF use-case character based on total depth
  const totalDofFeet = totalDofInches / 12;
  const dofCharacterKey =
    totalDofFeet < 0.5
      ? "Macro / Produs"
      : totalDofFeet < 3
      ? "Portret"
      : totalDofFeet < 10
      ? "Grup / Eveniment"
      : totalDofFeet < 30
      ? "Stradă / Arhitectură"
      : "Peisaj";
  const dofCharacterColor =
    totalDofFeet < 0.5
      ? "purple"
      : totalDofFeet < 3
      ? "blue"
      : totalDofFeet < 10
      ? "teal"
      : totalDofFeet < 30
      ? "green"
      : "gray";
  const dofCharacter = {
    label: DOF_CHARACTER_LABELS[dofCharacterKey][language],
    color: dofCharacterColor,
  };

  // ── Theme-aware colors 
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const topBarBg = useColorModeValue("gray.50", "gray.900");
  const graphicTextColor = useColorModeValue("#1A202C", "#F7FAFC");
  const weddingBg = useColorModeValue("pink.50", "pink.900");
  const weddingBorder = useColorModeValue("pink.200", "pink.700");
  const nativeSelectStyles = buildNativeSelectStyles(colorMode);

  const activeQuickScenarios =
    captureMode === "Video" ? VIDEO_QUICK_SCENARIOS : PHOTO_QUICK_SCENARIOS;

  // Lista de camere reale afișată în selectorul "Senzor / Cameră", grupată
  // pe brand — se schimbă automat cu Modul Foto/Video ales.
  const activeCameras = captureMode === "Video" ? VIDEO_CAMERAS : PHOTO_CAMERAS;
  const groupedCameras = groupCamerasByBrand(activeCameras);

  // Grupează subiecții de referință pe categorie (Portret / Nuntă-Eveniment /
  // Produs-Macro / Animale), în ordinea în care vrem să apară grupurile.
  const SUBJECT_CATEGORY_ORDER = ["portret", "eveniment", "produs", "animal"] as const;
  const groupedSubjects = SUBJECT_CATEGORY_ORDER.map((category) => ({
    category,
    entries: Object.entries(SUBJECTS).filter(
      ([, value]) => value.category === category
    ),
  })).filter((group) => group.entries.length > 0);

  // În Video, diafragma se exprimă în T-stop (transmisie reală de lumină,
  // corectată pentru pierderile din obiectiv) — de-asta apare "T" în loc de "f".
  const apertureUnitPrefix = captureMode === "Video" ? "T" : "f";

  const t = (key: string, vars?: Record<string, string | number>) =>
    translate(language, key, vars);

  // ── Cine influențează profunzimea de câmp? (100% client-side) ──
  const { tipKey: influencerTipKey } = useInfluencers(
    aperture,
    focalLengthInMillimeters,
    distanceToSubjectInInches
  );

  const labelStyles = {
    mt: "2",
    ml: "-2.5",
    fontSize: "sm",
  };

  const distanceMarks = useMemo(() => {
    if (system === "Imperial") {
      return new Array(Math.floor(farDistanceInInches / 24) + 1)
        .fill(0)
        .map((_v, i) => (i + 1) * 24)
        .map((val) => ({
          value: val,
          label: `${val / 12}'`,
        }));
    } else {
      const farDistanceInMeters = farDistanceInInches * 0.0254;
      const convertMetersToInches = (meters: number) => meters * 39.3701;
      return new Array(Math.floor(farDistanceInMeters) + 1)
        .fill(0)
        .map((_val, val) => ({
          value: convertMetersToInches(val + 1),
          label: `${val + 1}m`,
        }));
    }
  }, [system, farDistanceInInches]);

  // ── Simulare "rack focus" (trecere de focus în timpul filmării) ──
  const RACK_DURATION_MS = 2500;
  function startRackFocus() {
    if (isRacking) return;
    setIsRacking(true);
    const startValue = rackStartInInches;
    const endValue = rackEndInInches;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = clamp(elapsed / RACK_DURATION_MS, 0, 1);
      // ease-in-out pentru o tranziție mai naturală, ca la un focus pull real
      const eased =
        progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const currentValue = startValue + (endValue - startValue) * eased;
      setDistanceToSubjectInInches(currentValue);

      if (progress < 1) {
        rackAnimationRef.current = requestAnimationFrame(step);
      } else {
        setIsRacking(false);
        rackAnimationRef.current = null;
      }
    }
    rackAnimationRef.current = requestAnimationFrame(step);
  }

  // La prima vizită (fără link partajat), pornim cu primul model de cameră
  // real din lista modului curent, nu cu senzorul generic — respectă
  // link-urile vechi/partajate, care încă specifică un senzor explicit.
  useEffect(() => {
    const hadSensorParam = !!getInitialParam("sensor");
    const hadCameraParam = !!getInitialParam("camera");
    if (!hadSensorParam && !hadCameraParam) {
      const firstCam = (captureMode === "Video" ? VIDEO_CAMERAS : PHOTO_CAMERAS)[0];
      if (firstCam) {
        setSelectedCameraId(firstCam.id);
        setSensor("Custom");
        setCustomSensorWidth(firstCam.sensorWidth);
        setCustomSensorHeight(firstCam.sensorHeight);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (rackAnimationRef.current) {
        cancelAnimationFrame(rackAnimationRef.current);
      }
    };
  }, []);

  // ── Onboarding: arată ghidul o singură dată, la prima vizită ──
  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
      if (!seen) {
        onOnboardingOpen();
      }
    } catch {
      // localStorage indisponibil (ex: mod privat) — ignorăm, nu blocăm aplicația
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismissOnboarding() {
    try {
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // ignorăm erorile de localStorage
    }
    onOnboardingClose();
  }

  // ── Salvare presetări (Prioritate 6) ──
  function persistPresets(next: SavedPreset[]) {
    setSavedPresets(next);
    try {
      window.localStorage.setItem(
        SAVED_PRESETS_STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch {
      // ignorăm erorile de localStorage (ex: quota depășită)
    }
  }

  function saveCurrentPreset() {
    const newPreset: SavedPreset = {
      id: `${Date.now()}`,
      name: `${focalLengthInMillimeters}mm · ${apertureUnitPrefix}/${aperture}`,
      distanceToSubjectInInches,
      focalLengthInMillimeters,
      aperture,
      sensor,
      cameraId: selectedCameraId,
      customSensorWidth,
      customSensorHeight,
      system,
    };
    const next = [newPreset, ...savedPresets].slice(0, 3);
    persistPresets(next);
    toast({
      title: t("toastSaved"),
      description: t("toastSavedDesc", { name: newPreset.name }),
      status: "success",
      duration: 2500,
      isClosable: true,
      position: "top",
    });
  }

  function loadPreset(preset: SavedPreset) {
    setDistanceToSubjectInInches(preset.distanceToSubjectInInches);
    setFocalLengthInMillimeters(preset.focalLengthInMillimeters);
    setAperture(preset.aperture);
    setSensor(preset.sensor);
    setSelectedCameraId(preset.cameraId ?? null);
    if (preset.customSensorWidth) setCustomSensorWidth(preset.customSensorWidth);
    if (preset.customSensorHeight) setCustomSensorHeight(preset.customSensorHeight);
    setSystem(preset.system);
  }

  function deletePreset(id: string) {
    persistPresets(savedPresets.filter((p) => p.id !== id));
  }

  function applyQuickScenario(scenario: QuickScenario) {
    setFocalLengthInMillimeters(scenario.focalLength);
    setAperture(scenario.aperture);
    setSensor(scenario.sensor);
    setSelectedCameraId(null);
    setDistanceToSubjectInInches(metersToInches(scenario.distanceInMeters));
  }

  // ── Badge "Distanța hiperfocală s-a mutat" (Prioritate 3) ──
  const [hyperfocalBadge, setHyperfocalBadge] = useState<string | null>(null);
  const prevHyperfocalRoundedRef = useRef<number | null>(null);
  useEffect(() => {
    const roundedMeters = Math.round((hyperFocalDistanceInMM / 1000) * 10) / 10;
    if (
      prevHyperfocalRoundedRef.current !== null &&
      prevHyperfocalRoundedRef.current !== roundedMeters
    ) {
      setHyperfocalBadge(
        `${t("hyperfocalBadgePrefix")} ${convertUnits(
          hyperFocalDistanceInMM / 25.4,
          1
        )}`
      );
      const timeout = setTimeout(() => setHyperfocalBadge(null), 2800);
      prevHyperfocalRoundedRef.current = roundedMeters;
      return () => clearTimeout(timeout);
    }
    prevHyperfocalRoundedRef.current = roundedMeters;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hyperFocalDistanceInMM]);

  // ── Sincronizare setup curent cu URL-ul (pentru partajare prin link) ──
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("dist", String(Math.round(distanceToSubjectInInches)));
    params.set("focal", String(focalLengthInMillimeters));
    params.set("f", String(aperture));
    params.set("subject", subject);
    params.set("system", system);
    params.set("sensor", sensor);
    params.set("captureMode", captureMode);
    params.set("lang", language);
    if (sensor === "Custom") {
      params.set("sw", String(customSensorWidth));
      params.set("sh", String(customSensorHeight));
    }
    if (selectedCameraId) {
      params.set("camera", selectedCameraId);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }, [
    distanceToSubjectInInches,
    focalLengthInMillimeters,
    aperture,
    subject,
    system,
    sensor,
    customSensorWidth,
    customSensorHeight,
    captureMode,
    language,
    selectedCameraId,
  ]);

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: t("toastLinkCopiat"),
        description: t("toastLinkCopiatDesc"),
        status: "success",
        duration: 2500,
        isClosable: true,
        position: "top",
      });
    });
  }

  return (
    <>
      <style>{`
        .print-sheet { display: none; }
        @media print {
          .app-shell { display: none !important; }
          .print-sheet { display: block !important; }
        }
      `}</style>
      <Box className="app-shell">
      <Flex
        bg={topBarBg}
        justify="space-between"
        align="center"
        px={4}
        py={2}
        borderBottom="1px"
        borderColor={borderColor}
        wrap="wrap"
        gap={2}
      >
        <Text fontSize="sm" color={mutedText}>
          {t("appTitleBy")}{" "}
          <a
            href="https://github.com/gordasgdc"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Cristi Gordas
          </a>
        </Text>
        <Flex align="center" gap={2}>
          <Select
            aria-label={t("languageSelectorAria")}
            size="sm"
            w="auto"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Lang)}
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </Select>
          <Tooltip
            label={colorMode === "dark" ? t("toggleLight") : t("toggleDark")}
          >
            <IconButton
              aria-label={t("toggleColorAria")}
              icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
              size="sm"
              variant="ghost"
              onClick={toggleColorMode}
            />
          </Tooltip>
        </Flex>
      </Flex>

      {/* ── Scenarii Comune (Prioritate 1) ── */}
      <Box px={4} pt={4}>
        <Flex justify="center" mb={3}>
          <RadioGroup
            onChange={(v) => {
              const newMode = v as (typeof CAPTURE_MODES)[number];
              setCaptureMode(newMode);
              const firstCam = (newMode === "Video" ? VIDEO_CAMERAS : PHOTO_CAMERAS)[0];
              if (firstCam) {
                setSelectedCameraId(firstCam.id);
                setSensor("Custom");
                setCustomSensorWidth(firstCam.sensorWidth);
                setCustomSensorHeight(firstCam.sensorHeight);
                toast({
                  title: t("toastModeSwitch", {
                    mode: CAPTURE_MODE_LABELS[newMode][language],
                  }),
                  description: t("toastModeSwitchDesc", {
                    camera: `${firstCam.brand} ${firstCam.model}`,
                    type: SENSOR_TYPE_LABELS[firstCam.type][language],
                  }),
                  status: "info",
                  duration: 3000,
                  isClosable: true,
                  position: "top",
                });
              }
            }}
            value={captureMode}
          >
            <Stack direction="row" spacing={4}>
              {CAPTURE_MODES.map((m) => (
                <Radio value={m} key={m} colorScheme="purple">
                  {CAPTURE_MODE_LABELS[m][language]}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </Flex>
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color={mutedText}
          textAlign="center"
          textTransform="uppercase"
          letterSpacing="wider"
          mb={2}
        >
          {t("scenariiComune")} · {CAPTURE_MODE_LABELS[captureMode][language]}
        </Text>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={2}>
          {activeQuickScenarios.map((scenario) => (
            <Button
              key={scenario.name}
              onClick={() => applyQuickScenario(scenario)}
              colorScheme={scenario.colorScheme}
              variant="solid"
              size="sm"
              minH="44px"
              whiteSpace="normal"
              fontSize="sm"
              leftIcon={<Icon as={scenario.icon} boxSize={4} />}
            >
              {QUICK_SCENARIO_LABELS[scenario.name]?.[language] ?? scenario.name}
            </Button>
          ))}
        </SimpleGrid>
      </Box>

      <Box p={2} pt={4}>
        {compareMode && (
          <Text fontSize="xs" fontWeight="semibold" color={mutedText} mb={1}>
            {t("setupPrincipal", { sensor: getSensorDisplayName(sensor, selectedCameraId) })}
          </Text>
        )}
        <PhotographyGraphic
          distanceToSubjectInInches={distanceToSubjectInInches}
          nearFocalPointInInches={nearFocalPointInInches}
          farFocalPointInInches={farFocalPointInInches}
          farDistanceInInches={farDistanceInInches}
          subject={subject as keyof typeof SUBJECTS}
          focalLength={focalLengthInMillimeters}
          aperture={aperture}
          apertureUnitPrefix={apertureUnitPrefix}
          system={system}
          verticalFieldOfView={verticalFieldOfView}
          textColor={graphicTextColor}
          onChangeDistance={(val) => setDistanceToSubjectInInches(val)}
        />
      </Box>

      {/* ── Mod Comparație ── */}
      <Box px={6} pt={1}>
        <FormControl display="flex" alignItems="center" justifyContent="center" gap={2}>
          <Icon as={TbZoomIn} boxSize={4} color={mutedText} />
          <FormLabel htmlFor="compare-mode" mb="0" fontSize="sm">
            {t("modComparatie")}
          </FormLabel>
          <Switch
            id="compare-mode"
            colorScheme="purple"
            isChecked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
          />
        </FormControl>

        {compareMode && (
          <Box mt={3}>
            <Flex justify="center" align="center" gap={2} mb={2}>
              <Text fontSize="sm" color={mutedText}>
                {t("compareWith")}
              </Text>
              <Select
                size="sm"
                w="auto"
                value={compareSensor}
                onChange={(e) => setCompareSensor(e.target.value)}
              >
                {Object.entries(CIRCLES_OF_CONFUSION)
                  .filter(([key]) => key !== sensor)
                  .map(([key]) => (
                    <option key={key} value={key}>
                      {SENSOR_LABELS[key]?.[language] ?? key}
                    </option>
                  ))}
              </Select>
            </Flex>
            <Text fontSize="xs" fontWeight="semibold" color={mutedText} mb={1}>
              {t("compareLabel", {
                sensor: SENSOR_LABELS[compareSensor]?.[language] ?? compareSensor,
                fov: compareVerticalFieldOfView.toFixed(0),
              })}
            </Text>
            <PhotographyGraphic
              distanceToSubjectInInches={distanceToSubjectInInches}
              nearFocalPointInInches={compareNearFocalPointInInches}
              farFocalPointInInches={compareFarFocalPointInInches}
              farDistanceInInches={farDistanceInInches}
              subject={subject as keyof typeof SUBJECTS}
              focalLength={focalLengthInMillimeters}
              aperture={aperture}
              apertureUnitPrefix={apertureUnitPrefix}
              system={system}
              verticalFieldOfView={compareVerticalFieldOfView}
              textColor={graphicTextColor}
            />
            <SimpleGrid columns={2} spacing={3} mt={2}>
              <Box
                p={2}
                rounded="md"
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                textAlign="center"
              >
                <Text fontSize="xs" color={mutedText}>
                  {t("totalDofFor", { sensor: getSensorDisplayName(sensor, selectedCameraId) })}
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                  {isInfinityFar ? "∞" : convertUnits(totalDofInches, 0)}
                </Text>
              </Box>
              <Box
                p={2}
                rounded="md"
                bg={cardBg}
                border="1px"
                borderColor={borderColor}
                textAlign="center"
              >
                <Text fontSize="xs" color={mutedText}>
                  {t("totalDofFor", {
                    sensor: SENSOR_LABELS[compareSensor]?.[language] ?? compareSensor,
                  })}
                </Text>
                <Text fontWeight="bold" fontSize="sm">
                  {compareIsInfinityFar
                    ? "∞"
                    : convertUnits(compareTotalDofInches, 0)}
                </Text>
              </Box>
            </SimpleGrid>
          </Box>
        )}
      </Box>

      {/* ── DoF Stats Panel ── */}
      <Box px={6} pt={2}>
        <SimpleGrid columns={4} spacing={3}>
          {[
            {
              label: t("focalizareApropiata"),
              value: convertUnits(nearFocalPointInInches, 0),
            },
            {
              label: t("focalizareIndepartata"),
              value: isInfinityFar
                ? "∞"
                : convertUnits(farFocalPointInInches, 0),
            },
            {
              label: t("profunzimeTotala"),
              value: isInfinityFar ? "∞" : convertUnits(totalDofInches, 0),
            },
            {
              label: t("hiperfocala"),
              value: convertUnits(hyperFocalDistanceInInches, 0),
            },
          ].map(({ label, value }) => (
            <Box
              key={label}
              bg={cardBg}
              rounded="lg"
              p={3}
              textAlign="center"
              border="1px"
              borderColor={borderColor}
            >
              <Text
                fontSize="xs"
                color={mutedText}
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {label}
              </Text>
              <Text fontSize="lg" fontWeight="bold" mt={1}>
                {value}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        {/* DoF character badge + Set Hyperfocal action */}
        <Flex justify="space-between" align="center" mt={3}>
          <Badge
            colorScheme={dofCharacter.color}
            px={3}
            py={1}
            rounded="full"
            fontSize="sm"
          >
            {dofCharacter.label}
          </Badge>
          <Tooltip
            label={
              canSetHyperfocal
                ? t("tooltipSetHyperfocalOk")
                : t("tooltipSetHyperfocalBad", {
                    value: convertUnits(hyperFocalDistanceInInches, 0),
                  })
            }
          >
            <Button
              size="xs"
              variant="outline"
              colorScheme="teal"
              isDisabled={!canSetHyperfocal}
              onClick={() =>
                setDistanceToSubjectInInches(
                  Math.round(hyperFocalDistanceInInches)
                )
              }
            >
              {t("seteazaHiperfocala")}
            </Button>
          </Tooltip>
        </Flex>

        {/* Mod Nuntă — explicație practică pentru filmare run-and-gun */}
        <FormControl display="flex" alignItems="center" mt={4} justifyContent="center">
          <Icon as={FiHeart} boxSize={4} color="pink.400" mr={2} />
          <FormLabel htmlFor="wedding-mode" mb="0" fontSize="sm">
            {t("modNunta")}
          </FormLabel>
          <Switch
            id="wedding-mode"
            colorScheme="pink"
            isChecked={weddingMode}
            onChange={(e) => setWeddingMode(e.target.checked)}
          />
        </FormControl>

        {weddingMode && (
          <Box
            mt={3}
            p={3}
            rounded="lg"
            bg={weddingBg}
            border="1px"
            borderColor={weddingBorder}
            fontSize="sm"
            textAlign="center"
          >
            {isInfinityFar
              ? t("weddingFreeInfinity", {
                  ap: `${apertureUnitPrefix}/${aperture}`,
                  focal: focalLengthInMillimeters,
                  near: convertUnits(nearFocalPointInInches, 0),
                })
              : t("weddingFreeRange", {
                  ap: `${apertureUnitPrefix}/${aperture}`,
                  focal: focalLengthInMillimeters,
                  near: convertUnits(nearFocalPointInInches, 0),
                  far: convertUnits(farFocalPointInInches, 0),
                })}
            <br />
            <Text as="span" fontSize="xs" color={mutedText}>
              {t("weddingTip")}
            </Text>
          </Box>
        )}
      </Box>

      {/* ── Controls ── */}
      <Box px={6}>
        <Box pt={4}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbRuler} boxSize={4} color={mutedText} />
              <Text fontSize="sm">{t("unitati")}</Text>
              <InfoTip label={t("unitatiTooltip")} />
            </Flex>
            <Box flexGrow={1}>
              <RadioGroup
                onChange={(v) => setSystem(v as "Imperial" | "Metric")}
                value={system}
              >
                <Stack direction="row">
                  {SYSTEMS.map((s) => (
                    <Radio value={s} key={s} colorScheme="blue">
                      {SYSTEM_LABELS[s][language]}
                    </Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          </Flex>
        </Box>

        {/* Subject Distance */}
        <Box pt={6}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbRuler} boxSize={4} color={mutedText} />
              <Text fontSize="sm" textAlign="right">
                {t("distanta")} ({system === "Imperial" ? "ft" : "m"})
              </Text>
              <InfoTip label={t("distantaTooltip")} />
            </Flex>
            <Box flexGrow={1}>
              <Slider
                aria-label="distance to subject"
                colorScheme="blue"
                value={distanceToSubjectInInches}
                onChange={(val: number) => setDistanceToSubjectInInches(val)}
                min={10}
                max={400}
                step={1}
              >
                {distanceMarks.map(({ label, value }) => (
                  <SliderMark key={value} value={value} {...labelStyles}>
                    {label}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              {/* Bară de profunzime colorată — verde = zonă clară, roșu = neclară */}
              <Box
                mt={1}
                h="8px"
                rounded="full"
                transition="background 0.25s ease"
                bg={`linear-gradient(to right, #E53E3E 0%, #E53E3E ${clamp(
                  ((nearFocalPointInInches - 10) / (400 - 10)) * 100,
                  0,
                  100
                )}%, #38A169 ${clamp(
                  ((nearFocalPointInInches - 10) / (400 - 10)) * 100,
                  0,
                  100
                )}%, #38A169 ${
                  isInfinityFar
                    ? 100
                    : clamp(
                        ((farFocalPointInInches - 10) / (400 - 10)) * 100,
                        0,
                        100
                      )
                }%, #E53E3E ${
                  isInfinityFar
                    ? 100
                    : clamp(
                        ((farFocalPointInInches - 10) / (400 - 10)) * 100,
                        0,
                        100
                      )
                }%, #E53E3E 100%)`}
              />
              {hyperfocalBadge && (
                <SlideFade in={!!hyperfocalBadge} offsetY={-6}>
                  <Badge
                    mt={2}
                    colorScheme="teal"
                    variant="subtle"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                    rounded="md"
                  >
                    {hyperfocalBadge}
                  </Badge>
                </SlideFade>
              )}
            </Box>
          </Flex>
        </Box>

        {/* Focal Length */}
        <Box pt={6}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbZoomIn} boxSize={4} color={mutedText} />
              <Text fontSize="sm" textAlign="right">
                {t("distantaFocala")}
              </Text>
              <InfoTip label={t("distantaFocalaTooltip")} />
            </Flex>
            <Box flexGrow={1}>
              <Slider
                aria-label="focal length"
                colorScheme="blue"
                value={focalLengthInMillimeters}
                onChange={(val: number) => setFocalLengthInMillimeters(val)}
                min={3}
                max={400}
                step={1}
              >
                {[14, 28, 35, 50, 70, 85, 100, 135, 155, 200].map((val) => (
                  <SliderMark key={val} value={val} {...labelStyles}>
                    {val}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </Flex>
          <Flex gap={2} mt={2}>
            <Box w="20%"></Box>
            <Box flexGrow={1}>
              <Flex justify="space-between" align="center">
                <img src={Fisheye} alt="Fisheye lens" style={{ height: 50 }} />
                {sensor !== "Full Frame (35mm)" && (
                  <Text fontSize="xs" color={mutedText}>
                    {t("echivalentCadru", { value: equivalentFocalLength })}
                  </Text>
                )}
                <img
                  src={Telephoto}
                  alt="100-400 lens"
                  style={{ height: 50 }}
                />
              </Flex>
            </Box>
          </Flex>
        </Box>

        {/* Aperture */}
        <Box pt={6}>
          <Flex justify="center" mb={3}>
            <LensRing
              label={captureMode === "Video" ? t("diafragmaVideo") : t("diafragma")}
              value={aperture}
              onChange={setAperture}
              min={0.8}
              max={22}
              scale="log"
              marks={[0.8, 1.4, 1.8, 2.8, 4, 5.6, 8, 11, 16, 22]}
              formatMark={(v) => String(v)}
              formatCenter={(v) => `f/${v.toFixed(v < 4 ? 1 : 0)}`}
            />
          </Flex>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbAperture} boxSize={4} color={mutedText} />
              <Text fontSize="sm">
                {captureMode === "Video" ? t("diafragmaVideo") : t("diafragma")}
              </Text>
              <InfoTip
                label={
                  captureMode === "Video"
                    ? t("diafragmaTooltipVideo")
                    : t("diafragmaTooltip")
                }
              />
            </Flex>
            <Box flexGrow={1}>
              <Slider
                aria-label="aperture"
                colorScheme="blue"
                value={aperture}
                onChange={(val: number) => setAperture(val)}
                min={0.8}
                max={22}
                step={0.1}
              >
                {[0.8, 1.4, 1.8, 2.8, 4, 5.6, 8, 11, 16, 22].map((val) => (
                  <SliderMark key={val} value={val} {...labelStyles}>
                    {val}
                  </SliderMark>
                ))}
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Box>
          </Flex>
          {hasDiffractionRisk && (
            <Flex mt={2} justify="flex-start" pl="calc(20% + 8px)">
              <Badge
                colorScheme="orange"
                variant="subtle"
                px={2}
                py={0.5}
                fontSize="xs"
                rounded="md"
                display="flex"
                alignItems="center"
                gap={1}
                w="fit-content"
              >
                <Icon as={TbAlertTriangle} boxSize={3} />
                {t("difractieWarning", {
                  value: `${apertureUnitPrefix}/${diffractionLimitFStop.toFixed(1)}`,
                })}
              </Badge>
            </Flex>
          )}
        </Box>

        {/* Sensor + Subject */}
        <Box pt={6}>
          {isCustomSensor && (
  <Box mt={2}>
    <Flex gap={2} align="center" mb={1}>
      <Text fontSize="xs" w="80px" color={mutedText}>{t("latimeMm")}</Text>
      <input
        type="number"
        value={customSensorWidth}
        onChange={(e) => {
          setCustomSensorWidth(Number(e.target.value));
          setSelectedCameraId(null);
        }}
        style={{ width: 70, padding: "2px 6px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </Flex>
    <Flex gap={2} align="center" mb={1}>
      <Text fontSize="xs" w="80px" color={mutedText}>{t("inaltimeMm")}</Text>
      <input
        type="number"
        value={customSensorHeight}
        onChange={(e) => {
          setCustomSensorHeight(Number(e.target.value));
          setSelectedCameraId(null);
        }}
        style={{ width: 70, padding: "2px 6px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </Flex>
  </Box>
)}<Flex gap={3} direction={{ base: "column", md: "row" }}>
            <Flex gap={2} width={{ base: "100%", md: "50%" }}>
              <Flex
                w={{ base: "72px", md: "20%" }}
                mt={2}
                justify="flex-end"
                align="center"
                gap={1.5}
                flexShrink={0}
              >
                <Icon as={FiCamera} boxSize={4} color={mutedText} />
                <Text fontSize="sm" textAlign="right">
                  {t("senzorCamera")}
                </Text>
                <InfoTip label={t("senzorCameraTooltip")} />
              </Flex>
              <Box flexGrow={1}>
                <Select
                  bg={nativeSelectStyles.bg}
                  color={nativeSelectStyles.color}
                  borderColor={nativeSelectStyles.borderColor}
                  iconColor={nativeSelectStyles.iconColor}
                  _hover={nativeSelectStyles._hover}
                  _focus={nativeSelectStyles._focus}
                  _active={nativeSelectStyles._active}
                  sx={nativeSelectStyles.sx}
                  value={selectedCameraId ?? "Custom"}
                  onChange={(evt) => {
                    const value = evt?.target?.value;
                    if (!value) return;
                    if (value === "Custom") {
                      setSelectedCameraId(null);
                      setSensor("Custom");
                      return;
                    }
                    const cam = findCameraById(value);
                    if (!cam) return;
                    setSelectedCameraId(cam.id);
                    setSensor("Custom");
                    setCustomSensorWidth(cam.sensorWidth);
                    setCustomSensorHeight(cam.sensorHeight);
                  }}
                >
                  {Object.entries(groupedCameras).map(([brand, cams]) => (
                    <optgroup label={brand} key={brand}>
                      {cams.map((cam) => (
                        <option key={cam.id} value={cam.id}>
                          {cam.model} ({SENSOR_TYPE_LABELS[cam.type][language]})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                  <optgroup label={t("senzorPersonalizatGrup")}>
                    <option value="Custom">{t("senzorPersonalizat")}</option>
                  </optgroup>
                </Select>
              </Box>
            </Flex>

            <Flex gap={2} width={{ base: "100%", md: "50%" }}>
              <Flex
                w={{ base: "72px", md: "20%" }}
                mt={2}
                justify="flex-end"
                align="center"
                gap={1.5}
                flexShrink={0}
              >
                <Icon as={TbUser} boxSize={4} color={mutedText} />
                <Text fontSize="sm" textAlign="right">
                  {t("subiect")}
                </Text>
                <InfoTip label={t("subiectTooltip")} />
              </Flex>
              <Box flexGrow={1}>
                <Select
                  bg={nativeSelectStyles.bg}
                  color={nativeSelectStyles.color}
                  borderColor={nativeSelectStyles.borderColor}
                  iconColor={nativeSelectStyles.iconColor}
                  _hover={nativeSelectStyles._hover}
                  _focus={nativeSelectStyles._focus}
                  _active={nativeSelectStyles._active}
                  sx={nativeSelectStyles.sx}
                  value={subject}
                  placeholder={t("subiectPlaceholder")}
                  onChange={(evt) => {
                    if (
                      SUBJECTS[evt?.target?.value as keyof typeof SUBJECTS]
                    ) {
                      setSubject(evt?.target?.value);
                    }
                  }}
                >
                  {groupedSubjects.map(({ category, entries }) => (
                    <optgroup
                      label={SUBJECT_CATEGORY_LABELS[category][language]}
                      key={category}
                    >
                      {entries.map(([key]) => (
                        <option key={key} value={key}>
                          {SUBJECT_LABELS[key]?.[language] ?? key}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {/* ── Cine influențează profunzimea de câmp? ── */}
        <InfluencersPanel language={language} apertureUnitPrefix={apertureUnitPrefix} />
        <ComparisonTable
          language={language}
          apertureUnitPrefix={apertureUnitPrefix}
          aperture={aperture}
          focalLengthInMillimeters={focalLengthInMillimeters}
          distanceLabel={convertUnits(distanceToSubjectInInches, 0)}
        />
        <PracticalTip
          language={language}
          tipKey={influencerTipKey}
          apertureLabel={`${apertureUnitPrefix}/${aperture}`}
          focalLengthInMillimeters={focalLengthInMillimeters}
          distanceLabel={convertUnits(distanceToSubjectInInches, 0)}
        />

        {/* Rack Focus Simulator */}
        <Box pt={6}>
          <Flex gap={2} align="center" mb={2}>
            <Icon as={FiPlay} boxSize={4} color={mutedText} />
            <Text fontSize="sm" fontWeight="semibold">
              {t("rackFocusTitle")}
            </Text>
          </Flex>
          <Text fontSize="xs" color={mutedText} mb={3}>
            {t("rackFocusDesc")}
          </Text>
          <Flex gap={3} align="center" wrap="wrap">
            <Flex align="center" gap={2}>
              <Text fontSize="xs" color={mutedText}>
                {t("rackStart")}
              </Text>
              <input
                type="number"
                value={Math.round(rackStartInInches)}
                onChange={(e) =>
                  setRackStartInInches(Number(e.target.value))
                }
                style={{
                  width: 70,
                  padding: "2px 6px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="xs" color={mutedText}>
                {t("rackEnd")}
              </Text>
              <input
                type="number"
                value={Math.round(rackEndInInches)}
                onChange={(e) => setRackEndInInches(Number(e.target.value))}
                style={{
                  width: 70,
                  padding: "2px 6px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            </Flex>
            <Button
              size="sm"
              colorScheme="purple"
              variant="outline"
              leftIcon={<Icon as={FiPlay} />}
              isLoading={isRacking}
              loadingText={t("rackLoading")}
              onClick={startRackFocus}
            >
              {t("rackPlay")}
            </Button>
          </Flex>
        </Box>

        <Divider mt={6} borderColor={borderColor} />

        {/* Presetări salvate de utilizator */}
        <Box pt={4} pb={2}>
          <Flex justify="center" mb={3}>
            <Tooltip
              label={
                savedPresets.length >= 3
                  ? t("salveazaCombinatiaFull3")
                  : t("salveazaCombinatiaFull")
              }
            >
              <Button
                size="sm"
                minH="44px"
                colorScheme="teal"
                variant="outline"
                leftIcon={<Icon as={TbDeviceFloppy} boxSize={4} />}
                onClick={saveCurrentPreset}
              >
                {t("salveazaCombinatia")}
              </Button>
            </Tooltip>
          </Flex>

          {savedPresets.length > 0 && (
            <>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color={mutedText}
                textAlign="center"
                textTransform="uppercase"
                letterSpacing="wider"
                mb={2}
              >
                {t("presetariMele")}
              </Text>
              <Wrap justify="center" spacing={2}>
                {savedPresets.map((preset) => (
                  <WrapItem key={preset.id}>
                    <Flex
                      align="center"
                      gap={1}
                      border="1px"
                      borderColor={borderColor}
                      rounded="md"
                      pl={2}
                    >
                      <Button
                        size="sm"
                        minH="44px"
                        variant="ghost"
                        onClick={() => loadPreset(preset)}
                      >
                        {preset.name} · {getSensorDisplayName(preset.sensor, preset.cameraId)}
                      </Button>
                      <IconButton
                        aria-label={t("stergePresetare")}
                        icon={<Icon as={TbX} boxSize={3.5} />}
                        size="sm"
                        minH="44px"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => deletePreset(preset.id)}
                      />
                    </Flex>
                  </WrapItem>
                ))}
              </Wrap>
            </>
          )}
        </Box>

        <Divider mt={4} borderColor={borderColor} />

        {/* Quick Presets — doar în modul Foto */}
        {captureMode === "Foto" && (
          <Box pt={4} pb={2}>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color={mutedText}
              textAlign="center"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={3}
            >
              {t("presetariRapide")}
            </Text>
            <Wrap justify="center" spacing={2}>
              {COMMON_SETUPS.map((setup) => (
                <WrapItem key={setup.name}>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="blue"
                    onClick={() => {
                      setFocalLengthInMillimeters(setup.focalLength);
                      setAperture(setup.aperture);
                      setSensor(setup.sensor);
                      setSelectedCameraId(null);
                      setDistanceToSubjectInInches(setup.idealDistance);
                    }}
                  >
                    {COMMON_SETUP_LABELS[setup.name]?.[language] ?? setup.name}
                  </Button>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        {/* Video / Wedding Presets — doar în modul Video */}
        {captureMode === "Video" && (
          <Box pt={2} pb={2}>
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color={mutedText}
              textAlign="center"
              textTransform="uppercase"
              letterSpacing="wider"
              mb={3}
            >
              {t("presetariVideoNunta")}
            </Text>
            <Wrap justify="center" spacing={2}>
              {VIDEO_WEDDING_SETUPS.map((setup) => (
                <WrapItem key={setup.name}>
                  <Tooltip label={VIDEO_WEDDING_SETUP_LABELS[setup.name]?.note[language] ?? setup.note}>
                    <Button
                      size="sm"
                      variant="outline"
                      colorScheme={
                        setup.brand === "Sony"
                          ? "orange"
                          : setup.brand === "Panasonic"
                          ? "cyan"
                          : "red"
                      }
                      onClick={() => {
                        setFocalLengthInMillimeters(setup.focalLength);
                        setAperture(setup.aperture);
                        setSensor(setup.sensor);
                        setSelectedCameraId(null);
                        setDistanceToSubjectInInches(setup.idealDistance);
                      }}
                    >
                      {VIDEO_WEDDING_SETUP_LABELS[setup.name]?.name[language] ?? setup.name}
                    </Button>
                  </Tooltip>
                </WrapItem>
              ))}
            </Wrap>
          </Box>
        )}

        {/* FAQ / Ajutor */}
        <Box pt={4} pb={2} px={{ base: 0, md: 4 }}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color={mutedText}
            textAlign="center"
            textTransform="uppercase"
            letterSpacing="wider"
            mb={3}
          >
            {t("faqTitle")}
          </Text>
          <Accordion allowToggle>
            {FAQ_TRANSLATIONS.map((item) => (
              <AccordionItem key={item.id} borderColor={borderColor}>
                <h2>
                  <AccordionButton minH="44px" _hover={{ bg: cardBg }}>
                    <Box as="span" flex="1" textAlign="left" fontSize="sm" fontWeight="medium">
                      {item.question[language]}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} fontSize="sm" color={mutedText}>
                  {item.answer[language]}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        {/* GitHub Footer */}
        <Box pt={2} pb={6} textAlign="center">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={FiPrinter} />}
            color={mutedText}
            _hover={{ color: colorMode === "dark" ? "gray.200" : "gray.800" }}
            onClick={() => window.print()}
            mr={2}
          >
            {t("printeazaFisa")}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={FiLink} />}
            color={mutedText}
            _hover={{ color: colorMode === "dark" ? "gray.200" : "gray.800" }}
            onClick={copyShareLink}
            mr={2}
          >
            {t("copiazaLink")}
          </Button>
          <Button
            as="a"
            href="https://github.com/gordasgdc/depth-of-field"
            target="_blank"
            rel="noreferrer"
            size="sm"
            variant="ghost"
            leftIcon={<Icon as={FiGithub} />}
            color={mutedText}
            _hover={{ color: colorMode === "dark" ? "gray.200" : "gray.800" }}
          >
            {t("veziPeGithub")}
          </Button>
          <Text fontSize="xs" color={mutedText} mt={2}>
            {t("creatDe")}{" "}
            <a
              href="https://github.com/gordasgdc"
              target="_blank"
              rel="noreferrer"
              style={{ textDecoration: "underline" }}
            >
              Cristi Gordas
            </a>
          </Text>
        </Box>
      </Box>
      </Box>

      {/* ── Ghid inițial (onboarding) ── */}
      <Modal
        isOpen={isOnboardingOpen}
        onClose={dismissOnboarding}
        isCentered
        size={{ base: "sm", md: "lg" }}
      >
        <ModalOverlay />
        <ModalContent mx={4}>
          <ModalHeader>{t("onboardingTitle")}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" mb={4} color={mutedText}>
              {t("onboardingIntro")}
            </Text>
            <Stack spacing={3}>
              <Flex gap={3} align="start">
                <Icon as={TbAperture} boxSize={5} mt={0.5} color="blue.400" />
                <Text fontSize="sm">{t("onboardingAperture")}</Text>
              </Flex>
              <Flex gap={3} align="start">
                <Icon as={TbZoomIn} boxSize={5} mt={0.5} color="blue.400" />
                <Text fontSize="sm">{t("onboardingFocal")}</Text>
              </Flex>
              <Flex gap={3} align="start">
                <Icon as={TbRuler} boxSize={5} mt={0.5} color="blue.400" />
                <Text fontSize="sm">{t("onboardingDistance")}</Text>
              </Flex>
              <Flex gap={3} align="start">
                <Icon as={FiCamera} boxSize={5} mt={0.5} color="blue.400" />
                <Text fontSize="sm">{t("onboardingSensor")}</Text>
              </Flex>
              <Flex gap={3} align="start">
                <Icon as={TbBulb} boxSize={5} mt={0.5} color="purple.400" />
                <Text fontSize="sm">{t("onboardingInfluencers")}</Text>
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={dismissOnboarding} minH="44px" w="100%">
              {t("onboardingButton")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Fișă de Platou (vizibilă doar la print) ── */}
      <Box className="print-sheet" p={8} color="black" bg="white">
        <Text fontSize="2xl" fontWeight="bold" mb={1}>
          {t("fisaDePlatou")}
        </Text>
        <Text fontSize="sm" mb={6}>
          {t("fisaDePlatouSub", {
            date: new Date().toLocaleDateString(
              language === "ro" ? "ro-RO" : language === "es" ? "es-ES" : "en-US"
            ),
          })}
        </Text>
        <SimpleGrid columns={2} spacing={4} maxW="500px">
          <Text fontWeight="semibold">{t("mod")}</Text>
          <Text>{CAPTURE_MODE_LABELS[captureMode][language]}</Text>
          <Text fontWeight="semibold">{t("senzorLabel")}</Text>
          <Text>{getSensorDisplayName(sensor, selectedCameraId)}</Text>
          <Text fontWeight="semibold">{t("distantaFocalaLabel")}</Text>
          <Text>{focalLengthInMillimeters}mm</Text>
          <Text fontWeight="semibold">{t("diafragmaLabel")}</Text>
          <Text>{apertureUnitPrefix}/{aperture}</Text>
          <Text fontWeight="semibold">{t("distantaSubiectLabel")}</Text>
          <Text>{convertUnits(distanceToSubjectInInches, 0)}</Text>
        </SimpleGrid>
        <Divider my={4} borderColor="gray.400" />
        <SimpleGrid columns={2} spacing={4} maxW="500px">
          <Text fontWeight="semibold">{t("focalizareApropiataLabel")}</Text>
          <Text>{convertUnits(nearFocalPointInInches, 0)}</Text>
          <Text fontWeight="semibold">{t("focalizareIndepartataLabel")}</Text>
          <Text>
            {isInfinityFar ? "∞" : convertUnits(farFocalPointInInches, 0)}
          </Text>
          <Text fontWeight="semibold">{t("profunzimeTotalaLabel")}</Text>
          <Text>{isInfinityFar ? "∞" : convertUnits(totalDofInches, 0)}</Text>
          <Text fontWeight="semibold">{t("distantaHiperfocalaLabel")}</Text>
          <Text>{convertUnits(hyperFocalDistanceInInches, 0)}</Text>
        </SimpleGrid>
        <Text fontSize="xs" mt={8} color="gray.600">
          {t("fisaFooter")}
        </Text>
      </Box>
    </>
  );
}

export default App;
