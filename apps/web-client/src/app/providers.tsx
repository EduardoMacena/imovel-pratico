"use client";

import { ThemeProvider } from "styled-components";
import { StyledComponentsRegistry } from "./registry";
import { GlobalStyles } from "../styles/GlobalStyles";
import { theme } from "../styles/theme";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
