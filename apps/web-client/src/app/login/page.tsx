"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
	getAuthToken,
	getAuthUser,
	setAuthCliente,
	setAuthToken,
	setAuthUser,
} from "../../lib/auth-storage";
import {
	Badge,
	ErrorBox,
	FooterText,
	Form,
	Hero,
	HeroContent,
	HeroText,
	HeroTitle,
	LoginArea,
	LoginCard,
	LoginSubtitle,
	LoginTitle,
	Page,
	ForgotPasswordLink,
} from "./page.styles";
import { login } from "../../features/auth/api";

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		const token = getAuthToken();
		const user = getAuthUser();

		if (!token) {
			return;
		}

		if (user?.precisaTrocarSenha) {
			router.replace("/trocar-senha");
			return;
		}

		router.replace("/");
	}, [router]);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setIsLoading(true);

		try {
			const response = await login({
				email,
				senha,
			});

			if (!response) {
				throw new Error("E-mail ou senha inválidos");
			}

			const token = response.token;

			if (!token) {
				throw new Error("Token não retornado pela API");
			}

			setAuthToken(token);
			setAuthUser(response.usuario);
			setAuthCliente(response.cliente);

			if (response.usuario.precisaTrocarSenha) {
				router.push("/trocar-senha");
				return;
			}

			router.push("/");
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao fazer login"
			);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Page>
			<Hero>
				<HeroContent>
					<Badge>Área da imobiliária</Badge>

					<HeroTitle>
						Encontre proprietários com mais controle, velocidade e precisão.
					</HeroTitle>

					<HeroText>
						Consulte imóveis, acompanhe o processamento, visualize contatos
						enriquecidos e exporte resultados em uma experiência simples e
						profissional.
					</HeroText>
				</HeroContent>
			</Hero>

			<LoginArea>
				<LoginCard>
					<LoginTitle>Acessar plataforma</LoginTitle>

					<LoginSubtitle>
						Entre com o acesso da sua imobiliária para iniciar buscas e
						acompanhar seus resultados.
					</LoginSubtitle>

					<Form onSubmit={handleSubmit}>
						<Input
							label="E-mail"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="seu@email.com"
							autoComplete="email"
							required
						/>

						<Input
							label="Senha"
							type="password"
							value={senha}
							onChange={(event) => setSenha(event.target.value)}
							placeholder="Digite sua senha"
							autoComplete="current-password"
							required
						/>

						{erro && <ErrorBox>{erro}</ErrorBox>}

						<Button type="submit" fullWidth disabled={isLoading}>
							{isLoading ? "Entrando..." : "Entrar"}
						</Button>
            
						<ForgotPasswordLink href="/esqueci-senha">
							Esqueci minha senha
						</ForgotPasswordLink>
					</Form>

					<FooterText>
						Imóvel Prático · Inteligência para prospecção imobiliária
					</FooterText>
				</LoginCard>
			</LoginArea>
		</Page>
	);
}
