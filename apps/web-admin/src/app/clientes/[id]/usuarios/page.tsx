"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import { Button } from "../../../../components/Button";
import { Card } from "../../../../components/Card";
import { Input } from "../../../../components/Input";
import { Select } from "../../../../components/Select";
import { StatusBadge } from "../../../../components/StatusBadge";
import {
	criarUsuario,
	listarUsuariosDoCliente,
} from "../../../../features/admin/api";
import type {
	UsuarioResumo,
	UsuarioRole,
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
	Actions,
	BackLink,
	Badges,
	EditLink,
	EmptyState,
	EmptyStateTitle,
	ErrorBox,
	Form,
	FormHeader,
	FormSubtitle,
	FormTitle,
	Grid,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
	HeaderPanelLabel,
	HeaderPanelValue,
	List,
	ListHeader,
	ListSubtitle,
	ListTitle,
	PageContainer,
	Sidebar,
	StatCard,
	StatGrid,
	StatLabel,
	StatValue,
	Subtitle,
	Title,
	UserEmail,
	UserItem,
	UserName,
	UserTop,
} from "./page.styles";

type UsuarioRoleCliente = Exclude<UsuarioRole, "SUPER_ADMIN">;

export default function UsuariosClientePage() {
	const { isCheckingAuth } = useRequireSuperAdmin();
	const params = useParams<{ id: string }>();

	const clienteId = params.id;

	const [usuarios, setUsuarios] = useState<UsuarioResumo[]>([]);

	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("123456");
	const [role, setRole] = useState<UsuarioRoleCliente>("OPERADOR");
	const [precisaTrocarSenha, setPrecisaTrocarSenha] = useState("true");

	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

	const resumo = useMemo(() => {
		const ativos = usuarios.filter((usuario) => usuario.ativo).length;
		const inativos = usuarios.filter((usuario) => !usuario.ativo).length;
		const admins = usuarios.filter((usuario) => usuario.role === "ADMIN").length;
		const operadores = usuarios.filter(
			(usuario) => usuario.role === "OPERADOR"
		).length;
		const senhasTemporarias = usuarios.filter(
			(usuario) => usuario.precisaTrocarSenha
		).length;

		return {
			ativos,
			inativos,
			admins,
			operadores,
			senhasTemporarias,
		};
	}, [usuarios]);

	async function carregarUsuarios() {
		try {
			setErro(null);

			const data = await listarUsuariosDoCliente(clienteId);

			setUsuarios(data.usuarios);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar usuários"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleCriarUsuario(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		setErro(null);
		setIsCreating(true);

		try {
			await criarUsuario(clienteId, {
				nome,
				email,
				senha,
				role,
				ativo: true,
				precisaTrocarSenha: precisaTrocarSenha === "true",
			});

			setNome("");
			setEmail("");
			setSenha("123456");
			setRole("OPERADOR");
			setPrecisaTrocarSenha("true");

			await carregarUsuarios();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao criar usuário"
			);
		} finally {
			setIsCreating(false);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarUsuarios();
		}
	}, [isCheckingAuth]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageContainer>
				<BackLink href="/clientes">← Voltar para clientes</BackLink>

				<Header>
					<HeaderGrid>
						<HeaderContent>
							<HeaderEyebrow>Gestão de acesso</HeaderEyebrow>

							<Title>Usuários do cliente</Title>

							<Subtitle>
								Cadastre e gerencie usuários que acessam o sistema da
								imobiliária, definindo permissões e controle de senha temporária.
							</Subtitle>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelLabel>Total de usuários</HeaderPanelLabel>
							<HeaderPanelValue>{usuarios.length}</HeaderPanelValue>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				<StatGrid>
					<StatCard>
						<StatLabel>Usuários ativos</StatLabel>
						<StatValue>{resumo.ativos}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Usuários inativos</StatLabel>
						<StatValue>{resumo.inativos}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Administradores</StatLabel>
						<StatValue>{resumo.admins}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Operadores</StatLabel>
						<StatValue>{resumo.operadores}</StatValue>
					</StatCard>

					<StatCard>
						<StatLabel>Senha temporária</StatLabel>
						<StatValue>{resumo.senhasTemporarias}</StatValue>
					</StatCard>
				</StatGrid>

				<Grid>
					<Sidebar>
						<Card>
							<FormHeader>
								<FormTitle>Novo usuário</FormTitle>
								<FormSubtitle>
									Crie um acesso para a imobiliária. Por padrão, a senha inicial
									será temporária e o usuário deverá trocar no primeiro login.
								</FormSubtitle>
							</FormHeader>

							<Form onSubmit={handleCriarUsuario}>
								<Input
									label="Nome"
									value={nome}
									onChange={(event) => setNome(event.target.value)}
									required
								/>

								<Input
									label="E-mail"
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									required
								/>

								<Input
									label="Senha temporária"
									type="text"
									value={senha}
									onChange={(event) => setSenha(event.target.value)}
									required
								/>

								<Select
									label="Perfil"
									value={role}
									onChange={(event) =>
										setRole(event.target.value as UsuarioRoleCliente)
									}
								>
									<option value="ADMIN">ADMIN</option>
									<option value="GERENTE">GERENTE</option>
									<option value="OPERADOR">OPERADOR</option>
								</Select>

								<Select
									label="Troca de senha no primeiro login"
									value={precisaTrocarSenha}
									onChange={(event) =>
										setPrecisaTrocarSenha(event.target.value)
									}
								>
									<option value="true">Obrigatória</option>
									<option value="false">Não obrigatória</option>
								</Select>

								<Button type="submit" fullWidth disabled={isCreating}>
									{isCreating ? "Criando..." : "Criar usuário"}
								</Button>
							</Form>
						</Card>
					</Sidebar>

					<div>
						<ListHeader>
							<div>
								<ListTitle>Usuários cadastrados</ListTitle>
								<ListSubtitle>
									Visualize acessos, perfis, status, senha temporária e edite
									permissões dos usuários deste cliente.
								</ListSubtitle>
							</div>
						</ListHeader>

						{erro && <ErrorBox>{erro}</ErrorBox>}

						{isLoading && (
							<EmptyState>
								<EmptyStateTitle>Carregando usuários...</EmptyStateTitle>
								Estamos buscando os acessos cadastrados para este cliente.
							</EmptyState>
						)}

						{!isLoading && usuarios.length === 0 && (
							<EmptyState>
								<EmptyStateTitle>Nenhum usuário cadastrado ainda.</EmptyStateTitle>
								Crie o primeiro usuário para liberar o acesso da imobiliária ao
								sistema.
							</EmptyState>
						)}

						{!isLoading && usuarios.length > 0 && (
							<List>
								{usuarios.map((usuario) => (
									<UserItem key={usuario.id}>
										<UserTop>
											<div>
												<UserName>{usuario.nome}</UserName>
												<UserEmail>{usuario.email}</UserEmail>

												{usuario.precisaTrocarSenha && (
													<UserEmail>
														Senha temporária ativa: troca obrigatória no
														próximo login.
													</UserEmail>
												)}
											</div>

											<Badges>
												<StatusBadge status={usuario.role} />
												<StatusBadge
													status={usuario.ativo ? "ATIVO" : "INATIVO"}
												/>
												{usuario.precisaTrocarSenha && (
													<StatusBadge status="PENDENTE" />
												)}
											</Badges>
										</UserTop>

										<Actions>
											<EditLink
												href={`/clientes/${clienteId}/usuarios/${usuario.id}/editar`}
											>
												Editar usuário
											</EditLink>
										</Actions>
									</UserItem>
								))}
							</List>
						)}
					</div>
				</Grid>
			</PageContainer>
		</>
	);
}