"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    scroll-behavior: smooth;
    background: ${({ theme }) => theme.colors.background};
  }

  body {
    min-height: 100%;
    margin: 0;
    background:
      radial-gradient(circle at top left, rgba(200, 164, 93, 0.16), transparent 30%),
      radial-gradient(circle at 80% 10%, rgba(15, 76, 92, 0.15), transparent 28%),
      ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family:
      Inter,
      ui-sans-serif,
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  a {
    color: inherit;
  }

  button,
  input,
  textarea,
  select {
    font: inherit;
  }

  ::selection {
    background: ${({ theme }) => theme.colors.accent};
    color: ${({ theme }) => theme.colors.primary};
  }
`;
