import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import { TbBulb } from "react-icons/tb";
import type { Lang } from "../i18n";
import { translateInfluencers } from "../translations/influencers";
import type { InfluencerTipKey } from "../hooks/useInfluencers";

// Sfatul e ales 100% local, în App.tsx, prin hook-ul useInfluencers (simplă
// aritmetică pe valorile curente) — nicio cerere de rețea implicată aici.
export default function PracticalTip({
  language,
  tipKey,
  apertureLabel,
  focalLengthInMillimeters,
  distanceLabel,
}: {
  language: Lang;
  tipKey: InfluencerTipKey;
  apertureLabel: string;
  focalLengthInMillimeters: number;
  distanceLabel: string;
}) {
  const bg = useColorModeValue("purple.50", "purple.900");
  const border = useColorModeValue("purple.200", "purple.700");
  const headingColor = useColorModeValue("purple.700", "purple.100");

  const ti = (key: string, vars?: Record<string, string | number>) =>
    translateInfluencers(language, key, vars);

  const tipText = (() => {
    switch (tipKey) {
      case "allShallow":
        return ti("tipAllShallow");
      case "allDeep":
        return ti("tipAllDeep");
      case "closeDistance":
        return ti("tipCloseDistance", { dist: distanceLabel });
      case "tele":
        return ti("tipTele", { mm: focalLengthInMillimeters });
      case "aperturePortrait":
        return ti("tipAperturePortrait", { ap: apertureLabel });
      default:
        return ti("tipNeutral");
    }
  })();

  return (
    <Box mt={4} p={3} rounded="lg" bg={bg} border="1px" borderColor={border}>
      <Flex align="center" gap={2} mb={1}>
        <Icon as={TbBulb} boxSize={4} color={headingColor} />
        <Text fontWeight="bold" fontSize="sm" color={headingColor}>
          {ti("tipTitle")}
        </Text>
      </Flex>
      <Text fontSize="sm">{tipText}</Text>
    </Box>
  );
}
