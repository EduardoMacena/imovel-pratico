"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background:
      radial-gradient(circle at 10% 0%, rgba(200, 164, 93, 0.13), transparent 28%),
      radial-gradient(circle at 88% 10%, rgba(15, 76, 92, 0.13), transparent 30%),
      linear-gradient(180deg, ${({ theme }) => theme.colors.background} 0%, ${({ theme }) => theme.colors.backgroundSoft} 100%);
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    text-rendering: geometricPrecision;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    border: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  ::selection {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.accentSoft};
  }
`;
