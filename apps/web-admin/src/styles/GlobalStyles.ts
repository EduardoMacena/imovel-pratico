"use client";

import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: Arial, Helvetica, sans-serif;
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
`;
