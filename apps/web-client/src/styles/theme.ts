export const theme = {
  colors: {
    primary: "#111827",
    primaryHover: "#020617",

    background: "#f3f4f6",
    surface: "#ffffff",
    surfaceMuted: "#f9fafb",

    border: "#e5e7eb",
    borderStrong: "#d1d5db",

    text: "#111827",
    textMuted: "#6b7280",
    textSoft: "#4b5563",

    success: "#166534",
    successBg: "#dcfce7",
    successBorder: "#bbf7d0",

    danger: "#991b1b",
    dangerBg: "#fef2f2",
    dangerBorder: "#fecaca",

    warning: "#92400e",
    warningBg: "#fffbeb",
    warningBorder: "#fde68a",

    info: "#1d4ed8",
    infoBg: "#eff6ff",
    infoBorder: "#bfdbfe",

    white: "#ffffff"
  },

  radii: {
    sm: "8px",
    md: "12px",
    lg: "18px",
    xl: "24px",
    pill: "999px"
  },

  shadows: {
    card: "0 10px 30px rgba(15, 23, 42, 0.06)",
    soft: "0 4px 16px rgba(15, 23, 42, 0.06)"
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "48px"
  }
};

export type AppTheme = typeof theme;
