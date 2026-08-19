import { useState } from "react";
import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  Icon,
  IconButton,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { TbAperture, TbZoomIn, TbRuler, TbX, TbFocus2 } from "react-icons/tb";
import type { Lang } from "../i18n";
import { translateInfluencers } from "../translations/influencers";

// Cheie localStorage — la fel ca restul persistenței din aplicație, complet
// client-side, fără niciun server.
const PANEL_CLOSED_STORAGE_KEY = "dof-influencers-panel-closed-v1";

export default function InfluencersPanel({
  language,
  apertureUnitPrefix,
}: {
  language: Lang;
  apertureUnitPrefix: string;
}) {
  const [isClosed, setIsClosed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(PANEL_CLOSED_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.700", "gray.100");

  // Precalculăm perechile bg/border pentru cele 3 culori folosite mai jos —
  // hook-urile Chakra nu pot fi apelate în interiorul unui .map().
  const blueBg = useColorModeValue("blue.50", "blue.900");
  const blueBorder = useColorModeValue("blue.200", "blue.700");
  const greenBg = useColorModeValue("green.50", "green.900");
  const greenBorder = useColorModeValue("green.200", "green.700");
  const orangeBg = useColorModeValue("orange.50", "orange.900");
  const orangeBorder = useColorModeValue("orange.200", "orange.700");

  const ti = (key: string, vars?: Record<string, string | number>) =>
    translateInfluencers(language, key, vars);

  function closePanel() {
    setIsClosed(true);
    try {
      window.localStorage.setItem(PANEL_CLOSED_STORAGE_KEY, "true");
    } catch {
      // localStorage indisponibil — ignorăm, panoul rămâne doar închis pentru sesiunea curentă
    }
  }

  function reopenPanel() {
    setIsClosed(false);
    try {
      window.localStorage.removeItem(PANEL_CLOSED_STORAGE_KEY);
    } catch {
      // ignorăm
    }
  }

  if (isClosed) {
    return (
      <Flex justify="center" pt={4}>
        <Button size="xs" variant="ghost" color={mutedText} onClick={reopenPanel}>
          {ti("panelReopen")}
        </Button>
      </Flex>
    );
  }

  const factors = [
    {
      icon: TbAperture,
      color: "blue",
      bg: blueBg,
      border: blueBorder,
      title:
        apertureUnitPrefix === "T"
          ? ti("factor1TitleVideo")
          : ti("factor1TitlePhoto"),
      bullets: [
        ti("factor1Bullet1", { prefix: apertureUnitPrefix }),
        ti("factor1Bullet2", { prefix: apertureUnitPrefix }),
      ],
      effect: ti("factor1Effect", { prefix: apertureUnitPrefix }),
    },
    {
      icon: TbZoomIn,
      color: "green",
      bg: greenBg,
      border: greenBorder,
      title: ti("factor2Title"),
      bullets: [ti("factor2Bullet1"), ti("factor2Bullet2")],
      effect: ti("factor2Effect"),
    },
    {
      icon: TbRuler,
      color: "orange",
      bg: orangeBg,
      border: orangeBorder,
      title: ti("factor3Title"),
      bullets: [ti("factor3Bullet1"), ti("factor3Bullet2")],
      effect: ti("factor3Effect"),
    },
  ];

  return (
    <Box
      mt={4}
      p={4}
      rounded="lg"
      bg={cardBg}
      border="1px"
      borderColor={borderColor}
      position="relative"
    >
      <IconButton
        aria-label={ti("panelCloseAria")}
        icon={<Icon as={TbX} boxSize={3.5} />}
        size="xs"
        variant="ghost"
        position="absolute"
        top={2}
        right={2}
        onClick={closePanel}
      />
      <Flex align="center" gap={2} mb={1} pr={8}>
        <Icon as={TbFocus2} boxSize={4} color={headingColor} />
        <Text fontWeight="bold" fontSize="md" color={headingColor}>
          {ti("panelTitle")}
        </Text>
      </Flex>
      <Text fontSize="xs" color={mutedText} mb={4}>
        {ti("panelSubtitle")}
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
        {factors.map((factor) => (
          <Box
            key={factor.title}
            p={3}
            rounded="md"
            bg={factor.bg}
            border="1px"
            borderColor={factor.border}
          >
            <Flex align="center" gap={2} mb={2}>
              <Icon as={factor.icon} boxSize={5} color={`${factor.color}.500`} />
              <Text fontWeight="semibold" fontSize="sm">
                {factor.title}
              </Text>
            </Flex>
            {factor.bullets.map((bullet) => (
              <Text key={bullet} fontSize="xs" color={mutedText} mb={1}>
                • {bullet}
              </Text>
            ))}
            <Text fontSize="xs" fontWeight="semibold" mt={2}>
              {factor.effect}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
