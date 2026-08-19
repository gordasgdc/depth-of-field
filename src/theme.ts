import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Design system consecvent cu restul portofoliului GDC (gordas.dev):
// fundal antracit, accent verde-teal, tipografie tehnica Space Grotesk / JetBrains Mono.
const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: "#E9FDF5",
    100: "#C3F9E1",
    200: "#8FF0C6",
    300: "#5CE7AC",
    400: "#34E8A0",
    500: "#22C98A",
    600: "#17A672",
    700: "#0F805A",
    800: "#0A5B41",
    900: "#063829",
  },
  ink: {
    50: "#E7ECEE",
    100: "#C9D1D5",
    200: "#9FACB2",
    300: "#7C8790",
    400: "#5A646C",
    500: "#3A424A",
    600: "#232A30",
    700: "#171C21",
    800: "#12161A",
    900: "#0A0C0E",
  },
};

const fonts = {
  heading: `'Space Grotesk', 'Inter', system-ui, sans-serif`,
  body: `'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif`,
  mono: `'JetBrains Mono', 'SF Mono', monospace`,
};

const styles = {
  global: {
    "html, body": {
      backgroundColor: "ink.900",
      color: "ink.50",
    },
    "#root": {
      backgroundColor: "ink.900",
      minHeight: "100vh",
    },
    "::selection": {
      backgroundColor: "rgba(52,232,160,0.28)",
    },
  },
};

const radii = {
  sm: "2px",
  md: "3px",
  lg: "4px",
  xl: "6px",
};

const shadows = {
  outline: "0 0 0 2px rgba(52,232,160,0.45)",
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: 500,
      borderRadius: "sm",
      letterSpacing: "0.01em",
    },
    variants: {
      solid: {
        bg: "brand.400",
        color: "ink.900",
        _hover: { bg: "brand.300", _disabled: { bg: "brand.400" } },
        _active: { bg: "brand.500" },
      },
      outline: {
        borderColor: "ink.600",
        color: "ink.50",
        _hover: { bg: "ink.700", borderColor: "brand.400" },
      },
      ghost: {
        color: "ink.200",
        _hover: { bg: "ink.700", color: "ink.50" },
      },
    },
  },
  Badge: {
    baseStyle: {
      borderRadius: "sm",
      fontFamily: "mono",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      fontSize: "10px",
    },
  },
  Slider: {
    baseStyle: {
      thumb: { bg: "brand.400", borderRadius: "sm" },
      filledTrack: { bg: "brand.400" },
      track: { bg: "ink.600" },
    },
  },
  Switch: {
    baseStyle: {
      track: { _checked: { bg: "brand.400" } },
    },
  },
  Select: {
    baseStyle: {
      field: { borderRadius: "sm" },
    },
  },
  Modal: {
    baseStyle: {
      dialog: { bg: "ink.800", borderRadius: "md", borderWidth: "1px", borderColor: "ink.600" },
    },
  },
  Divider: {
    baseStyle: { borderColor: "ink.600" },
  },
};

export const theme = extendTheme({ config, colors, fonts, styles, radii, shadows, components });
