import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "./providers";
import { StyledComponentsRegistry } from "./registry";

export const metadata: Metadata = {
  title: "Imóvel Prático | Captação imobiliária inteligente",
  description:
    "Plataforma premium para imobiliárias automatizarem prospecção, localização de proprietários e organização de oportunidades.",
  keywords: [
    "imobiliária",
    "captação imobiliária",
    "prospecção imobiliária",
    "automação imobiliária",
    "Imóvel Prático",
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
