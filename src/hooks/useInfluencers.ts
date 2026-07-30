// Hook 100% client-side: primește valorile curente (deja calculate în App.tsx)
// și derivă, prin simplă aritmetică locală, ce prag e activ pentru fiecare
// factor și care sfat practic se potrivește. Nicio cerere de rețea, niciun
// API — doar comparații de numere.

export type InfluencerTipKey =
  | "allShallow"
  | "allDeep"
  | "closeDistance"
  | "tele"
  | "aperturePortrait"
  | "neutral";

export type ComparisonRowKey = "aperture" | "focalLength" | "distance";

export interface UseInfluencersResult {
  isShallowAperture: boolean;
  isDeepAperture: boolean;
  isTele: boolean;
  isWide: boolean;
  isCloseDistance: boolean;
  isFarDistance: boolean;
  tipKey: InfluencerTipKey;
}

export function useInfluencers(
  aperture: number,
  focalLengthInMillimeters: number,
  distanceToSubjectInInches: number
): UseInfluencersResult {
  const distanceInMeters = distanceToSubjectInInches * 0.0254;

  const isShallowAperture = aperture <= 2.8;
  const isDeepAperture = aperture >= 11;
  const isTele = focalLengthInMillimeters >= 85;
  const isWide = focalLengthInMillimeters <= 28;
  const isCloseDistance = distanceInMeters < 2;
  const isFarDistance = distanceInMeters > 10;

  let tipKey: InfluencerTipKey = "neutral";
  if (isShallowAperture && isTele && isCloseDistance) {
    tipKey = "allShallow";
  } else if (isDeepAperture && isWide && isFarDistance) {
    tipKey = "allDeep";
  } else if (isCloseDistance) {
    tipKey = "closeDistance";
  } else if (isTele) {
    tipKey = "tele";
  } else if (isShallowAperture) {
    tipKey = "aperturePortrait";
  }

  return {
    isShallowAperture,
    isDeepAperture,
    isTele,
    isWide,
    isCloseDistance,
    isFarDistance,
    tipKey,
  };
}
