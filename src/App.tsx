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
} from "@chakra-ui/react";
import { TbRuler, TbAperture, TbZoomIn, TbUser } from "react-icons/tb";
import { FiGithub, FiCamera, FiSun, FiMoon, FiPlay, FiHeart, FiLink, FiPrinter } from "react-icons/fi";
import { toImperial, toMetric } from "./utils/units";
import { buildNativeSelectStyles } from "./selectStyles";

import PhotographyGraphic, { SUBJECTS } from "./PhotographyGraphic";

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
    coc: 0.02,
    sensorHeight: 60,
    cropFactor: 0.55
  },
  "6x7 (Format Mediu)": {
    coc: 0.025,
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
  const [weddingMode, setWeddingMode] = useState(false);
  const [rackStartInInches, setRackStartInInches] = useState(48);
  const [rackEndInInches, setRackEndInInches] = useState(120);
  const [isRacking, setIsRacking] = useState(false);
  const rackAnimationRef = useRef<number | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSensor, setCompareSensor] = useState("APS-C");
  const toast = useToast();

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
  const dofCharacter =
    totalDofFeet < 0.5
      ? { label: "Macro / Produs", color: "purple" }
      : totalDofFeet < 3
      ? { label: "Portret", color: "blue" }
      : totalDofFeet < 10
      ? { label: "Grup / Eveniment", color: "teal" }
      : totalDofFeet < 30
      ? { label: "Stradă / Arhitectură", color: "green" }
      : { label: "Peisaj", color: "gray" };

  // ── Theme-aware colors 
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const topBarBg = useColorModeValue("gray.50", "gray.900");
  const graphicTextColor = useColorModeValue("#1A202C", "#F7FAFC");
  const weddingBg = useColorModeValue("pink.50", "pink.900");
  const weddingBorder = useColorModeValue("pink.200", "pink.700");
  const nativeSelectStyles = buildNativeSelectStyles(colorMode);

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

  useEffect(() => {
    return () => {
      if (rackAnimationRef.current) {
        cancelAnimationFrame(rackAnimationRef.current);
      }
    };
  }, []);

  // ── Sincronizare setup curent cu URL-ul (pentru partajare prin link) ──
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("dist", String(Math.round(distanceToSubjectInInches)));
    params.set("focal", String(focalLengthInMillimeters));
    params.set("f", String(aperture));
    params.set("subject", subject);
    params.set("system", system);
    params.set("sensor", sensor);
    if (sensor === "Custom") {
      params.set("sw", String(customSensorWidth));
      params.set("sh", String(customSensorHeight));
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
  ]);

  function copyShareLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copiat!",
        description: "Trimite-l cuiva ca să vadă exact acest setup.",
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
      >
        <Text fontSize="sm" color={mutedText}>
          Simulator de Profunzime a Câmpului · de{" "}
          <a
            href="https://github.com/gordasgdc"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "underline" }}
          >
            Cristi Gordas
          </a>
        </Text>
        <Tooltip
          label={
            colorMode === "dark"
              ? "Comută la modul luminos"
              : "Comută la modul întunecat"
          }
        >
          <IconButton
            aria-label="Comută modul de culoare"
            icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
            size="sm"
            variant="ghost"
            onClick={toggleColorMode}
          />
        </Tooltip>
      </Flex>

      <Box p={2} pt={4}>
        {compareMode && (
          <Text fontSize="xs" fontWeight="semibold" color={mutedText} mb={1}>
            Setup Principal — {sensor}
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
            Mod Comparație (două formate de senzor)
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
                Compară cu:
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
                      {key}
                    </option>
                  ))}
              </Select>
            </Flex>
            <Text fontSize="xs" fontWeight="semibold" color={mutedText} mb={1}>
              Comparație — {compareSensor} (aceeași distanță focală și
              diafragmă, câmp vizual {compareVerticalFieldOfView.toFixed(0)}°)
            </Text>
            <PhotographyGraphic
              distanceToSubjectInInches={distanceToSubjectInInches}
              nearFocalPointInInches={compareNearFocalPointInInches}
              farFocalPointInInches={compareFarFocalPointInInches}
              farDistanceInInches={farDistanceInInches}
              subject={subject as keyof typeof SUBJECTS}
              focalLength={focalLengthInMillimeters}
              aperture={aperture}
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
                  Total DoF — {sensor}
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
                  Total DoF — {compareSensor}
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
              label: "Focalizare Apropiată",
              value: convertUnits(nearFocalPointInInches, 0),
            },
            {
              label: "Focalizare Îndepărtată",
              value: isInfinityFar
                ? "∞"
                : convertUnits(farFocalPointInInches, 0),
            },
            {
              label: "Profunzime Totală",
              value: isInfinityFar ? "∞" : convertUnits(totalDofInches, 0),
            },
            {
              label: "Hiperfocală",
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
                ? "Focalizează la distanța hiperfocală — tot ce e de la jumătatea acestei distanțe până la ∞ va fi clar"
                : `Hiperfocala (${convertUnits(hyperFocalDistanceInInches, 0)}) depășește limitele scenei`
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
              Setează Hiperfocala
            </Button>
          </Tooltip>
        </Flex>

        {/* Mod Nuntă — explicație practică pentru filmare run-and-gun */}
        <FormControl display="flex" alignItems="center" mt={4} justifyContent="center">
          <Icon as={FiHeart} boxSize={4} color="pink.400" mr={2} />
          <FormLabel htmlFor="wedding-mode" mb="0" fontSize="sm">
            Mod Nuntă (setează și uită)
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
            {isInfinityFar ? (
              <>
                La <strong>f/{aperture}</strong>, {focalLengthInMillimeters}mm, poți
                filma liber de la{" "}
                <strong>{convertUnits(nearFocalPointInInches, 0)}</strong> până la{" "}
                <strong>infinit</strong> — totul rămâne clar, fără să mai atingi
                focusul.
              </>
            ) : (
              <>
                La <strong>f/{aperture}</strong>, {focalLengthInMillimeters}mm, tot ce
                se află între{" "}
                <strong>{convertUnits(nearFocalPointInInches, 0)}</strong> și{" "}
                <strong>{convertUnits(farFocalPointInInches, 0)}</strong> va fi clar.
                Cât timp mirii rămân în acest interval, poți filma fără să mai
                atingi focusul manual.
              </>
            )}
            <br />
            <Text as="span" fontSize="xs" color={mutedText}>
              Sfat: setează focusul la distanța hiperfocală (butonul de mai sus)
              pentru cea mai largă zonă de siguranță posibilă.
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
              <Text fontSize="sm">Unități</Text>
              <InfoTip label="Alege sistemul de unități pentru afișarea distanțelor: Imperial (ft/in) sau Metric (cm)." />
            </Flex>
            <Box flexGrow={1}>
              <RadioGroup
                onChange={(v) => setSystem(v as "Imperial" | "Metric")}
                value={system}
              >
                <Stack direction="row">
                  {SYSTEMS.map((s) => (
                    <Radio value={s} key={s} colorScheme="blue">
                      {s}
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
                Distanță ({system === "Imperial" ? "ft" : "m"})
              </Text>
              <InfoTip label="Distanța până la subiectul pe care vrei să-l focalizezi. Cu cât te apropii mai mult, cu atât profunzimea de câmp devine mai mică." />
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
            </Box>
          </Flex>
        </Box>

        {/* Focal Length */}
        <Box pt={6}>
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbZoomIn} boxSize={4} color={mutedText} />
              <Text fontSize="sm" textAlign="right">
                Distanța Focală (mm)
              </Text>
              <InfoTip label="Distanță focală mai mare = câmp vizual mai îngust și profunzime de câmp mai mică, la aceeași diafragmă." />
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
                    ≈ {equivalentFocalLength}mm echivalent cadru complet
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
          <Flex gap={2} align="center">
            <Flex w="20%" justify="flex-end" align="center" gap={1.5}>
              <Icon as={TbAperture} boxSize={4} color={mutedText} />
              <Text fontSize="sm">Diafragmă</Text>
              <InfoTip label="Diafragmă mai deschisă (f mic) = profunzime de câmp mai mică, dar mai multă lumină. Diafragmă închisă (f mare) = profunzime mai mare, dar mai puțină lumină." />
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
              >
                ⚠ Difracția poate reduce claritatea peste f/
                {diffractionLimitFStop.toFixed(1)} pe acest senzor
              </Badge>
            </Flex>
          )}
        </Box>

        {/* Sensor + Subject */}
        <Box pt={6}>
          {isCustomSensor && (
  <Box mt={2}>
    <Flex gap={2} align="center" mb={1}>
      <Text fontSize="xs" w="80px" color={mutedText}>Lățime (mm)</Text>
      <input
        type="number"
        value={customSensorWidth}
        onChange={(e) => setCustomSensorWidth(Number(e.target.value))}
        style={{ width: 70, padding: "2px 6px", borderRadius: 6, border: "1px solid #ccc" }}
      />
    </Flex>
    <Flex gap={2} align="center" mb={1}>
      <Text fontSize="xs" w="80px" color={mutedText}>Înălțime (mm)</Text>
      <input
        type="number"
        value={customSensorHeight}
        onChange={(e) => setCustomSensorHeight(Number(e.target.value))}
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
                  Senzor
                </Text>
                <InfoTip label="Senzorii mai mici au, de regulă, profunzime de câmp mai mare la aceeași distanță focală și diafragmă — de-asta un telefon are totul clar, iar un obiectiv full-frame poate izola subiectul." />
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
                  value={sensor}
                  placeholder="Senzor"
                  onChange={(evt) => {
                    if (!evt?.target?.value) {
                      return;
                    }
                    setSensor(evt?.target?.value);
                  }}
                >
                  {Object.entries(CIRCLES_OF_CONFUSION).map(([key]) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                  <option value="Custom">Personalizat</option>
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
                  Subiect
                </Text>
                <InfoTip label="Alege un subiect de referință, ca să vizualizezi mai ușor scara scenei și unde cade zona de focus pe el." />
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
                  placeholder="Subiect"
                  onChange={(evt) => {
                    if (
                      SUBJECTS[evt?.target?.value as keyof typeof SUBJECTS]
                    ) {
                      setSubject(evt?.target?.value);
                    }
                  }}
                >
                  {Object.entries(SUBJECTS).map(([key]) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </Box>
            </Flex>
          </Flex>
        </Box>

        {/* Rack Focus Simulator */}
        <Box pt={6}>
          <Flex gap={2} align="center" mb={2}>
            <Icon as={FiPlay} boxSize={4} color={mutedText} />
            <Text fontSize="sm" fontWeight="semibold">
              Simulare Trecere de Focus (Rack Focus)
            </Text>
          </Flex>
          <Text fontSize="xs" color={mutedText} mb={3}>
            Setează o distanță de start și una finală, apoi apasă Play ca să
            vezi cum se schimbă profunzimea de câmp în timpul unei treceri de
            focus — util pentru exersarea unui rack focus manual la nuntă.
          </Text>
          <Flex gap={3} align="center" wrap="wrap">
            <Flex align="center" gap={2}>
              <Text fontSize="xs" color={mutedText}>
                Start
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
                Final
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
              loadingText="Rulează..."
              onClick={startRackFocus}
            >
              Redă tranziția
            </Button>
          </Flex>
        </Box>

        <Divider mt={6} borderColor={borderColor} />

        {/* Quick Presets */}
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
            Presetări Rapide
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
                    setDistanceToSubjectInInches(setup.idealDistance);
                  }}
                >
                  {setup.name}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* Video / Wedding Presets */}
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
            Presetări Video / Nuntă (camere reale)
          </Text>
          <Wrap justify="center" spacing={2}>
            {VIDEO_WEDDING_SETUPS.map((setup) => (
              <WrapItem key={setup.name}>
                <Tooltip label={setup.note}>
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
                      setDistanceToSubjectInInches(setup.idealDistance);
                    }}
                  >
                    {setup.name}
                  </Button>
                </Tooltip>
              </WrapItem>
            ))}
          </Wrap>
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
            Printează Fișa
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
            Copiază Link
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
            Vezi pe GitHub
          </Button>
          <Text fontSize="xs" color={mutedText} mt={2}>
            Creat de{" "}
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

      {/* ── Fișă de Platou (vizibilă doar la print) ── */}
      <Box className="print-sheet" p={8} color="black" bg="white">
        <Text fontSize="2xl" fontWeight="bold" mb={1}>
          Fișă de Platou
        </Text>
        <Text fontSize="sm" mb={6}>
          Simulator de Profunzime a Câmpului · generat {new Date().toLocaleDateString("ro-RO")}
        </Text>
        <SimpleGrid columns={2} spacing={4} maxW="500px">
          <Text fontWeight="semibold">Senzor:</Text>
          <Text>{sensor}</Text>
          <Text fontWeight="semibold">Distanță Focală:</Text>
          <Text>{focalLengthInMillimeters}mm</Text>
          <Text fontWeight="semibold">Diafragmă:</Text>
          <Text>f/{aperture}</Text>
          <Text fontWeight="semibold">Distanță Subiect:</Text>
          <Text>{convertUnits(distanceToSubjectInInches, 0)}</Text>
        </SimpleGrid>
        <Divider my={4} borderColor="gray.400" />
        <SimpleGrid columns={2} spacing={4} maxW="500px">
          <Text fontWeight="semibold">Focalizare Apropiată:</Text>
          <Text>{convertUnits(nearFocalPointInInches, 0)}</Text>
          <Text fontWeight="semibold">Focalizare Îndepărtată:</Text>
          <Text>
            {isInfinityFar ? "∞" : convertUnits(farFocalPointInInches, 0)}
          </Text>
          <Text fontWeight="semibold">Profunzime Totală:</Text>
          <Text>{isInfinityFar ? "∞" : convertUnits(totalDofInches, 0)}</Text>
          <Text fontWeight="semibold">Distanță Hiperfocală:</Text>
          <Text>{convertUnits(hyperFocalDistanceInInches, 0)}</Text>
        </SimpleGrid>
        <Text fontSize="xs" mt={8} color="gray.600">
          Generat cu Simulator de Profunzime a Câmpului — Cristi Gordas ·
          gordasgdc.github.io/depth-of-field
        </Text>
      </Box>
    </>
  );
}

export default App;
