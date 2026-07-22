"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "../../../../components/AppHeader";
import {
	buscarCliente,
	cancelarWorkerAgentInstallLink,
	criarWorkerAgentInstallLink,
	listarWorkerAgentInstallLinks,
	listarWorkerAgentsCliente,
} from "../../../../features/admin/api";
import type {
	ClienteResumo,
	CriarWorkerAgentInstallLinkResponse,
	WorkerAgentInstallLinkResumo,
	WorkerAgentResumo,
} from "../../../../features/admin/types";
import { useRequireSuperAdmin } from "../../../../hooks/useRequireSuperAdmin";
import {
	ActionButton,
	Actions,
	BackLink,
	Badge,
	CheckboxCard,
	CheckboxGrid,
	CodeBox,
	ContentGrid,
	EmptyState,
	EmptyTitle,
	ErrorBox,
	Field,
	Form,
	FormGrid,
	GeneratedLinkBox,
	GeneratedTitle,
	Header,
	HeaderContent,
	HeaderEyebrow,
	HeaderGrid,
	HeaderPanel,
	HeaderPanelHint,
	HeaderPanelLabel,
	HeaderPanelValue,
	Input,
	ItemCard,
	ItemMuted,
	ItemTitle,
	ItemTop,
	List,
	MainColumn,
	PageContainer,
	PanelCard,
	PanelHeader,
	PanelSubtitle,
	PanelTitle,
	SideColumn,
	Subtitle,
	SuccessBox,
	Title,
} from "./page.styles";

function formatDate(value?: string | null) {
	if (!value) {
		return "-";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "short",
		timeStyle: "medium",
	}).format(new Date(value));
}

function getLinkVariant(status: string) {
	if (status === "PENDENTE") {
		return "warning";
	}

	if (status === "USADO") {
		return "success";
	}

	if (status === "EXPIRADO" || status === "CANCELADO") {
		return "error";
	}

	return "neutral";
}

function getAgentVariant(status: string) {
	if (status === "ONLINE") {
		return "success";
	}

	if (status === "OFFLINE" || status === "REVOGADO") {
		return "error";
	}

	if (status === "INSTAVEL") {
		return "warning";
	}

	return "neutral";
}

function getAgentLabel(status: string) {
	const labels: Record<string, string> = {
		ONLINE: "Online",
		INSTAVEL: "Instável",
		OFFLINE: "Offline",
		INATIVO: "Inativo",
		REVOGADO: "Revogado",
	};

	return labels[status] ?? status;
}

export default function InstaladorClientePage() {
	const { isCheckingAuth } = useRequireSuperAdmin();
	const params = useParams<{ id: string }>();

	const clienteId = params.id;

	const [cliente, setCliente] = useState<ClienteResumo | null>(null);
	const [links, setLinks] = useState<WorkerAgentInstallLinkResumo[]>([]);
	const [agents, setAgents] = useState<WorkerAgentResumo[]>([]);

	const [identificadorBase, setIdentificadorBase] = useState("");
	const [incluirRegistro, setIncluirRegistro] = useState(true);
	const [incluirCnd, setIncluirCnd] = useState(true);
	const [expiraEmHoras, setExpiraEmHoras] = useState("24");

	const [linkGerado, setLinkGerado] =
		useState<CriarWorkerAgentInstallLinkResponse | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [isGenerating, setIsGenerating] = useState(false);
	const [cancelandoId, setCancelandoId] = useState<string | null>(null);

	const [erro, setErro] = useState<string | null>(null);
	const [sucesso, setSucesso] = useState<string | null>(null);

	const resumoAgents = useMemo(() => {
		const online = agents.filter((agent) => agent.statusOperacional === "ONLINE").length;
		const atencao = agents.filter((agent) => agent.statusOperacional !== "ONLINE").length;

		return {
			online,
			atencao,
			total: agents.length,
		};
	}, [agents]);

	async function carregarDados() {
		try {
			setErro(null);

			const [clienteData, linksData, agentsData] = await Promise.all([
				buscarCliente(clienteId),
				listarWorkerAgentInstallLinks(clienteId),
				listarWorkerAgentsCliente(clienteId),
			]);

			setCliente(clienteData.cliente);
			setLinks(linksData.links);
			setAgents(agentsData.agents);

			setIdentificadorBase((current) =>
				current.trim() ? current : `${clienteData.cliente.slug}-windows-01`
			);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar instalador"
			);
		} finally {
			setIsLoading(false);
		}
	}

	async function handleGerarLink(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!incluirRegistro && !incluirCnd) {
			setErro("Selecione pelo menos REGISTRO ou CND.");
			return;
		}

		setErro(null);
		setSucesso(null);
		setLinkGerado(null);
		setIsGenerating(true);

		try {
			const result = await criarWorkerAgentInstallLink(clienteId, {
				identificadorBase,
				incluirRegistro,
				incluirCnd,
				expiraEmHoras: Number(expiraEmHoras),
			});

			setLinkGerado(result);
			setSucesso("Link de instalação gerado com sucesso.");

			await carregarDados();
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao gerar link de instalação"
			);
		} finally {
			setIsGenerating(false);
		}
	}

	async function handleCancelarLink(linkId: string) {
		const confirmou = window.confirm(
			"Deseja cancelar este link de instalação? Ele não poderá mais ser usado."
		);

		if (!confirmou) {
			return;
		}

		setErro(null);
		setSucesso(null);
		setCancelandoId(linkId);

		try {
			await cancelarWorkerAgentInstallLink(linkId);

			setSucesso("Link de instalação cancelado com sucesso.");

			await carregarDados();
		} catch (error) {
			setErro(
				error instanceof Error ? error.message : "Erro desconhecido ao cancelar link"
			);
		} finally {
			setCancelandoId(null);
		}
	}

	async function copiarTexto(value: string, label: string) {
		try {
			await window.navigator.clipboard.writeText(value);
			setSucesso(`${label} copiado.`);
		} catch {
			setErro(`Não foi possível copiar ${label.toLowerCase()}.`);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarDados();
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
							<HeaderEyebrow>Instalação do Agent</HeaderEyebrow>

							<Title>Instale o Agent no Windows com link de ativação.</Title>

							<Subtitle>
								Gere um link de instalação temporário e de uso único para ativar os
								serviços REGISTRO e CND na máquina do cliente.
							</Subtitle>
						</HeaderContent>

						<HeaderPanel>
							<HeaderPanelLabel>Cliente</HeaderPanelLabel>
							<HeaderPanelValue>{cliente?.nome ?? "-"}</HeaderPanelValue>
							<HeaderPanelHint>
								Modo: {cliente?.modoProcessamento ?? "-"} · Agents online:{" "}
								{resumoAgents.online}/{resumoAgents.total}
							</HeaderPanelHint>
						</HeaderPanel>
					</HeaderGrid>
				</Header>

				{erro && <ErrorBox>{erro}</ErrorBox>}
				{sucesso && <SuccessBox>{sucesso}</SuccessBox>}

				{isLoading ? (
					<EmptyState>
						<EmptyTitle>Carregando instalador...</EmptyTitle>
						Estamos buscando os dados do cliente, links e agents.
					</EmptyState>
				) : (
					<ContentGrid>
						<MainColumn>
							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Gerar link de instalação</PanelTitle>
										<PanelSubtitle>
											O link expira, só pode ser usado uma vez e será utilizado pelo
											instalador Windows.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								<Form onSubmit={handleGerarLink}>
									<FormGrid>
										<Field>
											Identificador base
											<Input
												value={identificadorBase}
												onChange={(event) => setIdentificadorBase(event.target.value)}
												placeholder="Ex: twa-windows-01"
												required
											/>
										</Field>

										<Field>
											Expira em horas
											<Input
												type="number"
												min={1}
												max={168}
												value={expiraEmHoras}
												onChange={(event) => setExpiraEmHoras(event.target.value)}
												required
											/>
										</Field>
									</FormGrid>

									<CheckboxGrid>
										<CheckboxCard>
											<input
												type="checkbox"
												checked={incluirRegistro}
												onChange={(event) => setIncluirRegistro(event.target.checked)}
											/>
											Incluir REGISTRO
										</CheckboxCard>

										<CheckboxCard>
											<input
												type="checkbox"
												checked={incluirCnd}
												onChange={(event) => setIncluirCnd(event.target.checked)}
											/>
											Incluir CND
										</CheckboxCard>
									</CheckboxGrid>

									<Actions>
										<ActionButton type="submit" disabled={isGenerating}>
											{isGenerating ? "Gerando..." : "Gerar link de instalação"}
										</ActionButton>
									</Actions>
								</Form>

								{linkGerado && (
									<GeneratedLinkBox>
										<GeneratedTitle>Link gerado. Copie agora.</GeneratedTitle>

										<CodeBox>{linkGerado.installUrl}</CodeBox>

										<Actions>
											<ActionButton
												type="button"
												$variant="neutral"
												onClick={() =>
													copiarTexto(linkGerado.installUrl, "Link de instalação")
												}
											>
												Copiar link
											</ActionButton>

											<ActionButton
												type="button"
												$variant="neutral"
												onClick={() => copiarTexto(linkGerado.code, "Código")}
											>
												Copiar código
											</ActionButton>
										</Actions>

										<CodeBox>{linkGerado.code}</CodeBox>
									</GeneratedLinkBox>
								)}
							</PanelCard>

							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Histórico de instalações</PanelTitle>
										<PanelSubtitle>
											Acompanhe links pendentes, usados, expirados e cancelados.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								{links.length === 0 ? (
									<EmptyState>
										<EmptyTitle>Nenhum link gerado</EmptyTitle>
										Gere o primeiro link de instalação para ativar o Agent.
									</EmptyState>
								) : (
									<List>
										{links.map((link) => (
											<ItemCard key={link.id}>
												<ItemTop>
													<div>
														<ItemTitle>{link.identificadorBase}</ItemTitle>
														<ItemMuted>
															Serviços:{" "}
															{[
																link.incluirRegistro ? "REGISTRO" : null,
																link.incluirCnd ? "CND" : null,
															]
																.filter(Boolean)
																.join(" + ")}
														</ItemMuted>
													</div>

													<Badge $variant={getLinkVariant(link.status)}>
														{link.status}
													</Badge>
												</ItemTop>

												<ItemMuted>Criado em: {formatDate(link.createdAt)}</ItemMuted>
												<ItemMuted>Expira em: {formatDate(link.expiraEm)}</ItemMuted>
												<ItemMuted>Usado em: {formatDate(link.usadoEm)}</ItemMuted>

												{link.status === "PENDENTE" && (
													<Actions>
														<ActionButton
															type="button"
															$variant="danger"
															disabled={cancelandoId === link.id}
															onClick={() => handleCancelarLink(link.id)}
														>
															{cancelandoId === link.id
																? "Cancelando..."
																: "Cancelar link"}
														</ActionButton>
													</Actions>
												)}
											</ItemCard>
										))}
									</List>
								)}
							</PanelCard>
						</MainColumn>

						<SideColumn>
							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Agents do cliente</PanelTitle>
										<PanelSubtitle>
											Status atual dos serviços criados para este cliente.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								{agents.length === 0 ? (
									<EmptyState>
										<EmptyTitle>Nenhum agent cadastrado</EmptyTitle>
										Após usar o link, os agents aparecerão aqui.
									</EmptyState>
								) : (
									<List>
										{agents.map((agent) => (
											<ItemCard key={agent.id}>
												<ItemTop>
													<div>
														<ItemTitle>{agent.tipo} Agent</ItemTitle>
														<ItemMuted>{agent.identificador}</ItemMuted>
													</div>

													<Badge $variant={getAgentVariant(agent.statusOperacional)}>
														{getAgentLabel(agent.statusOperacional)}
													</Badge>
												</ItemTop>

												<ItemMuted>Status cadastrado: {agent.status}</ItemMuted>
												<ItemMuted>
													Último sinal: {formatDate(agent.ultimoSinalEm)}
												</ItemMuted>
											</ItemCard>
										))}
									</List>
								)}
							</PanelCard>

							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Como funciona</PanelTitle>
										<PanelSubtitle>
											Fluxo seguro de instalação sem token exposto no link.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								<List>
									<ItemCard>
										<ItemTitle>1. Gere o link de instalação</ItemTitle>
										<ItemMuted>
											O link contém apenas um código temporário, não o token real do
											Agent.
										</ItemMuted>
									</ItemCard>

									<ItemCard>
										<ItemTitle>2. O instalador valida o código</ItemTitle>
										<ItemMuted>
											A API valida expiração, status e uso único antes de criar os tokens.
										</ItemMuted>
									</ItemCard>

									<ItemCard>
										<ItemTitle>3. O Agent inicia os serviços</ItemTitle>
										<ItemMuted>
											Depois da instalação, o Monitoramento passa a mostrar REGISTRO e CND
											online.
										</ItemMuted>
									</ItemCard>
								</List>
							</PanelCard>
						</SideColumn>
					</ContentGrid>
				)}
			</PageContainer>
		</>
	);
}
