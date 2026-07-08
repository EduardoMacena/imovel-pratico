"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
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
	BackLink,
	Badges,
	EmptyState,
	ErrorBox,
	Form,
	Grid,
	Header,
	List,
	PageContainer,
	Subtitle,
	Title,
	UserEmail,
	UserItem,
	UserName,
	UserTop,
	Actions,
	EditLink,
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

	const [isLoading, setIsLoading] = useState(true);
	const [isCreating, setIsCreating] = useState(false);
	const [erro, setErro] = useState<string | null>(null);

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
			});

			setNome("");
			setEmail("");
			setSenha("123456");
			setRole("OPERADOR");

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
					<Title>Usuários do cliente</Title>
					<Subtitle>
						Cadastre e gerencie usuários que acessam o sistema da imobiliária.
					</Subtitle>
				</Header>

				<Grid>
					<Card>
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
								label="Senha"
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

							<Button type="submit" disabled={isCreating}>
								{isCreating ? "Criando..." : "Criar usuário"}
							</Button>
						</Form>
					</Card>

					<div>
						{erro && <ErrorBox>{erro}</ErrorBox>}

						{isLoading && <EmptyState>Carregando usuários...</EmptyState>}

						{!isLoading && usuarios.length === 0 && (
							<EmptyState>Nenhum usuário cadastrado ainda.</EmptyState>
						)}

						{!isLoading && usuarios.length > 0 && (
							<List>
								{usuarios.map((usuario) => (
									<UserItem key={usuario.id}>
										<UserTop>
											<div>
												<UserName>{usuario.nome}</UserName>
												<UserEmail>{usuario.email}</UserEmail>
											</div>

											<Badges>
												<StatusBadge status={usuario.role} />
												<StatusBadge
													status={usuario.ativo ? "ATIVO" : "INATIVO"}
												/>
											</Badges>
										</UserTop>

										<Actions>
											<Link
												href={`/clientes/${clienteId}/usuarios/${usuario.id}/editar`}
												passHref
												legacyBehavior
											>
												<EditLink>Editar usuário</EditLink>
											</Link>
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
