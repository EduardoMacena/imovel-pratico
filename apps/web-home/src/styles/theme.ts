export const theme = {
  colors: {
    background: "#F5F1E8",
    backgroundSoft: "#FBF8F1",
    surface: "#FFFFFF",
    surfaceMuted: "#F8F4EC",
    surfaceDark: "#071927",
    surfaceDarkSoft: "#0B2438",

    primary: "#0B1F33",
    primaryHover: "#102F4C",
    primarySoft: "#E7EEF4",

    secondary: "#0F4C5C",
    secondaryHover: "#126276",
    secondarySoft: "#E5F2F4",

    accent: "#C8A45D",
    accentHover: "#B68E43",
    accentSoft: "#F5EAD3",

    success: "#237A57",
    successBg: "#E7F5EE",
    successBorder: "#B7E2CD",

    warning: "#A36B00",
    warningBg: "#FFF4D8",
    warningBorder: "#F0D08A",

    danger: "#B42318",
    dangerBg: "#FEEDEC",
    dangerBorder: "#F5B5AF",

    text: "#102033",
    textMuted: "#5B6778",
    textSoft: "#8490A3",
    textInverted: "#FFFFFF",

    border: "#E3DDD1",
    borderStrong: "#CFC4B3",

    glowBlue: "rgba(15, 76, 92, 0.22)",
    glowGold: "rgba(200, 164, 93, 0.32)",
  },

  shadows: {
    card: "0 24px 70px rgba(11, 31, 51, 0.10)",
    cardHover: "0 32px 90px rgba(11, 31, 51, 0.16)",
    dark: "0 28px 90px rgba(0, 0, 0, 0.28)",
    glow: "0 0 80px rgba(200, 164, 93, 0.28)",
    button: "0 16px 40px rgba(11, 31, 51, 0.20)",
  },

  radii: {
    sm: "10px",
    md: "16px",
    lg: "24px",
    xl: "34px",
    pill: "999px",
  },

  spacing: {
    xs: "8px",
    sm: "12px",
    md: "18px",
    lg: "28px",
    xl: "42px",
    "2xl": "64px",
    "3xl": "96px",
  },
} as const;
