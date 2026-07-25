"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import {
	getAuthToken,
	setAuthToken,
	setAuthCliente,
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
} from "./page.styles";
import { login } from "../../features/auth/api";

type LoginResponse = {
	token?: string;
	accessToken?: string;
	usuario?: {
		id: string;
		nome: string;
		email: string;
		role: string;
	};
	user?: {
		id: string;
		nome?: string;
		email: string;
		role?: string;
	};
};

export default function LoginPage() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");

	const [isLoading, setIsLoading] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	useEffect(() => {
		const token = getAuthToken();

		if (token) {
			router.replace("/dashboard");
		}
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

			const role = response.usuario?.role;

			if (role && role !== "SUPER_ADMIN") {
				throw new Error("Usuário sem permissão para acessar o painel admin");
			}

			setAuthToken(token);
			setAuthUser(response.usuario);
			setAuthCliente(response.cliente);

			router.push("/dashboard");
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
					<Badge>Painel administrativo</Badge>

					<HeroTitle>
						Gestão premium para uma operação imobiliária inteligente.
					</HeroTitle>

					<HeroText>
						Controle clientes, planos, consumo mensal, tarefas e processamento
						de consultas em uma plataforma preparada para escalar.
					</HeroText>
				</HeroContent>
			</Hero>

			<LoginArea>
				<LoginCard>
					<LoginTitle>Entrar no admin</LoginTitle>

					<LoginSubtitle>
						Acesse com seu usuário administrador para gerenciar clientes, planos
						e operação do Imóvel Prático.
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
					</Form>

					<FooterText>
						Imóvel Prático · Automação de prospecção imobiliária
					</FooterText>
				</LoginCard>
			</LoginArea>
		</Page>
	);
}
