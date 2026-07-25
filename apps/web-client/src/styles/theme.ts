export const theme = {
  colors: {
    background: "#F4F1EA",
    backgroundSoft: "#FAF8F3",

    surface: "#FFFFFF",
    surfaceMuted: "#F7F4EE",
    surfaceDark: "#07111F",

    primary: "#0B1F33",
    primaryHover: "#102B45",
    primarySoft: "#E8EEF4",

    secondary: "#1F6F5B",
    secondaryHover: "#185846",
    secondarySoft: "#E5F3EF",

    accent: "#C8A45D",
    accentHover: "#B38F49",
    accentSoft: "#F6EEDC",

    text: "#172033",
    textMuted: "#6B7280",
    textSoft: "#9CA3AF",
    textInverted: "#FFFFFF",

    border: "#E3DED3",
    borderStrong: "#CFC7B8",

    danger: "#B42318",
    dangerBg: "#FEE4E2",
    dangerBorder: "#FECDCA",

    success: "#027A48",
    successBg: "#D1FADF",
    successBorder: "#A6F4C5",

    warning: "#B54708",
    warningBg: "#FEF0C7",
    warningBorder: "#FEDF89",

    info: "#175CD3",
    infoBg: "#D1E9FF",
    infoBorder: "#84CAFF",
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },

  radii: {
    sm: "10px",
    md: "14px",
    lg: "20px",
    xl: "28px",
    pill: "999px",
  },

  shadows: {
    card: "0 18px 45px rgba(15, 23, 42, 0.08)",
    cardHover: "0 24px 60px rgba(15, 23, 42, 0.12)",
    header: "0 12px 30px rgba(15, 23, 42, 0.08)",
    button: "0 12px 24px rgba(11, 31, 51, 0.18)",
  },

  typography: {
    fontFamily:
      "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
} as const;

export type AppTheme = typeof theme;
