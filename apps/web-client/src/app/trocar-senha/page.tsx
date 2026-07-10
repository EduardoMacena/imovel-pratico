"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppHeader } from "../../components/AppHeader";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { trocarMinhaSenha } from "../../features/auth/api";
import {
	getAuthUser,
	setAuthUser,
	type AuthUser,
} from "../../lib/auth-storage";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import {
	Actions,
	AlertBox,
	ErrorBox,
	Form,
	FormCard,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
	HeaderPanelItem,
	HeaderPanelLabel,
	HeaderPanelValue,
	SecurityHint,
	SuccessBox,
	Subtitle,
	Title,
	PageContainer,
} from "./page.styles";

export default function TrocarSenhaPage() {
	const { isCheckingAuth } = useRequireAuth();
	const router = useRouter();

	const [usuario, setUsuario] = useState<AuthUser | null>(null);

	const [senhaAtual, setSenhaAtual] = useState("");
	const [novaSenha, setNovaSenha] = useState("");
	const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

	const [isSaving, setIsSaving] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [sucesso, setSucesso] = useState<string | null>(null);

	const trocaObrigatoria = usuario?.precisaTrocarSenha === true;

	useEffect(() => {
		setUsuario(getAuthUser());
	}, []);

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setSucesso(null);

		if (novaSenha !== confirmarNovaSenha) {
			setErro("As senhas não conferem.");
			return;
		}

		if (senhaAtual === novaSenha) {
			setErro("A nova senha precisa ser diferente da senha atual.");
			return;
		}

		setIsSaving(true);

		try {
			const response = await trocarMinhaSenha({
				senhaAtual,
				novaSenha,
				confirmarNovaSenha,
			});

			setAuthUser(response.usuario);
			setUsuario(response.usuario);

			setSenhaAtual("");
			setNovaSenha("");
			setConfirmarNovaSenha("");

			setSucesso(response.message ?? "Senha alterada com sucesso.");

			router.push("/");
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao alterar senha"
			);
		} finally {
			setIsSaving(false);
		}
	}

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<HeaderGrid>
					<HeaderContent>
						<HeaderEyebrow>Segurança da conta</HeaderEyebrow>

						<Title>
							{trocaObrigatoria ? "Crie uma nova senha" : "Alterar senha"}
						</Title>

						<Subtitle>
							{trocaObrigatoria
								? "Por segurança, sua senha temporária precisa ser alterada antes de acessar a plataforma."
								: "Atualize sua senha sempre que necessário para manter o acesso da sua imobiliária protegido."}
						</Subtitle>
					</HeaderContent>

					<HeaderPanel>
						<HeaderPanelItem>
							<HeaderPanelLabel>Usuário</HeaderPanelLabel>
							<HeaderPanelValue>{usuario?.nome ?? "-"}</HeaderPanelValue>
						</HeaderPanelItem>

						<HeaderPanelItem>
							<HeaderPanelLabel>E-mail</HeaderPanelLabel>
							<HeaderPanelValue>{usuario?.email ?? "-"}</HeaderPanelValue>
						</HeaderPanelItem>

						<HeaderPanelItem>
							<HeaderPanelLabel>Status da senha</HeaderPanelLabel>
							<HeaderPanelValue>
								{trocaObrigatoria ? "Troca obrigatória" : "Senha ativa"}
							</HeaderPanelValue>
						</HeaderPanelItem>
					</HeaderPanel>
				</HeaderGrid>

				{trocaObrigatoria && (
					<AlertBox>
						Você está usando uma senha temporária definida pelo administrador.
						Para continuar, cadastre uma nova senha.
					</AlertBox>
				)}

				<FormCard>
					<SecurityHint>
						Use uma senha com pelo menos 6 caracteres. Evite senhas simples como
						nome da empresa, telefone ou sequências numéricas.
					</SecurityHint>

					<Form onSubmit={handleSubmit}>
						<Input
							label="Senha atual"
							type="password"
							value={senhaAtual}
							onChange={(event) => setSenhaAtual(event.target.value)}
							placeholder="Digite sua senha atual"
							autoComplete="current-password"
							required
						/>

						<Input
							label="Nova senha"
							type="password"
							value={novaSenha}
							onChange={(event) => setNovaSenha(event.target.value)}
							placeholder="Digite a nova senha"
							autoComplete="new-password"
							required
						/>

						<Input
							label="Confirmar nova senha"
							type="password"
							value={confirmarNovaSenha}
							onChange={(event) => setConfirmarNovaSenha(event.target.value)}
							placeholder="Repita a nova senha"
							autoComplete="new-password"
							required
						/>

						{erro && <ErrorBox>{erro}</ErrorBox>}
						{sucesso && <SuccessBox>{sucesso}</SuccessBox>}

						<Actions>
							<Button type="submit" disabled={isSaving}>
								{isSaving ? "Salvando..." : "Atualizar senha"}
							</Button>

							<Button
								type="button"
								variant="ghost"
								disabled={trocaObrigatoria}
								onClick={() => router.push("/")}
							>
								Voltar
							</Button>
						</Actions>
					</Form>
				</FormCard>
			</PageContainer>
		</>
	);
}
