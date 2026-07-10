import type { Metadata } from "next";
import { Providers } from "./providers";
import { StyledComponentsRegistry } from "./registry";

export const metadata: Metadata = {
	title: "Imóvel Prático Admin",
	description: "Painel administrativo do Imóvel Prático",
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
