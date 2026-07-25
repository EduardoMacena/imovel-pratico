"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "styled-components";
import { GlobalStyles } from "../styles/global.styles";
import { theme } from "../styles/theme";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  );
}
