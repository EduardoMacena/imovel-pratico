"use client";

import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../../components/AppHeader";
import {
	buscarResumoMonitoramento,
	listarClientes,
	listarEventosMonitoramento,
	listarFilasMonitoramento,
} from "../../features/admin/api";
import type {
	ClienteResumo,
	ListarFilasMonitoramentoResponse,
	ListarEventosMonitoramentoResponse,
	MonitoramentoEvento,
	MonitoramentoResumoResponse,
} from "../../features/admin/types";
import { useRequireSuperAdmin } from "../../hooks/useRequireSuperAdmin";
import {
	Badge,
	ContentGrid,
	CountBox,
	EmptyState,
	EmptyTitle,
	ErrorBox,
	EventDetails,
	EventItem,
	EventList,
	EventMessage,
	EventMeta,
	Field,
	FilterCard,
	HealthStatus,
	HeroCard,
	HeroContent,
	HeroEyebrow,
	HeroGrid,
	HeroPanel,
	HeroPanelSubtitle,
	HeroPanelTitle,
	HeroSubtitle,
	HeroTitle,
	Input,
	ItemMuted,
	ItemTitle,
	ItemTop,
	MainColumn,
	MetricCard,
	MetricGrid,
	MetricHint,
	MetricLabel,
	MetricValue,
	PageContainer,
	PageShell,
	PanelCard,
	PanelHeader,
	PanelSubtitle,
	PanelTitle,
	QueueCard,
	QueueCounts,
	QueueGrid,
	QueueGroup,
	RefreshButton,
	Select,
	SideColumn,
	TaskLink,
	UpdatedAt,
	WorkerItem,
	WorkerList,
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

function formatNumber(value: number | undefined | null) {
	if (typeof value !== "number") {
		return "-";
	}

	return new Intl.NumberFormat("pt-BR").format(value);
}

function getLevelVariant(level: string) {
	if (level === "ERROR") {
		return "error";
	}

	if (level === "WARN") {
		return "warning";
	}

	return "success";
}

function getWorkerVariant(status: string) {
	if (status === "ONLINE") {
		return "success";
	}

	if (status === "ERROR" || status === "OFFLINE" || status === "REVOGADO") {
		return "error";
	}

	return "warning";
}

function getStatusGeralLabel(status?: string) {
	if (status === "OPERACIONAL") {
		return "Operacional";
	}

	return "Atenção";
}

function getServicoLabel(servico: string) {
	const labels: Record<string, string> = {
		API_GATEWAY: "API Gateway",
		WORKER_REGISTRO: "Worker Registro",
		WORKER_CND: "Worker CND",
		QUEUE: "Fila",
		REALTIME: "Realtime",
	};

	return labels[servico] ?? servico;
}

function renderEventoDetalhe(evento: MonitoramentoEvento) {
	const detalhes = [];

	if (evento.detalhes) {
		detalhes.push(evento.detalhes);
	}

	if (evento.metadata) {
		detalhes.push(JSON.stringify(evento.metadata, null, 2));
	}

	if (detalhes.length === 0) {
		return null;
	}

	return <EventDetails>{detalhes.join("\n\n")}</EventDetails>;
}

export default function MonitoramentoPage() {
	const { isCheckingAuth } = useRequireSuperAdmin();

	const [clientes, setClientes] = useState<ClienteResumo[]>([]);
	const [resumo, setResumo] = useState<
		MonitoramentoResumoResponse["resumo"] | null
	>(null);
	const [eventos, setEventos] = useState<
		ListarEventosMonitoramentoResponse["eventos"]
	>([]);
	const [filas, setFilas] = useState<ListarFilasMonitoramentoResponse["itens"]>(
		[]
	);

	const [clienteId, setClienteId] = useState("");
	const [nivel, setNivel] = useState("");
	const [servico, setServico] = useState("");
	const [tipo, setTipo] = useState("");

	const [isLoading, setIsLoading] = useState(true);
	const [erro, setErro] = useState<string | null>(null);

	async function carregarMonitoramento() {
		try {
			setErro(null);
			setIsLoading(true);

			const filtros = {
				clienteId: clienteId || undefined,
			};

			const [clientesData, resumoData, eventosData, filasData] =
				await Promise.all([
					clientes.length > 0
						? Promise.resolve({ clientes })
						: listarClientes(),
					buscarResumoMonitoramento(filtros),
					listarEventosMonitoramento({
						...filtros,
						nivel: nivel || undefined,
						servico: servico || undefined,
						tipo: tipo || undefined,
						take: 80,
					}),
					listarFilasMonitoramento(filtros),
				]);

			setClientes(clientesData.clientes);
			setResumo(resumoData.resumo);
			setEventos(eventosData.eventos);
			setFilas(filasData.itens);
		} catch (error) {
			setErro(
				error instanceof Error
					? error.message
					: "Erro desconhecido ao carregar monitoramento"
			);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		if (!isCheckingAuth) {
			carregarMonitoramento();
		}
	}, [isCheckingAuth]);

	const metricas = useMemo(() => {
		return {
			servicosOnline:
				(resumo?.workers.online ?? 0) + (resumo?.agents.online ?? 0),
			servicosComAtencao:
				(resumo?.workers.offline ?? 0) + (resumo?.agents.comAtencao ?? 0),
			workersOnline: resumo?.workers.online ?? 0,
			workersOffline: resumo?.workers.offline ?? 0,
			agentsOnline: resumo?.agents.online ?? 0,
			agentsComAtencao: resumo?.agents.comAtencao ?? 0,
			tarefasEmAndamento:
				(resumo?.tarefas.pendentes ?? 0) + (resumo?.tarefas.processando ?? 0),
			erros24h: resumo?.eventos.errosUltimas24h ?? 0,
		};
	}, [resumo]);

	if (isCheckingAuth) {
		return null;
	}

	return (
		<>
			<AppHeader />

			<PageShell>
				<PageContainer>
					<HeroGrid>
						<HeroCard>
							<HeroContent>
								<HeroEyebrow>Monitoramento operacional</HeroEyebrow>

								<HeroTitle>Saúde da operação, filas e workers.</HeroTitle>

								<HeroSubtitle>
									Acompanhe workers online, tarefas em processamento, filas por
									cliente e eventos técnicos do Imóvel Prático em uma visão
									centralizada para suporte e publicação.
								</HeroSubtitle>
							</HeroContent>
						</HeroCard>

						<HeroPanel>
							<div>
								<HealthStatus $status={resumo?.statusGeral ?? "ATENCAO"}>
									{getStatusGeralLabel(resumo?.statusGeral)}
								</HealthStatus>

								<HeroPanelTitle>
									{formatNumber(metricas.servicosOnline)} online
								</HeroPanelTitle>

								<HeroPanelSubtitle>
									{formatNumber(metricas.servicosComAtencao)} serviço(s)
									offline, instáveis ou com atenção.
								</HeroPanelSubtitle>
							</div>

							<UpdatedAt>
								Atualizado em {formatDate(resumo?.atualizadoEm)}
							</UpdatedAt>
						</HeroPanel>
					</HeroGrid>

					<FilterCard>
						<Field>
							Cliente
							<Select
								value={clienteId}
								onChange={(event) => setClienteId(event.target.value)}
							>
								<option value="">Todos os clientes</option>
								{clientes.map((cliente) => (
									<option key={cliente.id} value={cliente.id}>
										{cliente.nome}
									</option>
								))}
							</Select>
						</Field>

						<Field>
							Nível
							<Select
								value={nivel}
								onChange={(event) => setNivel(event.target.value)}
							>
								<option value="">Todos</option>
								<option value="INFO">Info</option>
								<option value="WARN">Atenção</option>
								<option value="ERROR">Erro</option>
							</Select>
						</Field>

						<Field>
							Serviço
							<Select
								value={servico}
								onChange={(event) => setServico(event.target.value)}
							>
								<option value="">Todos</option>
								<option value="API_GATEWAY">API Gateway</option>
								<option value="WORKER_REGISTRO">Worker Registro</option>
								<option value="WORKER_CND">Worker CND</option>
								<option value="QUEUE">Fila</option>
								<option value="REALTIME">Realtime</option>
							</Select>
						</Field>

						<Field>
							Tipo do evento
							<Input
								value={tipo}
								placeholder="Ex: JOB_ERRO"
								onChange={(event) => setTipo(event.target.value)}
							/>
						</Field>

						<RefreshButton
							type="button"
							disabled={isLoading}
							onClick={carregarMonitoramento}
						>
							{isLoading ? "Carregando..." : "Atualizar"}
						</RefreshButton>
					</FilterCard>

					{erro && <ErrorBox>{erro}</ErrorBox>}

					<MetricGrid>
						<MetricCard>
							<MetricLabel>Serviços online</MetricLabel>
							<MetricValue>{formatNumber(metricas.servicosOnline)}</MetricValue>
							<MetricHint>
								Workers de fila e Agents locais com heartbeat recente.
							</MetricHint>
						</MetricCard>

						<MetricCard>
							<MetricLabel>Serviços com atenção</MetricLabel>
							<MetricValue>
								{formatNumber(metricas.servicosComAtencao)}
							</MetricValue>
							<MetricHint>
								Offline, instáveis, revogados ou com erro.
							</MetricHint>
						</MetricCard>

						<MetricCard>
							<MetricLabel>Tarefas em andamento</MetricLabel>
							<MetricValue>
								{formatNumber(metricas.tarefasEmAndamento)}
							</MetricValue>
							<MetricHint>Pendentes ou processando agora.</MetricHint>
						</MetricCard>

						<MetricCard>
							<MetricLabel>Erros em 24h</MetricLabel>
							<MetricValue>{formatNumber(metricas.erros24h)}</MetricValue>
							<MetricHint>Eventos ERROR registrados no período.</MetricHint>
						</MetricCard>
					</MetricGrid>

					<ContentGrid>
						<MainColumn>
							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Eventos operacionais</PanelTitle>
										<PanelSubtitle>
											Logs técnicos salvos no banco, filtráveis por cliente,
											serviço, nível e tipo.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								{eventos.length === 0 ? (
									<EmptyState>
										<EmptyTitle>Nenhum evento encontrado</EmptyTitle>
										Os eventos aparecerão aqui quando os workers e a API
										registrarem atividade operacional.
									</EmptyState>
								) : (
									<EventList>
										{eventos.map((evento) => (
											<EventItem key={evento.id} $level={evento.nivel}>
												<ItemTop>
													<div>
														<EventMessage>{evento.mensagem}</EventMessage>
														<EventMeta>
															<span>{formatDate(evento.createdAt)}</span>
															<span>{getServicoLabel(evento.servico)}</span>
															<span>{evento.tipo}</span>
															{evento.cliente && (
																<span>Cliente: {evento.cliente.nome}</span>
															)}
															{evento.tarefa && (
																<span>
																	Tarefa:{" "}
																	<TaskLink
																		href={`/tarefas/${evento.tarefa.id}`}
																	>
																		abrir
																	</TaskLink>
																</span>
															)}
														</EventMeta>
													</div>

													<Badge $variant={getLevelVariant(evento.nivel)}>
														{evento.nivel}
													</Badge>
												</ItemTop>

												{renderEventoDetalhe(evento)}
											</EventItem>
										))}
									</EventList>
								)}
							</PanelCard>

							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Filas por cliente</PanelTitle>
										<PanelSubtitle>
											Situação das filas BullMQ de Registro e CND para cada
											cliente.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								{filas.length === 0 ? (
									<EmptyState>
										<EmptyTitle>Nenhuma fila encontrada</EmptyTitle>
										Cadastre clientes ou selecione outro filtro para visualizar
										as filas.
									</EmptyState>
								) : (
									<QueueGrid>
										{filas.map((item) => (
											<QueueGroup key={item.cliente.id}>
												<ItemTop>
													<div>
														<ItemTitle>{item.cliente.nome}</ItemTitle>
														<ItemMuted>
															{item.cliente.slug} · {item.cliente.status}
														</ItemMuted>
													</div>
												</ItemTop>

												{item.filas.map((fila) => (
													<QueueCard key={fila.nome}>
														<ItemTop>
															<div>
																<ItemTitle>{fila.descricao}</ItemTitle>
																<ItemMuted>{fila.nome}</ItemMuted>
															</div>

															<Badge $variant="neutral">{fila.tipo}</Badge>
														</ItemTop>

														<QueueCounts>
															<CountBox>
																<span>Aguardando</span>
																<strong>{fila.counts.waiting}</strong>
															</CountBox>
															<CountBox>
																<span>Ativas</span>
																<strong>{fila.counts.active}</strong>
															</CountBox>
															<CountBox>
																<span>Atrasadas</span>
																<strong>{fila.counts.delayed}</strong>
															</CountBox>
															<CountBox>
																<span>Falhas</span>
																<strong>{fila.counts.failed}</strong>
															</CountBox>
															<CountBox>
																<span>Concluídas</span>
																<strong>{fila.counts.completed}</strong>
															</CountBox>
															<CountBox>
																<span>Pausadas</span>
																<strong>{fila.counts.paused}</strong>
															</CountBox>
														</QueueCounts>
													</QueueCard>
												))}
											</QueueGroup>
										))}
									</QueueGrid>
								)}
							</PanelCard>
						</MainColumn>

						<SideColumn>
							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Workers e Agents</PanelTitle>
										<PanelSubtitle>
											Heartbeat dos workers em fila e agents locais por cliente.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								{!resumo ||
								(resumo.workers.itens.length === 0 &&
									resumo.agents.itens.length === 0) ? (
									<EmptyState>
										<EmptyTitle>Nenhum heartbeat ainda</EmptyTitle>
										Suba os workers para começar a registrar sinais de saúde.
									</EmptyState>
								) : (
									<WorkerList>
										{resumo.workers.itens.map((worker) => (
											<WorkerItem key={worker.id}>
												<ItemTop>
													<div>
														<ItemTitle>
															{getServicoLabel(worker.servico)}
														</ItemTitle>
														<ItemMuted>{worker.cliente.nome}</ItemMuted>
													</div>

													<Badge $variant={getWorkerVariant(worker.status)}>
														{worker.status}
													</Badge>
												</ItemTop>

												<ItemMuted>
													Identificador: {worker.identificador}
												</ItemMuted>

												{worker.fila && (
													<ItemMuted>Fila: {worker.fila}</ItemMuted>
												)}

												<ItemMuted>
													Último sinal: {formatDate(worker.ultimoSinalEm)}
												</ItemMuted>
											</WorkerItem>
										))}

										{resumo.agents.itens.map((agent) => (
											<WorkerItem key={agent.id}>
												<ItemTop>
													<div>
														<ItemTitle>{agent.tipo} Agent</ItemTitle>
														<ItemMuted>
															{agent.cliente.nome} ·{" "}
															{agent.cliente.modoProcessamento}
														</ItemMuted>
													</div>

													<Badge $variant={getWorkerVariant(agent.status)}>
														{agent.status}
													</Badge>
												</ItemTop>

												<ItemMuted>
													Identificador: {agent.identificador}
												</ItemMuted>

												<ItemMuted>
													Status cadastrado: {agent.statusRegistrado}
												</ItemMuted>

												<ItemMuted>
													Último sinal: {formatDate(agent.ultimoSinalEm)}
												</ItemMuted>
											</WorkerItem>
										))}
									</WorkerList>
								)}
							</PanelCard>

							<PanelCard>
								<PanelHeader>
									<div>
										<PanelTitle>Últimos erros</PanelTitle>
										<PanelSubtitle>
											Atalhos dos eventos mais críticos.
										</PanelSubtitle>
									</div>
								</PanelHeader>

								{!resumo || resumo.ultimosErros.length === 0 ? (
									<EmptyState>
										<EmptyTitle>Sem erros recentes</EmptyTitle>
										Nenhum evento ERROR foi encontrado para o filtro atual.
									</EmptyState>
								) : (
									<EventList>
										{resumo.ultimosErros.map((evento) => (
											<EventItem key={evento.id} $level={evento.nivel}>
												<EventMessage>{evento.mensagem}</EventMessage>
												<EventMeta>
													<span>{formatDate(evento.createdAt)}</span>
													<span>{getServicoLabel(evento.servico)}</span>
													{evento.cliente && (
														<span>Cliente: {evento.cliente.nome}</span>
													)}
												</EventMeta>
											</EventItem>
										))}
									</EventList>
								)}
							</PanelCard>
						</SideColumn>
					</ContentGrid>
				</PageContainer>
			</PageShell>
		</>
	);
}
