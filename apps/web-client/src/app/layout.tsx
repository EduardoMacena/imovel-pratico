import type { Metadata } from "next";
import { Providers } from "./providers";
import { StyledComponentsRegistry } from "./registry";

export const metadata: Metadata = {
	title: "Imóvel Prático",
	description: "Busque proprietários de imóveis com rapidez e organização",
  icons: {
    icon: [
      {
        url: "/favicon-dark.svg",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/favicon-light.svg",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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
