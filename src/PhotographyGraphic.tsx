import { useRef } from "react";
import { motion } from "framer-motion";
import { toImperial, toMetric } from "./utils/units";
import { StandingPersonA } from "./assets/peeps/StandingPersonA";
import { StandingPersonB } from "./assets/peeps/StandingPersonB";
import { SittingPerson } from "./assets/peeps/SittingPerson";
import { WalkingPerson } from "./assets/peeps/WalkingPerson";

const MotionG = motion.g;
const MotionRect = motion.rect;
const MotionLine = motion.line;

// Canvas original al ilustrațiilor Open Peeps (vezi src/assets/peeps/).
const PEEP_VIEWBOX_W = 850;
const PEEP_VIEWBOX_H = 1200;

// Scalează o siluetă Open Peeps la `height` (unități SVG locale) și o
// centrează pe axa X — aceeași convenție de poziționare ca restul
// diagramei (x=0 e centrul subiectului, y=height e solul).
function PeepFigure({
  height,
  Component,
}: {
  height: number;
  Component: () => JSX.Element;
}) {
  const scale = height / PEEP_VIEWBOX_H;
  return (
    <g transform={`scale(${scale}) translate(${-PEEP_VIEWBOX_W / 2} 0)`}>
      <Component />
    </g>
  );
}

// Culori consecvente cu tema GDC (vezi theme.ts): accent verde-teal pe fundal antracit.
const ACCENT = "#34E8A0";
const GROUND_LINE = "#3A424A";
const SUBJECT_DIM = "#5A646C";

const SPRING = { type: "spring" as const, stiffness: 170, damping: 24, mass: 0.6 };

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ── Persoane — ilustrații Open Peeps ──────────────────────────────────────
// Siluete umane detaliate, anatomice (cap, păr, brațe, mâini, picioare),
// desenate de Pablo Stanley (Open Peeps, licență CC0), extrase static în
// src/assets/peeps/ și aplatizate la o singură culoare (currentColor) ca
// să se încadreze în sistemul de accent/dim al diagramei. Toate provin din
// același sistem de ilustrare — de-aici coerența de stil între ele.

// Birou geometric simplu (blat + două picioare + monitor) — obiect, nu
// personaj, rămâne simplu intenționat; pereche pentru SittingPerson.
function Desk({ height }: { height: number }) {
  const deskY = height * 0.62;
  const deskW = height * 0.62;
  const t = height * 0.03;
  return (
    <g transform={`translate(${height * 0.3} 0)`}>
      <rect x={-deskW / 2} y={deskY} width={deskW} height={t} rx={t / 2} />
      <rect x={-deskW / 2 + t} y={deskY + t} width={t} height={height * 0.36} />
      <rect x={deskW / 2 - 2 * t} y={deskY + t} width={t} height={height * 0.36} />
      <rect
        x={-height * 0.07}
        y={deskY - height * 0.17}
        width={height * 0.14}
        height={height * 0.15}
        rx={t / 2}
      />
    </g>
  );
}

// Siluetă de patruped (câine/pisică), văzută din profil — un singur traseu
// bezier închis (nu cerc+dreptunghi), cu urechi diferite per specie.
function QuadrupedPictogram({
  height,
  ears = "dog",
}: {
  height: number;
  ears?: "dog" | "cat";
}) {
  const s = height / 40; // factor de scară — traseul e desenat la o înălțime de referință de 40
  const earTip =
    ears === "cat"
      ? "M 30,6 C 29,2 26,-2 24,1 C 26,3 27,5 27.5,7 Z M 20,4 C 19.5,0 17,-3 15,0 C 16.5,2 18,4 18.5,6 Z"
      : "M 31,10 C 33,6 33,1 29,2 C 28,5 27.5,8 28,11 Z M 15,9 C 12.5,5 12,0 16.5,1.5 C 17,4.5 17,7.5 16.5,10 Z";
  return (
    <g transform={`scale(${s})`}>
      <path
        d="M 6,40 C 5,37 5,34 6.5,31.5 C 4,29.5 3,26.5 3.5,23 C 1,21.5 0.5,18.5 2,16 C 1,13 2.5,10 5.5,9 C 7,5.5 10.5,3 14.5,3 C 17,1 20.5,0.5 23,2 C 26.5,1.5 30,3.5 31,7 C 34.5,8 36.5,11.5 35.5,15 C 37.5,17 37.5,20 35.5,22 C 36,25.5 34,28.5 30.5,29.5 C 30,32 29.5,34.5 30,37 C 30,38.5 29,40 27,40 C 25.5,40 24.5,38.5 25,37 C 24.5,35.5 24.5,33.5 25.5,31.5 C 21,32.5 15,32.5 10.5,31 C 11,33 11,35.5 10.5,37.5 C 10.5,39 9.5,40 8,40 C 6.5,40 5.5,39 6,40 Z"
        fill="currentColor"
      />
      <path d={earTip} fill="currentColor" />
    </g>
  );
}

// ── Persoane (siluete Open Peeps, scalate via PeepFigure) ────────────────
const PersonGraphic = () => (
  <PeepFigure height={72} Component={StandingPersonA} />
);

const PersonAtDeskGraphic = () => (
  <g>
    <Desk height={54} />
    <PeepFigure height={54} Component={SittingPerson} />
  </g>
);

// Cuplu — două siluete alăturate (variante diferite de păr, aceeași
// bibliotecă), reper de scară pentru cadre de nuntă.
const BrideAndGroom = () => (
  <g>
    <g transform="translate(-15 0)">
      <PeepFigure height={72} Component={StandingPersonB} />
    </g>
    <g transform="translate(15 0)">
      <PeepFigure height={72} Component={StandingPersonA} />
    </g>
  </g>
);

// Grup de 4 persoane, cu scări ușor diferite ca să sugereze adâncime.
const GroupOfPeople = () => (
  <g>
    <g transform="translate(-24 3) scale(0.82)">
      <PeepFigure height={72} Component={StandingPersonB} />
    </g>
    <g transform="translate(-8 0) scale(1)">
      <PeepFigure height={72} Component={StandingPersonA} />
    </g>
    <g transform="translate(9 1) scale(0.94)">
      <PeepFigure height={72} Component={StandingPersonB} />
    </g>
    <g transform="translate(24 4) scale(0.8)">
      <PeepFigure height={72} Component={StandingPersonA} />
    </g>
  </g>
);

// Cuplu în mișcare — poză de mers (Open Peeps "Walking"), în oglindă, ca
// să sugereze dinamism real, nu doar o rotire a poziției statice.
const Dancers = () => (
  <g>
    <g transform="translate(-10 2)">
      <PeepFigure height={72} Component={WalkingPerson} />
    </g>
    <g transform="translate(10 2) scale(-1 1)">
      <PeepFigure height={72} Component={WalkingPerson} />
    </g>
  </g>
);

// Invitat așezat la o masă rotundă simplă.
const GuestAtTable = () => (
  <g>
    <g transform="translate(-10 10) scale(0.85)">
      <PeepFigure height={60} Component={SittingPerson} />
    </g>
    <g className="cls-1" transform="translate(8 30)">
      {/* blat de masă */}
      <rect x={-11} y={-1.2} width={22} height={2.4} rx={1.2} />
      {/* picior central */}
      <rect x={-1} y={1.2} width={2} height={9} />
      {/* bază */}
      <rect x={-6} y={9.8} width={12} height={1.6} rx={0.8} />
    </g>
  </g>
);

// Inel de logodnă — bandă (inel plin, decupat la mijloc via evenodd) + o
// piatră mică (diamant) deasupra.
const EngagementRing = () => {
  const cx = 0;
  const cy = 4.2;
  const outerR = 1.9;
  const innerR = 1.3;
  const ring = (r: number) =>
    `M ${cx - r},${cy} A ${r},${r} 0 1,0 ${cx + r},${cy} A ${r},${r} 0 1,0 ${cx - r},${cy} Z`;
  return (
    <g className="cls-1">
      <path fillRule="evenodd" d={`${ring(outerR)} ${ring(innerR)}`} />
      <polygon
        points={`${cx},${cy - outerR - 1.6} ${cx - 0.9},${cy - outerR - 0.7} ${cx},${cy - outerR + 0.1} ${cx + 0.9},${cy - outerR - 0.7}`}
      />
    </g>
  );
};

// Buchet de flori — câteva "flori" (cercuri mici) grupate deasupra unui
// mănunchi de tulpini (formă triunghiulară).
const Bouquet = () => (
  <g className="cls-1">
    <path d="M -1.6,15 L 1.6,15 L 0.6,7.5 L -0.6,7.5 Z" />
    <circle cx={-2.6} cy={5.4} r={1.7} />
    <circle cx={0} cy={4.2} r={2} />
    <circle cx={2.6} cy={5.4} r={1.7} />
    <circle cx={-1.3} cy={2.6} r={1.4} />
    <circle cx={1.3} cy={2.6} r={1.4} />
  </g>
);

// Ceas de mână — cadran rotund + o curea simplă sus și jos.
const Watch = () => (
  <g className="cls-1">
    <rect x={-0.9} y={0.2} width={1.8} height={2} rx={0.4} />
    <rect x={-0.9} y={4.6} width={1.8} height={2} rx={0.4} />
    <circle cx={0} cy={3.8} r={1.9} />
    <circle cx={0} cy={3.8} r={1.1} fill="#fff" fillOpacity={0.35} />
  </g>
);

const SmallDogGraphic = () => <QuadrupedPictogram height={20} ears="dog" />;
const MediumDogGraphic = () => <QuadrupedPictogram height={30} ears="dog" />;
const LargeDogGraphic = () => <QuadrupedPictogram height={40} ears="dog" />;
const CatGraphic = () => <QuadrupedPictogram height={19} ears="cat" />;

// SUBJECTS is shared by App and this component; keeping it here avoids moving
// the large inline SVG paths into a separate module. `category` is used to
// group the subject dropdown in App.tsx (Portret / Nuntă-Eveniment /
// Produs-Macro / Animale).
// eslint-disable-next-line react-refresh/only-export-components
export const SUBJECTS = {
  "Persoană": {
    graphic: PersonGraphic,
    height: 72,
    category: "portret" as const,
    dynamic: false,
  },
  "Persoană la Birou": {
    graphic: PersonAtDeskGraphic,
    height: 54,
    category: "portret" as const,
    dynamic: false,
  },
  "Cuplu de Miri": {
    graphic: BrideAndGroom,
    height: 72,
    category: "eveniment" as const,
    dynamic: false,
  },
  "Grup de Oameni": {
    graphic: GroupOfPeople,
    height: 72,
    category: "eveniment" as const,
    dynamic: false,
  },
  "Dansatori": {
    graphic: Dancers,
    height: 72,
    category: "eveniment" as const,
    // Subiect in miscare — diagrama adauga linii de miscare (motion streaks).
    dynamic: true,
  },
  "Invitat la Masă": {
    graphic: GuestAtTable,
    height: 60,
    category: "eveniment" as const,
    dynamic: false,
  },
  "Inel de Logodnă": {
    graphic: EngagementRing,
    height: 6,
    category: "produs" as const,
    dynamic: false,
  },
  "Buchet de Flori": {
    graphic: Bouquet,
    height: 16,
    category: "produs" as const,
    dynamic: false,
  },
  "Ceas": {
    graphic: Watch,
    height: 6,
    category: "produs" as const,
    dynamic: false,
  },
  "Câine Mic": {
    graphic: SmallDogGraphic,
    height: 20,
    category: "animal" as const,
    dynamic: false,
  },
  "Câine Mediu": {
    graphic: MediumDogGraphic,
    height: 30,
    category: "animal" as const,
    dynamic: false,
  },
  "Câine Mare": {
    graphic: LargeDogGraphic,
    height: 40,
    category: "animal" as const,
    dynamic: false,
  },
  "Pisică": {
    graphic: CatGraphic,
    height: 19,
    category: "animal" as const,
    dynamic: false,
  },
};

// Colțuri de confirmare focus — ca marcajele de focalizare manuală dintr-un
// vizor de camera cinema (RED/ARRI) — apar doar pe subiectul aflat efectiv
// in cadru (in interiorul conului de vizualizare).
function FocusFrame({ height, color }: { height: number; color: string }) {
  const halfW = height * 0.24;
  const arm = height * 0.09;
  const top = -height * 0.06;
  const bottom = height * 1.04;
  const left = -halfW - height * 0.04;
  const right = halfW + height * 0.04;
  return (
    <g stroke={color} strokeWidth={height * 0.012} fill="none" strokeLinecap="round" opacity={0.85}>
      <path d={`M ${left},${top + arm} L ${left},${top} L ${left + arm},${top}`} />
      <path d={`M ${right - arm},${top} L ${right},${top} L ${right},${top + arm}`} />
      <path d={`M ${left},${bottom - arm} L ${left},${bottom} L ${left + arm},${bottom}`} />
      <path d={`M ${right - arm},${bottom} L ${right},${bottom} L ${right},${bottom - arm}`} />
    </g>
  );
}

// Linii de mișcare (motion streaks) — dinamism vectorial pur, fără artă
// figurativă suplimentară, pentru subiecte marcate "dynamic" (ex: dansatori).
function MotionStreaks({ height, color }: { height: number; color: string }) {
  return (
    <g stroke={color} strokeLinecap="round" opacity={0.55}>
      {[0, 1, 2].map((i) => {
        const y = height * (0.28 + i * 0.13);
        const len = height * (0.26 - i * 0.05);
        const xStart = -height * (0.36 + i * 0.05);
        return (
          <line
            key={i}
            x1={xStart}
            y1={y}
            x2={xStart + len}
            y2={y}
            strokeWidth={height * 0.012}
            opacity={0.55 - i * 0.14}
          />
        );
      })}
    </g>
  );
}

function findXAtY(
  x: number,
  y: number,
  angle: number,
  targetY: number
): number {
  const angleRadians = angle * (Math.PI / 180);
  const slope = Math.tan(angleRadians);
  return ((targetY - y) / slope + x) * -1;
}

function findYAtX(
  x: number,
  _y: number,
  angle: number,
  targetX: number
): number {
  const angleRadians = angle * (Math.PI / 180);
  const slope = Math.tan(angleRadians);
  return slope * (targetX - x);
}

function buildViewPath(
  x: number,
  y: number,
  verticalFieldOfView: number,
  farDistanceInInches: number,
  height: number
) {
  let path = `M${x},${y - 1}`;

  const topRayIntercept = findXAtY(x, y, verticalFieldOfView / 2, 0);
  if (topRayIntercept < farDistanceInInches) {
    path += ` L${topRayIntercept},0 L${farDistanceInInches},0`;
  } else {
    const topRayInterceptY = findYAtX(
      x,
      y,
      verticalFieldOfView / 2,
      farDistanceInInches
    );
    path += ` L${farDistanceInInches},${y - topRayInterceptY}`;
  }
  path += ` L${farDistanceInInches},${y}`;

  const bottomRayIntercept = findXAtY(x, y, -verticalFieldOfView / 2, height);
  if (bottomRayIntercept < farDistanceInInches) {
    path += ` L${farDistanceInInches},${height} L${bottomRayIntercept},${height}`;
  } else {
    const bottomRayInterceptY = findYAtX(
      x,
      y,
      -(verticalFieldOfView / 2),
      farDistanceInInches
    );
    path += ` L${farDistanceInInches},${y + -bottomRayInterceptY}`;
  }

  path += ` L${x},${y + 1} Z`;

  return path;
}

export default function PhotographyGraphic({
  distanceToSubjectInInches,
  nearFocalPointInInches,
  farFocalPointInInches,
  farDistanceInInches,
  subject,
  focalLength,
  aperture,
  apertureUnitPrefix = "f",
  system,
  verticalFieldOfView,
  textColor,
  onChangeDistance,
}: {
  distanceToSubjectInInches: number;
  nearFocalPointInInches: number;
  farFocalPointInInches: number;
  farDistanceInInches: number;
  focalLength: number;
  aperture: number;
  apertureUnitPrefix?: string;
  system: string;
  verticalFieldOfView: number;
  textColor?: string;
  subject: keyof typeof SUBJECTS;
  onChangeDistance?: (distance: number) => void;
}) {
  const convertUnits = system === "Imperial" ? toImperial : toMetric;

  const svgRef = useRef<SVGSVGElement>(null);
  const mouseDownRef = useRef(false);
  function onMouseDown() {
    mouseDownRef.current = true;
  }
  function onMouseUp() {
    mouseDownRef.current = false;
  }
  function onMouseMove(evt: React.MouseEvent<SVGSVGElement, MouseEvent>) {
    if (mouseDownRef.current) {
      const pt = svgRef.current!.createSVGPoint(); // Created once for document

      pt.x = evt.clientX;
      pt.y = evt.clientY;

      const cursorpt = pt.matrixTransform(
        svgRef.current!.getScreenCTM()!.inverse()
      );
      const x = Math.max(5, Math.min(farDistanceInInches, cursorpt.x));
      onChangeDistance?.(x);
    }
  }

  const SubjectGraphic = SUBJECTS[subject].graphic;
  const height = SUBJECTS[subject].height;
  const isDynamicSubject = SUBJECTS[subject].dynamic;
  const textFill = textColor ?? "currentColor";
  const clippedTextFill = "#1A202C";
  const shouldShowVerticalLabels =
    farFocalPointInInches - nearFocalPointInInches > 18;

  function renderVerticalDistanceLabels(fill: string) {
    return (
      <>
        <text
          fill={fill}
          fontSize={3}
          textAnchor="start"
          transform={`translate(${nearFocalPointInInches - 0.5} ${
            height - 1
          }) rotate(-90)`}
        >
          {convertUnits(nearFocalPointInInches, 0)}
        </text>
        <text
          fill={fill}
          fontSize={3}
          textAnchor="start"
          transform={`translate(${farFocalPointInInches + 0.5} 1) rotate(90)`}
        >
          {convertUnits(farFocalPointInInches, 0)}
        </text>
      </>
    );
  }

  const viewPath = buildViewPath(
    0,
    14.3,
    verticalFieldOfView,
    farDistanceInInches,
    height
  );

  // Perspectivă reală: subiectul se scalează în funcție de distanță (mai aproape = mai
  // mare), ancorat la 6ft (72in) = scară 1. Fără asta, personajul rămâne mereu aceeași
  // mărime indiferent unde e plasat pe axă — de-aici senzația de "carton lipit".
  const REFERENCE_DISTANCE = 72;
  const subjectScale = clampNumber(
    Math.sqrt(REFERENCE_DISTANCE / Math.max(distanceToSubjectInInches, 8)),
    0.45,
    1.6
  );

  return (
    <svg
      ref={svgRef}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`-43.5 0 ${farDistanceInInches} ${height + 12}`}
      style={{ width: "100%", height: "auto", color: textColor, touchAction: "none" }}
    >
      <defs>
        <style>
          {`
.cls-1 {
  stroke-width: 0px;
}
`}
        </style>
        <clipPath id="fov">
          <path d={viewPath} />
        </clipPath>
        <linearGradient id="dofZone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={ACCENT} stopOpacity={0} />
          <stop offset="18%" stopColor={ACCENT} stopOpacity={0.55} />
          <stop offset="50%" stopColor={ACCENT} stopOpacity={0.85} />
          <stop offset="82%" stopColor={ACCENT} stopOpacity={0.55} />
          <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Conul câmpului vizual al obiectivului — fundal, o singură dată */}
      <path d={viewPath} fill={ACCENT} fillOpacity={0.05} />

      {/* Linia de sol / axa distanței */}
      <line
        x1={0}
        y1={height}
        x2={farDistanceInInches}
        y2={height}
        stroke={GROUND_LINE}
        strokeWidth={0.25}
      />

      {/* Zona de profunzime de câmp — bandă cu tranziție graduală (nu bloc plat),
          reflectă optic faptul că trecerea spre neclar e progresivă, nu abruptă. */}
      <MotionRect
        y={0}
        height={height}
        fill="url(#dofZone)"
        initial={false}
        animate={{
          x: nearFocalPointInInches,
          width: Math.max(farFocalPointInInches - nearFocalPointInInches, 0.01),
        }}
        transition={SPRING}
      />

      <MotionLine
        y1={height + 8}
        y2={height + 8}
        stroke={ACCENT}
        strokeWidth={0.4}
        initial={false}
        animate={{ x1: nearFocalPointInInches, x2: farFocalPointInInches }}
        transition={SPRING}
      />
      <MotionLine
        x1={nearFocalPointInInches}
        x2={nearFocalPointInInches}
        y1={height + 6.5}
        y2={height + 9.5}
        stroke={ACCENT}
        strokeWidth={0.4}
        initial={false}
        animate={{ x1: nearFocalPointInInches, x2: nearFocalPointInInches }}
        transition={SPRING}
      />
      <MotionLine
        x1={farFocalPointInInches}
        x2={farFocalPointInInches}
        y1={height + 6.5}
        y2={height + 9.5}
        stroke={ACCENT}
        strokeWidth={0.4}
        initial={false}
        animate={{ x1: farFocalPointInInches, x2: farFocalPointInInches }}
        transition={SPRING}
      />
      <text
        x={
          nearFocalPointInInches +
          (farFocalPointInInches - nearFocalPointInInches) / 2
        }
        y={height + 10.7}
        fill={ACCENT}
        fontFamily="'JetBrains Mono', monospace"
        fontSize={3}
        textAnchor="middle"
      >
        {convertUnits(farFocalPointInInches - nearFocalPointInInches)}
      </text>

      <text
        x={-1}
        y={5}
        fill={textFill}
        fontFamily="'JetBrains Mono', monospace"
        fontSize={4}
        fontWeight="bold"
        textAnchor="end"
      >
        {focalLength}mm {apertureUnitPrefix}/{aperture}
      </text>

      {shouldShowVerticalLabels && renderVerticalDistanceLabels(textFill)}
      <text
        x={distanceToSubjectInInches}
        y={height + 3.5}
        fill={textFill}
        fontFamily="'JetBrains Mono', monospace"
        fontSize={3}
        textAnchor="middle"
      >
        {convertUnits(distanceToSubjectInInches, 0)}
      </text>

      {/* Subiect — o singură randare, cu scalare de perspectivă + tranziție lină
          (spring) la orice schimbare de distanță; culoare plină în interiorul
          conului de vizualizare, estompat în afara lui. */}
      <MotionG
        initial={false}
        animate={{ x: distanceToSubjectInInches, scale: subjectScale }}
        transition={SPRING}
        style={{ transformOrigin: `0px ${height}px` }}
        fill={SUBJECT_DIM}
      >
        <SubjectGraphic />
      </MotionG>
      <g clipPath="url(#fov)">
        <MotionG
          initial={false}
          animate={{ x: distanceToSubjectInInches, scale: subjectScale }}
          transition={SPRING}
          style={{ transformOrigin: `0px ${height}px` }}
          fill={ACCENT}
        >
          {isDynamicSubject && <MotionStreaks height={height} color={ACCENT} />}
          <SubjectGraphic />
          <FocusFrame height={height} color={ACCENT} />
        </MotionG>
        {shouldShowVerticalLabels && renderVerticalDistanceLabels(clippedTextFill)}
      </g>

      <MotionLine
        y1={0}
        y2={height}
        stroke={ACCENT}
        strokeWidth={0.25}
        strokeDasharray="1.2 1"
        initial={false}
        animate={{ x1: distanceToSubjectInInches, x2: distanceToSubjectInInches }}
        transition={SPRING}
      />
    </svg>
  );
}
