import { useCallback, useRef, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

// Inel de obiectiv interactiv (control prin rotire, mouse/touch unificat prin
// Pointer Events). Reutilizabil pentru diafragma si distanta de focalizare —
// scale "log" reproduce spatierea reala de pe un inel de diafragma optic
// (fiecare stop = acelasi unghi, la fel ca pe un obiectiv fizic).
export type LensRingProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  marks: number[];
  scale?: "log" | "linear";
  formatMark?: (value: number) => string;
  formatCenter?: (value: number) => string;
  label?: string;
  size?: number;
  accentColor?: string;
};

const SWEEP_START = -135; // grade, fata de "sus" (12 fix)
const SWEEP_RANGE = 270; // deschidere totala a inelului (lasa un gol jos, ca la un obiectiv real)

function toScaleSpace(value: number, scale: "log" | "linear") {
  return scale === "log" ? Math.log2(value) : value;
}
function fromScaleSpace(value: number, scale: "log" | "linear") {
  return scale === "log" ? Math.pow(2, value) : value;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

function angleForValue(
  value: number,
  min: number,
  max: number,
  scale: "log" | "linear"
) {
  const lo = toScaleSpace(min, scale);
  const hi = toScaleSpace(max, scale);
  const v = toScaleSpace(clamp(value, min, max), scale);
  const t = (v - lo) / (hi - lo);
  return SWEEP_START + t * SWEEP_RANGE;
}

function valueForAngle(
  angle: number,
  min: number,
  max: number,
  scale: "log" | "linear"
) {
  const lo = toScaleSpace(min, scale);
  const hi = toScaleSpace(max, scale);
  const t = clamp((angle - SWEEP_START) / SWEEP_RANGE, 0, 1);
  return fromScaleSpace(lo + t * (hi - lo), scale);
}

// Normalizeaza un unghi in intervalul (-180, 180], ca sa nu avem salturi
// false la trecerea prin +/-180 in timpul unei rotiri continue.
function normalizeAngle(angle: number) {
  let a = angle % 360;
  if (a > 180) a -= 360;
  if (a <= -180) a += 360;
  return a;
}

export default function LensRing({
  value,
  onChange,
  min,
  max,
  marks,
  scale = "linear",
  formatMark = (v) => String(v),
  formatCenter = (v) => String(v),
  label,
  size = 168,
  accentColor = "#34E8A0",
}: LensRingProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef<{
    pointerStartAngle: number;
    ringStartAngle: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const ringAngle = angleForValue(value, min, max, scale);
  const R = 74;
  const CENTER = 90;

  const getPointerAngle = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    return (Math.atan2(dx, -dy) * 180) / Math.PI; // 0 = sus, sensul acelor de ceasornic
  }, []);

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    (e.target as Element).setPointerCapture(e.pointerId);
    draggingRef.current = {
      pointerStartAngle: getPointerAngle(e.clientX, e.clientY),
      ringStartAngle: ringAngle,
    };
    setIsDragging(true);
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = draggingRef.current;
    if (!drag) return;
    const current = getPointerAngle(e.clientX, e.clientY);
    const delta = normalizeAngle(current - drag.pointerStartAngle);
    const nextAngle = clamp(
      drag.ringStartAngle + delta,
      SWEEP_START,
      SWEEP_START + SWEEP_RANGE
    );
    onChange(valueForAngle(nextAngle, min, max, scale));
  }

  function endDrag(e: React.PointerEvent<SVGSVGElement>) {
    if (draggingRef.current) {
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
    draggingRef.current = null;
    setIsDragging(false);
  }

  // Textura de "knurling" (zimti de prindere) de pe marginea inelului —
  // pur decorativa, sugereaza un obiectiv fizic.
  const knurls = Array.from({ length: 56 }, (_, i) => (i / 56) * 360);

  return (
    <Box userSelect="none">
      {label && (
        <Text fontSize="xs" color="ink.300" textAlign="center" mb={1} letterSpacing="0.04em" textTransform="uppercase">
          {label}
        </Text>
      )}
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
        style={{ touchAction: "none", cursor: isDragging ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {/* corpul obiectivului (fix) */}
        <circle cx={CENTER} cy={CENTER} r={R + 12} fill="#171C21" stroke="#232A30" strokeWidth={1.5} />
        <circle cx={CENTER} cy={CENTER} r={R - 20} fill="#0A0C0E" stroke="#232A30" strokeWidth={1} />

        {/* index fix — reperul care indica valoarea curenta */}
        <polygon
          points={`${CENTER - 3},${CENTER - R - 13} ${CENTER + 3},${CENTER - R - 13} ${CENTER},${CENTER - R - 6}`}
          fill={accentColor}
        />

        {/* inelul rotativ, cu zimti + marcaje gravate */}
        <g transform={`rotate(${ringAngle} ${CENTER} ${CENTER})`}>
          {knurls.map((a) => (
            <line
              key={a}
              x1={CENTER}
              y1={CENTER - R - 10}
              x2={CENTER}
              y2={CENTER - R - 5}
              stroke="#3A424A"
              strokeWidth={1}
              transform={`rotate(${a} ${CENTER} ${CENTER})`}
            />
          ))}
          <circle cx={CENTER} cy={CENTER} r={R} fill="none" stroke="#2B3238" strokeWidth={14} />
          {marks.map((m) => {
            const a = angleForValue(m, min, max, scale) - ringAngle;
            const isActive = Math.abs(m - value) <= (max - min) * 0.012;
            return (
              <g key={m} transform={`rotate(${a} ${CENTER} ${CENTER})`}>
                <line
                  x1={CENTER}
                  y1={CENTER - R - 7}
                  x2={CENTER}
                  y2={CENTER - R + 7}
                  stroke={isActive ? accentColor : "#5A646C"}
                  strokeWidth={isActive ? 1.4 : 1}
                />
                <text
                  x={CENTER}
                  y={CENTER - R + 17}
                  fill={isActive ? accentColor : "#9FACB2"}
                  fontSize={7.5}
                  fontFamily="'JetBrains Mono', monospace"
                  textAnchor="middle"
                  transform={`rotate(${-(a + ringAngle)} ${CENTER} ${CENTER - R + 17})`}
                >
                  {formatMark(m)}
                </text>
              </g>
            );
          })}
        </g>

        {/* citire centrala, mereu dreapta, indiferent de rotire */}
        <text
          x={CENTER}
          y={CENTER + 5}
          fill={accentColor}
          fontSize={15}
          fontWeight={600}
          fontFamily="'JetBrains Mono', monospace"
          textAnchor="middle"
        >
          {formatCenter(value)}
        </text>
      </svg>
    </Box>
  );
}
