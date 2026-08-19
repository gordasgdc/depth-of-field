import {
  Box,
  Flex,
  Icon,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useColorModeValue,
} from "@chakra-ui/react";
import { TbTable } from "react-icons/tb";
import type { Lang } from "../i18n";
import { translateInfluencers } from "../translations/influencers";

// Tabel 100% derivat din starea locală (aperture, focalLength, distanță) —
// nimic nu vine de pe server, se recalculează instant la fiecare slider.
export default function ComparisonTable({
  language,
  apertureUnitPrefix,
  aperture,
  focalLengthInMillimeters,
  distanceLabel,
}: {
  language: Lang;
  apertureUnitPrefix: string;
  aperture: number;
  focalLengthInMillimeters: number;
  distanceLabel: string;
}) {
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const headingColor = useColorModeValue("gray.700", "gray.100");

  const ti = (key: string, vars?: Record<string, string | number>) =>
    translateInfluencers(language, key, vars);

  const rows = [
    {
      factor: ti(apertureUnitPrefix === "T" ? "factor1TitleVideo" : "factor1TitlePhoto"),
      current: `${apertureUnitPrefix}/${aperture}`,
      increase: ti("rowApertureIncrease", { prefix: apertureUnitPrefix }),
      decrease: ti("rowApertureDecrease", { prefix: apertureUnitPrefix }),
      effect: ti("rowApertureEffect"),
    },
    {
      factor: ti("factor2Title"),
      current: `${focalLengthInMillimeters}mm`,
      increase: ti("rowFocalIncrease"),
      decrease: ti("rowFocalDecrease"),
      effect: ti("rowFocalEffect"),
    },
    {
      factor: ti("factor3Title"),
      current: distanceLabel,
      increase: ti("rowDistanceIncrease"),
      decrease: ti("rowDistanceDecrease"),
      effect: ti("rowDistanceEffect"),
    },
  ];

  return (
    <Box mt={4} p={4} rounded="lg" bg={cardBg} border="1px" borderColor={borderColor}>
      <Flex align="center" gap={2} mb={3}>
        <Icon as={TbTable} boxSize={4} color={headingColor} />
        <Text fontWeight="bold" fontSize="sm" color={headingColor}>
          {ti("tableTitle")}
        </Text>
      </Flex>
      <TableContainer>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>{ti("colFactor")}</Th>
              <Th>{ti("colCurrent")}</Th>
              <Th display={{ base: "none", md: "table-cell" }}>{ti("colIncrease")}</Th>
              <Th display={{ base: "none", md: "table-cell" }}>{ti("colDecrease")}</Th>
              <Th display={{ base: "none", lg: "table-cell" }}>{ti("colEffect")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((row) => (
              <Tr key={row.factor}>
                <Td fontWeight="semibold" fontSize="xs">
                  {row.factor}
                </Td>
                <Td fontSize="xs">
                  <Text as="span" fontWeight="bold">
                    {row.current}
                  </Text>
                </Td>
                <Td fontSize="xs" color={mutedText} display={{ base: "none", md: "table-cell" }}>
                  {row.increase}
                </Td>
                <Td fontSize="xs" color={mutedText} display={{ base: "none", md: "table-cell" }}>
                  {row.decrease}
                </Td>
                <Td fontSize="xs" color={mutedText} display={{ base: "none", lg: "table-cell" }}>
                  {row.effect}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
